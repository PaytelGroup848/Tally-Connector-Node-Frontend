import { formatAmount, formatDate } from "./utils";

const columns = [
  ["PARTY NAME"],
  ["GSTIN"],
  ["PHONE"],
  ["EMAIL"],
  ["CLOSING BALANCE", "party-right"],
  ["CREDIT LIMIT", "party-right"],
  ["CREDIT DAYS", "party-center"],
  ["LAST SOLD DATE"],
  ["ADDRESS"],
  ["CREATED AT"],
  ["UPDATED AT"],
];

function PartyRow({ party }) {
  const balance = Number(party?.closingBalance) || 0;

  return (
    <tr
      key={party?._id || party?.tallyExternalId}
      className="party-row"
    >
      <td className="party-td">
        <div style={{ minWidth: "220px" }}>
          <div style={{ fontSize: "12px", fontWeight: 500, color: "#1e3a5f" }}>
            {party?.partyName || "-"}
          </div>
          <div
            style={{
              marginTop: "3px",
              fontSize: "9px",
              color: "#94a3b8",
            }}
          />
        </div>
      </td>
      <td className="party-td">{party?.gstin || "-"}</td>
      <td className="party-td">
        {party?.phone ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>{party.phone}</span>
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="party-td">
        {party?.email ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              maxWidth: "220px",
            }}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {party.email}
            </span>
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="party-td party-right">
        <span style={{ fontWeight: 500, color: "#475569" }}>
          {formatAmount(Math.abs(balance))}
          {balance < 0 ? " Dr" : balance > 0 ? " Cr" : ""}
        </span>
      </td>
      <td className="party-td party-right">
        {formatAmount(party?.creditLimit ?? party?.credit_limit)}
      </td>
      <td className="party-td party-center">
        {party?.creditDays ?? party?.credit_days ?? 0}
      </td>
      <td className="party-td" style={{ whiteSpace: "nowrap" }}>
        {formatDate(party?.lastSoldDate ?? party?.last_sold_date)}
      </td>
      <td
        className="party-td"
        style={{
          minWidth: "360px",
          maxWidth: "500px",
          whiteSpace: "normal",
          wordBreak: "break-word",
          verticalAlign: "top",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        {party?.address ? (
          <div
            style={{
              width: "100%",
              fontSize: "12px",
              lineHeight: "1.5",
              color: "#1c426b",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {party.address}
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="party-td" style={{ whiteSpace: "nowrap" }}>
        {formatDate(party?.createdAt ?? party?.created_at)}
      </td>
      <td className="party-td" style={{ whiteSpace: "nowrap" }}>
        {formatDate(party?.updatedAt ?? party?.updated_at)}
      </td>
    </tr>
  );
}

export default function PartiesTable({
  companyId,
  parties,
  loading,
  search,
}) {
  if (!companyId) return null;

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
        <table
          style={{
            width: "100%",
            minWidth: "1250px",
            borderCollapse: "collapse",
            tableLayout: "auto",
          }}
        >
          <thead>
            <tr style={{ height: "41px", background: "#f5f8fa" }}>
              {columns.map(([label, className]) => (
                <th
                  key={label}
                  className={`party-th ${className || ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    height: "130px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  Loading parties...
                </td>
              </tr>
            ) : parties.length > 0 ? (
              parties.map((party) => (
                <PartyRow
                  key={party?._id || party?.tallyExternalId}
                  party={party}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    height: "130px",
                    textAlign: "center",
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  {search
                    ? `No parties found for "${search}".`
                    : "No parties found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
