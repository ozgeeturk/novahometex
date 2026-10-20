# NovaHomeTex — ilerleme ve sonraki adım

**13 Ekim 2026.** Boş repository'den gerçek dosyalar ve servislerle oluşturuldu. Bu teslim **çalışan yerel geliştirme sürümüdür**. Tüm production gereksinimlerinin tamamlandığı veya canlı satışa hazır olduğu iddia edilmez.

## Doğrulanan işler

| Faz | Durum |
|---|---|
| 1 — Temel | Next.js 16.4/React/TypeScript/Tailwind, Radix/shadcn yaklaşımında ortak bileşenler, Prisma 7.10, normalize PostgreSQL şeması ve 3 migration. Dockerfile/Compose/CI kaynakları hazır; Docker yüklü olmadığı için image çalıştırılmadı. |
| 2 — Mağaza | Ana sayfa, dinamik kategori, URL filtreli katalog, DB full-text/trigram arama, autocomplete, ürün/varyant/galeri, favoriler ve responsive tasarım çalışıyor. |
| 3 — Hesap | Güvenli yerel test email/password, profil/adres, üye siparişleri çalışıyor. Firebase email/Google/reset/verification ve MFA login kodu var; gerçek proje ile test bekliyor. |
| 4 — Ticaret | Kalıcı guest sepet, login cart merge, guest/member checkout, Decimal fiyat/KDV/kupon/kargo, kur/fiyat/sözleşme snapshot, reservation/expiry, sipariş takip ve stok yarış testi çalışıyor. |
| 5 — Ödeme | Sunucu imzalı açık etiketli mock simülasyon, callback idempotency/tutar kontrolü, failed/late handling ve partial/full refund çalışıyor. iyzico/PayTR hosted adapters yazıldı; merchant sandbox **test edilmedi**. |
| 6 — Yönetim | DB dashboard, ürün/varyant/galeri/CSV, kategori, stok, sipariş/kargo, müşteri, kupon/kampanya, iade, yorum, destek, CMS/banner, FX, ayar, rol/izin ve audit. Yetkiler API'de uygulanıyor. |
| 7 — Ek | TR/EN ve TRY/EUR/USD, iletişim DB/outbox, çift onay newsletter, izinli GA altyapısı, çerez tercihleri/geri alma, metadata/sitemap/robots ve Product JSON-LD. Gerçek e-posta gönderilmedi. |
| 8 — Doğrulama | Unit/integration/E2E, type/lint, production build, dependency audit ve desktop/mobile görsel kontrolü. Dış servis/Cloud/Docker ve formal load/accessibility incelemesi açık. |

Yerel DB gerçek PostgreSQL motorudur: `127.0.0.1:54329`, kalıcı `.data/postgres`. SQLite/mock DB kullanılmadı. Seed: 12 kategori, 32 örnek ürün/96 varyant, 18 seed test siparişi ve 6 rol. Otomatik testler ayrıca açıkça E2E isimli `.test` kayıtları oluşturur.

## Son doğrulama

- **18 birim testi geçti.**
- **15 PostgreSQL entegrasyon testi geçti:** son stok eşzamanlı satın alma, callback replay/forgery/tutar, expired-before-job, partial/full refund dahil.
- **12 Playwright testi desktop/mobile geçti:** 8 mağaza + 4 üye/kargo/iade/destek testi. Kayıtlı müşteri admin API'den 403 alır.
- **TypeScript, ESLint ve production build geçti.** ESLint 9 mevcut Next plugin peer aralıkları için seçildi; ESLint 10 geçişi plugin desteği bekler.
- **Production dependency audit:** bilinen açık yok. **Peer dependency:** sorun yok. Transitive yamalar lockfile/overrides içinde.
- **Görsel QA:** desktop 1440×1000, mobile 390×844; son `.data/qa/findings.json` boş. Taşma, kırık görsel veya pageerror yok.
- Jobs çalıştı; anahtarsız e-posta kayıtları TEST_STORED. Gerçek e-posta teslimi iddia edilmiyor.
- Final mağaza ve `/api/health` HTTP 200 döndü; health veritabanı bağlantısını ve sandbox modunu doğruladı. Uygulama kullanıcı incelemesi için yerelde çalışıyor.

## Eksik dış servis doğrulamaları

1. Firebase proje/config/authorized-domain ve gerçek email/Google/MFA akışları.
2. iyzico/PayTR test merchant anahtarları, erişilebilir HTTPS callback ve sağlayıcı sandbox success/failure/refund kayıtları.
3. E-posta API anahtarı/doğrulanmış sender ile gerçek teslim; Cloud Storage bucket doğrulaması.
4. Google Cloud project/owner yetkileri, domain ve maliyet onayı; Cloud Run/SQL/Secrets/Scheduler/Logging, Docker image, backup/restore/staging doğrulamaları.
5. İşletme bilgileri, gerçek ticari ürün/fotoğraf/stok, KDV/fatura/kargo politikaları ve hukuki metin onayı.

## Kalan uygulama geliştirmeleri

- iyzico canlı buyer identity toplama ve güvenli işleme akışı. Canlı iyzico bilinçli olarak engelli.
- PayTR taksit vade farkı mutabakatı; dış servis initialization/refund belirsizliğinde gelişmiş reconciliation/crash recovery.
- Müşteri Firebase MFA enrollment ve anlık session revocation yönetimi.
- Büyük katalogda DB aggregate/keyset pagination ve performans yük testi; ilk sürüm 500 aday sınırı.
- Gelişmiş haftalık/aylık/yıllık karşılaştırma, müşteri trendi, net dönem KDV/kargo, iade gerçekleşme tarihine göre muhasebe/banka mutabakatı.
- İçerik/footer/sosyal bağlantılar için kapsamlı görsel editör, kampanya landing page varyantları ve otomatik kur/kargo adaptörleri.
- Newsletter unsubscribe/marketing dispatch ve işletme veri saklama/anonymization süreci; IYS/ETBİS/KVKK işletme incelemesi.
- İngilizce örnek müşteri yorumlarının ayrı çevirisi, gelişmiş marka filtresi/arama geçmişi sunumu ve Breadcrumb JSON-LD.
- Formal WCAG 2.2 AA, screen reader/tablet/all-browser/Core Web Vitals ve penetration test; production CSP nonce sıkılaştırması.

## Sonraki somut adım

Yereldeki ürün/sipariş/admin akışını inceleyin. Dış servis bilgileri güvenli environment/Secret Manager'a sağlandığında önce **staging sağlayıcı sandbox + Firebase uçtan uca doğrulaması** yapılmalı, ardından production kontrol maddeleri tamamlanmalıdır. Bulut kaynağı, gerçek ödeme veya production deployment için ayrı açık onay gerekir.

README sıfırdan kurulum komutlarını, diğer belgeler mimari/API/güvenlik/deployment kararlarını içerir. Hiçbir canlı kaynak veya gerçek tahsilat açılmadı.
