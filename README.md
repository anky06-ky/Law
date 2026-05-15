# Luật Chân Thiện Mỹ - Website Upgrade

Prototype website nâng cấp cho Luật Chân Thiện Mỹ.

## Public site

Sau khi bật GitHub Pages, website sẽ chạy tại:

```text
https://anky06-ky.github.io/Law/
```

## Cấu trúc

- `site/index.html`: trang chủ
- `site/styles.css`: giao diện
- `site/script.js`: menu mobile, tìm kiếm demo, form lead demo
- `site/robots.txt`: robots cho SEO
- `site/sitemap.xml`: sitemap

## Deploy GitHub Pages

Repo này có workflow `.github/workflows/pages.yml`.

Vào GitHub repo:

1. `Settings`
2. `Pages`
3. `Build and deployment`
4. `Source`: chọn `GitHub Actions`
5. Chạy lại workflow nếu cần trong tab `Actions`
