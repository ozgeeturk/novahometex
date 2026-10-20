# Güvenlik

## Uygulanan kontroller

- Zod sunucu doğrulaması, Prisma parameterized sorgular; kullanıcı girdisiyle SQL kurulmaz.
- Sunucuda rol/işlem yetkileri; standart kullanıcı admin read/write endpoint'lerine erişemez.
- Firebase ID token verify/revocation/email_verified, personel için MFA claim. Yerel login loopback + açık bayrak ve scrypt salted password ile sınırlı.
- 12 saat JWT, issuer/audience/HS256, HTTPOnly, SameSite=Lax, HTTPS APP_URL için Secure cookie. İzin ve account.active her istekte DB'den okunur.
- POST Origin kontrolü, cookie tabanlı işlemlerde CSRF koruması; ödeme callback'leri ayrı imza kontrolleri kullanır.
- PostgreSQL rate limiting paylaşılabilir. Public proxy yalnızca güvenilir yapılandırmayla TRUST_PROXY=true olmalıdır; aksi durumda geliştirme istekleri ortak limit kullanır.
- Ödeme HMAC, tutar/currency/order eşleşmesi, unique event key, transaction ve expiry/late reconciliation.
- Varyant son stok için koşullu atomik update; stok hareketleri ve admin audit.
- Upload MIME + gerçek decoder doğrulaması, 5 MB/20 MP, raster-only, metadata temizlenerek WebP dönüşümü. Kullanıcı dosya adı disk yolu olarak kullanılmaz.
- Guest sipariş erişimi yüksek entropili anahtar; DB yalnızca hash tutar. PII ve ödeme token'ları public API'ye dönmez.
- CSP, nosniff, frame denial, Referrer-Policy, Permissions-Policy; HTTPS production HSTS.
- React metin escape, JSON-LD '<' escape, CMS içeriği raw HTML değildir; CSV formula injection kaçırılır.
- Sırlar .env/Secret Manager; public Firebase config dışında NEXT_PUBLIC prefix yok.

## Production öncesi zorunlu inceleme

Güvenlik incelemesi/penetrasyon testi tamamlandı denmez. CSP geliştirme için unsafe-inline/unsafe-eval içerir; production nonce ve sağlayıcı/Firebase domain gereksinimleriyle daraltılmalıdır. Cloud Run ingress/proxy IP doğrulaması, WAF/abuse bütçeleri ve DB least privilege ayrıca kurulmalıdır.

Firebase oturum iptali girişte kontrol edilir; oluşturulmuş uygulama JWT'si 12 saat yaşar. Acil personel yetki kapatmada DB active=false/rol kaldırma uygulanır. Tam anlık Firebase session revocation/session registry sonraki güvenlik güçlendirmesidir.

Misafir token URL query'de bulunur; proxy/access log'larda query redaction kurun. Referrer-Policy site dışına tam query gönderimini kısıtlar. Ödeme başlatma/refund'da network belirsizliğini otomatik tekrar etmeyin; sağlayıcı mutabakatı yapın.

Outbox SENDING/Refund PROCESSING crash recovery ve zaman aşımı reconciliation operasyonu işletim runbook'uyla tamamlanmalıdır. Kişisel veri saklama/anonymization, newsletter unsubscribe kampanya workflow'u, personel ilk bootstrap ve MFA enrollment işletme kurulumuna bağlıdır.

## Bağımlılık doğrulaması

Sürümler package.json ve lockfile'da sabittir. TypeScript 6, güncel typescript-eslint uyumluluğu için seçildi. Prisma CLI ve client 7.10 aynı sürümdedir. Audit çıktısında tespit edilen transitive lodash/deepmerge-ts/mysql2/grpc paketleri pnpm overrides ile yamalı sürümlere yönlendirilir; yeniden build/test ve audit sonucu TESTING.md'ye kaydedilir. CI için `pnpm audit --prod` tekrar uygulanmalıdır.

## Ödeme kaynakları

iyzico initialization/retrieve/refund response imzaları resmi [Response Signature Validation](https://docs.iyzico.com/en/advanced/response-signature-validation) sırasına göre. PayTR token/callback [iframe Step 1](https://dev.paytr.com/iframe-api/iframe-api-1-adim) ve [Step 2](https://dev.paytr.com/iframe-api/iframe-api-2-adim), iade [Refund API](https://dev.paytr.com/iade-api) esas alındı. Anahtarlar sağlanmadığından gerçek sağlayıcı doğrulaması yapılmadı; imza ve request kodunun var olması başarı kanıtı değildir.
