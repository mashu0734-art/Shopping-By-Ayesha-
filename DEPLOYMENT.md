# 🚀 Cloudflare Pages & GitHub Deployment Guide
## شاپنگ بائی عائشہ (Shopping By Ayesha)

اس پراجیکٹ کو **GitHub** سے منسلک کر کے **Cloudflare Pages** پر لائیو چلانے کے لیے مکمل سیٹنگز کر دی گئی ہیں۔

---

### طریقہ نمبر 1: Cloudflare Dashboard سے ڈائریکٹ آٹومیٹک ڈیپلائے (سب سے آسان اور مفت طریقہ)

یہ سب سے تیز اور بہترین طریقہ ہے، جس میں ہر بار جب آپ GitHub پر کوڈ push کریں گی تو Cloudflare خود بخود نئی ویب سائٹ لائیو کر دے گا۔

#### مرحلہ 1: کوڈ GitHub پر اپلوڈ کریں
اگر آپ کے پاس پہلے سے گٹ ریپوزٹری بنی ہوئی ہے تو کمانڈز:
```bash
git add .
git commit -m "Configure Cloudflare Pages deployment"
git push origin main
```

#### مرحلہ 2: Cloudflare پر لاگ ان کریں
1. براؤزر میں [dash.cloudflare.com](https://dash.cloudflare.com/) کھولیں۔
2. بائیں جانب مینو سے **Compute (Workers & Pages)** پر کلک کریں۔
3. **Create application** پر کلک کریں اور پھر **Pages** ٹیب منتخب کریں۔
4. **Connect to Git** پر کلک کریں اور اپنے GitHub اکاؤنٹ کو منتخب کریں۔
5. اپنی ریپوزٹری (**Shopping By Ayesha**) منتخب کریں اور **Begin setup** پر کلک کریں۔

#### مرحلہ 3: سیٹنگز درج کریں
سیٹنگز خود بخود درج ہو جائیں گی، تصدیق کر لیں:
- **Project name**: `shopping-by-ayesha`
- **Production branch**: `main` (یا `master`)
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (خالی چھوڑ دیں)

#### مرحلہ 4: Save and Deploy پر کلک کریں
- **Save and Deploy** کے نیلے بٹن پر کلک کریں۔
- 1 منٹ کے اندر آپ کی ویب سائٹ فری ایس ایس ایل (SSL / HTTPS) اور تیز رفتار گلوبل سی ڈی این کے ساتھ مفت لائیو ہو جائے گی! (مثال: `https://shopping-by-ayesha.pages.dev`)

---

### طریقہ نمبر 2: GitHub Actions کے ذریعے آٹومیٹک ڈیپلائے
اس ریپوزٹری میں `.github/workflows/deploy.yml` فائل پہلے سے موجود ہے۔

اگر آپ GitHub Actions استعمال کرنا چاہیں:
1. Cloudflare اکاؤنٹ سے **API Token** بنائیں (Permissions: `Cloudflare Pages: Edit`)۔
2. اپنے Cloudflare کا **Account ID** کاپی کریں۔
3. GitHub ریپوزٹری میں جائیں -> **Settings** -> **Secrets and variables** -> **Actions**۔
4. دو Secrets شامل کریں:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. اب جب بھی آپ GitHub پر کوڈ push کریں گی، GitHub Action خود بخود بلڈ بنا کر Cloudflare پر اپلوڈ کر دے گا۔

---

### کی گئی سیٹنگز کی تفصیل (Configured Files):
1. **`public/_redirects`**: کلاؤڈ فلیئر پر تمام پیجز اور راؤٹنگ کو 404 ایرر سے بچانے کے لیے ایس پی اے ری ڈائریکٹس۔
2. **`public/_headers`**: تیز ترین رفتار اور سیکیورٹی کیشنگ ہیڈرز۔
3. **`wrangler.toml`**: کلاؤڈ فلیئر پیجز کی بنیادی کنفیگریشن فائل۔
4. **`.node-version` & `.nvmrc`**: نوڈ 20 ایل ٹی ایس ورژن کی تصدیق۔
5. **`.github/workflows/deploy.yml`**: مکمل خودکار CI/CD ورک فلو۔
