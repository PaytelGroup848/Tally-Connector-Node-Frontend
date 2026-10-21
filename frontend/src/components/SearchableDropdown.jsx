import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function SearchableDropdown({
    name,
    label,
    options,
    placeholder,
    loading = false,
    loadError = "",
    infiniteScroll = false,
    hasMoreOptions = false,
    loadingMore = false,
    loadMoreError = "",
    onLoadMore,
    defaultValue = "",
    value,
    onSelect,
    onOptionSelect,
    onClear,
    resetToken = 0,
    disabled = false,
  }) {
    const [query, setQuery] = useState(value ?? defaultValue);
    const [open, setOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    const dropdownRef = useRef(null);
    const menuRef = useRef(null);
    const loadMoreRef = useRef(onLoadMore);
    const [menuPosition, setMenuPosition] = useState(null);

    useEffect(() => {
      loadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    const updateMenuPosition = () => {
      const input = dropdownRef.current?.querySelector("input");
      if (!input) return;

      const rect = input.getBoundingClientRect();
      setMenuPosition({
        left: rect.left,
        top: rect.bottom + 4,
        width: rect.width,
      });
    };

    useEffect(() => {
      if (value !== undefined) {
        setQuery(value);
      }
    }, [value]);

    useEffect(() => {
      setQuery(value ?? defaultValue ?? "");
      setOpen(false);
      setShowAll(false);
    }, [resetToken]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          !menuRef.current?.contains(event.target)
        ) {
          setOpen(false);
          setShowAll(false);
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);

    useEffect(() => {
      if (!open) {
        setMenuPosition(null);
        return undefined;
      }

      updateMenuPosition();
      const handleViewportChange = () => updateMenuPosition();
      window.addEventListener("resize", handleViewportChange);
      window.addEventListener("scroll", handleViewportChange, true);

      return () => {
        window.removeEventListener("resize", handleViewportChange);
        window.removeEventListener("scroll", handleViewportChange, true);
      };
    }, [open]);

    const filteredOptions = options.filter((option) => {
      const optionText =
        typeof option === "string"
          ? option
          : option?.name ||
            option?.label ||
            option?.partyName ||
            option?.ledgerName ||
            "";

      return String(optionText)
        .toLowerCase()
        .includes(String(query).toLowerCase());
    });

    useEffect(() => {
      if (
        open &&
        infiniteScroll &&
        query &&
        filteredOptions.length === 0 &&
        hasMoreOptions &&
        !loadMoreError &&
        !loadingMore
      ) {
        loadMoreRef.current?.();
      }
    }, [
      infiniteScroll,
      open,
      query,
      filteredOptions.length,
      hasMoreOptions,
      loadMoreError,
      loadingMore,
    ]);

    const visibleOptions = infiniteScroll
      ? filteredOptions
      : showAll
        ? filteredOptions
        : filteredOptions.slice(0, 10);

    return (
      <div ref={dropdownRef} className="relative w-full">
        <input
          name={name}
          value={query}
          autoComplete="off"
          readOnly={disabled}
          onFocus={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
          onChange={(event) => {
            if (disabled) return;

            setQuery(event.target.value);

            onSelect?.(event.target.value);

            setOpen(true);
            setShowAll(false);
          }}
          placeholder={
            loading ? `Loading ${label.toLowerCase()}...` : placeholder
          }
          className={`min-h-9 w-full rounded-md border border-slate-300 px-2.5 pr-14 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 ${
            disabled ? "cursor-not-allowed bg-slate-100" : "bg-white"
          }`}
        />

        {query && !disabled && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              setQuery("");
              setShowAll(false);
              onSelect?.("");
              onClear?.();
            }}
            className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
          >
            ×
          </button>
        )}

        {!disabled && (
          <span className="pointer-events-none absolute right-2.5 top-3 -translate-y-1/2 text-slate-400">
            ⌄
          </span>
        )}

        {open &&
          !disabled &&
          menuPosition &&
          createPortal(
            <div
              ref={menuRef}
              className="fixed z-[1200] max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-xl"
              style={menuPosition}
              onScroll={(event) => {
                if (!infiniteScroll) return;
                const menu = event.currentTarget;
                if (
                  menu.scrollTop + menu.clientHeight >=
                  menu.scrollHeight - 40
                ) {
                  loadMoreRef.current?.();
                }
              }}
            >
              <div>
                {visibleOptions.length > 0 ? (
                  visibleOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setQuery(option);
                        onSelect?.(option);
                        onOptionSelect?.(option);
                        setOpen(false);
                        setShowAll(false);
                      }}
                      className="block w-full rounded px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-green-50"
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-slate-500">
                    {loadError || "No matching options."}
                  </p>
                )}
                {visibleOptions.length > 0 && loadError && (
                  <p className="border-t border-slate-100 px-3 py-2 text-xs text-red-600">
                    {loadError}
                  </p>
                )}

                {!infiniteScroll && !showAll && filteredOptions.length > 10 && (
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setShowAll(true)}
                    className="mt-1 w-full border-t border-slate-100 px-3 py-2 text-center text-[11px] font-semibold text-green-700 hover:bg-green-50"
                  >
                    Show more ({filteredOptions.length - 10})
                  </button>
                )}
                {infiniteScroll && loadingMore && (
                  <p className="px-3 py-2 text-center text-xs text-slate-500">
                    Loading more {label.toLowerCase()}...
                  </p>
                )}
                {infiniteScroll && loadMoreError && (
                  <div className="border-t border-slate-100 px-3 py-2 text-xs text-red-600">
                    <p>{loadMoreError}</p>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => loadMoreRef.current?.()}
                      className="mt-1 font-semibold text-green-700 hover:text-green-800"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  }
