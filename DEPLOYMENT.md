# Dağıtım ve işletim

Bu belgede kaynak hazırlığı vardır; hiçbir Google Cloud kaynağı oluşturulmadı ve dağıtım yapılmadı. Docker bu bilgisayarda yüklü olmadığından image build yerelde doğrulanamadı. Uygulamanın Next.js production build'i ayrıca doğrulanır.

## Gereken işletme bilgileri

- Google Cloud proje kimliği, owner tarafından verilmiş yetkiler ve faturalama onayı.
- Ayrı staging/production projeleri veya izole servis/DB/bucket/secret setleri.
- Alan adı ve DNS erişimi; HTTPS.
- Firebase public config, Google/email auth sağlayıcıları, authorized domains ve personel MFA.
- iyzico veya PayTR test merchant anahtarları; sandbox callback adresi. Production hesabı ve canlı geçiş ayrıca onaylanmalıdır.
- E-posta sağlayıcı anahtarı ve doğrulanmış EMAIL_FROM alan adı.
- Gerçek ürün görselleri, ticari bilgiler, onaylı hukuk metinleri ve muhasebe/KDV/kargo politikası.

## Cloud Run mimarisi

Node standalone container Cloud Run'da 8080 dinler. Cloud SQL PostgreSQL bağlantısı TLS veya Cloud SQL Unix socket URL'siyle PrismaPg pool'a verilir. `pg_trgm` migration'ı için migration kullanıcısı extension kurabilmelidir. Runtime ayrı least-privilege DB kullanıcısı ve service account kullanmalıdır.

`infra/cloud-run.yaml.example` owner tarafından gerçek PROJECT/REGION/INSTANCE/DOMAIN/REVIEWED_SHA alanlarıyla doldurulur. `DATABASE_URL`, `SESSION_SECRET`, `MOCK_PAYMENT_SECRET`, `JOBS_SECRET`, ödeme/e-posta anahtarları Secret Manager'dan geçirilir. Public Firebase değişkenleri build-time `NEXT_PUBLIC_*` olduğu için build sırasında sağlanmalıdır; gerçek sır bu prefix'i kullanmamalıdır.

Bucket ürün raster dosyalarını tutar. Uygulama `/api/assets/:hash.webp` üzerinden okur; public bucket gerekmez. Runtime service account object create/read yetkisiyle sınırlandırılır. Cloud Run'da local upload kullanılmaz.

## Onay sonrası sıra

1. Kimlik bilgileri ve maliyet/owner onayını kayda alın.
2. Staging Cloud SQL, bucket, registry, Secret Manager, service account ve Cloud Run hazırlayın.
3. CI tüm testleri çalıştırsın; `cloudbuild.yaml` yalnızca image oluşturur. Otomatik production deploy tanımlı değildir.
4. Ayrı migration job/dependency image'i ile `pnpm db:migrate`; runtime image migration CLI içermez. Seed staging/production'a otomatik uygulanmaz.
5. APP_URL gerçek HTTPS adresi, AUTH_MODE=firebase, ALLOW_LOCAL_AUTH=false, SEED_DEMO=false, PAYMENT_MODE=sandbox, ALLOW_LIVE_PAYMENTS=false.
6. Firebase login/Google/MFA, sağlayıcı sandbox hosted checkout, imza callback, başarısız ödeme, expiry, kısmi iade ve e-posta teslimi uçtan uca test edin.
7. Owner hukuk/operasyon onayı ve GO_LIVE_CHECKLIST tamamlanmadan production'a yönlendirmeyin.
8. Production için ikinci açık onay ve ayrı sırlar; gerçek ödeme ancak başarılı sandbox kayıtlarından sonra açılır.

iyzico canlı alıcı kimliği toplama akışı henüz engellidir. Anahtar veya env bayrağı değiştirmek tek başına bu geliştirme engelini kaldırmaz. PayTR callback'te taksit vade farkı nedeniyle değişen toplamlar da ayrıca mutabakat politikası gerektirir; şimdilik yalnızca tam eşit tutar kabul edilir.

## Jobs, log ve monitoring

Cloud Scheduler veya başka güvenilir scheduler dakikada bir `/api/jobs` POST çağırmalıdır. Bearer JOBS_SECRET kullanılmalı, scheduler URL/secret log'a yazılmamalıdır. Tüm job çağrıları secret doğrular. Outbox servis başarısızlığında yeniden kuyruğa alınır; SENDING/PROCESSING durumunda süreç kesilirse personel mutabakatı gerekir.

Cloud Logging stdout JSON requestId/event kayıtları, health endpoint başarısızlığı, callback signature rejection, inventory consistency error, payment/refund RECONCILIATION, failed mail queue ve Cloud SQL bağlantı/pool kullanımı için alarm kurun. API hataları PII içermez. Audit tablosunu sınırlı personel erişimi ve uygun saklama süresiyle koruyun.

## Yedek ve geri yükleme

Cloud SQL otomatik backup, PITR ve bakım penceresini staging/production ayrı etkinleştirin. İşletmeyle RPO/RTO hedefi belirleyin. Backup'ı düzenli olarak ayrı instance'a restore edip migration sürümü, sipariş/ödeme toplamları, stock onHand/reserved ve erişim rollerini doğrulayın. GCS object versioning/lifecycle ihtiyacını maliyet onayıyla değerlendirin. Silme talepleri ve finansal saklama politikası yedeklere de uygulanmalıdır.

Production geri dönüş: önce yeni trafik kesilir, incelenmiş önceki container revision'a dönülür. Şema migration'ı backward compatible olmalıdır; destructive rollback otomatik yapılmaz. Ödeme durumu ve stok asla eski uygulama sürümü için körlemesine geri yüklenmez.
