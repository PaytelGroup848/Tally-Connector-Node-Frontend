
export default function StatusToast({
  visible,
  message,
  isError = false,
  onClose,
}) {
  if (!visible) return null;

  return (
    <div className="fixed right-4 top-20 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div
        role={isError ? "alert" : "status"}
        aria-live={isError ? "assertive" : "polite"}
        className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-xl ${
          isError ? "border-red-200" : "border-green-200"
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
            isError
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {isError ? "!" : "✓"}
        </div>

        <p
          className={`min-w-0 flex-1 text-sm font-semibold ${
            isError ? "text-red-700" : "text-green-700"
          }`}
        >
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          ×
        </button>
      </div>
    </div>
  );
}
