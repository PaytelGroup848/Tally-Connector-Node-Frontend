export function VoucherFormHeader({ title, isJournalStyleVoucher }) {
  return (
<div className="flex min-h-14 items-center bg-emerald-700 px-4 py-3 text-[17px] font-bold text-white sm:px-5 sm:py-4">
            {isJournalStyleVoucher
              ? `Create ${title}`
              : `Create ${title} Voucher`}
            <div className="ml-auto">
              <button
                type="button"
                className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 hover:text-white"
                onClick={() => {
                  let path = "/";

                  if (title === "Quotation") {
                    path = "/my-quotations";
                  } else if (title === "Sales") {
                    path = "/my-invoices";
                  } else if (title === "Receipt") {
                    path = "/my-receipts";
                  } else if (title === "Payment") {
                    path = "/my-payments";
                  } else if (title === "Sales Order") {
                    path = "/my-sales-order";
                  } else if (title === "Purchase") {
                    path = "/my-purchase";
                  } else if (title === "Purchase Order") {

     path = "/my-purchase-order";
                  } else if (title === "Credit Note") {
                    path = "/my-credit-note";
                  } else if (title === "Debit Note") {
                    path = "/my-debit-note";
                  } else if (title === "Journal") {
                    path = "/my-journal";
                  } else if (title === "Contra") {
                    path = "/my-contra";
                  } else if (title === "Stock Journal") {
                    path = "/my-stock-journal";
                  } else if (title === "Physical Stock") {
                    path = "/my-physical-stock";
                  } else if (title === "Receipt Note") {
                    path = "/my-receipt-note";
                  } else if (title === "Delivery Note") {
                    path = "/my-delivery-note";
                  }

                  window.history.pushState({}, "", path);
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                View status

      </button>
            </div>
          </div>
  );
}
