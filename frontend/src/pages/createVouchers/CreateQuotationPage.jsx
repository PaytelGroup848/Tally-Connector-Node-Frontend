import { useMemo, useState } from "react";
import useAuthStore from "../../store/authStore";

import QuotationBottomSection from "../components/quotation/QuotationBottomSection";
import QuotationDetailsFields from "../components/quotation/QuotationDetailsFields";
import QuotationFeedback from "../components/quotation/QuotationFeedback";
import QuotationItemsTable from "../../components/quotation/QuotationItemsTable";

import useQuotationData from "../hooks/quotation/useQuotationData";
import useQuotationSubmit from "../hooks/quotation/useQuotationSubmit";

import {
  calculateLedgerTotals,
  calculateRowAmount,
  calculateRowTax,
  createEmptyItemRow,
  createEmptyLedgerRow,
  findStockHsnCode,
  findStockQuantity,
  findStockRate,
  findStockUnits,
  getGstinStateCode,
} from "../../utils/quotationUtils";

function resolveCompanyId(selectedCompany) {
  if (typeof selectedCompany === "string") {
    return selectedCompany;
  }

  return (
    selectedCompany?._id ||
    selectedCompany?.id ||
    selectedCompany?.companyId ||
    ""
  );
}

export default function CreateQuotationPage({
  companyId: companyIdProp = "",
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const selectedCompany = useAuthStore(
    (state) => state.selectedCompany,
  );

  const storedCompanyId =
    typeof window !== "undefined"
      ? window.localStorage.getItem("selectedCompanyId") || ""
      : "";

  const companyId =
    companyIdProp ||
    resolveCompanyId(selectedCompany) ||
    storedCompanyId;

  const data = useQuotationData({
    companyId,
    accessToken,
  });

  const submit = useQuotationSubmit();

  const [selectedParty, setSelectedParty] = useState("");
  const [selectedVoucherNumber, setSelectedVoucherNumber] =
    useState("");
  const [selectedGstin, setSelectedGstin] = useState("");

  const [itemRows, setItemRows] = useState(() => [
    createEmptyItemRow(),
  ]);

  const [ledgerRows, setLedgerRows] = useState([]);
  const [showLedgerPanel, setShowLedgerPanel] = useState(false);
  const [clearToken, setClearToken] = useState(0);

  const defaultDate = new Date().toLocaleDateString("en-CA");

  const companyStateCode = data.companyStateCode;
  const partyStateCode = getGstinStateCode(selectedGstin);

  const isSameState =
    companyStateCode && partyStateCode
      ? companyStateCode === partyStateCode
      : null;

  const subtotal = useMemo(
    () =>
      itemRows.reduce(
        (total, row) => total + calculateRowAmount(row),
        0,
      ),
    [itemRows],
  );

  const itemTaxes = useMemo(
    () =>
      itemRows.reduce(
        (total, row) => total + calculateRowTax(row),
        0,
      ),
    [itemRows],
  );

  const totals = useMemo(
    () =>
      calculateLedgerTotals(
        ledgerRows,
        subtotal,
        itemTaxes,
      ),
    [ledgerRows, subtotal, itemTaxes],
  );

  const handlePartyChange = (party) => {
    if (party !== selectedParty) {
      data.resetSelectedPartyBalance();
    }

    setSelectedParty(party);

    setSelectedVoucherNumber(
      data.findVoucherNumberForParty(party),
    );

    setSelectedGstin(
      data.findGstinForParty(party),
    );
  };

  const clearParty = () => {
    setSelectedParty("");
    setSelectedVoucherNumber("");
    setSelectedGstin("");

    data.resetSelectedPartyBalance();
  };

  const updateItemRow = (rowId, changes) => {
    setItemRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              ...changes,
            }
          : row,
      ),
    );
  };

  const handleSelectItem = (rowId, itemName) => {
    const quantity = findStockQuantity(
      data.stockItems,
      itemName,
    );

    updateItemRow(rowId, {
      item: itemName,
      quantity: quantity !== "" ? quantity : "0",
      rate: findStockRate(data.stockItems, itemName),
      units: findStockUnits(data.stockItems, itemName),
      hsnCode: findStockHsnCode(
        data.stockItems,
        itemName,
      ),
    });
  };

  const addItemRow = () => {
    setItemRows((current) => [
      ...current,
      createEmptyItemRow(),
    ]);
  };

  const deleteItemRow = (rowId) => {
    setItemRows((current) => {
      if (current.length === 1) {
        return [createEmptyItemRow()];
      }

      return current.filter((row) => row.id !== rowId);
    });
  };

  const resetItems = () => {
    setItemRows([createEmptyItemRow()]);

    setClearToken((current) => current + 1);
  };

  const addLedger = () => {
    setLedgerRows((current) => [
      ...current,
      createEmptyLedgerRow(),
    ]);

    setShowLedgerPanel(true);
  };

  const updateLedger = (rowId, changes) => {
    setLedgerRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              ...changes,
            }
          : row,
      ),
    );
  };

  const removeLedger = (rowId) => {
    setLedgerRows((current) =>
      current.filter((row) => row.id !== rowId),
    );
  };

  const resetAfterSuccess = () => {
    setSelectedParty("");
    setSelectedVoucherNumber("");
    setSelectedGstin("");

    data.resetSelectedPartyBalance();

    resetItems();

    setLedgerRows([]);
    setShowLedgerPanel(false);
  };

  const handleClear = (event) => {
    event.preventDefault();

    event.currentTarget.form?.reset();

    resetAfterSuccess();

    submit.setSubmitMessage("");
    submit.setSubmitError(null);
  };

  return (
    <div className="voucher-page-animate relative min-h-[calc(100vh-60px)] bg-[#eef3f8] p-3 text-slate-900 sm:p-5">
      <QuotationFeedback
        isLoading={data.isOptionsLoading}
        isSubmitting={submit.isSubmitting}
        showSuccessAnimation={submit.showSuccessAnimation}
        submitError={submit.submitError}
        dismissError={submit.dismissError}
        companyId={companyId}
        date={defaultDate}
        selectedParty={selectedParty}
        selectedVoucherNumber={selectedVoucherNumber}
        grandTotal={totals.grandTotal}
      />

      {!companyId && (
        <div className="mx-auto mb-3 max-w-[1440px] rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Select a company before creating a quotation.
        </div>
      )}

      <form
        onSubmit={(event) =>
          submit.handleSubmit(event, {
            accessToken,
            companyId,
            selectedGstin,
            companyStateCode,
            itemRows,
            ledgerRows,
            subtotal,
            itemTaxes,
            resetAfterSuccess,
          })
        }
        className="relative z-0 mx-auto max-w-[1440px] overflow-visible rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.06)]"
      >
        <div className="flex min-h-14 items-center bg-emerald-700 px-4 py-3 text-[17px] font-bold text-white sm:px-5 sm:py-4">
          Create Quotation Voucher

          <div className="ml-auto">
            <button
              type="button"
              className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 hover:text-white"
              onClick={() => {
                window.history.pushState(
                  {},
                  "",
                  "/my-quotations",
                );

                window.dispatchEvent(
                  new PopStateEvent("popstate"),
                );
              }}
            >
              View status
            </button>
          </div>
        </div>

        <div className="bg-[#f5f7f4] p-3 sm:p-5">
          <QuotationDetailsFields
            defaultDate={defaultDate}
            selectedParty={selectedParty}
            selectedVoucherNumber={selectedVoucherNumber}
            selectedGstin={selectedGstin}
            partyBalance={data.partyBalance}
            partyBalanceLoading={data.partyBalanceLoading}
            partyBalanceError={data.partyBalanceError}
            isOptionsLoading={data.isOptionsLoading}
            partyOptions={data.partyOptions}
            voucherNumberOptions={data.voucherNumberOptions}
            ledgerTypeOptions={data.ledgerTypeOptions}
            getPaginationProps={data.getPaginationProps}
            clearToken={clearToken}
            onPartyChange={handlePartyChange}
            onPartyChosen={data.fetchSelectedPartyBalance}
            onPartyClear={clearParty}
            onVoucherNumberChange={setSelectedVoucherNumber}
            onGstinChange={setSelectedGstin}
            onPartyBalanceChange={data.setPartyBalanceManually}
          />

          <QuotationItemsTable
            rows={itemRows}
            itemOptions={data.stockOptions}
            godownOptions={data.godownOptions}
            stockError={data.stockError}
            isOptionsLoading={data.isOptionsLoading}
            getPaginationProps={data.getPaginationProps}
            clearToken={clearToken}
            onSelectItem={handleSelectItem}
            onUpdateRow={updateItemRow}
            onAddRow={addItemRow}
            onDeleteRow={deleteItemRow}
          />

          <QuotationBottomSection
            subtotal={subtotal}
            itemTaxes={itemTaxes}
            isSameState={isSameState}
            companyGstinLoading={data.companyGstinLoading}
            companyGstinError={data.companyGstinError}
            hasCompanyGstin={Boolean(data.currentCompanyGstin)}
            ledgerOptions={data.ledgerOptions}
            ledgerDropdownProps={data.getPaginationProps("ledgers")}
            ledgerRows={ledgerRows}
            onAddLedger={addLedger}
            onRemoveLedger={removeLedger}
            onUpdateLedger={updateLedger}
            showLedgerPanel={showLedgerPanel}
            onToggleLedgerPanel={() =>
              setShowLedgerPanel((current) => !current)
            }
          />
        </div>

        <div className="flex flex-col gap-3 bg-[#f5f7f4] px-3 pb-4 pt-0 sm:flex-row sm:items-center sm:justify-end sm:px-5 sm:pb-5">
          {submit.submitMessage && (
            <p className="text-center text-sm text-slate-600 sm:text-right">
              {submit.submitMessage}
            </p>
          )}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={handleClear}
              disabled={submit.isSubmitting}
              className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={submit.isSubmitting || !companyId}
              className="w-full rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)] transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submit.isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
                    aria-hidden="true"
                  />
                  Creating...
                </span>
              ) : (
                "Create Voucher"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}