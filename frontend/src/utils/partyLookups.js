import { getDisplayValue } from "./stockLookups";

export const getVoucherValue = (voucher, keys) => {
      const normalizedKeys = keys.map((key) =>
        key.toLowerCase().replace(/[^a-z0-9]/g, ""),
      );

      const findNormalizedValue = (entry) => {
        if (!entry || typeof entry !== "object") {
          return "";
        }

        const matchingKey = Object.keys(entry).find((key) =>
          normalizedKeys.includes(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
        );

        if (!matchingKey) {
          return "";
        }

        const value = entry[matchingKey];

        if (value && typeof value === "object") {
          return getDisplayValue(value, [
            "name",
            "partyName",
            "partyLedger",
            "ledgerName",
            "displayName",
            "value",
          ]);
        }

        return String(value ?? "").trim();
      };

      const candidates = [
        voucher,
        voucher?.payload,
        voucher?.data,
        voucher?.voucher,
        voucher?.payload?.data,
        voucher?.payload?.voucher,
      ];

      return candidates.map(findNormalizedValue).find(Boolean) || "";
    };

export const findVoucherNumberForParty = (vouchers, party) => {
      const normalizeParty = (value) =>
        String(value || "")
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

      const selectedPartyValue = normalizeParty(party);

      const matchingVoucher = vouchers.find(
        (voucher) =>
          normalizeParty(
            getVoucherValue(voucher, [
              "partyLedger",
              "party ledger",
              "partyName",
              "ledgerName",
              "party",
              "customerName",
            ]),
          ) === selectedPartyValue,
      );

      return matchingVoucher
        ? getVoucherValue(matchingVoucher, [
            "voucherNumber",
            "voucherNo",
            "voucher no",
            "voucher_no",
            "number",
          ])
        : "";
    };

export const findLedgerGstin = (ledgers, customers, party) => {
      const normalizeParty = (value) =>
        String(value || "")
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

      const selectedPartyValue = normalizeParty(party);

      const matchingLedger = ledgers.find((ledger) => {
        const ledgerName = normalizeParty(
          getDisplayValue(ledger, [
            "ledgerName",
            "name",
            "displayName",
            "partyName",
          ]),
        );
        return ledgerName === selectedPartyValue;
      });

      if (matchingLedger) {
        const gstin =
          matchingLedger.gstin ||
          matchingLedger.GSTIN ||
          matchingLedger.gstNo ||
          matchingLedger.raw?.gstin ||
          "";
        return String(gstin || "").trim();
      }

      const matchingCustomer = customers.find((customer) => {
        const customerName = normalizeParty(
          getDisplayValue(customer, [
            "name",
            "customerName",
            "partyName",
            "ledgerName",
            "displayName",
          ]),
        );
        return customerName === selectedPartyValue;
      });

      if (matchingCustomer) {
        const gstin =
          matchingCustomer.gstin ||
          matchingCustomer.GSTIN ||
          matchingCustomer.gstNo ||
          "";
        return String(gstin || "").trim();
      }

      return "";
    };
