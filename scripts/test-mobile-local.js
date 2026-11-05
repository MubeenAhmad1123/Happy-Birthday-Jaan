const { chromium } = require('playwright');

const VIEWPORTS = [
  { name: '320px_small_mobile', width: 320, height: 650 },
  { name: '360px_android_mobile', width: 360, height: 780 },
  { name: '375px_small_iphone', width: 375, height: 667 },
  { name: '390px_modern_iphone', width: 390, height: 844 },
  { name: '430px_large_mobile', width: 430, height: 932 },
];

const BASE_URL = 'http://localhost:3002';

async function runLocalAudit() {
  console.log('🚀 Running Local Playwright Mobile QA Audit on http://localhost:3002...');
  const browser = await chromium.launch({ headless: true });
  let allPassed = true;

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
      // wait a bit for animations
      await page.waitForTimeout(1000);

      // Check horizontal overflow
      const overflow = await page.evaluate((vw) => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const overflowing = [];

        document.querySelectorAll('*').forEach((el) => {
          if (el.tagName === 'DEFS' || el.tagName === 'defs' || el.offsetParent === null) return;
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 1 || rect.width > vw + 1) {
            let p = el.parentElement;
            let isScroll = false;
            while (p && p !== document.body) {
              const s = window.getComputedStyle(p);
              if (s.overflowX === 'auto' || s.overflowX === 'scroll') {
                isScroll = true;
                break;
              }
              p = p.parentElement;
            }
            if (!isScroll) {
              overflowing.push({ tag: el.tagName, class: el.className, w: Math.round(rect.width), right: Math.round(rect.right) });
            }
          }
        });

        return {
          hasOverflow: docWidth > vw || bodyWidth > vw || overflowing.length > 0,
          docWidth,
          bodyWidth,
          vw,
          overflowing: overflowing.slice(0, 3)
        };
      }, vp.width);

      if (overflow.hasOverflow) {
        console.error(`❌ [${vp.name}] OVERFLOW DETECTED: docWidth=${overflow.docWidth}, vw=${vp.width}`, overflow.overflowing);
        allPassed = false;
      } else {
        console.log(`✅ [${vp.name}] PASSED (No overflow, docWidth=${overflow.docWidth} <= vw=${vp.width})`);
      }

      if (consoleErrors.length > 0) {
        console.warn(`⚠️ [${vp.name}] Console errors:`, consoleErrors);
      }

    } catch (err) {
      console.error(`❌ [${vp.name}] Test failed:`, err.message);
      allPassed = false;
    } finally {
      await context.close();
    }
  }

  await browser.close();
  if (allPassed) {
    console.log('\n🎉 ALL VIEWPORTS PASSED MOBILE QA AUDIT WITH ZERO OVERFLOW!');
    process.exit(0);
  } else {
    console.error('\n⚠️ SOME VIEWPORTS HAD ISSUES');
    process.exit(1);
  }
}

runLocalAudit();

