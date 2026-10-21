import { SearchableDropdown } from "./SearchableDropdown";

export function VoucherItemsTable(props) {
  const { addItemRow, calculateRowAmount, deleteItemRow, getNativeDropdownPaginationProps, getPaginationProps, godownOptions, handleItemSelect, isCreditNote, isDebitNote, isOptionsLoading, isSalesInvoice, isSalesOrder, itemOptions, itemRows, loadMoreOnNativeDropdownSelection, stockError, title, updateItemRow, updateItemRowValues } = props;
  return (
<div className="relative z-10 mt-5 overflow-visible rounded-lg border border-slate-200 bg-white">
                  <div className="overflow-x-auto lg:overflow-visible">
                    <div className="min-w-[1280px] lg:min-w-0">
                      {/* Table Header */}
                      <div className="grid grid-cols-[1.45fr_.55fr_.7fr_.7fr_.65fr_.9fr_1fr_1.4fr_.9fr_.6fr_.5fr] border-b border-slate-200 bg-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                        <div className="border-r border-slate-200 px-2.5 py-3">
                          Items
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Qty
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Rate
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Units
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Disc %
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          HSN Code
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Godown
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Description (optional)
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Amount
                        </div>

                        <div className="border-r border-slate-200 px-2 py-3 text-center">
                          Tax Incl.
                        </div>

                        <button
                          type="button"
                          title="Add new item row"
                          aria-label="Add new item row"
                          onClick={addItemRow}
                          className="flex min-h-full items-center justify-center bg-[#1a1f24] px-2 py-3 text-base font-bold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                          +
                        </button>
                      </div>

                      {/* Dynamic Rows */}
                      {itemRows.map((row, index) => {
                        const amount = calculateRowAmount(row);

                        return (
                          <div key={row.id}>
                            <div
                              className={`grid grid-cols-[1.45fr_.55fr_.7fr_.7fr_.65fr_.9fr_1fr_1.4fr_.9fr_.6fr_.5fr] items-stretch border-b border-slate-200 bg-white last:border-b-0 ${
                                index % 2 === 1 ? "bg-slate-[25]" : "bg-white"
                              }`}
                            >
                              {/* Item */}
                              <div className="flex min-w-0 items-center border-r border-slate-200 p-1.5">
                                {title === "Quotation" ||
                                isSalesInvoice ||
                                isSalesOrder ||
                                title === "Purchase Order" ||
                                isCreditNote ||
                                isDebitNote ? (
                                  <SearchableDropdown
                                    name={`item-${row.id}`}
                                    label="items"
                                    options={itemOptions}
                                    {...getPaginationProps("stock")}
                                    placeholder={stockError || "Search item"}
                                    loading={isOptionsLoading}
                                    value={row.item}
                                    onSelect={(itemName) =>
                                      handleItemSelect(row.id, itemName)
                                    }
                                    onClear={() =>
                                      updateItemRowValues(row.id, {
                                        item: "",
                                        quantity: "0",
                                        rate: "",
                                        units: "",
                                        hsnCode: "",
                                      })
                                    }
                                  />
                                ) : (
                                  <select
                                    name={`item-${row.id}`}
                                    value={row.item}
                                    {...getNativeDropdownPaginationProps("stock")}
                                    onChange={(event) => {
                                      handleItemSelect(
                                        row.id,
                                        event.target.value,
                                      );
                                      loadMoreOnNativeDropdownSelection(
                                        event,
                                        "stock",
                                      );
                                    }}
                                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                  >
                                    <option value="">
                                      {isOptionsLoading
                                        ? "Loading items..."
                                        : "Select Item"}
                                    </option>

                                    {itemOptions.map((name) => (
                                      <option key={name} value={name}>
                                        {name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </div>

                              {/* Quantity */}
                              <div className="relative flex items-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`quantity-${row.id}`}
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={row.quantity}
                                  onChange={(event) =>
                                    updateItemRow(
                                      row.id,
                                      "quantity",
                                      event.target.value,
                                    )
                                  }
                                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />

                                {row.quantity && (
                                  <button
                                    type="button"
                                    aria-label="Clear quantity"
                                    onClick={() =>
                                      updateItemRow(row.id, "quantity", "")
                                    }
                                    className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>

                              {/* Rate */}
                              <div className="relative flex items-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`rate-${row.id}`}
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={row.rate}
                                  onChange={(event) =>
                                    updateItemRow(
                                      row.id,
                                      "rate",
                                      event.target.value,
                                    )
                                  }
                                  placeholder="0"
                                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />

                                {row.rate && (
                                  <button
                                    type="button"
                                    aria-label="Clear rate"
                                    onClick={() =>
                                      updateItemRow(row.id, "rate", "")
                                    }
                                    className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>

                              {/* Units - Simple Text Input */}
                              <div className="relative flex items-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`units-${row.id}`}
                                  type="text"
                                  value={row.units}
                                  onChange={(event) =>
                                    updateItemRow(
                                      row.id,
                                      "units",
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Units"
                                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 pr-7 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />

                                {row.units && (
                                  <button
                                    type="button"
                                    aria-label="Clear units"
                                    onClick={() =>
                                      updateItemRow(row.id, "units", "")
                                    }
                                    className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>

                              {/* Discount */}
                              <div className="flex items-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`discount-${row.id}`}
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={row.discount}
                                  onChange={(event) =>
                                    updateItemRow(
                                      row.id,
                                      "discount",
                                      event.target.value,
                                    )
                                  }
                                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                              </div>

                              {/* HSN */}
                              <div className="flex items-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`hsnCode-${row.id}`}
                                  value={row.hsnCode}
                                  onChange={(event) =>
                                    updateItemRow(
                                      row.id,
                                      "hsnCode",
                                      event.target.value,
                                    )
                                  }
                                  placeholder=""
                                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                              </div>

                              {/* Godown */}
                              <div className="flex min-w-0 items-center border-r border-slate-200 p-1.5">
                                {title === "Quotation" ||
                                isSalesInvoice ||
                                isSalesOrder ||
                                title === "Purchase" ||
                                title === "Purchase Order" ||
                                title === "Receipt Note" ||
                                title === "Delivery Note" ||
                                isCreditNote ||
                                isDebitNote ? (
                                  <SearchableDropdown
                                    name={`godown-${row.id}`}
                                    label="godowns"
                                    options={godownOptions}
                                    {...getPaginationProps("godowns")}
                                    placeholder="Search Godown"
                                    loading={isOptionsLoading}
                                    value={row.godown}
                                    onSelect={(value) =>
                                      updateItemRow(row.id, "godown", value)
                                    }
                                    onClear={() =>
                                      updateItemRow(row.id, "godown", "")
                                    }
                                  />
                                ) : (
                                  <input
                                    name={`godown-${row.id}`}
                                    value={row.godown}
                                    onChange={(event) =>
                                      updateItemRow(
                                        row.id,
                                        "godown",
                                        event.target.value,
                                      )
                                    }
                                    placeholder="Search Godown"
                                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                  />
                                )}
                              </div>

                              {/* Description */}
                              <div className="flex items-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`description-${row.id}`}
                                  value={row.description}
                                  onChange={(event) =>
                                    updateItemRow(
                                      row.id,
                                      "description",
                                      event.target.value,
                                    )
                                  }
                                  placeholder="Enter Notes"
                                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                />
                              </div>

                              {/* Amount */}
                              <div className="relative flex items-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`amount-${row.id}`}
                                  type="number"
                                  value={amount}
                                  readOnly
                                  className="h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-xs font-medium text-slate-700 outline-none"
                                />

                                <button
                                  type="button"
                                  aria-label="Clear amount"
                                  onClick={() =>
                                    updateItemRowValues(row.id, {
                                      quantity: "",
                                      rate: "",
                                    })
                                  }
                                  className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                                >
                                  ×
                                </button>
                              </div>

                              {/* Tax Inclusive */}
                              <div className="flex items-center justify-center border-r border-slate-200 p-1.5">
                                <input
                                  name={`taxInclusive-${row.id}`}
                                  type="checkbox"
                                  title="Checked: calculate GST included in rate; unchecked: no GST"
                                  checked={row.taxInclusive}
                                  onChange={(event) =>
                                    updateItemRow(
                                      row.id,
                                      "taxInclusive",
                                      event.target.checked,
                                    )
                                  }
                                  className="h-4 w-4 cursor-pointer accent-green-600"
                                />
                              </div>

                              {/* Delete */}
                              <div className="flex items-center justify-center p-1.5">
                                <button
                                  type="button"
                                  aria-label={`Delete item row ${index + 1}`}
                                  title="Delete row"
                                  onClick={() => deleteItemRow(row.id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Row Footer */}
                  <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-xs text-slate-500">
                      {itemRows.length}{" "}
                      {itemRows.length === 1 ? "item row" : "item rows"}
                    </span>

                    <button
                      type="button"
                      onClick={addItemRow}
                      className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                      <span className="text-sm leading-none">+</span>
                      Add Item
                    </button>
                  </div>
                </div>
  );
}
