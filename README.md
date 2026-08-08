# میدان — راهنمای دیپلوی

این پوشه یه پروژه‌ی وب واقعیه که می‌تونی بدون نصب هیچی روی کامپیوتر خودت، فقط با مرورگر، آنلاینش کنی.

## قدم ۱ — ساخت دیتابیس (Supabase) — ۵ دقیقه

۱. برو به [supabase.com](https://supabase.com) و یه حساب رایگان بساز.
۲. یه پروژه‌ی جدید بساز (یه اسم و رمز دیتابیس بهش بده، رمز رو یه‌جا سیو کن).
۳. از منوی سمت چپ برو تو **SQL Editor** و این کوئری رو پیست کن و Run بزن:

```sql
create table app_data (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

alter table app_data enable row level security;

create policy "public read" on app_data for select using (true);
create policy "public insert" on app_data for insert with check (true);
create policy "public update" on app_data for update using (true);
```

> ⚠️ این تنظیمات دیتابیس رو کاملاً باز می‌کنه (هرکسی می‌تونه بخونه/بنویسه) — برای تست با چندتا دوست کاملاً کافیه، ولی برای انتشار عمومی و جدی بعداً باید امن‌ترش کنیم.

۴. از منوی چپ برو **Project Settings → API**. دو تا چیز رو کپی کن:
   - **Project URL**
   - **anon public key**

## قدم ۲ — آپلود کد روی گیت‌هاب — ۵ دقیقه

۱. تو [github.com](https://github.com) یه حساب بساز (اگه نداری).
۲. یه ریپازیتوری جدید بساز (دکمه‌ی سبز **New**)، اسمش رو مثلاً `meydan-app` بذار، **Public** یا **Private** فرقی نداره.
۳. تو صفحه‌ی ریپو، رو لینک **uploading an existing file** بزن.
۴. کل محتوای این پوشه (همه‌ی فایل‌ها و پوشه‌ی `src`) رو بکش و بنداز تو اون صفحه، بعد **Commit changes** بزن.

## قدم ۳ — دیپلوی روی Vercel — ۵ دقیقه

۱. برو [vercel.com](https://vercel.com) و با همون حساب گیت‌هابت وارد شو.
۲. **Add New → Project** بزن، ریپوی `meydan-app` رو انتخاب و **Import** کن.
۳. قبل از دکمه‌ی Deploy، بخش **Environment Variables** رو باز کن و این دوتا رو اضافه کن:
   - `VITE_SUPABASE_URL` → همون Project URL از قدم ۱
   - `VITE_SUPABASE_ANON_KEY` → همون anon public key از قدم ۱
۴. **Deploy** بزن. بعد از حدود یک دقیقه یه لینک زنده مثل `meydan-app.vercel.app` بهت می‌ده.

همین لینک رو برای هرکی خواستی بفرست — رو گوشی هم می‌تونه از مرورگر بازش کنه و با «Add to Home Screen» مثل یه اپ رو صفحه‌ی اصلیش نگه داره.

## بعداً اگه خواستی چیزی رو عوض کنی

فقط کافیه فایل رو تو گیت‌هاب ویرایش کنی (یا فایل جدید رو جایگزین کنی) — Vercel خودش خودکار دوباره دیپلویش می‌کنه.
