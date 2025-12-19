'use client';

import { useState } from 'react';

export default function EmailComposerPage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: 'Имэйл амжилттай илгээгдлээ!' });
        // Clear form
        setTo('');
        setSubject('');
        setBody('');
      } else {
        setResult({ success: false, message: data.error || 'Имэйл илгээхэд алдаа гарлаа' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Серверт холбогдоход алдаа гарлаа' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span>📧</span>
              <span>Email Илгээх</span>
            </h1>
            <p className="text-purple-100 mt-2">
              Хэрэглэгчдэд мэдэгдэл болон имэйл илгээх
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSendEmail} className="p-8 space-y-6">
            {/* Result Message */}
            {result && (
              <div
                className={`p-4 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{result.success ? '✅' : '❌'}</span>
                  <span className="font-medium">{result.message}</span>
                </div>
              </div>
            )}

            {/* To Field */}
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                Хэнд илгээх <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="to"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Гарчиг <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Имэйлийн гарчиг"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Body Field */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                Агуулга <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Имэйлийн агуулга..."
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y"
              />
              <p className="mt-2 text-sm text-gray-500">
                {body.length} тэмдэгт
              </p>
            </div>

            {/* Template Buttons */}
            <div className="border-t pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Загвар сонгох:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Баталгаажуулалт');
                    setBody(`Сайн байна уу,

Таны бүртгэл амжилттай баталгаажлаа.

Баярлалаа,
Yellow Books баг`);
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  📋 Баталгаажуулалт
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Сэргээх код');
                    setBody(`Сайн байна уу,

Таны нууц үг сэргээх код: 123456

Энэ кодыг 15 минутын дотор ашиглана уу.

Баярлалаа,
Yellow Books баг`);
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  🔑 Нууц үг сэргээх
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubject('Урилга');
                    setBody(`Сайн байна уу,

Та Yellow Books систем ашиглахыг урьж байна.

Та манай вэб сайтаар зочлон уу: https://sharnom.systems

Баярлалаа,
Yellow Books баг`);
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ✉️ Урилга
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Илгээж байна...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>📤</span>
                    Email илгээх
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTo('');
                  setSubject('');
                  setBody('');
                  setResult(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Цэвэрлэх
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="bg-blue-50 border-t border-blue-100 px-8 py-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">Санамж</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Имэйл background job-оор асинхрон илгээгдэнэ</li>
                  <li>• Одоогоор log-only горимд ажиллаж байна (бодит имэйл илгээхгүй)</li>
                  <li>• Worker logs-г шалгаж имэйл агуулгыг харна уу</li>
                  <li>• Алдаа гарвал автоматаар 5 удаа retry хийнэ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-sm text-gray-600">Имэйл илгээсэн</p>
                <p className="text-xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-sm text-gray-600">Хүлээгдэж буй</p>
                <p className="text-xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-sm text-gray-600">Алдаатай</p>
                <p className="text-xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
