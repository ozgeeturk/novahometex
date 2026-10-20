# Mimari

## Katmanlar

`src/app`: Next.js App Router, SSR katalog/ürün/içerik ve Route Handlers. `src/components`: ortak tasarım sistemi ve etkileşimli ekranlar. `src/lib`: doğrulama, veri erişimi, kimlik/yetki, katalog, Decimal hesaplama, commerce, payments, refunds, e-posta ve admin servisleri. `prisma`: normalize şema, migration ve yalnızca yerel seed. `infra`: dağıtım örnekleri.

İstemci fiyat göndermez; varyant kimliği ve adet gönderir. Admin fiyat değiştirebilir, checkout güncel veriyi yeniden okur. Ürün çevirileri ve para birimi kur kayıtları veritabanındadır. Ödeme TRY ile, görüntüleme TRY/EUR/USD ile yapılır.

## Satın alma

1. Rastgele misafir sepet token'ının yalnızca SHA-256 özeti DB'ye yazılır; raw token HTTPOnly cookie'dedir.
2. Checkout anahtarı UUID. Aynı sepet/kullanıcı/payload için tekrar aynı sipariş ve deterministik erişim anahtarını döndürür; farklı payload 409 verir.
3. Transaction sepet satırını kilitler, ürünleri/kuponu doğrular. Varyantlar sabit kimlik sırasıyla rezerve edilir: `UPDATE ... WHERE onHand-reserved >= quantity`.
4. Fiyat, ürün adı, SKU, renk, ölçü, KDV, indirim ve kur siparişe sabitlenir. Rezervasyon süresi 30 dakika.
5. Hosted checkout/iframe adaptörü sunucudan başlatılır. Sağlayıcı başlamazsa sipariş ve erişim anahtarı korunur; müşteri takip sayfasından yeniden dener.
6. Ödeme doğrulama sipariş satırını kilitler. Unique event key tekrarları önler. Tutar/para birimi kontrol edilmeden PAID yazılmaz.
7. Ödeme başarısında onHand ve reserved birlikte azaltılır. Başarısızlık/iptal/süre aşımında reserved serbest bırakılır.
8. Süresi dolmuş siparişe sonradan gelen tahsilat RECONCILIATION olur. Stok sessizce tekrar tüketilmez; personel sağlayıcı mutabakatı/iade yapmalıdır.

## İade ve bildirim

Kalem/miktar bazlı iade talepleri sipariş kilidi altında toplam miktar/tutarı aşamaz. İade bir kez PROCESSING olarak alınır; sağlayıcı sonucundan sonra COMPLETED olur. Belirsiz dış servis hatası RECONCILIATION bırakır; otomatik tekrar yoktur. Stok yalnızca personelin açık stok iadesi seçimiyle geri alınır.

İş transaction'ı e-posta outbox kaydını atomik yazar. Yerel anahtarsız mod TEST_STORED, gerçek servis SENT olarak kayıt tutar. Şu an Resend uyumlu HTTP adapter kullanılır; SMTP protokolü uygulanmamıştır.

## Kimlik ve erişim

Firebase ID token sunucuda iptal kontrolü ve e-posta doğrulamasıyla doğrulanır. Uygulama 12 saatlik imzalı, HTTPOnly, SameSite=Lax oturum verir. Personel izinleri her istekte DB'den okunur; Firebase personel erişimi ikinci faktör ister. Yerel scrypt test girişi yalnızca loopback APP_URL ve açık ALLOW_LOCAL_AUTH ile çalışır.

Admin modülleri modül/işlem izinlerine sahiptir. Super Admin korumalı; diğer rollerin read/write izinleri düzenlenebilir. Hassas anahtarlar hiçbir API cevabında gösterilmez. Guest sipariş erişimi sipariş numarası + 256 bit anahtar veya ait olduğu üye oturumu gerektirir.

## Genişletme ve sınırlar

PaymentProvider hosted checkout/refund interface'ini uygular. Kargo ilk sürümde manuel Shipment/ShipmentEvent modelidir. Kur sağlayıcı eklenebilir; mevcut kurlar manuel. Harici arama motoru catalog servisinin yerine eklenebilir.

SSR yanıtları kişiselleştirilmiş ve dinamik, stok/checkout cache edilmez. Görseller Next Image ile optimize edilir. Katalog sorgusu ilk sürümde en fazla 500 aday getirip fiyat/puan sıralamasını uygular; büyük katalog için DB seviyesinde fiyat/rating/popularity aggregate ve keyset pagination sonraki geliştirmedir. Çoklu instance'da PostgreSQL rate limit tablosu paylaşılır.

İleri muhasebe raporları, otomatik kargo/kur, müşteri MFA kayıt ekranı, gelişmiş içerik blok editörü ve tam erişilebilirlik/performance sertifikasyonu tamamlandı sayılmaz.
