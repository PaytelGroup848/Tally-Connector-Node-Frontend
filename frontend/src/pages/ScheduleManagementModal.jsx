import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  Save,
  X,
  Loader2,
  CircleAlert,
  Copy,
  Sun,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { updateMemberSchedule } from "../services/membersApi";

const SCHEDULE_DAYS = [
  ["monday", "Monday", "Mon"],
  ["tuesday", "Tuesday", "Tue"],
  ["wednesday", "Wednesday", "Wed"],
  ["thursday", "Thursday", "Thu"],
  ["friday", "Friday", "Fri"],
  ["saturday", "Saturday", "Sat"],
  ["sunday", "Sunday", "Sun"],
];

const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const WEEKEND_KEYS = ["saturday", "sunday"];

/* Small reusable pill switch — mirrors the checkbox styling language
   used in ManageAccessModal so the two modals feel like one product. */
function Switch({ checked, onChange, disabled, size = "md" }) {
  const track = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const thumb = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  const translate = size === "sm" ? "translate-x-4" : "translate-x-5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex ${track} shrink-0 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "bg-teal-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block ${thumb} translate-x-1 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? translate : ""
        }`}
      />
    </button>
  );
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES_5 = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

/* Custom time picker — replaces the native <input type="time"> (which
   renders the browser's own ugly, unthemeable scroller) with a small
   styled dropdown that matches the rest of the modal. Value in/out is
   still a plain "HH:MM" 24-hour string, so nothing else has to change. */
function TimeSelect({ value, onChange, disabled, openUpward }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const [hStr = "00", mStr = "00"] = (value || "00:00").split(":");
  const hour24 = parseInt(hStr, 10) || 0;
  const minute = mStr.padStart(2, "0");
  const isPM = hour24 >= 12;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const commit = (nextHour24, nextMinute) => {
    onChange(`${String(nextHour24).padStart(2, "0")}:${nextMinute}`);
  };

  const pickHour12 = (h12) => {
    const base = h12 % 12;
    commit(isPM ? base + 12 : base, minute);
  };

  const pickMinute = (m) => commit(hour24, m);

  const pickPeriod = (pm) => {
    const base = hour12 % 12;
    commit(pm ? base + 12 : base, minute);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-[122px] items-center gap-1.5 rounded-md border px-2 py-1.5 text-[13px] transition ${
          open
            ? "border-teal-500 ring-2 ring-teal-500/15"
            : "border-slate-200 hover:border-slate-300"
        } ${
          disabled
            ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
            : "bg-white text-slate-700"
        }`}
      >
        <Clock
          size={12}
          className={disabled ? "text-slate-300" : "text-slate-400"}
        />
        <span className="flex-1 text-left tabular-nums">
          {String(hour12).padStart(2, "0")}:{minute}{" "}
          <span className="text-[11px] text-slate-400">
            {isPM ? "PM" : "AM"}
          </span>
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""} text-slate-400`}
        />
      </button>

      {open && !disabled && (
        <div
          className={`time-scroll absolute z-30 flex w-[168px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {/* HOURS */}
          <div className="time-scroll max-h-[176px] flex-1 overflow-y-auto border-r border-slate-100 py-1">
            {HOURS_12.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => pickHour12(h)}
                className={`block w-full px-3 py-1.5 text-center text-[13px] tabular-nums transition ${
                  h === hour12
                    ? "bg-teal-600 font-semibold text-white"
                    : "text-slate-600 hover:bg-teal-50"
                }`}
              >
                {String(h).padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* MINUTES */}
          <div className="time-scroll max-h-[176px] flex-1 overflow-y-auto border-r border-slate-100 py-1">
            {MINUTES_5.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => pickMinute(m)}
                className={`block w-full px-3 py-1.5 text-center text-[13px] tabular-nums transition ${
                  m === minute
                    ? "bg-teal-600 font-semibold text-white"
                    : "text-slate-600 hover:bg-teal-50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* AM / PM */}
          <div className="flex w-12 shrink-0 flex-col justify-center gap-1 p-1">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => pickPeriod(p === "PM")}
                className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
                  (p === "PM") === isPM
                    ? "bg-teal-600 text-white"
                    : "text-slate-400 hover:bg-teal-50 hover:text-teal-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScheduleManagementModal({
  user,
  accessToken,
  onClose,
  onSuccess,
}) {
  const [scheduleEnabled, setScheduleEnabled] = useState(
    Boolean(user.loginSchedule?.enabled),
  );

  const [days, setDays] = useState(() => {
    const existing = user.loginSchedule?.days || {};
    return SCHEDULE_DAYS.reduce((acc, [key]) => {
      acc[key] = {
        enabled: existing[key]?.enabled ?? key !== "sunday",
        from: existing[key]?.from || "10:00",
        to: existing[key]?.to || "19:00",
      };
      return acc;
    }, {});
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateDay = (key, patch) => {
    setDays((current) => ({
      ...current,
      [key]: { ...current[key], ...patch },
    }));
  };

  const applyToKeys = (keys, patch) => {
    setDays((current) => {
      const next = { ...current };
      keys.forEach((key) => {
        next[key] = { ...next[key], ...patch };
      });
      return next;
    });
  };

  const copyMondayToAll = () => {
    const { from, to } = days.monday;
    applyToKeys(
      SCHEDULE_DAYS.map(([key]) => key),
      { from, to },
    );
  };

  const activeCount = useMemo(
    () => SCHEDULE_DAYS.filter(([key]) => days[key].enabled).length,
    [days],
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      await updateMemberSchedule({
        accessToken,
        id: user.id,
        enabled: scheduleEnabled,
        days,
      });

      onSuccess(user.id, { enabled: scheduleEnabled, days });
      onClose();
    } catch (submitError) {
      setError(submitError?.message || "Failed to save schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="flex max-h-[calc(100vh-8rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <Clock size={18} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-slate-900">
                Login schedule
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Set working hours for{" "}
                <span className="font-medium text-slate-700">{user.email}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="schedule-scroll flex-1 overflow-y-auto px-6 py-5">
          {/* RESTRICT TOGGLE */}
          <div
            className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-colors ${
              scheduleEnabled
                ? "border-teal-200 bg-teal-50/60"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <Clock
                size={18}
                className={`mt-0.5 ${scheduleEnabled ? "text-teal-600" : "text-slate-400"}`}
              />
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Restrict outside office hours
                </div>
                <div className="text-xs text-slate-500">
                  Login is only allowed during the windows set below
                </div>
              </div>
            </div>

            <Switch
              checked={scheduleEnabled}
              onChange={() => setScheduleEnabled((v) => !v)}
            />
          </div>

          {/* WEEKLY SCHEDULE */}
          <div className="mt-5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Calendar size={15} />
                Weekly schedule
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 tabular-nums">
                  {activeCount}/7 active
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={!scheduleEnabled}
                  onClick={() => applyToKeys(WEEKDAY_KEYS, { enabled: true })}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Briefcase size={11} />
                  Weekdays
                </button>
                <button
                  type="button"
                  disabled={!scheduleEnabled}
                  onClick={() => applyToKeys(WEEKEND_KEYS, { enabled: false })}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sun size={11} />
                  Off weekends
                </button>
                <button
                  type="button"
                  disabled={!scheduleEnabled}
                  onClick={copyMondayToAll}
                  title="Copy Monday's hours to every day"
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Copy size={11} />
                  Copy Mon to all
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
              {SCHEDULE_DAYS.map(([key, label, short], index) => {
                const day = days[key];
                const rowActive = scheduleEnabled && day.enabled;
                const openUpward = index >= SCHEDULE_DAYS.length - 3;

                return (
                  <div
                    key={key}
                    className={`flex items-center gap-3 px-3.5 py-2.5 transition-colors ${
                      rowActive ? "bg-white" : "bg-slate-50/70"
                    }`}
                  >
                    <span
                      className={`w-9 shrink-0 text-[13px] font-semibold ${
                        rowActive ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {short}
                    </span>

                    <Switch
                      size="sm"
                      checked={day.enabled}
                      disabled={!scheduleEnabled}
                      onChange={() => updateDay(key, { enabled: !day.enabled })}
                    />

                    <div className="ml-1 flex flex-1 items-center gap-2">
                      <TimeSelect
                        value={day.from}
                        disabled={!rowActive}
                        openUpward={openUpward}
                        onChange={(val) => updateDay(key, { from: val })}
                      />
                      <span className="text-[11px] text-slate-400">to</span>
                      <TimeSelect
                        value={day.to}
                        disabled={!rowActive}
                        openUpward={openUpward}
                        onChange={(val) => updateDay(key, { to: val })}
                      />
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                        rowActive
                          ? "bg-teal-50 text-teal-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {rowActive ? "Active" : "Off"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {loading ? "Saving" : "Save schedule"}
          </button>
        </div>
      </div>

      <style>{`
        .schedule-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .schedule-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .schedule-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .schedule-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 9999px;
          border: 2px solid white;
        }
        .schedule-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
        .time-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .time-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .time-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .time-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
