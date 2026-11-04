import os
import shutil
from PIL import Image
from collections import deque

BASE = r"C:\Users\premier\Desktop\Site\birthday-site\assets-private"
PUBLIC_CHAR = r"C:\Users\premier\Desktop\Site\birthday-site\public\characters"
PHOTOS_DIR = os.path.join(BASE, "assets", "photos")
STICKERS_DIR = os.path.join(BASE, "assets", "stickers")
SPARE_DIR = os.path.join(BASE, "spare")
REF_DIR = os.path.join(BASE, "reference")
STYLE_REFS_DIR = os.path.join(REF_DIR, "style-refs")

os.makedirs(PHOTOS_DIR, exist_ok=True)
os.makedirs(STICKERS_DIR, exist_ok=True)
os.makedirs(PUBLIC_CHAR, exist_ok=True)
os.makedirs(SPARE_DIR, exist_ok=True)
os.makedirs(REF_DIR, exist_ok=True)
os.makedirs(STYLE_REFS_DIR, exist_ok=True)

# 1. Convert Realistic photos to WebP (max 1200px wide, under 300 KB, quality ~82)
def convert_to_webp(src_name, target_name):
    src_path = os.path.join(BASE, src_name)
    target_path = os.path.join(PHOTOS_DIR, target_name)
    if not os.path.exists(src_path):
        print(f"Skipping {src_name}: not found")
        return
    im = Image.open(src_path).convert("RGB")
    if im.width > 1200:
        ratio = 1200.0 / im.width
        new_h = int(im.height * ratio)
        im = im.resize((1200, new_h), Image.Resampling.LANCZOS)
    im.save(target_path, "WEBP", quality=82)
    size_kb = os.path.getsize(target_path) / 1024.0
    print(f"Saved {target_name} ({size_kb:.1f} KB)")

# Slot mappings
realistic_map = {
    "Sunset Rooftop Tea for Two.png": "07.webp",
    "Confident Advocate in a Sunlit Law Library.png": "14.webp",
    "Confident Law Student at the Courthouse.png": "15.webp",
    "Serene South Asian Woman in Sunset Field.png": "18.webp",
    "Dreamy Sunrise Portrait with Flowing Dupatta.png": "19.webp",
    "Romantic Pastel Portrait with Flowers.png": "23.webp",
}

for src, tgt in realistic_map.items():
    convert_to_webp(src, tgt)

# 21.webp from dudu-bubu-chai.png flattened on #FFF8F5
chai_src = os.path.join(BASE, "dudu-bubu-chai.png")
if os.path.exists(chai_src):
    chai_im = Image.open(chai_src).convert("RGBA")
    # Soft cream background #FFF8F5 = (255, 248, 245)
    cream_bg = Image.new("RGBA", chai_im.size, (255, 248, 245, 255))
    flattened = Image.alpha_composite(cream_bg, chai_im).convert("RGB")
    if flattened.width > 1200:
        ratio = 1200.0 / flattened.width
        new_h = int(flattened.height * ratio)
        flattened = flattened.resize((1200, new_h), Image.Resampling.LANCZOS)
    target_21 = os.path.join(PHOTOS_DIR, "21.webp")
    flattened.save(target_21, "WEBP", quality=82)
    print(f"Saved 21.webp ({os.path.getsize(target_21)/1024:.1f} KB)")

# Spares to spare/ (spare-20-garden-walk.jpg, spare-21-rose-garden-couple.jpg)
spares_map = {
    "Golden-Hour Garden Walk.png": "spare-20-garden-walk.jpg",
    "Rose Garden Couple Portrait.png": "spare-21-rose-garden-couple.jpg"
}
for src, tgt in spares_map.items():
    src_path = os.path.join(BASE, src)
    if os.path.exists(src_path):
        tgt_path = os.path.join(SPARE_DIR, tgt)
        im = Image.open(src_path).convert("RGB")
        im.save(tgt_path, "JPEG", quality=85)
        print(f"Saved spare {tgt} ({os.path.getsize(tgt_path)/1024:.1f} KB)")

# 2. Extract Stickers with flood-fill background removal
def process_sticker(src_name, out_name):
    src_path = os.path.join(BASE, src_name)
    if not os.path.exists(src_path):
        print(f"Sticker {src_name} not found")
        return
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()

    def is_bg(r, g, b):
        return r >= 240 and g >= 240 and b >= 240

    visited = set()
    queue = deque()

    # Seed borders
    for x in range(w):
        for y in [0, h - 1]:
            r, g, b, a = pixels[x, y]
            if is_bg(r, g, b) and (x, y) not in visited:
                visited.add((x, y))
                queue.append((x, y))
    for y in range(h):
        for x in [0, w - 1]:
            r, g, b, a = pixels[x, y]
            if is_bg(r, g, b) and (x, y) not in visited:
                visited.add((x, y))
                queue.append((x, y))

    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                r, g, b, a = pixels[nx, ny]
                if is_bg(r, g, b):
                    visited.add((nx, ny))
                    queue.append((nx, ny))

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out_pixels = out.load()
    for y in range(h):
        for x in range(w):
            if (x, y) in visited:
                out_pixels[x, y] = (0, 0, 0, 0)
            else:
                out_pixels[x, y] = pixels[x, y]

    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)

    if out.width > 1000:
        ratio = 1000.0 / out.width
        new_h = int(out.height * ratio)
        out = out.resize((1000, new_h), Image.Resampling.LANCZOS)

    # Save to public/characters/ and assets-private/assets/stickers/
    target_public = os.path.join(PUBLIC_CHAR, out_name)
    target_private = os.path.join(STICKERS_DIR, out_name)
    out.save(target_public, "PNG")
    out.save(target_private, "PNG")
    print(f"Saved sticker {out_name}: public & private ({out.size})")

stickers_map = {
    "dudu-bubu-box.png": "dudu-bubu-box.png",
    "bubu-sad.png": "bubu-sad.png",
    "dudu-bubu-chai.png": "dudu-bubu-chai.png",
    "Kawaii Panda with Floral Dupatta.png": "bubu-maria-base.png",
    "Kawaii Bear in Traditional Kurta.png": "dudu-mubi-base.png",
    "Kawaii Panda Bear Valentine Gift Scene.png": "dudu-bubu-box-alt.png"
}

for src, tgt in stickers_map.items():
    process_sticker(src, tgt)

# 3. Move Mubeen photos to reference/ref-mubi-01..03.jpg
mubi_map = {
    "WhatsApp Image 2026-11-01 at 9.14.11 PM.jpeg": "ref-mubi-01.jpg",
    "WhatsApp Image 2026-11-01 at 9.14.11 PM (1).jpeg": "ref-mubi-02.jpg",
    "WhatsApp Image 2026-11-01 at 9.14.11 PM (2).jpeg": "ref-mubi-03.jpg"
}

for src, tgt in mubi_map.items():
    src_p = os.path.join(BASE, src)
    tgt_p = os.path.join(REF_DIR, tgt)
    if os.path.exists(src_p):
        shutil.move(src_p, tgt_p)
        print(f"Moved {src} -> {tgt}")

# 4. Move Style References to reference/style-refs/ with clean ASCII names
style_files = [
    "618963542585585228.jpg",
    "bubu dudu love 💞.jpg",
    "download.jpg",
    "download (1).jpg",
    "download (2).jpg",
    "download (3).jpg",
    "dudu bubu funny sticker.jpg",
    "Dudu Bubu.jpg",
    "Dudu ❤️ Bubu Video Call.jpg",
    "images.jpg",
    "בובו ודודו צופים בכוכבים.jpg",
    "☺️.jpg",
    "𝘗𝘪𝘯 𝘣𝘺 𝙖𝙣𝙂𝙚𝙡𝘼-✿.jpg"
]

# Find the mornings file dynamically
for item in os.listdir(BASE):
    if "mornings" in item.lower() and item.endswith(".jpg"):
        style_files.append(item)
        break

idx = 1
for sf in style_files:
    sf_path = os.path.join(BASE, sf)
    if os.path.exists(sf_path):
        target_name = f"style-ref-{idx:02d}.jpg"
        target_p = os.path.join(STYLE_REFS_DIR, target_name)
        shutil.move(sf_path, target_p)
        print(f"Moved style ref {sf[:30]}... -> {target_name}")
        idx += 1

# 5. Clean up processed source files in BASE
to_clean = list(realistic_map.keys()) + list(spares_map.keys()) + list(stickers_map.keys())
for f in to_clean:
    p = os.path.join(BASE, f)
    if os.path.exists(p):
        os.remove(p)
        print(f"Cleaned up {f}")

print("\n--- ALL ASSETS PROCESSED SUCCESSFULLY ---")

