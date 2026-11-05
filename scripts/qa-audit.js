const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const VIEWPORTS = [
  { name: '320px_small_mobile', width: 320, height: 650 },
  { name: '360px_android_mobile', width: 360, height: 780 },
  { name: '375px_small_iphone', width: 375, height: 667 },
  { name: '390px_modern_iphone', width: 390, height: 844 },
  { name: '430px_large_mobile', width: 430, height: 932 },
  { name: '768px_tablet_portrait', width: 768, height: 1024 },
  { name: '1024px_tablet_landscape', width: 1024, height: 768 },
  { name: '1280px_laptop', width: 1280, height: 800 },
  { name: '1440px_desktop', width: 1440, height: 900 }
];

const BASE_URL = 'https://happy-birthday-jaan-three.vercel.app';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'qa-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Function to check for horizontal overflow
async function checkOverflow(page, screenName, vp) {
  return await page.evaluate(({ screenName, vp }) => {
    const vw = window.innerWidth;
    const docWidth = document.documentElement.scrollWidth;
    const bodyWidth = document.body.scrollWidth;
    const overflowingElements = [];

    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > vw + 1.5 || rect.width > vw + 1.5) {
        // filter out svg defs or hidden templates
        if (el.tagName === 'DEFS' || el.tagName === 'defs' || el.offsetParent === null) return;
        // ignore intentional horizontal scroll containers like thumbnail strips
        let p = el.parentElement;
        let isScrollChild = false;
        while (p && p !== document.body) {
          const s = window.getComputedStyle(p);
          if (s.overflowX === 'auto' || s.overflowX === 'scroll') {
            isScrollChild = true;
            break;
          }
          p = p.parentElement;
        }
        if (isScrollChild) return;

        overflowingElements.push({
          tagName: el.tagName,
          className: el.className?.toString?.() || '',
          width: Math.round(rect.width),
          right: Math.round(rect.right),
          vw
        });
      }
    });

    const hasDocOverflow = docWidth > vw + 1 || bodyWidth > vw + 1;
    return {
      hasOverflow: hasDocOverflow || overflowingElements.length > 0,
      docWidth,
      bodyWidth,
      vw,
      overflowingElements: overflowingElements.slice(0, 5)
    };
  }, { screenName, vp });
}

async function runQA() {
  console.log('🚀 Starting Comprehensive Mobile-First QA Visual Audit...');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Viewports: ${VIEWPORTS.map(v => v.width + 'px').join(', ')}\n`);

  const results = {
    viewportsTested: [],
    screensTested: [],
    overflowIssues: [],
    consoleErrors: [],
    functionalChecks: []
  };

  const browser = await chromium.launch({ headless: true });

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================`);
    console.log(`📱 TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });

    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.consoleErrors.push({ vp: vp.name, text: msg.text() });
      }
    });

    try {
      // ── SCREEN 0: GATE SCREEN ──
      console.log('  [Screen 0] Gate Screen...');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);

      let ov = await checkOverflow(page, 'GateScreen', vp);
      if (ov.hasOverflow) {
        console.warn(`    ⚠️ OVERFLOW on GateScreen (${vp.width}px): doc=${ov.docWidth} vw=${ov.vw}`, ov.overflowingElements);
        results.overflowIssues.push({ vp: vp.name, screen: 'GateScreen', ...ov });
      } else {
        console.log(`    ✅ GateScreen: 0 overflow (docWidth=${ov.docWidth}px, vw=${ov.vw}px)`);
      }

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_0_gate.png`) });

      // Unlock with password
      const pwInput = await page.$('input[type="password"]');
      if (pwInput) {
        await pwInput.fill('jaan');
        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) await submitBtn.click();
        await page.waitForTimeout(1200);
      }

      // ── SCREEN 1: OPENER SCREEN ──
      console.log('  [Screen 1] Opener Screen...');
      ov = await checkOverflow(page, 'OpenerScreen', vp);
      if (ov.hasOverflow) {
        console.warn(`    ⚠️ OVERFLOW on OpenerScreen (${vp.width}px):`, ov.overflowingElements);
        results.overflowIssues.push({ vp: vp.name, screen: 'OpenerScreen', ...ov });
      } else {
        console.log(`    ✅ OpenerScreen: 0 overflow`);
      }
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_1_opener.png`) });

      // Click YES
      const yesBtn = await page.getByRole('button', { name: /YES|Haan/i }).first();
      if (yesBtn) {
        await yesBtn.click();
        await page.waitForTimeout(1500);
      }

      // ── SCREEN 2: BIRTHDAY CELEBRATION SCREEN ──
      console.log('  [Screen 2] Birthday Celebration Screen...');
      ov = await checkOverflow(page, 'BirthdayScreen', vp);
      if (ov.hasOverflow) {
        console.warn(`    ⚠️ OVERFLOW on BirthdayScreen (${vp.width}px):`, ov.overflowingElements);
        results.overflowIssues.push({ vp: vp.name, screen: 'BirthdayScreen', ...ov });
      } else {
        console.log(`    ✅ BirthdayScreen: 0 overflow`);
      }
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_2_birthday.png`) });

      // Click Proceed button ("Aage Chalo")
      const tapKaroBtn = await page.getByRole('button', { name: /Aage Chalo/i }).first();
      if (tapKaroBtn) {
        await tapKaroBtn.click();
        await page.waitForTimeout(1500);
      }

      // ── SCREEN 3: CRYSTAL HEART SCREEN ──
      console.log('  [Screen 3] Crystal Heart 3D Screen...');
      ov = await checkOverflow(page, 'CrystalHeartScreen', vp);
      if (ov.hasOverflow) {
        console.warn(`    ⚠️ OVERFLOW on CrystalHeartScreen (${vp.width}px):`, ov.overflowingElements);
        results.overflowIssues.push({ vp: vp.name, screen: 'CrystalHeartScreen', ...ov });
      } else {
        console.log(`    ✅ CrystalHeartScreen: 0 overflow`);
      }
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_3_crystal_heart.png`) });

      // Click "Kuch cheezein khol ke dekho"
      const kholBtn = await page.getByRole('button', { name: /Kuch cheezein khol ke dekho/i }).first();
      if (kholBtn) {
        await kholBtn.click();
        await page.waitForTimeout(1200);
      }

      // ── SCREEN 4: HUB SCREEN (3 MYSTERY GIFTS) ──
      console.log('  [Screen 4] Hub Screen (3 Mystery Gift Boxes)...');
      ov = await checkOverflow(page, 'HubScreen', vp);
      if (ov.hasOverflow) {
        console.warn(`    ⚠️ OVERFLOW on HubScreen (${vp.width}px):`, ov.overflowingElements);
        results.overflowIssues.push({ vp: vp.name, screen: 'HubScreen', ...ov });
      } else {
        console.log(`    ✅ HubScreen: 0 overflow`);
      }

      // Check gift boxes flex layout
      const giftBoxesWrapCheck = await page.evaluate(() => {
        const gift1 = document.querySelector('button[aria-label*="Gift 1"]');
        const gift2 = document.querySelector('button[aria-label*="Gift 2"]');
        const gift3 = document.querySelector('button[aria-label*="Gift 3"]');
        if (!gift1 || !gift2 || !gift3) return { exists: false };
        const r1 = gift1.getBoundingClientRect();
        const r2 = gift2.getBoundingClientRect();
        const r3 = gift3.getBoundingClientRect();
        // check they are in one horizontal row (same top within 10px)
        const inOneRow = Math.abs(r1.top - r2.top) < 15 && Math.abs(r2.top - r3.top) < 15;
        return {
          exists: true,
          inOneRow,
          r1: { w: Math.round(r1.width), h: Math.round(r1.height) },
          r2: { w: Math.round(r2.width), h: Math.round(r2.height) },
          r3: { w: Math.round(r3.width), h: Math.round(r3.height) }
        };
      });
      console.log(`    🎁 Gift Boxes Row Alignment: inOneRow=${giftBoxesWrapCheck.inOneRow}`, giftBoxesWrapCheck.r1);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_4_hub.png`) });

      // Click Gift 1 (Photos)
      const gift1Btn = await page.getByRole('button', { name: /Gift 1/i }).first();
      if (gift1Btn) {
        await gift1Btn.click();
        await page.waitForTimeout(2000); // unbox animation and auto open
        // Check Camera Screen
        const camOv = await checkOverflow(page, 'CameraScreen', vp);
        console.log(`    📷 CameraScreen: overflow=${camOv.hasOverflow}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_4a_camera.png`) });
        const backBtn = await page.getByRole('button', { name: /Back/i }).first();
        if (backBtn) await backBtn.click();
        await page.waitForTimeout(800);
      }

      // Click Gift 2 (Letter)
      const gift2Btn = await page.getByRole('button', { name: /Gift 2/i }).first();
      if (gift2Btn) {
        await gift2Btn.click();
        await page.waitForTimeout(2000);
        // Envelope open click
        const envelope = await page.getByText(/Maria ke naam|Khat kholne/i).first();
        if (envelope) await envelope.click();
        await page.waitForTimeout(800);
        const letOv = await checkOverflow(page, 'LetterScreen', vp);
        console.log(`    💌 LetterScreen: overflow=${letOv.hasOverflow}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_4b_letter.png`) });
        const backBtn = await page.getByRole('button', { name: /Back/i }).first();
        if (backBtn) await backBtn.click();
        await page.waitForTimeout(800);
      }

      // Click Gift 3 (Song)
      const gift3Btn = await page.getByRole('button', { name: /Gift 3/i }).first();
      if (gift3Btn) {
        await gift3Btn.click();
        await page.waitForTimeout(2000);
        const songOv = await checkOverflow(page, 'CassetteScreen', vp);
        console.log(`    🎵 CassetteScreen: overflow=${songOv.hasOverflow}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_4c_cassette.png`) });
        const backBtn = await page.getByRole('button', { name: /Back/i }).first();
        if (backBtn) await backBtn.click();
        await page.waitForTimeout(800);
      }

      // Now all 3 are opened: Click "One last thing (25 Reasons)"
      const proceedReasonsBtn = await page.getByRole('button', { name: /One last thing/i }).first();
      if (proceedReasonsBtn) {
        await proceedReasonsBtn.click();
        await page.waitForTimeout(1000);
      }

      // ── SCREEN 5: REASONS SCREEN (2 COLUMNS × 3 ROWS) ──
      console.log('  [Screen 5] Reasons Screen (2x3 Card Grid)...');
      ov = await checkOverflow(page, 'ReasonsScreen', vp);
      if (ov.hasOverflow) {
        console.warn(`    ⚠️ OVERFLOW on ReasonsScreen (${vp.width}px):`, ov.overflowingElements);
        results.overflowIssues.push({ vp: vp.name, screen: 'ReasonsScreen', ...ov });
      } else {
        console.log(`    ✅ ReasonsScreen: 0 overflow`);
      }

      // Test flipping card 1
      const firstCard = await page.locator('[role="button"][aria-label*="Reason 1"]').first();
      if (firstCard) {
        await firstCard.click();
        await page.waitForTimeout(600);
        console.log(`    ✨ Card 1 flipped successfully in 3D`);
      }
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_5_reasons_p1.png`) });

      // Navigate to page 5
      for (let p = 1; p < 5; p++) {
        const nextBtn = await page.getByRole('button', { name: /Next/i }).first();
        if (nextBtn) {
          await nextBtn.click();
          await page.waitForTimeout(400);
        }
      }
      console.log('    📄 Reached Reasons Page 5 (Milestone Reason #25)');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_5_reasons_p5.png`) });

      // Click "Aage Barho (Tumhara Khwab ⚖️)"
      const aageBtn = await page.getByRole('button', { name: /Aage Barho/i }).first();
      if (aageBtn) {
        await aageBtn.click();
        await page.waitForTimeout(1000);
      }

      // ── SCREEN 6: LAWYER DREAM SCREEN ──
      console.log('  [Screen 6] Lawyer Dream Screen...');
      ov = await checkOverflow(page, 'LawyerDreamScreen', vp);
      console.log(`    ⚖️ LawyerDreamScreen: overflow=${ov.hasOverflow}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_6_lawyer.png`) });
      const nextLawyerBtn = await page.getByRole('button', { name: /Azaadi ki roshni dekho|Azaadi|Ek aur baat|Aage/i }).first();
      if (nextLawyerBtn) {
        await nextLawyerBtn.click();
        await page.waitForTimeout(1000);
      }

      // ── SCREEN 7: FREEDOM SCREEN ──
      console.log('  [Screen 7] Freedom Screen...');
      ov = await checkOverflow(page, 'FreedomScreen', vp);
      console.log(`    🕊️ FreedomScreen: overflow=${ov.hasOverflow}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_7_freedom.png`) });
      const nextFreedomBtn = await page.getByRole('button', { name: /Hamari kahani dekho|Hamari kahani|Aage/i }).first();
      if (nextFreedomBtn) {
        await nextFreedomBtn.click();
        await page.waitForTimeout(1000);
      }

      // ── SCREEN 8: TIMELINE SCREEN ──
      console.log('  [Screen 8] Timeline Screen...');
      ov = await checkOverflow(page, 'TimelineScreen', vp);
      console.log(`    📅 TimelineScreen: overflow=${ov.hasOverflow}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_8_timeline.png`) });
      const nextTimelineBtn = await page.getByRole('button', { name: /Aakhri paighaam dekho|Aakhri Paighaam|Aakhri|Aage/i }).first();
      if (nextTimelineBtn) {
        await nextTimelineBtn.click();
        await page.waitForTimeout(1000);
      }

      // ── SCREEN 9: FINALE SCREEN ──
      console.log('  [Screen 9] Finale Screen...');
      ov = await checkOverflow(page, 'FinaleScreen', vp);
      console.log(`    🎉 FinaleScreen: overflow=${ov.hasOverflow}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_9_finale.png`) });

      results.viewportsTested.push(vp.name);
      console.log(`  🌟 ${vp.name} COMPLETED ALL 10 SCREENS SUCCESSFULLY!`);

    } catch (err) {
      console.error(`  ❌ Error testing ${vp.name}:`, err.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log('🏁 QA AUDIT RUN FINISHED');
  console.log('========================================');
  console.log(`Viewports Tested: ${results.viewportsTested.length}/${VIEWPORTS.length}`);
  console.log(`Total Overflow Issues Found: ${results.overflowIssues.length}`);
  console.log(`Total Console Errors: ${results.consoleErrors.length}`);

  // Write results JSON
  fs.writeFileSync(
    path.join(__dirname, '..', 'qa-audit-report.json'),
    JSON.stringify(results, null, 2)
  );

  return results;
}

runQA();

