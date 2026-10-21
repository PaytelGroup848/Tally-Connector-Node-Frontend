import { useEffect } from "react";
import {
  extractBatches, extractGodowns, extractLedgers, extractStockItems, extractVouchers, extractVoucherTypes,
  fetchCompanyBatches, fetchCompanyCommands, fetchCompanyGodowns, fetchCompanyLedgers, fetchCompanyStock, fetchCompanyVouchers, fetchCompanyVoucherTypes,
} from "../services/companiesApi";
import { extractCustomers, extractSuppliers, fetchCustomers, fetchSuppliers } from "../services/customersApi";
import { createEmptyItemRow, createJournalRow, createStockJournalRow, DROPDOWN_PAGE_SIZE } from "../utils/voucherHelpers";

export function useVoucherOptionsLoading({ state, requestCompanyId, accessToken, title, isSupplierVoucher, isSalesInvoice, isSalesOrder, updateOptionPage }) {
  const {
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
    setOptionPages,
    optionPagesRef,
  } = state;

useEffect(() => {
      if (!requestCompanyId || !accessToken) {
        optionPagesRef.current = {};
        setOptionPages({});
        setCustomers([]);
        setSuppliers([]);
        setStockItems([]);
        setVouchers([]);
        setLedgers([]);
        setGodowns([]);
        setBatches([]);
        setVoucherTypes([]);
        setVoucherTypesError("");
        setSelectedParty("");
        setSelectedVoucherNumber("");
        setSelectedVoucherType("Sales");
        setSelectedGstin("");
        partyBalanceRequestRef.current += 1;
        partyBalanceEditedRef.current = false;
        setPartyBalance("");
        setPartyBalanceLoading(false);
        setPartyBalanceError("");
        setItemRows([
          createEmptyItemRow({
            taxInclusive:
              title === "Receipt Note" || title === "Delivery Note",
          }),
        ]);
        setAdditionalLedgers([]);
        setShowLedgerPanel(false);
        setJournalRows([
          { ...createJournalRow(1), type: "Debit" },
          { ...createJournalRow(2), type: "Credit" },
        ]);
        setSourceRows([createStockJournalRow(1)]);
        setDestinationRows([createStockJournalRow(2)]);
        setStockError("");
        return undefined;
      }

      let mounted = true;

      optionPagesRef.current = {};
      setOptionPages({});
      setCustomers([]);
      setSuppliers([]);
      setStockItems([]);
      setVouchers([]);
      setLedgers([]);
      setGodowns([]);
      setBatches([]);
      setVoucherTypes([]);
      setIsOptionsLoading(true);
      setStockError("");
      setVoucherTypesError("");

      const requests = [
        isSupplierVoucher
          ? Promise.resolve(null)
          : fetchCustomers({
              companyId: requestCompanyId,
              accessToken,
              page: 1,
              limit: DROPDOWN_PAGE_SIZE,
            }),

        isSupplierVoucher
          ? fetchSuppliers({
              companyId: requestCompanyId,
              accessToken,
              page: 1,
              limit: DROPDOWN_PAGE_SIZE,
            })
          : Promise.resolve(null),

        fetchCompanyStock(accessToken, requestCompanyId, {
          page: 1,
          limit: 20,
        }),
      ];

      if (title === "Quotation" || isSalesInvoice) {
        requests.push(
          fetchCompanyVouchers(accessToken, requestCompanyId, {
            page: 1,
            limit: 100,
          }),
        );
      } else {
        requests.push(Promise.resolve(null));
      }

      requests.push(
        fetchCompanyBatches(accessToken, requestCompanyId, {
          page: 1,
          limit: 100,
        }),
      );

      requests.push(
        fetchCompanyLedgers(accessToken, requestCompanyId, {
          page: 1,
          limit: 100,
        }),
      );

      requests.push(
        fetchCompanyGodowns(accessToken, requestCompanyId, {
          page: 1,
          limit: 100,
        }),
      );

      if (
        isSalesInvoice ||
        isSalesOrder ||
        title === "Receipt Note" ||
        title === "Delivery Note"
      ) {
        requests.push(fetchCompanyVoucherTypes(accessToken, requestCompanyId));
      } else {
        requests.push(Promise.resolve(null));
      }

      if (isSalesOrder) {
        requests.push(
          fetchCompanyCommands(accessToken, requestCompanyId, {
            type: "CREATE_VOUCHER",
            voucherType: "Sales Order",
            page: 1,
            limit: 20,
            q: "",
          }),
        );
      }

      Promise.allSettled(requests)
        .then(
          ([
            customersResult,
            suppliersResult,
            stockResult,
            vouchersResult,
            batchesResult,
            ledgersResult,
            godownsResult,
            voucherTypesResult,
          ]) => {
            if (!mounted) return;

            if (customersResult.status === "fulfilled") {
              const customerPage = extractCustomers(customersResult.value);
              setCustomers(customerPage);
              updateOptionPage("customers", {
                nextPage: 2,
                hasMore: customerPage.length >= DROPDOWN_PAGE_SIZE,
                loading: false,
                error: "",
                loadError: "",
              });
            } else {
              setCustomers([]);
              updateOptionPage("customers", {
                nextPage: 2,
                hasMore: false,
                loading: false,
                error: "",
                loadError:
                  customersResult.reason?.message || "Unable to load customers.",
              });
            }

            if (suppliersResult.status === "fulfilled") {
              const supplierPage = extractSuppliers(suppliersResult.value);
              setSuppliers(supplierPage);
              updateOptionPage("suppliers", {
                nextPage: 2,
                hasMore: supplierPage.length >= DROPDOWN_PAGE_SIZE,
                loading: false,
                error: "",
                loadError: "",
              });
            } else {
              setSuppliers([]);
              updateOptionPage("suppliers", {
                nextPage: 2,
                hasMore: false,
                loading: false,
                error: "",
                loadError:
                  suppliersResult.reason?.message || "Unable to load suppliers.",
              });
            }

            if (stockResult.status === "fulfilled") {
              const stockPage = extractStockItems(stockResult.value);
              setStockItems(stockPage);
              updateOptionPage("stock", {
                nextPage: 2,
                hasMore: stockPage.length >= DROPDOWN_PAGE_SIZE,
                loading: false,
                error: "",
                loadError: "",
              });
            } else {
              setStockItems([]);
              setStockError(
                stockResult.reason?.message || "Unable to load stock items.",
              );
              updateOptionPage("stock", {
                nextPage: 2,
                hasMore: false,
                loading: false,
                error: "",
                loadError:
                  stockResult.reason?.message || "Unable to load stock items.",
              });
            }

            if (batchesResult?.status === "fulfilled") {
              const batchPage = extractBatches(batchesResult.value);
              setBatches(batchPage);
              updateOptionPage("batches", {
                nextPage: 2,
                hasMore: batchPage.length >= DROPDOWN_PAGE_SIZE,
                loading: false,
                error: "",
                loadError: "",
              });
            } else if (batchesResult?.status === "rejected") {
              setBatches([]);
              updateOptionPage("batches", {
                nextPage: 2,
                hasMore: false,
                loading: false,
                error: "",
                loadError:
                  batchesResult.reason?.message || "Unable to load batches.",
              });
            }

            if (vouchersResult?.status === "fulfilled") {
              const voucherPage = extractVouchers(vouchersResult.value);
              setVouchers(voucherPage);
              updateOptionPage("vouchers", {
                nextPage: 2,
                hasMore: voucherPage.length >= DROPDOWN_PAGE_SIZE,
                loading: false,
                error: "",
                loadError: "",
              });
            } else if (vouchersResult?.status === "rejected") {
              setVouchers([]);
              updateOptionPage("vouchers", {
                nextPage: 2,
                hasMore: false,
                loading: false,
                error: "",
                loadError:
                  vouchersResult.reason?.message || "Unable to load vouchers.",
              });
            }

            if (ledgersResult?.status === "fulfilled") {
              const ledgerPage = extractLedgers(ledgersResult.value);
              setLedgers(ledgerPage);
              updateOptionPage("ledgers", {
                nextPage: 2,
                hasMore: ledgerPage.length >= DROPDOWN_PAGE_SIZE,
                loading: false,
                error: "",
                loadError: "",
              });
            } else if (ledgersResult?.status === "rejected") {
              setLedgers([]);
              updateOptionPage("ledgers", {
                nextPage: 2,
                hasMore: false,
                loading: false,
                error: "",
                loadError:
                  ledgersResult.reason?.message || "Unable to load ledgers.",
              });
            }

            if (godownsResult?.status === "fulfilled") {
              const godownPage = extractGodowns(godownsResult.value);
              setGodowns(godownPage);
              updateOptionPage("godowns", {
                nextPage: 2,
                hasMore: godownPage.length >= DROPDOWN_PAGE_SIZE,
                loading: false,
                error: "",
                loadError: "",
              });
            } else if (godownsResult?.status === "rejected") {
              setGodowns([]);
              updateOptionPage("godowns", {
                nextPage: 2,
                hasMore: false,
                loading: false,
                error: "",
                loadError:
                  godownsResult.reason?.message || "Unable to load godowns.",
              });
            }

            if (voucherTypesResult?.status === "fulfilled") {
              setVoucherTypes(extractVoucherTypes(voucherTypesResult.value));
              setVoucherTypesError("");
            } else if (voucherTypesResult?.status === "rejected") {
              setVoucherTypes([]);
              setVoucherTypesError(
                voucherTypesResult.reason?.message ||
                  "Unable to load voucher types.",
              );
            }
          },
        )
        .finally(() => {
          if (mounted) {
            setIsOptionsLoading(false);
          }
        });

      return () => {
        mounted = false;
      };
    }, [
      accessToken,
      isSalesInvoice,
      isSalesOrder,
      isSupplierVoucher,
      optionPagesRef,
      partyBalanceEditedRef,
      partyBalanceRequestRef,
      requestCompanyId,
      setAdditionalLedgers,
      setBatches,
      setCustomers,
      setDestinationRows,
      setGodowns,
      setIsOptionsLoading,
      setItemRows,
      setJournalRows,
      setLedgers,
      setOptionPages,
      setPartyBalance,
      setPartyBalanceError,
      setPartyBalanceLoading,
      setSelectedGstin,
      setSelectedParty,
      setSelectedVoucherNumber,
      setSelectedVoucherType,
      setShowLedgerPanel,
      setSourceRows,
      setStockError,
      setStockItems,
      setSuppliers,
      setVoucherTypes,
      setVoucherTypesError,
      setVouchers,
      title,
      updateOptionPage,
    ]);
}
