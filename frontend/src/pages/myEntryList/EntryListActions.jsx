import { addNewRoutes } from "./config";

export default function EntryListActions({
  path,
  title,
  query,
  setQuery,
}) {
  const handleAddNew = () => {
    const nextRoute = addNewRoutes[path] || "/items/add-new";
    window.history.pushState({}, "", nextRoute);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const canAddNew = [
    "My Stock Items",
    "My Ledgers",
    "My Parties",
    "My Invoices",
    "My eWay Bills",
    "My Quotations",
  ].includes(title);

  return (
    <div className="mb-3 flex flex-wrap items-center gap-4">
      <input
        className="
          h-9
          w-[min(100%,220px)]
          rounded-lg
          border
          border-slate-300
          bg-white
          px-3
          text-xs
          outline-none
          focus:border-green-500
        "
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
      />

      <button
        type="button"
        className="text-xs text-slate-700 hover:text-black"
        onClick={() => console.log("Rows per page clicked")}
      >
        Rows per page: 10　⌄
      </button>

      {canAddNew && (
        <button
          className="
            ml-auto
            rounded-lg
            bg-slate-900
            px-4
            py-2
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-slate-700
            active:scale-[0.98]
          "
          type="button"
          onClick={handleAddNew}
        >
          + Add New
        </button>
      )}
    </div>
  );
}
