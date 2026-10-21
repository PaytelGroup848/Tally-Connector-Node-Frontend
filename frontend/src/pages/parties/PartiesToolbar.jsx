import { Plus, Search } from "lucide-react";

export default function PartiesToolbar({
  companyId,
  limit,
  page,
  search,
  onSearchChange,
  onLimitChange,
  onAddParty,
}) {
  const viewPartyStatus = () => {
    window.history.pushState({}, "", "/my-parties");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div
      className="toolbar-shell"
      style={{
        height: "62px",
        minHeight: "62px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "0 13px",
        borderBottom: "1px solid #e7edf2",
        background: "#ffffff",
      }}
    >
      <div
        className="toolbar-left"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: 0,
        }}
      >
        <div
          className="toolbar-search"
          style={{
            width: "256px",
            flexShrink: 0,
            height: "36px",
            display: "flex",
            alignItems: "center",
            border: "1px solid #d8e1ea",
            borderRadius: "7px",
            background: "#ffffff",
          }}
        >
          <Search
            size={15}
            style={{
              marginLeft: "11px",
              marginRight: "8px",
              color: "#647b94",
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            value={search}
            onChange={onSearchChange}
            placeholder="Search party name"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              padding: "0 10px 0 0",
              fontSize: "12px",
              color: "#334155",
            }}
          />
        </div>

        <div
          className="toolbar-show"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            color: "#26364a",
          }}
        >
          <span>Show</span>
          <select
            className="toolbar-select"
            value={limit}
            onChange={onLimitChange}
            style={{
              width: "62px",
              height: "38px",
              padding: "0 8px",
              border: "1px solid #d8e1ea",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#334155",
              fontSize: "12px",
              outline: "none",
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>30</option>
            <option value={100}>50</option>
          </select>
          <span>records</span>
        </div>
      </div>

      <div className="toolbar-right flex items-center gap-3">
        <span
          className="page-meta"
          style={{
            fontSize: "11px",
            color: "#536d8a",
            whiteSpace: "nowrap",
          }}
        >
          Page {page} · {limit} per page
        </span>
        <button
          type="button"
          disabled={!companyId}
          onClick={onAddParty}
          className="add-party-btn flex h-9 items-center gap-1.5 rounded-md bg-emerald-700 px-3 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add New Party
        </button>
        <button
          type="button"
          className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 hover:text-white"
          onClick={viewPartyStatus}
        >
          View status
        </button>
      </div>
    </div>
  );
}
