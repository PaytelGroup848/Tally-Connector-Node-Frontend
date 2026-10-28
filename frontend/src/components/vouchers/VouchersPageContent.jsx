import { useEffect, useMemo, useState } from "react";

import useAuthStore from "../../store/authStore";
import {
  extractVouchers,
  extractVoucherTypes,
  fetchCompanyVouchers,
  fetchCompanyVoucherTypes,
} from "../../services/companiesApi";
import { downloadVoucherPdf } from "../../services/voucherPdfApi";

import VouchersPageView from "./VouchersPageView";
import {
  getUniqueVoucherColumns,
  getVoucherTypeValue,
  normalizeColumnKey,
} from "./voucherUtils";

function VouchersPage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [vouchers, setVouchers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [voucherType, setVoucherType] = useState("");
  const [voucherTypes, setVoucherTypes] = useState([]);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [detailStack, setDetailStack] = useState([]);

  const [downloadingId, setDownloadingId] = useState(null);

  const [previewId, setPreviewId] = useState(null);

  const handleDownload = async (voucher) => {
    try {
      setDownloadingId(voucher._id);
      await downloadVoucherPdf(companyId, voucher);
    } catch (err) {
      alert(err.message || "PDF download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const openDetail = (title, value) => {
    setDetailStack((currentStack) => [...currentStack, { title, value }]);
  };

  const closeDetail = () => {
    setDetailStack((currentStack) => currentStack.slice(0, -1));
  };

  const closeAllDetails = () => setDetailStack([]);

  // ---------------------------------------------------------
  // RESET PAGE WHEN FILTERS CHANGE
  // ---------------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [companyId, fromDate, toDate, pageSize, voucherType]);

  useEffect(() => {
    if (!accessToken || !companyId) {
      setVoucherTypes([]);
      return undefined;
    }

    let isMounted = true;

    fetchCompanyVoucherTypes(accessToken, companyId)
      .then((response) => {
        if (!isMounted) return;

        const nextTypes = extractVoucherTypes(response)
          .map(getVoucherTypeValue)
          .filter(Boolean);

        setVoucherTypes([...new Set(nextTypes)]);
      })
      .catch(() => {
        if (isMounted) setVoucherTypes([]);
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken, companyId]);

  // ---------------------------------------------------------
  // LOAD VOUCHERS
  // ---------------------------------------------------------

  useEffect(() => {
    if (!accessToken) {
      setVouchers([]);
      setTotalItems(0);
      setTotalPages(1);
      setErrorMessage("Session expired. Please sign in.");
      return undefined;
    }

    if (!companyId) {
      setVouchers([]);
      setTotalItems(0);
      setTotalPages(1);
      setErrorMessage("No company selected.");
      return undefined;
    }

    if (fromDate && toDate && fromDate > toDate) {
      setVouchers([]);
      setTotalItems(0);
      setTotalPages(1);
      setErrorMessage("From date cannot be greater than To date.");
      return undefined;
    }

    let isMounted = true;

    const loadVouchers = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetchCompanyVouchers(accessToken, companyId, {
          page,
          limit: pageSize,
          from: fromDate,
          to: toDate,
          voucherType,
        });

        if (!isMounted) return;

        const nextVouchers = extractVouchers(response);

        const totalCandidates = [
          response?.total,
          response?.count,
          response?.totalItems,
          response?.pagination?.total,
          response?.pagination?.totalItems,
          response?.data?.total,
          response?.data?.count,
        ];

        const parsedTotal = totalCandidates.find(
          (value) =>
            value !== undefined &&
            value !== null &&
            Number.isFinite(Number(value)),
        );

        const safeTotal =
          parsedTotal !== undefined ? Number(parsedTotal) : nextVouchers.length;

        const apiLimit = Number(
          response?.pagination?.limit ??
            response?.limit ??
            response?.data?.limit ??
            pageSize,
        );

        const safeLimit =
          Number.isFinite(apiLimit) && apiLimit > 0 ? apiLimit : pageSize;

        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(safeTotal / safeLimit),
        );

        const apiTotalPages = Number(
          response?.pagination?.totalPages ??
            response?.totalPages ??
            response?.data?.totalPages ??
            calculatedTotalPages,
        );

        const safeTotalPages =
          Number.isFinite(apiTotalPages) && apiTotalPages > 0
            ? apiTotalPages
            : calculatedTotalPages;

        setVouchers(nextVouchers);
        setTotalItems(safeTotal);
        setTotalPages(safeTotalPages);
      } catch (error) {
        if (!isMounted) return;

        setVouchers([]);
        setTotalItems(0);
        setTotalPages(1);

        setErrorMessage(error?.message || "Unable to load vouchers");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadVouchers();

    return () => {
      isMounted = false;
    };
  }, [accessToken, companyId, page, pageSize, fromDate, toDate, voucherType]);

  // ---------------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------------

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }, [page, totalPages]);

  // ---------------------------------------------------------
  // TABLE COLUMNS
  // ---------------------------------------------------------

  const responseColumns = useMemo(() => {
    const preferredColumns = [
      "voucherNumber",
      "voucherType",
      "partyLedger",
      "amount",
      "narration",
    ];

    const columns = getUniqueVoucherColumns(
      vouchers.flatMap((voucher) => Object.keys(voucher || {})),
    );

    return [
      ...preferredColumns.filter((key) =>
        columns.some(
          (column) => normalizeColumnKey(column) === normalizeColumnKey(key),
        ),
      ),
      ...columns.filter(
        (key) =>
          !preferredColumns.some(
            (preferredKey) =>
              normalizeColumnKey(preferredKey) === normalizeColumnKey(key),
          ),
      ),
    ];
  }, [vouchers]);

  const tableGridColumns = useMemo(() => {
    const dataColumnCount = Math.max(responseColumns.length, 1);

    return `repeat(${dataColumnCount}, 220px) 140px`;
  }, [responseColumns.length]);

  const recordStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;

  const recordEnd = totalItems > 0 ? Math.min(page * pageSize, totalItems) : 0;

  return (
    <VouchersPageView
      {...{
        companyId,
        page,
        pageSize,
        setPage,
        setPageSize,
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
      }}
    />
  );
}

export default VouchersPage;
