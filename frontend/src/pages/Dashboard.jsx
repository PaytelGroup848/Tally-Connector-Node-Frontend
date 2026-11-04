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

function formatHeaderDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

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
    const requestOptions = {
      from: fromDate || "2000-01-01",
      to: toDate || toInputDate(new Date()),
    };

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

  const companyDataStartDate = toInputDate(
    dashboardData?.summary?.companyDataStartDate ??
      dashboardData?.companyDataStartDate,
  );
  const companyDataEndDate = toInputDate(
    dashboardData?.summary?.companyDataEndDate ??
      dashboardData?.companyDataEndDate,
  );
  const companyDataRange =
    companyDataStartDate && companyDataEndDate
      ? { from: companyDataStartDate, to: companyDataEndDate }
      : null;

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
  const reportRange =
    fromDate && toDate
      ? { from: fromDate, to: toDate }
      : dashboardRange || {
          from: "2000-01-01",
          to: toInputDate(new Date()),
        };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full min-w-0 overflow-x-hidden bg-app-bg p-4 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-[1500px] min-w-0">
        <div className="mb-5 grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <h1 className="cloud-page-title">Dashboard</h1>

          <div className="col-span-2 flex justify-center sm:col-span-1">
            <div className="mx-auto grid w-fit max-w-full gap-1.5 rounded-xl border border-app-border bg-white px-3 py-2 shadow-sm sm:px-4">
              <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs">
                <span className="text-app-text">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <CalendarDays size={15} />
                    <span className="text-xs font-semibold tracking-wide">
                      {companyDataRange
                        ? `FY (${formatHeaderDate(companyDataRange.from)}) to FY (${formatHeaderDate(companyDataRange.to)})`
                        : "Date range unavailable"}
                    </span>
                  </div>
                </span>
              </div>
            </div>
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
            label="Total Purchases"
            value={dashboardValues.totalPurchases}
            change={dashboardValues.purchasesChange}
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

            WebkitMaskImage: "url('/ctrlbooks-logo.webp')",
            maskImage: "url('/ctrlbooks-logo.webp')",

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
                src="/ctrlbooks-video.webm"
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
