import { ChevronLeft, ChevronRight, Eye, FileDown } from "lucide-react";
import VoucherPreviewModal from "../VoucherPreviewModal";
import VoucherDetailStack from "./VoucherDetailStack";
import { SearchableDropdown } from "../SearchableDropdown";
import {
  formatCellValue,
  formatColumnLabel,
  isViewableField,
} from "./voucherUtils";

function VouchersPageView({
  companyId,
  page,
  pageSize,
  setPage,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  voucherType,
  setVoucherType,
  voucherTypes,
  errorMessage,
  responseColumns,
  tableGridColumns,
  isLoading,
  vouchers,
  downloadingId,
  handleDownload,
  setPreviewId,
  previewId,
  totalItems,
  recordStart,
  recordEnd,
  pageItems,
  totalPages,
  detailStack,
  openDetail,
  closeDetail,
  closeAllDetails,
}) {
  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#f8fafc] text-[#17355f]">
      {/* =====================================================
                MAIN
            ===================================================== */}

      <div className="px-3 py-3 sm:px-5 sm:py-4">
        <section className="min-w-[1120px] border-t border-[#e5ebf2] bg-white">
          {/* =================================================
                        TOOLBAR
                    ================================================= */}

          <div className="flex min-h-[70px] flex-wrap items-center gap-3 border-b border-[#e5ebf2] px-4 py-3 sm:px-8">
            <div className="flex w-full flex-wrap items-center gap-3">
              {/* VOUCHER TYPE */}

              <label className="flex h-[38px] items-center gap-2 whitespace-nowrap text-[13px] text-[#17355f]">
                <span>Voucher type</span>

                <SearchableDropdown
                  name="voucherType"
                  label="voucher type"
                  options={voucherTypes}
                  placeholder="Select voucher type"
                  value={voucherType || ""}
                  onSelect={(value) => setVoucherType(value)}
                  onClear={() => setVoucherType("")}
                  showAllValues={true}
                />
              </label>

              {/* SHOW RECORDS */}

              <label className="flex h-[38px] items-center gap-2 whitespace-nowrap text-[13px] text-[#17355f]">
                <span>Show</span>

                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className="
                                        h-[38px]
                                        w-[64px]
                                        cursor-pointer
                                        rounded-lg
                                        border
                                        border-[#10b981]
                                        bg-white
                                        px-2
                                        text-[12px]
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-[#17355f]
                                        focus:ring-1
                                        focus:ring-[#17355f]/20
                                    "
                >
                  {[10, 20, 30, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <span>records</span>
              </label>

              {/* FLEX SPACER */}

              <div className="hidden min-w-0 flex-1 lg:block" />

              <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
                {/* FROM */}

                <div className="flex h-[36px] items-center gap-2 whitespace-nowrap">
                  <span className="text-[12px] text-[#17355f]">From</span>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    className="
                                        h-[30px]
                                        rounded-md
                                        border
                                        border-slate-300
                                        bg-white
                                        px-2
                                        text-[11px]
                                        text-slate-700
                                        outline-none
                                        focus:border-[#17355f]
                                        focus:ring-1
                                        focus:ring-[#17355f]/20
                                    "
                  />
                </div>

                {/* TO */}

                <div className="flex h-[36px] items-center gap-2 whitespace-nowrap">
                  <span className="text-[12px] text-[#17355f]">To</span>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    className="
                                        h-[30px]
                                        rounded-md
                                        border
                                        border-slate-300
                                        bg-white
                                        px-2
                                        text-[11px]
                                        text-slate-700
                                        outline-none
                                        focus:border-[#17355f]
                                        focus:ring-1
                                        focus:ring-[#17355f]/20
                                    "
                  />
                </div>

                {/* PAGE INFO */}

                <div className="whitespace-nowrap text-[12px] text-[#17355f]">
                  Page {page} · {pageSize} per page
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
                        ERROR
                    ================================================= */}

          {errorMessage && (
            <div className="mx-8 mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* =================================================
                        TABLE
                    ================================================= */}

          <div className="mx-8 overflow-x-auto rounded-lg border border-[#dfe7f0]">
            <div className="min-w-max">
              {/* HEADER */}

              <div
                className="grid min-w-max items-center border-b border-[#dfe7f0] bg-[#f4f7fb] px-4 py-3 text-[11px] font-semibold uppercase text-[#274b78]"
                style={{
                  gridTemplateColumns: tableGridColumns,
                  minHeight: "48px",
                }}
              >
                {responseColumns.map((column) => (
                  <div
                    key={column}
                    className="box-border flex h-full w-[220px] min-w-[220px] max-w-[220px] items-center overflow-hidden border-l border-[#dfe7f0] pr-4"
                  >
                    <span className="block whitespace-normal break-words">
                      {formatColumnLabel(column)}
                    </span>
                  </div>
                ))}

                <div className="box-border flex h-full w-[140px] min-w-[140px] max-w-[140px] items-center justify-center overflow-hidden border-l border-[#dfe7f0] pr-4">
                  <span className="block whitespace-normal break-words">
                    Action
                  </span>
                </div>
              </div>

              {/* LOADING */}

              {isLoading ? (
                <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                    Loading vouchers...
                  </div>
                </div>
              ) : vouchers.length > 0 ? (
                <div>
                  {vouchers.map((voucher, index) => {
                    const isDownloading = downloadingId === voucher._id;

                    return (
                      <div
                        key={voucher?._id || voucher?.id || index}
                        className="grid min-w-max items-start border-b border-[#e5ebf2] px-4 py-3 text-[12px] text-[#17355f] last:border-b-0 odd:bg-white even:bg-[#fbfdff]"
                        style={{
                          gridTemplateColumns: tableGridColumns,
                          minHeight: "50px",
                        }}
                      >
                        {/* CELLS */}
                        {responseColumns.map((column) => {
                          const cellValue = formatCellValue(
                            voucher?.[column],
                            column,
                          );

                          return (
                            <div
                              key={column}
                              className="box-border w-[220px] min-w-[220px] max-w-[220px] overflow-hidden border-l border-[#e5ebf2] pr-4"
                              title={
                                isViewableField(column, voucher?.[column])
                                  ? "View details"
                                  : cellValue
                              }
                            >
                              {isViewableField(column, voucher?.[column]) ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openDetail(
                                      formatColumnLabel(column),
                                      voucher?.[column],
                                    )
                                  }
                                  className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 transition hover:bg-sky-100"
                                >
                                  View
                                </button>
                              ) : (
                                <div className="max-w-full whitespace-pre-wrap break-words leading-5">
                                  {cellValue}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/*  ACTION CELL */}
                        <div className="box-border w-[140px] min-w-[140px] max-w-[140px] overflow-hidden border-l border-[#e5ebf2] pr-4">
                          <div className="flex flex-col gap-2 px-5 py-3">
                            {/* View Button */}
                            <button
                              type="button"
                              onClick={() => setPreviewId(voucher._id)}
                              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                            >
                              <Eye size={14} />
                              View
                            </button>

                            {/* Download PDF Button */}
                            <button
                              type="button"
                              onClick={() => handleDownload(voucher)}
                              disabled={isDownloading}
                              className="inline-flex h-8 min-w-[90px] items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60 disabled:hover:border-red-200 disabled:hover:bg-white"
                              title={
                                isDownloading
                                  ? "Generating PDF..."
                                  : "Generate PDF"
                              }
                              aria-label={
                                isDownloading
                                  ? "Generating PDF..."
                                  : "Generate PDF"
                              }
                            >
                              {isDownloading ? (
                                <>
                                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                  <span>Wait...</span>
                                </>
                              ) : (
                                <>
                                  <FileDown size={14} strokeWidth={2} />
                                  <span>PDF</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <VoucherPreviewModal
                          open={!!previewId}
                          onClose={() => setPreviewId(null)}
                          companyId={companyId}
                          voucherId={previewId}
                          fileName={`voucher-${previewId || ""}`}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">
                  <div className="text-sm text-slate-400">
                    No data available
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
                        FOOTER
                    ================================================= */}

          <div className="flex flex-wrap items-center justify-center gap-6 border-t border-[#e5ebf2] px-8 py-4 text-xs text-[#17355f]">
            {/* RECORD COUNT */}

            <div className="text-center">
              {totalItems > 0
                ? `${recordStart}-${recordEnd} of ${totalItems}`
                : "0-0 of 0"}
            </div>

            {/* PAGINATION */}

            <div className="flex items-center gap-2">
              {/* PREVIOUS */}

              <button
                type="button"
                disabled={isLoading || page <= 1}
                onClick={() =>
                  setPage((currentPage) => Math.max(1, currentPage - 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>

              {/* PAGE NUMBERS */}

              {pageItems.map((pageNumber, index) =>
                pageNumber === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-9 w-5 items-center justify-center text-[#71819a]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setPage(pageNumber)}
                    className={
                      pageNumber === page
                        ? "h-9 w-9 rounded-md border border-[#059669] bg-[#059669] font-semibold text-white shadow-sm"
                        : "h-9 w-9 rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878] disabled:cursor-not-allowed disabled:opacity-50"
                    }
                  >
                    {pageNumber}
                  </button>
                ),
              )}

              {/* NEXT */}

              <button
                type="button"
                disabled={isLoading || page >= totalPages}
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(totalPages, currentPage + 1),
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>

      <VoucherDetailStack
        detailStack={detailStack}
        onOpenDetail={openDetail}
        onCloseDetail={closeDetail}
        onCloseAllDetails={closeAllDetails}
      />
    </div>
  );
}

export default VouchersPageView;
