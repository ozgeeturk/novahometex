# Canlıya geçiş kontrol listesi

**Henüz tamamlanmadı.** Yerel işlev testleri gerçek ticari hizmet doğrulaması yerine geçmez. Canlı ödeme, gerçek müşteri verisi veya ücretli bulut kaynağı için açık owner onayı gerekir.

## Dış servis ve işletme

- [ ] Google Cloud project/region/owner yetkileri ve maliyet onayı.
- [ ] Staging/production isolation, gerçek domain, DNS ve HTTPS.
- [ ] Firebase email/Google login ve doğrulama/şifre reset; gerçek personel MFA.
- [ ] İlk Super Admin bootstrap, service account ve minimum izinli DB runtime hesabı.
- [ ] Hosted checkout/iframe gerçek sağlayıcı sandbox testleri; doğru callback URL ve imza.
- [ ] Başarılı/başarısız ödeme, duplicate callback, farklı tutar, geç callback ve tam/kısmi iade sandbox sonuçları.
- [ ] iyzico gerçek alıcı kimliği toplama/onaylı işleme akışı. Canlı kod şu an engelli.
- [ ] PayTR taksit/vade farkı, tahsilat currency ve refund mutabakat kuralları.
- [ ] E-posta domain/SPF/DKIM ve gerçek teslim; outbox crash recovery.
- [ ] Cloud Storage erişim, image upload/read, lifecycle ve yedekler.
- [ ] Jobs schedule, log query redaction, alerts ve callback/refund mutabakat runbook'u.
- [ ] Gerçek ürün/fiyat/stok/görseller; tüm demo/test kayıtları uygun şekilde ayırma.

## Hukuk ve operasyon incelemesi

- [ ] Ticari unvan, vergi/adres/MERSİS bilgileri ve gerektiği ölçüde ETBİS süreci işletme tarafından dolduruldu.
- [ ] Ön bilgilendirme, mesafeli satış, teslimat, cayma/iade ve masraf metinleri hukuk danışmanı tarafından incelendi.
- [ ] KVKK aydınlatma, veri işleme/saklama, erişim/silme ve yurt dışı hizmet değerlendirmesi.
- [ ] Çerez sınıfları/izin geri alma ve newsletter/ticari ileti izinlerinin işletme incelemesi.
- [ ] KDV ürün sınıflandırması, faturalama/e-arşiv ve banka/muhasebe mutabakatı.
- [ ] İade penceresi/koşulları ve kargo sorumluluğu; destek personeli prosedürleri.

Bu liste hukuki uygunluk sertifikası değildir. Güncel inceleme için resmi [Ticaret Bakanlığı mesafeli sözleşmeler bilgilendirmesi](https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/mesafeli-sozlesmeler-hakkinda-bilgilendirme), [ETBİS bilgi sayfası](https://ticaret.gov.tr/ic-ticaret/bilgi-sistemleri/elektronik-ticaret-bilgi-sistemi-etbis-ve-e-ticaret-bilgi-platformu) ve [KVKK Çerez Rehberi](https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber) işletme danışmanıyla değerlendirilmelidir.

## Teknik doğrulama

- [ ] Docker image gerçekten build edildi; Cloud Run migration/runtime staging'de çalıştı.
- [ ] Production-like E2E, load/concurrency ve mobile/tablet/keyboard/screen-reader incelemesi.
- [ ] WCAG 2.2 AA ve Core Web Vitals ölçümü; formal sertifikasyon yapılmadı.
- [ ] Güvenlik review, CSP nonce, proxy/WAF, bağımlılık audit ve tüm prod sırların rotasyonu.
- [ ] Backup/PITR restore denemesi ve RPO/RTO onayı.
- [ ] Büyük katalog pagination/search ve rapor performansı.
- [ ] Gelişmiş dönem muhasebesi, iade tarihi raporları ve operasyonel reconciliation.
- [ ] Owner tarafından gerçek ödeme ve production deploy için ayrı son onay.
