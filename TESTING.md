# Test stratejisi ve sonuçlar

13 Ekim 2026 yerel doğrulama. Final yeniden çalıştırma sonuçları PROGRESS.md'de güncellenir.

## Testler

- `pnpm test`: 18 unit test; Decimal aritmetik, inclusive VAT, merkezi kur, kupon eligible/cap/minimum/shipping, stok/durum geçişleri ve CSV güvenliği.
- `pnpm test:integration`: 15 PostgreSQL test; gerçek fixture kullanıcı/ürün, arama, checkout snapshot, kupon limit/release, idempotency conflict, **iki müşterinin son stok yarışı**, callback HMAC/tutar/guest token, bir kez stok düşümü, failure/expiry/late payment (expiry job öncesi dahil), kargo, stok constraint, partial/full refund ve tekrar iade engeli.
- `pnpm test:e2e`: 12 Playwright testi desktop 1440×1000 ve mobile 390×844; mağaza arama/detay/sepet/misafir checkout/simülasyon/takip, unauthorized admin, admin ürün/stock, İngilizce/USD, üyelik/adres/üye checkout, admin kargo/takip, müşteri iade ve admin onayı, destek DB ve sahte callback reddi. İlgili gruplar son değişikliklerinden sonra geçti.
- Final `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm audit --prod` ve peer kontrolü başarılı. Audit bilinen açık bulmadı; bu tam güvenlik sertifikasyonu değildir.
- `node scripts/visual-check.mjs`: yerel ekran görüntüleri `.data/qa`; yatay overflow, pageerror ve kırık görsel kontrolü. Screenshot öncesinde hydration tamamlanmalı; screenshot'ın caret gizleme mutasyonu false positive oluşturabileceğinden caret initial kullanılır.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`: tip/lint ve production bundle.

Test DB global setup yalnızca loopback veya CI `db` adresinde `novahometex_test` oluşturur; bu isim doğrulanmadan TRUNCATE yapılmaz. Geliştirme mağazasındaki kayıtlar temizlenmez. E2E `.test` adresleri kullanır, gerçek ödeme/e-posta çağrılmaz. Ürün testleri E2E isim/slug kullanır ve arşivlenir.

## Henüz doğrulanmamış

Firebase gerçek email/Google/MFA, iyzico/PayTR merchant sandbox, e-posta teslim, Cloud Storage, Docker image ve Google Cloud deployment. Test simülasyonu sağlayıcı sandbox başarısı olarak raporlanmaz. Büyük trafik yük testi, tüm tarayıcılar ve formal WCAG/Core Web Vitals incelemesi ayrıca yapılmalıdır.

Playwright failures trace/screenshot `test-results` altında. CI failure artifact'ları yükler. Aynı değişiklik için geçen testler gereksiz tekrar edilmez; güvenlik override veya anlamlı kod değişikliği sonrası ilgili test/build yeniden çalıştırılır.
