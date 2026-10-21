import { useState } from "react";
import DateRangePicker from "../../components/DateRangePicker";

export default function EntryListToolbar({
  title,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedTab,
  setSelectedTab,
  setCurrentPage,
}) {
  const invoiceTabs =
    title === "My Invoices" || title === "My eWay Bills";
  const isTracking = title === "Tracking Report";
  const hasStatusFilters = !isTracking && title !== "My Quotations";
  const tabs = invoiceTabs
    ? ["All", "Generated", "Cancelled", "Rejected"]
    : ["All", "Pending", "Completed"];

  return (
    <div
      className="
        page-toolbar
        flex
        flex-wrap
        items-center
        gap-3
        border-b
        border-slate-200
        bg-white
        px-4
        py-3
      "
    >
      <button
        type="button"
        onClick={() => window.history.back()}
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded
          text-2xl
          leading-none
          text-slate-700
          transition
          hover:bg-slate-100
          hover:text-black
        "
        aria-label="Back"
        title="Back"
      >
        ←
      </button>

      <h1 className="text-[18px] font-semibold text-slate-900">
        {title}
      </h1>

      <div className="page-tabs ml-auto flex flex-wrap items-center gap-2">
        {hasStatusFilters &&
          tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
              }}
              className={`
                rounded-md
                border
                px-3
                py-1.5
                text-[11px]
                font-medium
                transition
                ${
                  selectedTab === tab
                    ? "border-slate-300 bg-white text-slate-900 shadow-sm"
                    : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
              `}
            >
              {tab}
            </button>
          ))}

        {hasStatusFilters && !invoiceTabs && (
          <MoreStatusMenu
            setSelectedTab={setSelectedTab}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {!isTracking && (
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(nextStart, nextEnd) => {
            setStartDate(nextStart || startDate);
            setEndDate(nextEnd || endDate);
          }}
          compact
        />
      )}

    </div>
  );
}

function MoreStatusMenu({ setSelectedTab, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`
          flex
          items-center
          gap-1
          rounded-md
          border
          px-3
          py-1.5
          text-[11px]
          font-medium
          transition
          ${
            isOpen
              ? "border-slate-300 bg-white text-slate-900 shadow-sm"
              : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
          }
        `}
      >
        More
        <span className="text-[10px]">⌄</span>
      </button>

      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-[38px]
            z-20
            min-w-[130px]
            overflow-hidden
            rounded-md
            border
            border-slate-200
            bg-white
            shadow-lg
          "
        >
          {["Overdue", "Archived"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setSelectedTab(item);
                setIsOpen(false);
                setCurrentPage(1);
              }}
              className="
                block
                w-full
                px-3
                py-2
                text-left
                text-[11px]
                text-slate-700
                hover:bg-slate-50
              "
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
