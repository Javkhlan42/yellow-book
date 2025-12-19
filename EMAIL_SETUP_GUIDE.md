# Email Configuration Guide

## Бодит имэйл илгээх тохиргоо

Yellow Books систем одоо **бодит имэйл** илгээх боломжтой! 📧

### 1️⃣ Gmail-ээр тохируулах (Санал болгож байна)

#### Алхам 1: Gmail App Password үүсгэх

1. Google Account руу нэвтэрнэ үү: https://myaccount.google.com/security
2. **2-Step Verification** идэвхжүүлнэ үү (хэрэв идэвхжүүлээгүй бол)
3. **App Passwords** руу очно: https://myaccount.google.com/apppasswords
4. "Mail" гэсэн app password үүсгэнэ үү
5. 16 оронтой кодыг хуулна уу (жишээ: `abcd efgh ijkl mnop`)

#### Алхам 2: .env файл тохируулах

```bash
# .env файл дахь дараах мөрүүдийг өөрчилнө үү:

SMTP_ENABLED=true                              # false -> true
SMTP_HOST=smtp.gmail.com                       # Gmail SMTP
SMTP_PORT=587                                  # TLS port
SMTP_SECURE=false                              # false for port 587
SMTP_USER=javkhlangantulga0917@gmail.com      # Таны Gmail хаяг
SMTP_PASSWORD=abcd efgh ijkl mnop              # App Password (16 оронтой)
SMTP_FROM="Yellow Books <javkhlangantulga0917@gmail.com>"
```

#### Алхам 3: Server restart хийх

```powershell
# Dev server-г дахин эхлүүлнэ
npm run dev
```

#### Алхам 4: Тест хийх

1. Браузераа нээнэ: http://localhost:3000/admin/email
2. Өөрийн имэйл хаягруу тест имэйл илгээнэ үү
3. 📬 Gmail-аа шалгана уу!

---

### 2️⃣ Бусад SMTP Providers

#### SendGrid
```env
SMTP_ENABLED=true
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_ENABLED=true
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-mailgun-password
```

#### AWS SES
```env
SMTP_ENABLED=true
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

---

### 3️⃣ Алдаа засах (Troubleshooting)

#### "Authentication failed"
- ✅ Gmail App Password зөв эсэхийг шалгана уу
- ✅ 2-Step Verification идэвхтэй эсэхийг шалгана уу
- ✅ Spaces (зайг) устгасан эсэхийг шалгана уу (`abcdefghijklmnop`)

#### "Connection timeout"
- ✅ Firewall SMTP port (587) блок хийсэн эсэхийг шалгана уу
- ✅ VPN ашиглаж байвал унтраана уу

#### Имэйл ирэхгүй байна
- ✅ Spam folder шалгана уу
- ✅ Backend logs шалгана уу: `[Worker] ✅ Email sent successfully!`
- ✅ Gmail inbox filter шалгана уу

---

### 4️⃣ Production тохиргоо

Kubernetes дээр ажиллуулахдаа `k8s/secrets.yaml` файлд SMTP credentials нэмнэ үү:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: yellowbooks-secrets
  namespace: yellowbooks
type: Opaque
stringData:
  SMTP_ENABLED: "true"
  SMTP_HOST: "smtp.gmail.com"
  SMTP_PORT: "587"
  SMTP_SECURE: "false"
  SMTP_USER: "your-email@gmail.com"
  SMTP_PASSWORD: "your-app-password"
  SMTP_FROM: "Yellow Books <your-email@gmail.com>"
```

Дараа нь:
```bash
kubectl apply -f k8s/secrets.yaml
kubectl rollout restart deployment backend -n yellowbooks
```

---

### 5️⃣ Тест команд

```bash
# Worker logs-г харах
npm run worker:dev

# Имэйл илгээх
curl -X POST http://localhost:3333/api/admin/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "Сайн байна уу, энэ бол тест имэйл!"
  }'
```

---

### 📊 Feature Overview

✅ Бодит SMTP имэйл илгээх  
✅ Gmail, SendGrid, Mailgun, AWS SES дэмжлэг  
✅ HTML email templates  
✅ Mongolian language support  
✅ Background job queue (Bull + Redis)  
✅ Retry logic (5 attempts, exponential backoff)  
✅ Rate limiting (10 emails/hour per user)  
✅ Dead Letter Queue (DLQ)  
✅ Admin UI for composing emails  
✅ Log-only mode for development  

---

### 🔐 Security Best Practices

1. **Never commit .env файлыг Git-д!** (`.gitignore`-д нэмсэн)
2. **App Passwords ашигла** (бодит нууц үгийг бүү ашигла)
3. **Production дээр** Kubernetes Secrets ашигла
4. **Rate limiting** идэвхтэй байлга
5. **SMTP credentials** хамгаалагдсан байх ёстой

---

## Support

Асуудал гарвал:
- 📧 Email: javkhlangantulga0917@gmail.com
- 🐛 GitHub Issues: [Create an issue](https://github.com/Javkhlan42/uploadit/issues)

Амжилт хүсье! 🚀
