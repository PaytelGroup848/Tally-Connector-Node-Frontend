import {
  formatConnectorDateTime,
  getConnectorBadgeClass,
  getConnectorDotClass,
  getConnectorStatusType,
  getTallyConnectionClass,
} from "./connectorStatusUtils";

export default function ConnectorStatusPanel({
  rows,
  lastSyncLabel,
  connectorStatusError,
  isConnectorStatusLoading,
}) {
  return (
    <div className="connector-status-menu absolute right-0 top-full z-[1100] mt-2 w-[min(420px,calc(100vw-16px))] overflow-hidden rounded-xl border border-black/[0.10] bg-white text-black shadow-[0_18px_42px_rgba(0,0,0,0.35)] backdrop-blur-[24px] backdrop-saturate-[150%]">
      <div className="border-b border-black/[0.07] bg-white px-4 py-3">
        <p className="text-xs font-semibold text-gray-900">
          Connector Status
        </p>
        <p className="mt-1 text-[10px] text-gray-500">Last sync history</p>
        <span className="mt-1 block text-[11px] font-medium text-gray-800">
          {lastSyncLabel}
        </span>
      </div>
      <div className="glass-scrollbar max-h-[320px] overflow-y-auto">
        {isConnectorStatusLoading ? (
          <div className="px-4 py-5 text-sm text-gray-500">
            Loading connector status...
          </div>
        ) : connectorStatusError ? (
          <div className="px-4 py-5 text-sm text-red-600">
            {connectorStatusError}
          </div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-5 text-sm text-gray-500">
            No connector status available.
          </div>
        ) : (
          rows.map((connector, index) => {
            const deviceName =
              connector?.deviceName ||
              connector?.name ||
              connector?.connectorName ||
              `Connector ${index + 1}`;
            const status = connector?.status || "UNKNOWN";
            const statusType = getConnectorStatusType(status);
            const heartbeat =
              connector?.lastHeartbeatAt ||
              connector?.lastHeartbeat ||
              connector?.heartbeatAt ||
              null;
            const tallyConnectedClass = getTallyConnectionClass(
              connector?.tallyConnected,
            );

            return (
              <div
                key={`${deviceName}-${index}`}
                className="border-b border-gray-100 px-4 py-4 last:border-b-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${getConnectorDotClass(statusType)}`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-gray-900">
                        {deviceName}
                      </p>
                      <p className="mt-1 text-[10px] font-bold text-gray-500">
                        Tally connection
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getConnectorBadgeClass(statusType)}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-medium text-gray-400">
                      Connection
                    </p>
                    <p
                      className={`mt-1 text-[11px] font-semibold ${tallyConnectedClass}`}
                    >
                      {connector?.tallyConnected === true
                        ? "Connected"
                        : connector?.tallyConnected === false
                          ? "Disconnected"
                          : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-medium text-gray-400">
                      Last Updated
                    </p>
                    <p className="mt-1 truncate text-[11px] font-medium text-gray-700">
                      {formatConnectorDateTime(heartbeat)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
