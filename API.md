# API

JSON Route Handlers: `/api/*`. Browser POST için `Origin` tam APP_URL origin'i ile eşleşmelidir. Auth HTTPOnly cookie'dir. Başarısız işlemler `{error: CODE}` döndürür; Zod 422 alan hataları, yetki 401/403, conflict 409, rate limit 429. PII/sırlar hata mesajında yer almaz.

| Endpoint                              | Yöntem         | İşlem                                                                                                         |
| ------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| health                                | GET            | DB hazır olma kontrolü                                                                                        |
| products                              | GET            | q/category/min/max/color/size/material/stock/sale/sort/page; ids ile favori kayıtları                         |
| search, categories                    | GET            | Otomatik tamamlama, aktif kategoriler                                                                         |
| preferences                           | POST           | locale tr/en; currency TRY/EUR/USD                                                                            |
| auth/local                            | POST           | Yerel test email/password/register/name                                                                       |
| auth/firebase                         | POST           | Firebase idToken doğrulama                                                                                    |
| auth/logout, me                       | POST / GET     | Çıkış / güvenli kullanıcı özeti                                                                               |
| cart                                  | GET / POST     | Oku; variantId/quantity/add. quantity=0 siler                                                                 |
| quote                                 | POST           | coupon/email/locale ile sunucu hesaplaması                                                                    |
| checkout                              | POST           | name/email/phone/address/billing/consent/checkoutKey/currency/locale/coupon; sipariş + hosted checkout adresi |
| payments/retry                        | POST           | Ödeme bekleyen, rezervasyonu geçerli sipariş için tekrar başlatma                                             |
| payments/mock                         | POST           | Yetkili test siparişinde başarı/başarısızlık simülasyonu                                                      |
| payments/mock/callback                | POST           | x-nova-signature HMAC; test callback                                                                          |
| payments/paytr/callback               | POST           | PayTR form + hash kontrolü; başarı yanıtı OK                                                                  |
| payments/iyzico/callback              | POST           | Token'ın sunucudan retrieve edilmesi + response HMAC                                                          |
| orders/:id                            | GET            | Ait kullanıcı veya token ile güvenli sipariş özeti                                                            |
| track                                 | GET            | number + token; sipariş numarasından güvenli doğrulama                                                        |
| orders/cancel                         | POST           | Yalnızca ödenmemiş siparişte stok bırakma                                                                     |
| refunds                               | POST           | orderId/token/reason/items[{itemId,quantity}]                                                                 |
| account, wishlist                     | GET            | Üye adres/sipariş ve favorileri                                                                               |
| profile, addresses, wishlist, reviews | POST           | Üye işlemleri; yorum için doğrulanmış satın alma gerekir                                                      |
| contact                               | POST           | Talebi ve bildirim outbox'ını kaydet                                                                          |
| newsletter                            | POST           | Onay linki kuyruğa alınır; active=false                                                                       |
| newsletter/confirm                    | GET            | Rastgele anahtarla çift onay                                                                                  |
| jobs                                  | POST           | Bearer JOBS_SECRET, expire + e-posta worker                                                                   |
| admin/:module                         | GET / POST     | RBAC kontrollü modül okuma/yazma                                                                              |
| admin/import                          | POST           | En fazla 100 ürün/500 varyant CSV, atomik import                                                              |
| admin/role-permissions                | POST           | Korumasız rollerin izinleri                                                                                   |
| admin/product-images                  | POST           | Varyant galerisi sıralama/açıklama                                                                            |
| upload                                | POST multipart | Yetkili raster yükleme; 5 MB, 20 MP sınırı, WebP yeniden kodlama                                              |
| assets/:name                          | GET            | GCS raster dosyası, yalnızca SHA-256.webp adı                                                                 |

Ödeme endpoint'leri kart numarası/CVV almaz. Browser yönlendirmesi PAID oluşturmaz. Sayfalar POST fiyatını güvenilir kabul etmez. `checkoutUrl` sağlayıcı başlatma hatasında sipariş takip sayfasına gider; `paymentError` bunu açıklar.

CSV: ürün export ilk 500 ürünü tüm varyant satırlarıyla çıkarır. Import productId/variantId olan satırları günceller, olmayanları oluşturur. `slug,categoryId,nameTr,nameEn,descriptionTr,descriptionEn,careTr,careEn,material,taxRate,image,sku,color,colorHex,size,price,compareAt,stock,active,featured` alanları vardır. Ürün dışı CSV export mevcut sayfadaki en fazla 50 kayıttır. Formül enjeksiyonu için tehlikeli hücre başlangıçları kaçırılır.
