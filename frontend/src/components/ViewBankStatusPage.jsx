import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import useAuthStore from "../store/authStore";
import Pagination from "./Pagination";
import {
  extractCommands,
  fetchCompanyCommands,
} from "../services/companiesApi";

const PAGE_SIZE = 20;

function extractPagination(response) {
  const pending = [response];

  while (pending.length > 0) {
    const value = pending.shift();
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;

    for (const key of ["pagination", "meta"]) {
      const metadata = value[key];
      if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
        return metadata;
      }
    }

    const hasPaginationFields = [
      "total",
      "totalItems",
      "totalRecords",
      "totalPages",
      "pages",
      "count",
    ].some((key) => value[key] !== undefined);
    if (hasPaginationFields) return value;

    for (const child of Object.values(value)) {
      if (child && typeof child === "object") pending.push(child);
    }
  }

  return {};
}

function getSafeNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function getValue(command, keys) {
  for (const source of [
    command,
    command?.payload,
    command?.data,
    command?.data?.payload,
    command?.command,
    command?.command?.payload,
  ]) {
    if (!source || typeof source !== "object") continue;
    for (const key of keys) {
      const value = source[key];
      if (value !== null && value !== undefined && value !== "") {
        return value;
      }
    }
  }

  return null;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getCommandId(command, index) {
  return (
    command?._id ||
    command?.id ||
    command?.commandId ||
    command?.command_id ||
    `ledger-command-${index}`
  );
}

function getStatusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "pending") return "bg-amber-50 text-amber-700";
  if (normalized === "failed") return "bg-red-50 text-red-700";
  if (normalized === "done" || normalized === "success") {
    return "bg-emerald-50 text-emerald-700";
  }
  return "bg-slate-100 text-slate-700";
}
const HIDDEN_JSON_FIELDS = new Set([
  "result",
  "id",
  "guid",
  "__v",
  "companyId",
  "organizationId",
  "tallyExternalId",
]);
const DATE_FIELDS = new Set([
  "date",
  "createdAt",
  "updatedAt",
  "submittedAt",
  "completedAt",
  "effectiveDate",
  "created_at",
  "updated_at",
  "submitted_at",
  "completed_at",
]);

function isDateField(key, value) {
  return (
    DATE_FIELDS.has(key) &&
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Date.parse(value))
  );
}
function formatLabel(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace("payload","Details")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
function JsonDataTable({ data, level = 0 }) {
  if (data === null || data === undefined) {
    return <span className="text-slate-400">—</span>;
  }

  if (typeof data !== "object") {
    return (
      <span className="break-words text-slate-700">
        {String(data)}
      </span>
    );
  }

  const entries = Object.entries(data).filter(
    ([key]) => !HIDDEN_JSON_FIELDS.has(key),
  );

  if (entries.length === 0) {
    return <span className="text-slate-400">No fields to display</span>;
  }

  return (
    <div
      className={
        level > 0
          ? "ml-3 border-l-2 border-slate-200 pl-3"
          : ""
      }
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="w-1/3 border border-slate-200 px-3 py-2 font-semibold text-slate-600">
              Field
            </th>
            <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-600">
              Value
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.map(([key, value]) => {
            const isNested =
              value !== null && typeof value === "object";

            return (
              <tr key={key} className="align-top">
                <td className="break-words border border-slate-200 bg-slate-50/70 px-3 py-2 font-medium text-slate-700">
                  {formatLabel(key)}
                </td>

                <td className="border border-slate-200 px-3 py-2">
                  {isDateField(key, value) ? (
                    <span className="break-words text-slate-700">
                      {formatDate(value)}
                    </span>
                  ) : isNested ? (
                    <details>
                      <summary className="cursor-pointer font-medium text-emerald-700">
                        {Array.isArray(value)
                          ? `Array (${value.length} items)`
                          : "View details"}
                      </summary>

                      <div className="mt-3">
                        <JsonDataTable
                          data={value}
                          level={level + 1}
                        />
                      </div>
                    </details>
                  ) : value === null ? (
                    <span className="text-slate-600">—</span>
                  ) : value === "" ? (
                    <span className="text-slate-400">
                      NA
                    </span>
                  ) : (
                    <span className="break-words text-slate-700">
                      {String(value)}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default function ViewBankStatusPage({
  companyId,
  companyName,
  onClose,
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [commands, setCommands] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCommand, setSelectedCommand] = useState(null);
  const totalItems = commands.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const visibleCommands = commands.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const requestError = !accessToken
    ? "Sign in to load bank status."
    : !companyId
      ? "This company does not have an ID."
      : errorMessage;

  useEffect(() => {
    if (!accessToken || !companyId) return undefined;

    let isMounted = true;

   async function loadLedgerCommands() {
  setIsLoading(true);
  setErrorMessage("");

  try {
    const allCommands = [];
    const commandTypes = ["CREATE_LEDGER", "UPDATE_LEDGER"];

    for (const type of commandTypes) {
      let currentPage = 1;
      let hasMorePages = true;
      let fetchedCount = 0;

      while (hasMorePages) {
        const response = await fetchCompanyCommands(
          accessToken,
          companyId,
          {
            type,
            page: currentPage,
            limit: PAGE_SIZE,
            q: "",
          },
        );

        const nextCommands = extractCommands(response);
        const pagination = extractPagination(response);

        const total = getSafeNumber(
          pagination.total ??
            pagination.totalItems ??
            pagination.totalRecords ??
            pagination.count,
        );

        const apiTotalPages = getSafeNumber(
          pagination.totalPages ?? pagination.pages,
        );

        allCommands.push(...nextCommands);
        fetchedCount += nextCommands.length;

        hasMorePages =
          nextCommands.length === PAGE_SIZE &&
          (apiTotalPages !== null
            ? currentPage < apiTotalPages
            : total !== null
              ? fetchedCount < total
              : true);

        currentPage += 1;
      }
    }

    if (isMounted) {
      setCommands(allCommands);
      setPage(1);
    }
  } catch (error) {
    if (isMounted) {
      setCommands([]);
      setErrorMessage(
        error?.message || "Unable to load bank status.",
      );
    }
  } finally {
    if (isMounted) setIsLoading(false);
  }
}

    loadLedgerCommands();

    return () => {
      isMounted = false;
    };
  }, [accessToken, companyId]);

  return (
    <section className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      <section
        aria-labelledby="bank-status-title"
        className="flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Bank Status
            </p>
            <h2
              id="bank-status-title"
              className="mt-1 text-lg font-bold text-slate-900"
            >
              {companyName || "Company"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-auto p-5">
          {requestError ? (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {requestError}
            </p>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
              Loading bank status...
            </div>
          ) : commands.length === 0 ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              No bank status records found.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Ledger / Bank</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Submitted</th>
                    <th className="px-4 py-3 font-semibold">Message</th>
                    <th className="px-4 py-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleCommands.map((command, index) => {
                    const status = getValue(command, [
                      "status",
                      "state",
                      "commandStatus",
                      "command_status",
                    ]);
                    const ledgerName = getValue(command, [
                      "ledgerName",
                      "name",
                      "bankName",
                      "accountName",
                      "partyName",
                    ]);
                    const message = getValue(command, [
                      "errorMessage",
                      "error_message",
                      "message",
                    ]);
                    const createdAt = getValue(command, [
                      "createdAt",
                      "created_at",
                      "submittedAt",
                      "submitted_at",
                    ]);

                    return (
                      <tr
                        key={getCommandId(command, index)}
                        className="text-slate-700"
                      >
                        <td className="px-4 py-3 font-medium">
                          {ledgerName || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(status)}`}
                          >
                            {status || "Unknown"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {formatDate(createdAt)}
                        </td>
                        <td
                          className="max-w-xs truncate px-4 py-3"
                          title={message || ""}
                        >
                          {message || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedCommand(command)}
                            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!isLoading && !requestError && commands.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={(nextPage) => {
              setPage(nextPage);
              setSelectedCommand(null);
            }}
          />
        )}

        {selectedCommand && (
          <div
            className="fixed inset-0 z-[410] flex items-center justify-center bg-slate-950/50 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setSelectedCommand(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="ledger-command-details"
              className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
            >
              <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <h3
                  id="ledger-command-details"
                  className="font-semibold text-slate-900"
                >
                  Ledger Command Details
                </h3>
                <button
                  type="button"
                  aria-label="Close command details"
                  onClick={() => setSelectedCommand(null)}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </header>
              <div className="max-h-[65vh] overflow-auto p-5">
                <JsonDataTable data={selectedCommand} />
              </div>
            </section>
          </div>
        )}
      </section>
    </section>
  );
}
