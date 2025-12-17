-- Insert Mongolian business data directly into database
-- Run this SQL in the PostgreSQL database

-- Delete old data
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

-- Verify
SELECT business_name, city, category FROM yellow_books ORDER BY created_at DESC LIMIT 10;
