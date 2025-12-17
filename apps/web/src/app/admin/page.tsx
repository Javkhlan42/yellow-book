import { requireAdmin } from '../../lib/auth-guards';

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Welcome, {session.user.name || session.user.email}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h2 className="font-semibold mb-2">Your Role: {session.user.role}</h2>
            <p className="text-sm text-gray-600">
              Only admin users can access this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
