# NovaHomeTex

Türkçe/İngilizce ev tekstili mağazası; Next.js 16.4.0, React 19.3, TypeScript 6.0, Tailwind 4, Prisma 7.10 ve **gerçek PostgreSQL**. Mağaza, sunucu servisleri ve role dayalı yönetim aynı repository'de.

**Durum:** Yerel geliştirme sürümü. Canlı satışa hazır olduğu iddia edilmez. Sağlayıcı sandbox, Firebase ve Google Cloud doğrulamaları dış servis kimlik bilgileri bekliyor. Tam ayrım [PROGRESS.md](PROGRESS.md) ve [GO_LIVE_CHECKLIST.md](GO_LIVE_CHECKLIST.md) içinde.

## Yerel kurulum

Node.js 24 ve pnpm 11.25.0 gerekir. Windows'ta Codex'in pnpm yolu PATH'te değilse `pnpm` yerine `./scripts/pnpm.ps1` kullanın.

```powershell
pnpm install --frozen-lockfile
pnpm setup
pnpm db:generate
```

`setup` var olan `.env` dosyasını korur. Yeni kurulumda yalnızca yerel test için oturum/imza anahtarları ve rastgele admin şifresi oluşturur. Bunlar Git'e dahil edilmez. Giriş bilgileri `local-credentials.txt` dosyasındadır.

Birinci terminalde PostgreSQL'i başlatın:

```powershell
pnpm db:local
```

Windows Türkçe locale problemi `--locale=C --encoding=UTF8` ile giderilmiştir. Veriler `.data/postgres` içinde kalır; servis yalnızca `127.0.0.1:54329` dinler. Bu bir bellek içi taklit değildir, PostgreSQL 18 motorudur.

İkinci terminalde:

```powershell
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Mağaza: [http://127.0.0.1:3000](http://127.0.0.1:3000). Yönetim: [/admin](http://127.0.0.1:3000/admin). `localhost` yerine yapılandırılmış APP_URL adresini kullanın; CSRF origin denetimi adres eşleşmesini gerektirir.

Docker tercihi: embedded servisi durdurduktan sonra `docker compose up -d db`; aynı migrate/seed/dev komutları. Port aynı olduğundan iki PostgreSQL servisini aynı anda başlatmayın. İsteğe bağlı uygulama konteyneri: `docker compose --profile container up --build` (önce veritabanına migration uygulanmalıdır).

## Çalışan akışlar

- PostgreSQL ürünleri, 12 kategori, 32 örnek ürün ve ayrı SKU/stoklu renk/ölçü varyantları.
- URL üzerinden arama/filtre/sıralama/sayfalama, full-text ve trigram arama, görsel galerisi, favoriler.
- Kalıcı misafir sepeti, yerel üye girişi/kaydı, adres/profil, sepet birleştirme, misafir/üye siparişleri.
- Decimal fiyat/KDV/kupon/kargo, TRY tahsilat ve EUR/USD görüntüleme, sipariş fiyat/kur snapshot'ları.
- Transaction stok rezervasyonu, son stok yarışının önlenmesi, imzalı simülasyon ödemesi, callback idempotency, sipariş takibi.
- Yönetim: ürün/varyant, kategori, stok hareketleri, sipariş/kargo, müşteri, kupon/kampanya, iade, yorum, destek, içerik/banner, kur, ayar, personel/rol izinleri ve audit.
- Gerçek DB raporları; ödeme doğrulanmadan satış geliri yazılmaz. İadeler ayrıca ayrılır.
- İletişim ve çift onaylı newsletter; anahtar olmadığında **e-posta gönderilmez**, outbox'ta test kaydı tutulur.

`MERHABA10` örnek kuponu: minimum 500 TRY, %10, en fazla 300 TRY, kişi başı bir kullanım. Kurlar **temsili**, piyasa kuru değildir. Ürün fotoğrafları Unsplash'tan temsili iç mekan fotoğraflarıdır; ürünlerin gerçek ticari fotoğrafları olarak kullanılmamalıdır.

## Test ve build

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm test:integration
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
pnpm start
```

Entegrasyon testleri ayrı `novahometex_test` veritabanını kullanır ve yalnızca bu veritabanını temizler. E2E, yerel çalışan mağazada `.test` e-posta ve açıkça E2E isimli ürünler oluşturur; test ürünleri arşivlenir. Harici ödeme servisi testlerde çağrılmaz.

## Periyodik işler

Yerelde `pnpm jobs`: süresi dolan stok rezervasyonlarını bırakır, e-posta outbox'ını işler. Dağıtımda `POST /api/jobs` isteği `Authorization: Bearer JOBS_SECRET` ile bir scheduler tarafından dakikada bir çağrılmalıdır. Checkout da gecikmiş rezervasyonları temizler.

## Dış servisler

`AUTH_MODE=firebase` için Firebase public config + sunucu service account / ADC, e-posta/Google sağlayıcıları, yetkili domain ve admin MFA gerekir. `.env.example` tüm alanları gösterir. iyzico / PayTR test hesabı anahtarları, HTTPS callback adresi ve e-posta servis anahtarı sağlanmalıdır. Gerçek sağlayıcı testleri henüz çalıştırılmamıştır. Google Cloud kaynakları oluşturulmamıştır.

Canlı mod iki ayarla kapalıdır: `PAYMENT_MODE=sandbox`, `ALLOW_LIVE_PAYMENTS=false`. Hukuki metinler taslaktır. iyzico canlı alıcı kimliği akışı ayrıca engellenir; yer tutucu T.C. kimlik numarası üretilmez.

## Belgeler

[Mimari](ARCHITECTURE.md) · [Veritabanı](DATABASE.md) · [API](API.md) · [Admin](ADMIN_GUIDE.md) · [Deployment](DEPLOYMENT.md) · [Güvenlik](SECURITY.md) · [Testler](TESTING.md) · [Canlı kontrol listesi](GO_LIVE_CHECKLIST.md) · [İlerleme](PROGRESS.md)
