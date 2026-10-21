export default function ReceiptHeader({ documentType, onViewStatus }) {
  return (
    <div className="flex justify-center bg-emerald-700 px-5 py-4 text-[17px] font-bold text-white">
      <span>Create {documentType}</span>

      <div className="ml-auto">
        <button
          type="button"
          className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 hover:text-white"
          onClick={onViewStatus}
        >
          View status
        </button>
      </div>
    </div>
  );
}
