import { useRef, useState } from "react";
import { createEmptyItemRow, createJournalRow, createStockJournalRow, DROPDOWN_PAGE_SIZE } from "../utils/voucherHelpers";

export function useVoucherPageState(title) {
const [isSubmitting, setIsSubmitting] = useState(false);

const [submitError, setSubmitError] = useState(null);

const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

const [customers, setCustomers] = useState([]);

const [suppliers, setSuppliers] = useState([]);

const [stockItems, setStockItems] = useState([]);

const [vouchers, setVouchers] = useState([]);

const [ledgers, setLedgers] = useState([]);

const [godowns, setGodowns] = useState([]);

const [batches, setBatches] = useState([]);

const [voucherTypes, setVoucherTypes] = useState([]);

const [voucherTypesError, setVoucherTypesError] = useState("");

const [visibleVoucherTypeCount, setVisibleVoucherTypeCount] =
    useState(DROPDOWN_PAGE_SIZE);

const [selectedParty, setSelectedParty] = useState("");

const [selectedVoucherNumber, setSelectedVoucherNumber] = useState("");

const [selectedVoucherType, setSelectedVoucherType] = useState(
    title === "Sales Order" ? "Sales Order" : "Sales",
  );

const [selectedGstin, setSelectedGstin] = useState("");

const [itemRows, setItemRows] = useState([
    createEmptyItemRow({
      taxInclusive: title === "Receipt Note" || title === "Delivery Note",
    }),
  ]);

const [additionalLedgers, setAdditionalLedgers] = useState([]);

const [showLedgerPanel, setShowLedgerPanel] = useState(false);

const [journalRows, setJournalRows] = useState([
    { ...createJournalRow(1), type: "Debit" },
    { ...createJournalRow(2), type: "Credit" },
  ]);

const [sourceRows, setSourceRows] = useState([createStockJournalRow(1)]);

const [destinationRows, setDestinationRows] = useState([
    createStockJournalRow(2),
  ]);

const [clearToken, setClearToken] = useState(0);

const [isOptionsLoading, setIsOptionsLoading] = useState(false);

const [optionPages, setOptionPages] = useState({});

const optionPagesRef = useRef({});

const [stockError, setStockError] = useState("");

const successTimerRef = useRef(null);

  return { isSubmitting, setIsSubmitting, submitError, setSubmitError, showSuccessAnimation, setShowSuccessAnimation, customers, setCustomers, suppliers, setSuppliers, stockItems, setStockItems, vouchers, setVouchers, ledgers, setLedgers, godowns, setGodowns, batches, setBatches, voucherTypes, setVoucherTypes, voucherTypesError, setVoucherTypesError, visibleVoucherTypeCount, setVisibleVoucherTypeCount, selectedParty, setSelectedParty, selectedVoucherNumber, setSelectedVoucherNumber, selectedVoucherType, setSelectedVoucherType, selectedGstin, setSelectedGstin, itemRows, setItemRows, additionalLedgers, setAdditionalLedgers, showLedgerPanel, setShowLedgerPanel, journalRows, setJournalRows, sourceRows, setSourceRows, destinationRows, setDestinationRows, clearToken, setClearToken, isOptionsLoading, setIsOptionsLoading, optionPages, setOptionPages, optionPagesRef, stockError, setStockError, successTimerRef };
}
