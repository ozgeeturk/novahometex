# Yönetim rehberi

`/admin` hesabıyla giriş yapın. Yerel admin bilgileri `local-credentials.txt` dosyasında. Gerçek Firebase personeli için MFA zorunludur; personel önce Firebase ile müşteri hesabı açmalı, sonra yetkili Super Admin rol atamalıdır. İlk production Super Admin kontrollü DB/bootstrap operasyonuyla atanır; public kayıt rol vermez.

## Günlük işlemler

- Ürünler > Yeni kayıt: Türkçe/İngilizce metin, kategori, malzeme, bakım, KDV, görsel ve SKU başına varyant fiyat/stok. Aktif ürün mağazada anında görünür. Pasifleştirme arşivler, finansal geçmiş korunur.
- Ürün düzenleme: galeri bölümünden raster ekleyin, açıklama ve sıralamayı kaydedin. Galeri kayıt butonu ayrı işlem yapar. Görseller güvenli WebP formatına yeniden kodlanır.
- Stok Yönetimi: pozitif/negatif değişim ve zorunlu gerekçe. Rezerve miktarın altına indirilemez. Hareketler actor/time/reason ile korunur.
- Siparişler > Ayrıntılar: PAID → PREPARING → PACKED → SHIPPED → DELIVERED. Kargoya verirken firma, takip numarası, maliyet ve tahmini teslim girilir. Ödenmiş sipariş doğrudan iptal edilmez; iade gerekir.
- İade ve İptaller: müşteri kalem/miktar talebi. Onay veya reddet. Stok geri alma ancak fiziksel iade incelendiyse seçilmelidir. Sağlayıcı cevabı belirsizse RECONCILIATION; tamamlandı olarak gösterilmez.
- Şikayet ve Öneriler: gelen mesaj, durum ve yanıt. Yanıt outbox'a yazılır; e-posta anahtarı yoksa dışarıya gönderilmez.
- Kuponlar: PERCENT/FIXED/SHIPPING, tarihler, minimum, maksimum ve kullanım limitleri. Sepet başına tek kupon; ürünün indirimli fiyatı üzerine kupon merkezi kurallarla uygulanır.
- Kategoriler: Türkçe/İngilizce ad, slug, sıra, aktiflik ve üst kategori. Döngüler reddedilir.
- İçerik / Bannerlar: iki dilde metinler, banner bağlantısı ve sıra. Hukuki metinler işletme incelemesinden sonra taslak olmaktan çıkarılmalıdır.
- Döviz Kurları: 1 EUR/USD karşılığının TRY değerini ve geçerlilik tarihini kaydedin. Mevcut sipariş kurunu değiştirmez. TRY kur değeri 1 olmalıdır.
- Kullanıcılar ve Yetkiler: rol ata/kaldır; rolün modül read/write izinlerini düzenle. Super Admin temel yetkileri korunur.
- Site Ayarları: brandName, logoUrl/faviconUrl, announcementTr/En, business, homeSections ve socialLinks. Logo/favicon için yüklenen raster yolu kullanılır. homeSections dizisi featured/new/sale değerleriyle ana sayfa bölümlerini seçer. business alanı ticari unvan/vergi/adres/MERSİS/ETBİS bilgilerini saklar.
- Entegrasyonlar: mock/iyzico/PayTR seçimi; anahtarlar ekranda gösterilmez. Sağlayıcı seçmek anahtarların veya entegrasyon testinin tamamlandığı anlamına gelmez.

## Rapor yorumlama

Brüt tahsilat doğrulanmış ödemelerden, iade sonrası net tahsilat completed refund düşülerek hesaplanır. Vergi/kargo brüt kırılımlardır. Muhasebe kârı veya banka mutabakatı değildir. Test siparişleri demo=true ile işaretlidir. Tarih filtresi sipariş oluşturma tarihini kullanır; ayrı iade gerçekleşme tarihi dönem muhasebesi henüz eklenmemiştir.

Her kritik yazma audit log'a kaydedilir. Personel e-posta/rol değişikliği derhal sonraki API isteğine uygulanır. Yönetim erişimini sadece menü gizlenmesine dayanarak değerlendirmeyin; API ayrıca yetki kontrolü yapar.
