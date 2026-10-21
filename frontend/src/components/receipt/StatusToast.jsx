export default function StatusToast({ visible, message, isError = false }) {
  if (!visible) return null;

  return (
    <div className="fixed right-4 top-20 z-[300] w-[calc(100%-2rem)] max-w-sm">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-xl border border-green-200 bg-white px-4 py-3 shadow-xl"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
          {isError ? "!" : "✓"}
        </div>
        <p className={`text-sm font-semibold ${isError ? 'text-red-700' : 'text-green-700'}`}>
          {message}
        </p>
      </div>
    </div>
  );
}
