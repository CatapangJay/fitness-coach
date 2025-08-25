export const dynamic = 'error';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full rounded-2xl bg-white shadow p-6 text-center">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">☁️</div>
        <h1 className="text-lg font-semibold text-gray-900">You are offline</h1>
        <p className="mt-1 text-sm text-gray-600">
          Some features require an internet connection. You can still view cached content. We'll reconnect automatically once you're back online.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
