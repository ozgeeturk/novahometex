# Veritabanı

Şema: `prisma/schema.prisma`. PostgreSQL/Prisma. Başlangıç migration'ı ve ikinci migration'da pg_trgm/full-text indeksleri ve CHECK kısıtları bulunur. Migration'lar `pnpm db:migrate` ile uygulanır; production'da `db push` kullanılmaz.

| Alan                   | Tablolar                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Kimlik/RBAC            | users, user_profiles, roles, permissions, user_roles, role_permissions, addresses                                       |
| Katalog                | categories, category_translations, products, product_translations, product_images, product_variants, product_attributes |
| Stok/sepet             | inventory, inventory_movements, carts, cart_items, wishlists                                                            |
| Ticaret                | orders, order_items, order_status_history, payments, payment_events, refunds, shipments, shipment_events                |
| Kampanya               | coupons, coupon_redemptions, campaigns, reviews                                                                         |
| Destek/içerik          | support_tickets, support_messages, content_pages, banners, newsletters                                                  |
| Yapılandırma/operasyon | exchange_rates, tax_rules, site_settings, audit_logs, outbox, rate_limits                                               |

Para değerleri Decimal(14,2); kurlar Decimal(14,6), KDV Decimal(5,2). TRY fiyatlar KDV dahildir. Adres/fatura/sözleşme sürümü ve sipariş kalemleri geçmişi koruyan snapshot'lardır. İndirim her kaleme oransal dağıtılır, son eligible kalem kuruş bakiyesini alır. Stok varyant seviyesindedir.

`sku`, slug, email, order.number, checkoutKey, externalId unique. CartItem sepet/varyant unique. Inventory reserved >=0, onHand >=reserved; ürün price>0 ve compareAt>price. Sipariş total=subtotal-discount+shipping. Rating 1..5; miktarlar pozitif. Geçmiş siparişlere referans veren ürünler arşivlenir, silinmez.

Seed yalnızca SEED_DEMO=true ve yerel host/db adresinde çalışır. 12 kategori, 32 ürün, 96 varyant, test müşteri, 18 test sipariş, 6 personel rolü, örnek yorum/kupon/banner ve taslak içerikler oluşturur. Tekrar çalıştırılabilir. Canlı ortama otomatik demo eklenmez.

Kişisel verilerin erişim/silme talepleri profil üzerinden kaydedilir; veri saklama/anonymization politikası işletme onayından sonra uygulanmalıdır. Otomatik finansal kayıt silme yapılmaz.

Yedek: yerelde pg_dump/custom format, Cloud SQL'de otomatik backup + PITR. Geri yükleme ayrı veritabanında denenmelidir; ayrıntılar DEPLOYMENT.md'de.
