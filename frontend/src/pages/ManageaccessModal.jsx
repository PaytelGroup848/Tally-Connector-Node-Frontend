import { useMemo, useState } from "react";
import {
  X,
  Check,
  Minus,
  Search,
  ShieldCheck,
  Loader2,
  CircleAlert,
  RotateCcw,
} from "lucide-react";

import { navItems, submenuItems } from "../routes/navigation";
import { updateMemberModules } from "../services/membersApi";

/**
 * Custom checkbox — replaces the native input visually while keeping it
 * fully keyboard/screen-reader accessible (a real <input type="checkbox">
 * sits underneath, just visually hidden).
 */
function CheckBox({ checked, indeterminate, onChange, size = "md" }) {
  const dims = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  const iconDims = size === "sm" ? 12 : 13;

  return (
    <span className={`relative inline-flex ${dims} shrink-0`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[5px] border border-slate-300 bg-white transition-colors checked:border-teal-600 checked:bg-teal-600 indeterminate:border-teal-600 indeterminate:bg-teal-600 hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
        {indeterminate ? (
          <Minus size={iconDims} strokeWidth={3} />
        ) : (
          <Check size={iconDims} strokeWidth={3} />
        )}
      </span>
    </span>
  );
}

export default function ManageAccessModal({
  user,
  accessToken,
  onClose,
  onSuccess,
}) {
  const [selectedKeys, setSelectedKeys] = useState(
    () =>
      new Set(
        Array.isArray(user.allowedModules) && user.allowedModules.length > 0
          ? user.allowedModules
          : navItems.map(([, , , , path]) => path), // default: everything
      ),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const isGroupFullyChecked = (parentPath, children) =>
    selectedKeys.has(parentPath) ||
    children.every(([, p]) => selectedKeys.has(p));

  const isGroupPartiallyChecked = (parentPath, children) =>
    !isGroupFullyChecked(parentPath, children) &&
    children.some(([, p]) => selectedKeys.has(p));

  const toggleSimple = (path) => {
    setSelectedKeys((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const toggleGroup = (parentPath, children) => {
    setSelectedKeys((current) => {
      const next = new Set(current);
      const fullyChecked = isGroupFullyChecked(parentPath, children);
      if (fullyChecked) {
        next.delete(parentPath);
        children.forEach(([, p]) => next.delete(p));
      } else {
        next.add(parentPath);
        children.forEach(([, p]) => next.delete(p));
      }
      return next;
    });
  };

  const toggleChild = (parentPath, childPath, children) => {
    setSelectedKeys((current) => {
      const next = new Set(current);
      const wasFull = next.has(parentPath);

      if (wasFull) {
        next.delete(parentPath);
        children.forEach(([, p]) => {
          if (p !== childPath) next.add(p);
        });
      } else if (next.has(childPath)) {
        next.delete(childPath);
      } else {
        next.add(childPath);
        const allChecked = children.every(([, p]) => next.has(p));
        if (allChecked) {
          children.forEach(([, p]) => next.delete(p));
          next.add(parentPath);
        }
      }
      return next;
    });
  };

  const handleReset = () => {
    setSelectedKeys(new Set(navItems.map(([, , , , path]) => path)));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      await updateMemberModules({
        accessToken,
        id: user.id,
        allowedModules: Array.from(selectedKeys),
      });

      onSuccess(user.id, Array.from(selectedKeys));
      onClose();
    } catch (submitError) {
      setError(submitError?.message || "Failed to update access.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNavItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return navItems;
    return navItems.filter(([, label, , , path]) => {
      if (label.toLowerCase().includes(q)) return true;
      const children = submenuItems[label];
      return children?.some(([childLabel]) =>
        childLabel.toLowerCase().includes(q),
      );
    });
  }, [query]);

  const totalLeaf = useMemo(() => {
    let count = 0;
    navItems.forEach(([, label, , , path]) => {
      const children = submenuItems[label];
      count += children ? children.length : 1;
    });
    return count;
  }, []);

  const selectedLeaf = useMemo(() => {
    let count = 0;
    navItems.forEach(([, label, , , path]) => {
      const children = submenuItems[label];
      if (!children) {
        if (selectedKeys.has(path)) count += 1;
        return;
      }
      if (selectedKeys.has(path)) {
        count += children.length;
      } else {
        count += children.filter(([, p]) => selectedKeys.has(p)).length;
      }
    });
    return count;
  }, [selectedKeys]);

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="flex max-h-[calc(100vh-8rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <ShieldCheck size={18} strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-[17px] font-semibold tracking-tight text-slate-900">
                Manage access
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Choose what{" "}
                <span className="font-medium text-slate-700">{user.email}</span>{" "}
                can see
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 px-6 py-3">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sections..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/15"
            />
          </div>
        </div>

        {/* List */}
        <div className="access-scroll flex-1 space-y-0.5 overflow-y-auto px-4 py-3">
          {filteredNavItems.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-slate-400">
              No sections match &ldquo;{query}&rdquo;
            </p>
          )}

          {filteredNavItems.map(([, label, , , path]) => {
            const children = submenuItems[label];

            if (!children) {
              return (
                <label
                  key={path}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <CheckBox
                    checked={selectedKeys.has(path)}
                    onChange={() => toggleSimple(path)}
                  />
                  {label}
                </label>
              );
            }

            const fullyChecked = isGroupFullyChecked(path, children);
            const partiallyChecked = isGroupPartiallyChecked(path, children);
            const checkedCount = fullyChecked
              ? children.length
              : children.filter(([, p]) => selectedKeys.has(p)).length;

            return (
              <div key={path} className="rounded-lg">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold text-slate-800 transition hover:bg-slate-50">
                  <CheckBox
                    checked={fullyChecked}
                    indeterminate={partiallyChecked}
                    onChange={() => toggleGroup(path, children)}
                  />
                  <span className="flex-1">{label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${
                      checkedCount > 0
                        ? "bg-teal-50 text-teal-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {checkedCount}/{children.length}
                  </span>
                </label>

                <div className="ml-[26px] grid grid-cols-2 gap-x-2 gap-y-0.5 border-l border-slate-150 py-0.5 pl-4 sm:grid-cols-3">
                  {children.map(([itemLabel, itemPath]) => (
                    <label
                      key={itemPath}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] text-slate-600 transition hover:bg-slate-50"
                    >
                      <CheckBox
                        size="sm"
                        checked={fullyChecked || selectedKeys.has(itemPath)}
                        onChange={() => toggleChild(path, itemPath, children)}
                      />
                      <span className="truncate">{itemLabel}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mx-6 mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <CircleAlert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700 tabular-nums">
                {selectedLeaf}
              </span>{" "}
              of {totalLeaf} enabled
            </span>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-slate-600 disabled:opacity-50"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Saving" : "Save access"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .access-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .access-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .access-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .access-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 9999px;
          border: 2px solid white;
        }
        .access-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
