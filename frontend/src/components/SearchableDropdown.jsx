import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MENU_MAX_HEIGHT = 288;
const DROPDOWN_PAGE_SIZE = 20; // same as Tailwind max-h-72
const DEBOUNCE_DELAY = 700;
// Works for string options and object options.
const getOptionText = (option) =>
  typeof option === "string"
    ? option
    : option?.name ||
      option?.label ||
      option?.partyName ||
      option?.ledgerName ||
      "";

export function SearchableDropdown({
  name,
  label = "options",
  options = [],
  placeholder,
  loading = false,
  loadError = "",
  infiniteScroll = true,
  hasMoreOptions = false,
  loadingMore = false,
  loadMoreError = "",
  onLoadMore,
  defaultValue = "",
  value,
  onSelect, // fires on typing AND on picking (unchanged behaviour)
  onOptionSelect, // fires only on picking; receives the full option (string or object)
  onInputChange, // fires only on typing
  onClear, // fires when the input is emptied
  resetToken = 0,
  disabled = false,
  showAllValues,
}) {
  const [query, setQuery] = useState(value ?? defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(DROPDOWN_PAGE_SIZE);
  // true only after the user types; until then the full list is shown
  const [dirty, setDirty] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const loadMoreRef = useRef(onLoadMore);
  const listboxId = useId();
  const onInputChangeRef = useRef(onInputChange);

  useEffect(() => {
    onInputChangeRef.current = onInputChange;
  }, [onInputChange]);

  useEffect(() => {
    if (!dirty) return;

    const timer = setTimeout(() => {
      onInputChangeRef.current?.(query);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query, dirty, resetToken]);
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const closeMenu = () => {
    setOpen(false);
    setShowAll(false);
    setDirty(false);
    setActiveIndex(-1);
    setVisibleCount(DROPDOWN_PAGE_SIZE);
  };
  const openMenu = () => {
    updateMenuPosition();
    setOpen(true);
    setShowAll(false);
  };

  const updateMenuPosition = () => {
    const input = dropdownRef.current?.querySelector("input");
    if (!input) return;

    const rect = input.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;

    setMenuPosition(
      openUp
        ? {
            left: rect.left,
            bottom: window.innerHeight - rect.top + 4,
            width: rect.width,
            maxHeight: Math.min(MENU_MAX_HEIGHT, spaceAbove),
          }
        : {
            left: rect.left,
            top: rect.bottom + 4,
            width: rect.width,
            maxHeight: Math.min(MENU_MAX_HEIGHT, spaceBelow),
          },
    );
  };

  // Sync with controlled value
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  // Reset when the parent bumps resetToken.
  // Intentionally depends only on resetToken: value/defaultValue are read
  // at reset time, not tracked.
  useEffect(() => {
    setQuery(value ?? defaultValue ?? "");
    setOpen(false);
    setShowAll(false);
    setDirty(false);
    setActiveIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setDirty(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keep the portal menu aligned with the input
  useEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return undefined;
    }

    updateMenuPosition();
    const handleResize = () => updateMenuPosition();
    const handleScroll = (event) => {
      // scrolling inside the menu itself should not reposition it
      if (menuRef.current?.contains(event.target)) return;
      updateMenuPosition();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  // Keep the displayed filter in sync with the debounced server search.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);
  // Filter only after the user starts typing, so reopening a field that
  // already has a selected value still shows every option.
  const filteredOptions =
    dirty && debouncedQuery
      ? options.filter((option) =>
          getOptionText(option)
            .toLowerCase()
            .includes(String(debouncedQuery).toLowerCase()),
        )
      : options;

  const isServerPagination = infiniteScroll && typeof onLoadMore === "function";

  const visibleOptions = isServerPagination
    ? filteredOptions
    : showAll
      ? filteredOptions
      : filteredOptions.slice(0, visibleCount);

  const loadMoreOptions = () => {
    if (isServerPagination) {
      if (hasMoreOptions && !loadingMore && !loadMoreError) {
        loadMoreRef.current?.();
      }
      return;
    }

    setVisibleCount((prev) =>
      Math.min(prev + DROPDOWN_PAGE_SIZE, filteredOptions.length),
    );
  };

  const hasMoreLocalOptions =
    !isServerPagination && visibleCount < filteredOptions.length;

  // Infinite scroll: if the loaded options don't fill the menu there is
  // nothing to scroll, so keep loading until it overflows or no more remain.
  useEffect(() => {
    if (!open || !menuPosition) return;

    const menu = menuRef.current;

    if (!menu) return;

    if (menu.scrollHeight > menu.clientHeight + 1) return;

    if (isServerPagination) {
      if (hasMoreOptions && !loadingMore && !loadMoreError) {
        loadMoreRef.current?.();
      }
    } else if (hasMoreLocalOptions) {
      setVisibleCount((prev) =>
        Math.min(prev + DROPDOWN_PAGE_SIZE, filteredOptions.length),
      );
    }
  }, [
    open,
    menuPosition?.maxHeight,
    isServerPagination,
    hasMoreOptions,
    loadingMore,
    loadMoreError,
    hasMoreLocalOptions,
    visibleOptions.length,
    filteredOptions.length,
  ]);

  // Keep the keyboard-highlighted option in view
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    menuRef.current
      ?.querySelector(`[data-option-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const selectOption = (option) => {
    const text = getOptionText(option);
    setQuery(text);
    onSelect?.(text);
    onOptionSelect?.(option); // full option, so callers get ids, GST info, etc.
    closeMenu();
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openMenu();
          return;
        }
        if (visibleOptions.length > 0) {
          setActiveIndex((i) => (i + 1) % visibleOptions.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openMenu();
          return;
        }
        if (visibleOptions.length > 0) {
          setActiveIndex((i) => (i <= 0 ? visibleOptions.length - 1 : i - 1));
        }
        break;
      case "Enter":
        if (
          open &&
          activeIndex >= 0 &&
          visibleOptions[activeIndex] !== undefined
        ) {
          event.preventDefault(); // don't submit the surrounding form
          selectOption(visibleOptions[activeIndex]);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          closeMenu();
        }
        break;
      case "Tab":
        closeMenu();
        break;
      default:
        break;
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full cursor-pointer">
      <input
        name={name}
        value={query}
        autoComplete="off"
        readOnly={disabled}
        role="combobox"
        aria-expanded={open && !disabled}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        }
        onClick={() => {
          if (disabled) return;
          openMenu();
        }}
        onFocus={() => {
          if (!disabled) {
            updateMenuPosition();
            setOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          if (disabled) return;

          const next = event.target.value;
          setQuery(next);
          setDirty(true);
          setActiveIndex(-1);
          setVisibleCount(DROPDOWN_PAGE_SIZE);
          onSelect?.(next);

          if (!next) {
            onClear?.();
          }
          openMenu();
        }}
        placeholder={
          loading ? `Loading ${label.toLowerCase()}...` : placeholder
        }
        className={`min-h-9 w-full rounded-md border border-slate-300 px-2.5 pr-8 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 ${
          disabled
            ? "cursor-not-allowed bg-slate-100"
            : "cursor-pointer bg-white"
        }`}
      />

      {!disabled && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Toggle ${label} dropdown`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (open) {
              closeMenu();
            } else {
              openMenu();
            }
          }}
          className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-r-md text-slate-400 hover:text-slate-700"
        >
          <span className="text-xs">⌄</span>
        </button>
      )}

      {open &&
        !disabled &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            className="fixed z-[1200] overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-xl"
            style={menuPosition}
            onScroll={(event) => {
              const menu = event.currentTarget;

              const reachedBottom =
                menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 40;

              if (!reachedBottom) return;

              loadMoreOptions();
            }}
          >
            <div>
              {visibleOptions.length > 0 ? (
                visibleOptions.map((option, index) => {
                  const text = getOptionText(option);
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={`${text}-${index}`}
                      id={`${listboxId}-${index}`}
                      data-option-index={index}
                      role="option"
                      aria-selected={isActive}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectOption(option)}
                      className={`block w-full rounded px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-green-50 ${
                        isActive ? "bg-green-50" : ""
                      }`}
                    >
                      {text}
                    </button>
                  );
                })
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

              {!infiniteScroll &&
                !showAllValues &&
                !showAll &&
                filteredOptions.length > visibleCount && (
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
