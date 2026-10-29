import { SearchableDropdown } from "./SearchableDropdown";

export function VoucherDetailsFields(props) {
  const { clearToken, customers, defaultDate, defaultVoucherType, fetchSelectedPartyBalance, findLedgerGstin, findVoucherNumberForParty, getPaginationProps, hasMoreVoucherTypeOptions, isJournalStyleVoucher, isNoteVoucher, isOptionsLoading, isSalesInvoice, isSalesOrder, isStockJournal, isSupplierVoucher, ledgerTypeOptions, ledgers, loadMoreVoucherTypeOptions, partyBalance, partyBalanceEditedRef, partyBalanceError, partyBalanceLoading, partyOptions, partySources, resetSelectedPartyBalance, searchOptions, selectedGstin, selectedParty, selectedVoucherNumber, setPartyBalance, setSelectedGstin, setSelectedParty, setSelectedVoucherNumber, title, visibleVoucherTypeOptions, voucherNumberOptions, voucherTypesError, vouchers } = props;
  return (
<div
                  className={`grid items-start gap-3 sm:grid-cols-2 ${
                    isSalesInvoice || isSalesOrder || title === "Purchase"
                      ? "xl:grid-cols-3"
                      : title === "Receipt Note" || title === "Delivery Note"
                        ? "xl:grid-cols-5"
                        : "xl:grid-cols-4"
                  }`}
                >
                  <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                    <span>Voucher Type</span>

                    <input
                      name="voucherType"
                      value={defaultVoucherType}
                      readOnly
                      className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
                      placeholder="Select Voucher Type"
                    />
                  </label>

                  <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                    <span>
                      {title === "Contra" ? "Transaction Type" : "Party Name"}
                    </span>

                    <div className="relative">
                      <SearchableDropdown
                        name="partyName"
                        label={isSupplierVoucher ? "suppliers" : "parties"}
                        options={partyOptions}
                        {...getPaginationProps(partySources)}
                        onInputChange={(query) =>
                          searchOptions(partySources, query)
                        }
                        placeholder="Select Party"
                        loading={isOptionsLoading}
                        value={selectedParty}
                        resetToken={clearToken}
                        onSelect={(party) => {
                          if (party !== selectedParty) {
                            resetSelectedPartyBalance();
                          }
                          setSelectedParty(party);
                          setSelectedVoucherNumber(
                            findVoucherNumberForParty(vouchers, party),
                          );
                          setSelectedGstin(findLedgerGstin(ledgers, customers, party));
                        }}
                        onOptionSelect={(party) =>
                          fetchSelectedPartyBalance(party)
                        }
                        onClear={() => {
                          setSelectedParty("");
                          resetSelectedPartyBalance();
                          setSelectedVoucherNumber("");
                          setSelectedGstin("");
                        }}
                      />
                    </div>
                  </label>

                  {!isJournalStyleVoucher && !isStockJournal && (
                    <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                      <span>Closing Balance</span>
                      <input
                        type="number"
                        step="any"
                        value={partyBalance}
                        onChange={(event) => {
                          partyBalanceEditedRef.current = true;
                          setPartyBalance(event.target.value);
                        }}
                        aria-describedby={
                          partyBalanceError ? "party-balance-error" : undefined
                        }
                        className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        placeholder={
                          partyBalanceLoading ? "Loading..." : "Closing Balance"
                        }
                      />
                      {partyBalanceError && (
                        <span
                          id="party-balance-error"
                          className="text-xs text-red-600"
                          role="status"
                        >
                          {partyBalanceError}
                        </span>
                      )}
                    </label>
                  )}

                  {(title === "Receipt Note" || title === "Delivery Note") && (
                    <>
                      <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                        <span>Order Type</span>
                        <SearchableDropdown
                          name="orderType"
                          label="order types"
                          options={visibleVoucherTypeOptions}
                          placeholder="Select ref"
                          loading={isOptionsLoading}
                          loadError={voucherTypesError}
                          infiniteScroll={true}
                          hasMoreOptions={hasMoreVoucherTypeOptions}
                          loadingMore={false}
                          onLoadMore={loadMoreVoucherTypeOptions}
                          resetToken={clearToken}
                        />
                      </label>
                      <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                        <span>Order Number</span>
                        <input
                          name="orderNumber"
                          type="text"
                          placeholder="Order Number"
                          className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                      </label>
                      <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                        <span>Order Date</span>
                        <input
                          name="orderDate"
                          type="date"
                          className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                        
                      </label>
                    </>
                  )}

                  <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                    <span>Voucher No (optional)</span>

                    {title === "Quotation" || isSalesInvoice ? (
                      <SearchableDropdown
                        name="voucherNumber"
                        label="voucher numbers"
                        options={voucherNumberOptions}
                        {...getPaginationProps("vouchers")}
                        onInputChange={(query) =>
                          searchOptions("vouchers", query)
                        }
                        placeholder="Voucher number"
                        loading={isOptionsLoading}
                        value={selectedVoucherNumber}
                        resetToken={clearToken}
                      />
                    ) : (
                      <input
                        name="voucherNumber"
                        type="text"
                        defaultValue=""
                        className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        placeholder="Voucher Number"
                      />
                    )}
                  </label>

                  {(title === "Quotation" ||
                    isSalesInvoice ||
                    isSalesOrder ||
                    title === "Purchase" ||
                    title === "Purchase Order" ||
                    isNoteVoucher) && (
                    <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                      <span>Ledger Type</span>

                      <SearchableDropdown
                        name="ledgerType"
                        label="ledger types"
                        options={ledgerTypeOptions}
                        {...getPaginationProps("ledgers")}
                        onInputChange={(query) =>
                          searchOptions("ledgers", query)
                        }
                        placeholder="Select Ledger"
                        loading={isOptionsLoading}
                        resetToken={clearToken}
                      />
                    </label>
                  )}

                  {(title === "Quotation" ||
                    isSalesInvoice ||
                    isSalesOrder ||
                    title === "Purchase" ||
                    title === "Purchase Order" ||
                    isNoteVoucher) && (
                    <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                      <span>GST Number</span>

                      <input
                        name="gstin"
                        type="text"
                        value={selectedGstin}
                        onChange={(event) => setSelectedGstin(event.target.value)}
                        className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        placeholder="Enter GST Number"
                      />
                    </label>
                  )}
                  {isNoteVoucher && (
                    <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                      <span>Reason For Return</span>
                      <SearchableDropdown
                        name="reasonForReturn"
                        label="return reasons"
                        options={[
                          "Sales Return",
                          "Damaged Goods",
                          "Wrong Item",
                          "Other",
                          "Purchase Return",
                        ]}
                        placeholder="Select Reason for return"
                        loading={isOptionsLoading}
                        resetToken={clearToken}
                      />
                    </label>
                  )}

                  <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                    <span>Date</span>

                    <div className="relative">
                      <input
                        name="date"
                        type="date"
                        defaultValue={defaultDate}
                        className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                      <span className="pointer-events-none absolute right-3 top-4.5 -translate-y-1/2 text-slate-400">
                        🗓
                      </span>

                      {title === "Quotation" && (
                        <button
                          type="button"
                          aria-label="Clear date"
                          onClick={(event) => {
                            event.currentTarget.previousElementSibling.value = "";
                          }}
                          className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </label>
                </div>
  );
}
