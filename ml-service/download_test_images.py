import requests
import os

out_dir = os.path.join(os.path.dirname(__file__), "test_images")
os.makedirs(out_dir, exist_ok=True)

base = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/segmented"

urls = {
    "tomato_early_blight.jpg": f"{base}/Tomato___Early_blight/002f332e-87e6-42c0-91f9-cba302ded3c2___RS_Early_B.JPG",
    "potato_late_blight.jpg": f"{base}/Potato___Late_blight/03df0b7d-6a01-48b5-8579-c095b5087c0d___RS_Late_Blight.JPG",
    "tomato_healthy.jpg": f"{base}/Tomato___healthy/0029c0f1-a307-4621-af04-d0a4d4b63e3e___RS_HL.JPG",
    "corn_common_rust.jpg": f"{base}/Corn_(maize)___Common_rust_/00c2e5ca-25f5-4916-ad54-e5ce3ee0e234___RS_C_Rust.JPG",
    "apple_scab.jpg": f"{base}/Apple___Apple_scab/00a8e04e-fa15-4abb-bce5-4aed2f743638___FREC_Scab_3170.JPG",
}

downloaded = 0
for name, url in urls.items():
    path = os.path.join(out_dir, name)
    if os.path.exists(path) and os.path.getsize(path) > 5000:
        print(f"{name}: already exists ({os.path.getsize(path)} bytes)")
        downloaded += 1
        continue
    try:
        r = requests.get(url, timeout=15)
        if r.status_code == 200 and len(r.content) > 1000:
            with open(path, "wb") as f:
                f.write(r.content)
            print(f"{name}: OK ({len(r.content)} bytes)")
            downloaded += 1
        else:
            print(f"{name}: HTTP {r.status_code} (len={len(r.content) if r.status_code==200 else 'N/A'})")
    except Exception as e:
        print(f"{name}: ERROR {e}")

if downloaded == 0:
    print("\nNo real images downloaded. Trying alternative sources...")
    alt_base = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color"
    alt_urls = {
        "tomato_early_blight.jpg": f"{alt_base}/Tomato_Early_Blight/002f332e-87e6-42c0-91f9-cba302ded3c2___RS_Early_Blight.JPG",
        "potato_late_blight.jpg": f"{alt_base}/Potato_Late_Blight/03df0b7d-6a01-48b5-8579-c095b5087c0d___RS_Late_Blight.JPG",  
        "tomato_healthy.jpg": f"{alt_base}/Tomato_Healthy/0029c0f1-a307-4621-af04-d0a4d4b63e3e___RS_HL.JPG",
    }
    for name, url in alt_urls.items():
        path = os.path.join(out_dir, name)
        try:
            r = requests.get(url, timeout=15)
            if r.status_code == 200 and len(r.content) > 1000:
                with open(path, "wb") as f:
                    f.write(r.content)
                print(f"{name}: ALT OK ({len(r.content)} bytes)")
                downloaded += 1
        except:
            pass

if downloaded == 0:
    print("\nDownloading from alternative open sources...")
    import urllib.parse
    # Try to search and download from various CDN-hosted datasets
    alt2 = {
        "tomato_early_blight.jpg": "https://plantvillage.psu.edu/static/collections/tomato_early_blight_1.jpg",
        "potato_late_blight.jpg": "https://plantvillage.psu.edu/static/collections/potato_late_blight_1.jpg",
    }
    for name, url in alt2.items():
        path = os.path.join(out_dir, name)
        try:
            r = requests.get(url, timeout=15)
            if r.status_code == 200:
                with open(path, "wb") as f:
                    f.write(r.content)
                print(f"{name}: ALT2 OK ({len(r.content)} bytes)")
                downloaded += 1
        except:
            pass

if downloaded == 0:
    print("\nStill no images. Generating synthetic test images...")
    from PIL import Image, ImageDraw
    import random
    for name, color in [
        ("synthetic_healthy.jpg", (34, 139, 34)),
        ("synthetic_early_blight.jpg", (100, 80, 30)),
        ("synthetic_late_blight.jpg", (80, 60, 40)),
    ]:
        img = Image.new("RGB", (224, 224), (20, 40, 20))
        draw = ImageDraw.Draw(img)
        draw.ellipse([10, 30, 214, 194], fill=color, outline=(0, 80, 0), width=2)
        if "blight" in name:
            for _ in range(30):
                x, y = random.randint(30, 190), random.randint(40, 180)
                draw.ellipse([x, y, x + random.randint(3, 10), y + random.randint(3, 10)], fill=(60, 30, 10))
        img.save(os.path.join(out_dir, name))
        print(f"{name}: synthetic generated")
        downloaded += 1

print(f"\nResult: {downloaded} test images in {out_dir}")
for f in sorted(os.listdir(out_dir)):
    print(f"  {f}: {os.path.getsize(os.path.join(out_dir, f))} bytes")
