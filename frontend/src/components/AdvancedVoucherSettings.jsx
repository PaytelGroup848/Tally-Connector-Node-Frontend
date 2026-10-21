import { useState } from "react";

export const advancedVoucherTabs = [
    "Consignee Details / Ship To",
    "Dispatch Details",
    "Order Details",
  ];

export const advancedVoucherFieldNames = [
    "supplierName",
    "supplierCountry",
    "supplierState",
    "registrationType",
    "postalCode",
    "gstinUin",
    "address",
    "consigneeName",
    "consigneeCountry",
    "consigneeState",
    "consigneePostalCode",
    "consigneeGstinUin",
    "consigneeAddress",
    "dispatchFrom",
    "dispatchThrough",
    "vehicleNo",
    "dispatchDocNo",
    "dispatchDate",
    "orderNo",
    "orderDate",
    "termsOfDelivery",
  ];

export function VoucherField({
    label,
    placeholder,
    name,
    formName = name,
    search = false,
    type,
    className = "",
  }) {
    const inputType =
      type || (name.toLowerCase().endsWith("date") ? "date" : "text");

    return (
      <label className={`relative block min-w-0 ${className}`}>
        <span className="absolute -top-[7px] left-3 z-10 bg-white px-1.5 text-[11px] leading-none text-slate-600">
          {label}
        </span>
        <div className="relative">
          <input
            name={formName}
            type={inputType}
            placeholder={placeholder}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 pr-9 text-xs text-slate-700 outline-none placeholder:text-slate-500 focus:border-green-600 focus:ring-1 focus:ring-green-100"
          />
          {search && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              ⌕
            </span>
          )}
        </div>
      </label>
    );
  }

export function AdvancedVoucherContent({ activeTab }) {
    const fields = {
      "Consignee Details / Ship To": [
        ["consigneeName", "Consignee Name", "Consignee Name", true],
        ["consigneeCountry", "Consignee Country", "Country", false],
        ["consigneeState", "Consignee State", "State", false],
        ["consigneePostalCode", "Postal Code", "Postal Code", false],
        ["consigneeGstinUin", "GSTIN/UIN", "GSTIN/UIN", false],
        ["consigneeAddress", "Address", "Address", false],
      ],
      "Dispatch Details": [
        ["dispatchFrom", "Dispatch From", "Dispatch From", true],
        ["dispatchThrough", "Dispatch Through", "Dispatch Through", false],
        ["vehicleNo", "Vehicle Number", "Vehicle Number", false],
        ["dispatchDocNo", "Dispatch Document No", "Document No", false],
        ["dispatchDate", "Dispatch Date", "Dispatch Date", false],
      ],
      "Order Details": [
        ["orderNo", "Order No", "Order No", false],
        ["orderDate", "Order Date", "Order Date", false],
        ["termsOfDelivery", "Terms Of Delivery", "Terms Of Delivery", false],
      ],
    };

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fields[activeTab].map(([name, label, placeholder, search]) => (
          <VoucherField
            key={name}
            name={name}
            formName={name === "orderDate" ? "advancedOrderDate" : name}
            label={label}
            placeholder={placeholder}
            search={search}
            className={
              name.includes("Address") || name === "termsOfDelivery"
                ? "md:col-span-2 xl:col-span-3"
                : ""
            }
          />
        ))}
      </div>
    );
  }

export function AdvancedVoucherSettings() {
    const [activeTab, setActiveTab] = useState(advancedVoucherTabs[0]);

    return (
      <details className="group rounded-md bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">
          Advanced Settings
          <span className="text-lg leading-none transition group-open:rotate-90">
            ›
          </span>
        </summary>
        <div className="p-3">
          <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2 border-b border-slate-200 px-2">
            {advancedVoucherTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 pb-2 text-xs transition ${activeTab === tab ? "border-sky-500 font-semibold text-sky-500" : "border-transparent text-slate-600 hover:text-slate-900"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          {advancedVoucherTabs.map((tab) => (
            <div
              key={tab}
              className={activeTab === tab ? "" : "hidden"}
              aria-hidden={activeTab !== tab}
            >
              <AdvancedVoucherContent activeTab={tab} />
            </div>
          ))}
        </div>
      </details>
    );
  }
