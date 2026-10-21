export default function PartiesStyles() {
  return (
    <style>
      {`
        .party-th {
          height: 41px;
          padding: 0 20px;
          border-bottom: 1px solid #e7edf2;
          text-align: left;
          white-space: nowrap;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #4f6985;
        }

        .party-td {
          height: 45px;
          padding: 0 20px;
          border-bottom: 1px solid #edf2f6;
          font-size: 12px;
          color: #1c426b;
          vertical-align: middle;
        }

        .party-right {
          text-align: right;
        }

        .party-center {
          text-align: center;
        }

        .party-row {
          background: #ffffff;
          transition: background 0.15s ease;
        }

        .party-row:hover {
          background: #f8fafc;
        }

        @media (max-width: 767px) {
          .toolbar-shell {
            height: auto !important;
            min-height: auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
            padding: 8px 10px !important;
          }

          .toolbar-left,
          .toolbar-right {
            width: 100% !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            min-width: 0 !important;
          }

          .toolbar-left {
            gap: 6px !important;
          }

          .toolbar-search {
            width: 100% !important;
            min-width: 0 !important;
            flex: 1 1 auto !important;
          }

          .toolbar-show {
            flex-shrink: 0 !important;
            justify-content: flex-start !important;
            gap: 4px !important;
          }

          .toolbar-select {
            width: 56px !important;
            min-width: 56px !important;
            flex: 0 0 auto !important;
          }

          .toolbar-right {
            justify-content: space-between !important;
            gap: 6px !important;
          }

          .page-meta {
            white-space: nowrap !important;
            line-height: 1.2;
            font-size: 10px !important;
          }

          .add-party-btn {
            width: auto !important;
            justify-content: center !important;
            flex: 0 0 auto !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
            white-space: nowrap !important;
          }

          .party-th,
          .party-td {
            padding: 0 14px;
          }
        }
      `}
    </style>
  );
}
