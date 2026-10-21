import { useEffect } from "react";

import useAuthStore from "../store/authStore";

import {
  extractCommandId,
  extractCommandStatus,
  fetchCommandStatus,
  postCompanyCommand,
} from "../services/companiesApi";

import {
  createJournalRow,
  formatJournalPaise,
  getGstinStateCode,
  getJournalTotalsInPaise,
  createStockJournalRow,
} from "../utils/voucherHelpers";
import { JournalVoucherContent } from "../components/JournalVoucherContent";
import { advancedVoucherFieldNames } from "../components/AdvancedVoucherSettings";
import { VoucherBottomSection } from "../components/VoucherBottomSection";
import { StockJournalVoucherContent } from "../components/StockJournalVoucherContent";
import {
  findStockHsnCode,
  findStockQuantity,
  findStockRate,
  findStockUnits,
  getDisplayValue,
  getStockValue,
} from "../utils/stockLookups";
import {
  findLedgerGstin,
  findVoucherNumberForParty,
  getVoucherValue,
} from "../utils/partyLookups";
import { createVoucherSubmitHandler } from "../utils/submitVoucher";
import { useVoucherOptionPagination } from "../hooks/useVoucherOptionPagination";
import { useVoucherOptionsLoading } from "../hooks/useVoucherOptionsLoading";
import { getCommandFailureDetails } from "../utils/commandFailure";
import { buildVoucherOptions } from "../utils/voucherOptions";
import { createVoucherTotals } from "../hooks/voucherTotals";
import { createJournalRowActions } from "../hooks/journalRowActions";
import { createStockRowActions } from "../hooks/stockRowActions";
import { createItemRowActions } from "../hooks/itemRowActions";
import { VoucherPageStatus } from "../components/VoucherPageStatus";
import { VoucherFormHeader } from "../components/VoucherFormHeader";
import { VoucherDetailsFields } from "../components/VoucherDetailsFields";
import { VoucherItemsTable } from "../components/VoucherItemsTable";
import { usePartyBalance } from "../hooks/usePartyBalance";
import { useVoucherPageState } from "../hooks/useVoucherPageState";

export { AdvancedVoucherSettings, advancedVoucherFieldNames } from "../components/AdvancedVoucherSettings";
export { GstLedgerPanel } from "../components/GstLedgerPanel";
export { SearchableDropdown } from "../components/SearchableDropdown";

export function DocumentVoucherPage({
  title,
  companyId,
  date = new Date().toLocaleDateString("en-CA"),
}) {
  const {
    isSubmitting, setIsSubmitting,
    submitMessage, setSubmitMessage,
    submitError, setSubmitError,
    showSuccessAnimation, setShowSuccessAnimation,
    customers, setCustomers,
    suppliers, setSuppliers,
    stockItems, setStockItems,
    vouchers, setVouchers,
    ledgers, setLedgers,
    godowns, setGodowns,
    batches, setBatches,
    voucherTypes, setVoucherTypes,
    voucherTypesError, setVoucherTypesError,
    visibleVoucherTypeCount, setVisibleVoucherTypeCount,
    selectedParty, setSelectedParty,
    selectedVoucherNumber, setSelectedVoucherNumber,
    selectedVoucherType, setSelectedVoucherType,
    selectedGstin, setSelectedGstin,
    itemRows, setItemRows,
    additionalLedgers, setAdditionalLedgers,
    showLedgerPanel, setShowLedgerPanel,
    journalRows, setJournalRows,
    sourceRows, setSourceRows,
    destinationRows, setDestinationRows,
    clearToken, setClearToken,
    isOptionsLoading, setIsOptionsLoading,
    optionPages, setOptionPages,
    optionPagesRef,
    stockError, setStockError,
    successTimerRef,
  } = useVoucherPageState(title);

  const accessToken = useAuthStore((state) => state.accessToken);

  const isSalesInvoice = title === "Sales";
  const isSalesOrder = title === "Sales Order";
  const isJournal = title === "Journal";
  const isContra = title === "Contra";
  const isJournalStyleVoucher = isJournal || isContra;
  const isCreditNote = title === "Credit Note";
  const isDebitNote = title === "Debit Note";
  const isReceiptDeliveryNote =
    title === "Receipt Note" || title === "Delivery Note";
  const defaultTaxInclusive =
    title === "Receipt Note" || title === "Delivery Note";
  const isSupplierVoucher =
    title === "Purchase" || title === "Purchase Order" || isDebitNote;

  const {
    companyGstinResult,
    partyBalance,
    setPartyBalance,
    partyBalanceLoading,
    setPartyBalanceLoading,
    partyBalanceError,
    setPartyBalanceError,
    partyBalanceEditedRef,
    partyBalanceRequestRef,
    fetchSelectedPartyBalance,
    resetSelectedPartyBalance,
  } = usePartyBalance({ companyId, accessToken, isSupplierVoucher });
  const isNoteVoucher = isCreditNote || isDebitNote;
  const isStockJournal = title === "Stock Journal";
  const enableVoucherDropdownPagination = true;
  const defaultVoucherType = title === "Quotation" ? "Quotation" : title;
  const showPageLoader =
    isOptionsLoading || isSubmitting || showSuccessAnimation;
  const optionState = {
    setCustomers,
    setSuppliers,
    setStockItems,
    setVouchers,
    setLedgers,
    setGodowns,
    setBatches,
    setVoucherTypes,
    setVoucherTypesError,
    setSelectedParty,
    setSelectedVoucherNumber,
    setSelectedVoucherType,
    setSelectedGstin,
    partyBalanceRequestRef,
    partyBalanceEditedRef,
    setPartyBalance,
    setPartyBalanceLoading,
    setPartyBalanceError,
    setItemRows,
    setAdditionalLedgers,
    setShowLedgerPanel,
    setJournalRows,
    setSourceRows,
    setDestinationRows,
    setStockError,
    setIsOptionsLoading,
    optionPages,
    setOptionPages,
    optionPagesRef,
  };
  const { updateOptionPage, getPaginationProps, getNativeDropdownPaginationProps, loadMoreOnNativeDropdownSelection } = useVoucherOptionPagination({
    state: optionState, requestCompanyId: companyId, accessToken, enableVoucherDropdownPagination,
  });
  useVoucherOptionsLoading({
    state: optionState, requestCompanyId: companyId, accessToken, title, isSupplierVoucher,
    isSalesInvoice, isSalesOrder, updateOptionPage,
  });

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const defaultDate =
    title === "Quotation" ? new Date().toLocaleDateString("en-CA") : date;

  const requestCompanyId = companyId;
  const currentCompanyGstinResult =
    companyGstinResult?.companyId === requestCompanyId
      ? companyGstinResult
      : null;
  const companyGstin = currentCompanyGstinResult?.gstin || "";
  const companyGstinError = currentCompanyGstinResult?.error || "";
  const companyGstinLoading = Boolean(
    requestCompanyId && accessToken && !currentCompanyGstinResult,
  );
  const companyStateCode = getGstinStateCode(companyGstin);
  const partyStateCode = getGstinStateCode(selectedGstin);
  const isSameState =
    companyStateCode && partyStateCode
      ? companyStateCode === partyStateCode
      : null;

  const {
    itemOptions,
    voucherNumberOptions,
    ledgerTypeOptions,
    partyLedgerOptions,
    ledgerOptions,
    visibleVoucherTypeOptions,
    hasMoreVoucherTypeOptions,
    loadMoreVoucherTypeOptions,
    godownOptions,
    partySources,
    partyOptions,
  } = buildVoucherOptions({
    customers,
    suppliers,
    stockItems,
    vouchers,
    ledgers,
    godowns,
    voucherTypes,
    getDisplayValue,
    getStockValue,
    getVoucherValue,
    isSalesInvoice,
    isSalesOrder,
    isSupplierVoucher,
    visibleVoucherTypeCount,
    setVisibleVoucherTypeCount,
  });

  const {
    calculateRowAmount,
    calculateRowTaxBreakdown,
    subtotal,
    itemTaxes,
    addAdditionalLedger,
    removeAdditionalLedger,
    updateAdditionalLedger,
    calculateLedgerTotals,
  } = createVoucherTotals({
    itemRows,
    additionalLedgers,
    setAdditionalLedgers,
    setShowLedgerPanel,
    isSameState,
  });
  const { updateJournalRow, addJournalRow, removeJournalRow } =
    createJournalRowActions({ setJournalRows });
  const { updateStockRow, addStockRow, removeStockRow } =
    createStockRowActions({ stockItems, findStockRate });
  const {
    updateItemRow,
    updateItemRowValues,
    handleItemSelect,
    addItemRow,
    deleteItemRow,
    resetItemRows,
  } = createItemRowActions({
    stockItems,
    setItemRows,
    setClearToken,
    findStockRate,
    findStockQuantity,
    findStockUnits,
    findStockHsnCode,
    defaultTaxInclusive,
  });

  // Qty × Rate, minus the row discount %

  const handleSubmit = createVoucherSubmitHandler({
    title, accessToken, isJournalStyleVoucher, isSalesInvoice, defaultVoucherType,
    isReceiptDeliveryNote,
    requestCompanyId, setSubmitError, setShowSuccessAnimation, setSubmitMessage,
    advancedVoucherFieldNames, journalRows, isStockJournal, getJournalTotalsInPaise,
    formatJournalPaise, isSalesOrder, isNoteVoucher, sourceRows, destinationRows,
    itemRows, setIsSubmitting, calculateRowTaxBreakdown, calculateRowAmount,
    calculateLedgerTotals, subtotal, isJournal, isContra, isSameState,
    selectedGstin,
    postCompanyCommand, extractCommandId, fetchCommandStatus, extractCommandStatus,
    getCommandFailureDetails, setSelectedParty, setSelectedVoucherNumber,
    resetSelectedPartyBalance, setAdditionalLedgers, setShowLedgerPanel, setJournalRows,
    createJournalRow, setSourceRows, setDestinationRows, createStockJournalRow,
    resetItemRows, successTimerRef,
  });

  const handleClear = (event) => {
    const form = event.currentTarget.form;

    form?.reset();

    setSelectedParty("");
    setSelectedVoucherNumber("");
    resetSelectedPartyBalance();

    resetItemRows();
    setAdditionalLedgers([]);
    setShowLedgerPanel(false);

    setSubmitMessage("");
    setSubmitError(null);
  };

  const failedVoucherDetails = submitError?.voucherDetails || {};

  const failedVoucherType =
    failedVoucherDetails.voucherType || selectedVoucherType || "Sales";

  const failedVoucherNumber =
    failedVoucherDetails.voucherNumber || selectedVoucherNumber;

  const failedParty = failedVoucherDetails.party || selectedParty || "Cash";

  const failedAmount = failedVoucherDetails.amount ?? subtotal;

  const failedCompany =
    failedVoucherDetails.company || requestCompanyId || "Company";

  const failedDate = failedVoucherDetails.date || defaultDate;

  const voucherFormProps = {
      clearToken,
      customers,
      defaultDate,
      defaultVoucherType,
      fetchSelectedPartyBalance,
      findLedgerGstin,
      findVoucherNumberForParty,
      getPaginationProps,
      hasMoreVoucherTypeOptions,
      isJournalStyleVoucher,
      isNoteVoucher,
      isOptionsLoading,
      isSalesInvoice,
      isSalesOrder,
      isStockJournal,
      isSupplierVoucher,
      ledgerTypeOptions,
      ledgers,
      loadMoreVoucherTypeOptions,
      partyBalance,
      partyBalanceEditedRef,
      partyBalanceError,
      partyBalanceLoading,
      partyOptions,
      partySources,
      resetSelectedPartyBalance,
      selectedGstin,
      selectedParty,
      selectedVoucherNumber,
      setPartyBalance,
      setSelectedGstin,
      setSelectedParty,
      setSelectedVoucherNumber,
      title,
      visibleVoucherTypeOptions,
      voucherNumberOptions,
      voucherTypesError,
      vouchers,
      addItemRow,
      calculateRowAmount,
      deleteItemRow,
      getNativeDropdownPaginationProps,
      godownOptions,
      handleItemSelect,
      isCreditNote,
      isDebitNote,
      itemOptions,
      itemRows,
      loadMoreOnNativeDropdownSelection,
      stockError,
      updateItemRow,
      updateItemRowValues,
    };

  return (
    <div className="voucher-page-animate relative min-h-[calc(100vh-60px)] bg-[#eef3f8] p-3 text-slate-900 sm:p-5">
      <VoucherPageStatus showPageLoader={showPageLoader} isSubmitting={isSubmitting} showSuccessAnimation={showSuccessAnimation} submitError={submitError} failedVoucherType={failedVoucherType} failedVoucherNumber={failedVoucherNumber} failedParty={failedParty} failedAmount={failedAmount} failedCompany={failedCompany} failedDate={failedDate} setSubmitError={setSubmitError} />

      <form
        onSubmit={handleSubmit}
        className="relative z-0 mx-auto max-w-[1440px] overflow-visible rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.06)]"
      >
        {/* Header */}
        <VoucherFormHeader title={title} isJournalStyleVoucher={isJournalStyleVoucher} />

        <div className="bg-[#f5f7f4] p-3 sm:p-5">
          {isStockJournal ? (
            <StockJournalVoucherContent
              sourceRows={sourceRows}
              destinationRows={destinationRows}
              stockItems={stockItems}
              batches={batches}
              itemOptions={itemOptions}
              godownOptions={godownOptions}
              itemDropdownProps={getPaginationProps("stock")}
              godownDropdownProps={getPaginationProps("godowns")}
              batchDropdownProps={getPaginationProps("batches")}
              optionsLoading={isOptionsLoading}
              onAddSource={() => addStockRow(setSourceRows)}
              onAddDestination={() => addStockRow(setDestinationRows)}
              onRemoveSource={(rowId) => removeStockRow(setSourceRows, rowId)}
              onRemoveDestination={(rowId) =>
                removeStockRow(setDestinationRows, rowId)
              }
              onSourceChange={(rowId, field, value) =>
                updateStockRow(setSourceRows, rowId, field, value)
              }
              onDestinationChange={(rowId, field, value) =>
                updateStockRow(setDestinationRows, rowId, field, value)
              }
            />
          ) : isJournalStyleVoucher ? (
            <JournalVoucherContent
              companyId={companyId}
              voucherType={title}
              rows={journalRows}
              partyOptions={partyLedgerOptions}
              partyDropdownProps={getPaginationProps(["customers", "ledgers"])}
              optionsLoading={isOptionsLoading}
              onAddRow={addJournalRow}
              onRemoveRow={removeJournalRow}
              onRowChange={updateJournalRow}
            />
          ) : (
            <>
              {/* Voucher Details */}
              <VoucherDetailsFields {...voucherFormProps} />

              {/* Items Table */}
              <VoucherItemsTable {...voucherFormProps} />

              <VoucherBottomSection
                subtotal={subtotal}
                itemTaxes={itemTaxes}
                isSameState={isSameState}
                hideIgstBreakdown={defaultTaxInclusive}
                companyGstinLoading={companyGstinLoading}
                companyGstinError={companyGstinError}
                hasCompanyGstin={Boolean(companyGstin)}
                ledgerOptions={ledgerOptions}
                ledgerDropdownProps={getPaginationProps("ledgers")}
                additionalLedgers={additionalLedgers}
                onAddLedger={addAdditionalLedger}
                onRemoveLedger={removeAdditionalLedger}
                onLedgerChange={updateAdditionalLedger}
                showLedgerPanel={showLedgerPanel}
                onToggleLedgerPanel={() => setShowLedgerPanel((open) => !open)}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 bg-[#f5f7f4] px-3 pb-4 pt-0 sm:flex-row sm:items-center sm:justify-end sm:px-5 sm:pb-5">
          {submitMessage && (
            <p className="text-center text-sm text-slate-600 sm:text-right">
              {submitMessage}
            </p>
          )}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {title === "Quotation" && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)] transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent"
                    aria-hidden="true"
                  />
                  Creating...
                </span>
              ) : isJournalStyleVoucher ? (
                `Create ${title} `
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
