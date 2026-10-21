import { Smartphone } from "lucide-react";
import ConnectorStatusButton from "./ConnectorStatus/ConnectorStatusButton";
import ProfileMenu from "./ProfileMenu";

export default function HeaderActions({
  onMobileVersionClick,
  connectorStatusRows,
  lastSyncMeta,
  connectorStatusError,
  isConnectorStatusLoading,
  showProfileMenu,
  onToggleProfile,
  hasInvoices,
  onProfileAction,
}) {
  return (
    <div className="ml-auto flex h-16 shrink-0 items-stretch">
      <button
        type="button"
        onClick={
          onMobileVersionClick ??
          (() =>
            window.open(
              "/mobile-version",
              "_blank",
              "noopener,noreferrer",
            ))
        }
        className="hidden h-16 w-[82px] shrink-0 items-center justify-center gap-1.5 border-r border-black/[0.06] bg-black/[0.02] text-[9px] leading-3 text-gray-500 transition-all hover:bg-black/[0.04] hover:text-gray-900 lg:flex"
      >
        <Smartphone className="h-4 w-4 shrink-0 text-emerald-700" />
        <span>
          Mobile
          <br />
          Version
        </span>
      </button>

      <div className="hidden h-16 w-[180px] shrink-0 items-center justify-center border-r border-black/[0.06] bg-black/[0.02] px-5 lg:flex">
        <ConnectorStatusButton
          rows={connectorStatusRows}
          lastSyncMeta={lastSyncMeta}
          connectorStatusError={connectorStatusError}
          isConnectorStatusLoading={isConnectorStatusLoading}
        />
      </div>

      <ProfileMenu
        isOpen={showProfileMenu}
        onToggle={onToggleProfile}
        hasInvoices={hasInvoices}
        onProfileAction={onProfileAction}
      />
    </div>
  );
}
