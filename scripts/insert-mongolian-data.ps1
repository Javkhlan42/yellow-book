# Insert Mongolian data directly to PostgreSQL database
# This script connects to the PostgreSQL pod and runs SQL commands

Write-Host "🔍 Finding PostgreSQL pod..." -ForegroundColor Cyan

# Get PostgreSQL pod name
$podName = kubectl get pods -n yellowbooks -l app=postgres -o jsonpath='{.items[0].metadata.name}' 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to find PostgreSQL pod. Make sure you have AWS/kubectl access." -ForegroundColor Red
    Write-Host "Error: $podName" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found pod: $podName" -ForegroundColor Green

# SQL commands to insert Mongolian data
$sqlCommands = @"
-- Delete old American data
DELETE FROM yellow_books WHERE city IN ('New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Seattle');

-- Insert Mongolian businesses
INSERT INTO yellow_books (id, business_name, category, phone_number, address, city, state, zip_code, description, website, email, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Хаан банк', 'Санхүү', '7000-1111', 'Бага тойруу, Чингисийн өргөн чөлөө 9', 'Улаанбаатар', 'СХД', '14192', 'Монголын хамгийн том банкуудын нэг. Олон улсын стандартын санхүүгийн үйлчилгээ үзүүлдэг.', 'https://khanbank.com', 'info@khanbank.com', now(), now()),
  (gen_random_uuid(), 'Шангри-Ла зочид буудал', 'Зочид буудал', '7799-8888', 'Олимпын гудамж 19', 'Улаанбаатар', 'СХД', '14241', '5 одтой зочид буудал. Дэлхийн жишгийн үйлчилгээ, ресторан, конференц танхим бүхий.', 'https://shangri-la.com/ulaanbaatar', 'slub@shangri-la.com', now(), now()),
  (gen_random_uuid(), 'Номин супермаркет', 'Худалдаа', '7012-3456', 'Сөүлийн гудамж 8', 'Улаанбаатар', 'ХУД', '14210', 'Монголын хамгийн том супермаркет сүлжээ. Хүнсний бүтээгдэхүүн, гэр ахуйн бараа.', 'https://nomin.mn', 'info@nomin.mn', now(), now()),
  (gen_random_uuid(), 'Enerelt сургууль', 'Боловсрол', '7011-5555', 'Энхтайвны өргөн чөлөө 47', 'Улаанбаатар', 'СБД', '14253', 'Олон улсын жишигт нийцсэн хувийн сургууль. Англи хэл дээр суралцах боломжтой.', 'https://enerelt.edu.mn', 'info@enerelt.edu.mn', now(), now()),
  (gen_random_uuid(), 'Сонгдо эмнэлэг', 'Эрүүл мэнд', '7575-1100', 'Их Монгол улсын 16а', 'Улаанбаатар', 'БГД', '14200', 'Солонгос-Монголын хамтарсан эмнэлэг. Орчин үеийн тоног төхөөрөмж, мэргэжлийн эмч нар.', 'https://songdo.mn', 'contact@songdo.mn', now(), now()),
  (gen_random_uuid(), 'MCS coca cola', 'Үйлдвэрлэл', '7011-9999', 'Амгалан 30', 'Улаанбаатар', 'СХД', '14251', 'Кока Кола, Фанта зэрэг ундааны үйлдвэр. Монголд 1997 оноос хойш үйл ажиллагаа явуулж байна.', 'https://coca-cola.mn', 'info@coca-cola.mn', now(), now()),
  (gen_random_uuid(), 'Өрхөн гоёо', 'Ресторан', '7010-7777', 'Сөүлийн гудамж 3', 'Улаанбаатар', 'ХУД', '14210', 'Монголын үндэсний хоолны ресторан. Хорхог, бууз, цуйван зэрэг үндэсний хоол.', 'https://orkhongoyo.mn', 'booking@orkhongoyo.mn', now(), now()),
  (gen_random_uuid(), 'Модерн номын дэлгүүр', 'Худалдаа', '7015-8888', 'Их тойруу, Сүхбаатарын талбай', 'Улаанбаатар', 'СБД', '14192', 'Монгол болон гадаад номын хамгийн том дэлгүүр. Сурах бичиг, уран зохиол, хүүхдийн ном.', 'https://modernbook.mn', 'info@modernbook.mn', now(), now()),
  (gen_random_uuid(), 'Sky resort', 'Амралт', '7018-3000', 'Цагаан нуур', 'Дархан', 'ДАР', '45000', 'Дарханы ойролцоо байрладаг амралтын газар. Цагаан нуур дээр сувиллын үйлчилгээ.', 'https://skyresort.mn', 'reservation@skyresort.mn', now(), now()),
  (gen_random_uuid(), 'Эрдэнэт техникийн их сургууль', 'Боловсрол', '7035-2200', 'Баруун хэсэг, 4-р хороолол', 'Эрдэнэт', 'ОРХ', '65000', 'Орхон аймгийн том их сургууль. Технологийн болон бизнесийн чиглэлээр сургалт явуулдаг.', 'https://erdenet-tech.edu.mn', 'admission@erdenet-tech.edu.mn', now(), now());
"@

Write-Host "`n📝 Running SQL commands..." -ForegroundColor Cyan

# Execute SQL
kubectl exec -n yellowbooks $podName -- psql -U yellowbooks_user -d yellowbooks -c "$sqlCommands"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Mongolian data inserted successfully!" -ForegroundColor Green
    
    # Verify the data
    Write-Host "`n📊 Verifying data..." -ForegroundColor Cyan
    kubectl exec -n yellowbooks $podName -- psql -U yellowbooks_user -d yellowbooks -c "SELECT business_name, city, category FROM yellow_books ORDER BY created_at DESC LIMIT 10;"
    
    Write-Host "`n✅ Done! You can now test the application at:" -ForegroundColor Green
    Write-Host "   http://sharnom.systems:31529/yellow-books/assistant" -ForegroundColor White
} else {
    Write-Host "`n❌ Failed to insert data!" -ForegroundColor Red
}
