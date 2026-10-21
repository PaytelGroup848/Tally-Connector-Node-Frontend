import { useState } from "react";
import EntryListActions from "./myEntryList/EntryListActions";
import EntryListPagination from "./myEntryList/EntryListPagination";
import EntryListTable from "./myEntryList/EntryListTable";
import EntryListToolbar from "./myEntryList/EntryListToolbar";
import { entryListPages } from "./myEntryList/config";

function MyEntryListPage({ path }) {
  const [title, columns, rows] =
    entryListPages[path] || entryListPages["/my-invoices"];
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState("2027-03-31");
  const [selectedTab, setSelectedTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const isTracking = title === "Tracking Report";
  const filteredRows = rows.filter((row) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className={`page-surface ${
        isTracking ? "tracking-page" : "entry-page"
      }`}
    >
      <EntryListToolbar
        title={title}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setCurrentPage={setCurrentPage}
      />

      <section className="page-card p-5">
        <EntryListActions
          path={path}
          title={title}
          query={query}
          setQuery={setQuery}
        />
        <EntryListTable columns={columns} rows={filteredRows} />
        <EntryListPagination
          itemCount={filteredRows.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </section>
    </div>
  );
}

export default MyEntryListPage;
