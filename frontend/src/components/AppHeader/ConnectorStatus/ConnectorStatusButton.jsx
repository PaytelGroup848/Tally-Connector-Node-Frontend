import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import ConnectorStatusPanel from "./ConnectorStatusPanel";
import { formatConnectorDateTime } from "./connectorStatusUtils";

export default function ConnectorStatusButton({
  rows = [],
  lastSyncMeta = null,
  connectorStatusError = "",
  isConnectorStatusLoading = false,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const syncMeta = Array.isArray(lastSyncMeta)
    ? lastSyncMeta[0]
    : lastSyncMeta;
  const lastSyncValue =
    syncMeta?.completedAt ||
    syncMeta?.lastSync ||
    syncMeta?.lastSyncedAt ||
    syncMeta?.updatedAt ||
    syncMeta?.timestamp ||
    null;
  const lastSyncLabel = lastSyncValue
    ? formatConnectorDateTime(lastSyncValue)
    : "No sync yet";

  useEffect(() => {
    const closeOnRouteChange = () => setOpen(false);
    const closeOnOutsideClick = (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("popstate", closeOnRouteChange);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("popstate", closeOnRouteChange);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="connector-status relative flex w-full min-w-0 items-center justify-center"
    >
      <button
        type="button"
        aria-label="Open connector status"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="group flex h-11 w-full min-w-0 max-w-full items-center gap-2 rounded-xl border border-black/[0.10] bg-white/[0.055] px-3 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-200 hover:border-white/[0.16] hover:bg-white/[0.08] active:bg-white/[0.10]"
      >
        <span className="flex min-w-0 flex-1 flex-col items-start justify-center leading-none">
          <span className="truncate text-[10px] font-semibold text-black">
            Connector Status
          </span>
          <span className="mt-0.5 truncate whitespace-nowrap text-[8px] text-black">
            Last Sync History
          </span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-black transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ConnectorStatusPanel
          rows={rows}
          lastSyncLabel={lastSyncLabel}
          connectorStatusError={connectorStatusError}
          isConnectorStatusLoading={isConnectorStatusLoading}
        />
      )}
    </div>
  );
}
