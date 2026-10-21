export default function PartyCreatedDialog({ onClose, onViewStatus }) {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="party-created-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-700">
            ✓
          </div>
          <h2
            id="party-created-title"
            className="mt-4 text-lg font-semibold text-slate-900"
          >
            Party created successfully
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            You can check the party creation status in My Parties.
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onViewStatus}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            View Status
          </button>
        </div>
      </section>
    </div>
  );
}
