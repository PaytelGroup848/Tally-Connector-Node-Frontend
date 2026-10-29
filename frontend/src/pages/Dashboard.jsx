import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CreditCard,
  FileText,
  Landmark,
  TrendingUp,
  Users,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { fetchCompanyDashboard } from "../services/companiesApi";
import DashboardTables from "./dashboard/DashboardTables";
import MetricCard from "./dashboard/MetricCard";
import ReceivablesPanel from "./dashboard/ReceivablesPanel";
import SalesReceiptsPanel from "./dashboard/SalesReceiptsPanel";
import { normalizeDashboardData, toInputDate } from "./dashboard/utils";

function DashboardPage({
  companyId,
  activeTab,
  setActiveTab,
  selectedPeriod,
  setSelectedPeriod,
  dayBookDate,
  setDayBookDate,
  openCustomDatePicker,
  customDateInput,
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardRange, setDashboardRange] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [draftFromDate, setDraftFromDate] = useState("");
  const [draftToDate, setDraftToDate] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const dashboardRequestRef = useRef(0);
  useEffect(() => {
    if (!accessToken || !companyId) {
      setDashboardData(null);
      setDashboardRange(null);
      return undefined;
    }

    let isMounted = true;
    const requestId = ++dashboardRequestRef.current;
    const requestOptions =
      fromDate && toDate ? { from: fromDate, to: toDate } : {};

    fetchCompanyDashboard(accessToken, companyId, requestOptions)
      .then((response) => {
        if (!isMounted || requestId !== dashboardRequestRef.current) return;

        const responseData = response?.data || response;
        const responseRange = responseData?.range;
        const responseFrom = toInputDate(responseRange?.from);
        const responseTo = toInputDate(responseRange?.to);

        setDashboardData(responseData);
        setDashboardRange(
          responseFrom && responseTo
            ? { from: responseFrom, to: responseTo }
            : null,
        );
      })
      .catch((error) => {
        if (!isMounted || requestId !== dashboardRequestRef.current) return;

        setDashboardData(null);
        setDashboardRange(null);
        console.warn("Dashboard API failed, using dashboard defaults:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken, companyId, fromDate, toDate]);

  const applyDateFilter = (event) => {
    event.preventDefault();
    if (!draftFromDate || !draftToDate || draftFromDate > draftToDate) return;

    setFromDate(draftFromDate);
    setToDate(draftToDate);
    setDashboardRange(null);
    setIsDateFilterOpen(false);
  };

  const dashboardValues = normalizeDashboardData(
    dashboardData,
    dashboardRange || { from: fromDate, to: toDate },
  );

  return (
    <div className="min-h-[calc(100vh-64px)] w-full min-w-0 overflow-x-hidden bg-app-bg p-4 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-[1500px] min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="cloud-page-title">Dashboard</h1>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setDraftFromDate(fromDate);
                setDraftToDate(toDate);
                setIsDateFilterOpen((open) => !open);
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-app-border bg-white px-3 text-[11px] font-semibold text-app-text-secondary shadow-sm"
            >
              <CalendarDays className="h-4 w-4" />

              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {isDateFilterOpen && (
              <form
                onSubmit={applyDateFilter}
                className="absolute right-0 z-20 mt-2 grid w-64 gap-3 rounded-lg border border-app-border bg-white p-4 shadow-lg"
              >
                <label className="grid gap-1 text-[11px] font-semibold text-app-text-secondary">
                  From
                  <input
                    type="date"
                    value={draftFromDate}
                    onChange={(event) => setDraftFromDate(event.target.value)}
                    className="h-9 rounded-md border border-app-border px-2 text-xs text-app-text"
                  />
                </label>

                <label className="grid gap-1 text-[11px] font-semibold text-app-text-secondary">
                  To
                  <input
                    type="date"
                    value={draftToDate}
                    min={draftFromDate}
                    onChange={(event) => setDraftToDate(event.target.value)}
                    className="h-9 rounded-md border border-app-border px-2 text-xs text-app-text"
                  />
                </label>

                <button
                  type="submit"
                  className="h-9 rounded-md bg-app-primary px-3 text-xs font-semibold text-white"
                >
                  Apply Filter
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={TrendingUp}
            label="Total Sales"
            value={dashboardValues.totalSales}
            change={dashboardValues.salesChange}
          />
          <MetricCard
            icon={FileText}
            label="Total Receipts"
            value={dashboardValues.totalReceipts}
            change={dashboardValues.receiptsChange}
          />
          <MetricCard
            icon={CreditCard}
            label="Total Payments"
            value={dashboardValues.totalPayments}
            change={dashboardValues.paymentsChange}
          />
          <MetricCard
            icon={Landmark}
            label="Cash & Bank Balance"
            value={dashboardValues.cashBankBalance}
            change={dashboardValues.cashBankChange}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <SalesReceiptsPanel
            chartData={dashboardValues.chartData}
            totalSales={dashboardValues.totalSales}
            totalReceipts={dashboardValues.totalReceipts}
          />
          <ReceivablesPanel
            totalOutstanding={dashboardValues.totalOutstanding}
            agingData={dashboardValues.agingData}
            customerCounts={dashboardValues.customerCounts}
          />
        </div>

        <DashboardTables
          customers={dashboardValues.topCustomers}
          dayBook={dashboardValues.dayBook}
        />

        <div className="sr-only">
          <select
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
            aria-label="Dashboard period"
          >
            <option>This Year</option>
          </select>

          <span>{activeTab}</span>
          <span>{dayBookDate}</span>

          <button type="button" onClick={openCustomDatePicker}>
            Custom Date
          </button>

          <input
            ref={customDateInput}
            type="date"
            value={dayBookDate || ""}
            onChange={(event) => setDayBookDate(event.target.value)}
          />

          <Users />
          <ArrowUpRight />
        </div>
      </div>

     
<div className="w-full max-w-none m-0 p-0 overflow-hidden">
  <div
    className="relative w-full h-80 overflow-hidden"
    style={{
      aspectRatio: "202 / 60",
      WebkitMaskImage: "url('/ctrlbooks-logo.png')",
      maskImage: "url('/ctrlbooks-logo.png')",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    }}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-full max-sm:w-[90%] max-sm:h-[70%] overflow-hidden">
        <video
          className="block w-full h-full object-cover m-0 p-0"
          src="/ctrlbooks-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</div>

    </div>
  );
}

export default DashboardPage;
