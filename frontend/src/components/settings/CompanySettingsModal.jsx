import { useEffect, useRef, useState } from "react";
import { X, User, Pencil, Trash2, Upload, Save, ArrowLeft } from "lucide-react";
import useAuthStore from "../../store/authStore";
import {
  deleteCompanyLogo,
  fetchCompanySettings,
  getCompanyLogoUrl,
  updateCompanySettings,
  uploadCompanyLogo,
  getCompanySignatureUrl,
  uploadCompanySignature,
  deleteCompanySignature,
} from "../../services/CompanyDetailsAndBanksApi";
import {
  COMPANY_SETTING_FIELDS,
  FIELD_RULES,
  validateSettings,
  getSettingsFormValues,
  normalizeWebsite,
  flattenSettings,
} from "./settingsHelpers";

const CompanyLogo = ({ src, name, size = "h-28 w-28", iconSize = 44 }) =>
  src ? (
    <img
      src={src}
      alt={`${name || "Company"} logo`}
      className={`${size} rounded-full border border-slate-200 bg-white object-contain p-2 shadow-sm`}
    />
  ) : (
    <div
      role="img"
      aria-label="No company logo"
      className={`${size} flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400`}
    >
      <User size={iconSize} strokeWidth={1.5} />
    </div>
  );

export default function CompanySettingsModal({ company, onClose }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [companySettings, setCompanySettings] = useState(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsForm, setSettingsForm] = useState(() =>
    getSettingsFormValues(null),
  );
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaveMessage, setSettingsSaveMessage] = useState("");
  const [settingsSaveError, setSettingsSaveError] = useState("");
  const [settingsFieldErrors, setSettingsFieldErrors] = useState({});

  const [logoUrl, setLogoUrl] = useState("");
  const [logoBusy, setLogoBusy] = useState(false);
  const [logoError, setLogoError] = useState("");

  const [signatureUrl, setSignatureUrl] = useState("");
  const [signatureBusy, setSignatureBusy] = useState(false);
  const [signatureError, setSignatureError] = useState("");

  const settingsRequestRef = useRef(0);

  // Load settings on open
  useEffect(() => {
    if (!company?.id || !accessToken) return;

    const requestId = ++settingsRequestRef.current;
    setSettingsLoading(true);
    setSettingsError("");

    fetchCompanySettings(accessToken, company.id)
      .then((response) => {
        if (requestId !== settingsRequestRef.current) return;
        setCompanySettings(response);
        setSettingsForm(getSettingsFormValues(response, company));
        setLogoUrl(getCompanyLogoUrl(response) || getCompanyLogoUrl(company));
        setSignatureUrl(
          getCompanySignatureUrl(response) || getCompanySignatureUrl(company),
        );
      })
      .catch((error) => {
        if (requestId !== settingsRequestRef.current) return;
        setSettingsError(error?.message || "Unable to load company settings.");
      })
      .finally(() => {
        if (requestId === settingsRequestRef.current) {
          setSettingsLoading(false);
        }
      });

    return () => {
      settingsRequestRef.current += 1;
    };
  }, [company?.id, accessToken]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!company?.id || !accessToken) return;

    const normalized = { ...settingsForm };
    for (const [name, rule] of Object.entries(FIELD_RULES)) {
      normalized[name] = rule.transform(String(normalized[name] ?? "")).trim();
    }

    const errors = validateSettings(normalized);
    setSettingsFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSettingsSaveError("Please fix the highlighted fields.");
      return;
    }

    const requestId = settingsRequestRef.current;
    setSettingsSaving(true);
    setSettingsSaveMessage("");
    setSettingsSaveError("");

    try {
      const settingsToSave = {
        ...normalized,
        website: normalizeWebsite(normalized.website || ""),
      };
      await updateCompanySettings(accessToken, company.id, settingsToSave);
      if (requestId !== settingsRequestRef.current) return;
      setCompanySettings({
        data: {
          ...settingsToSave,
          ...(logoUrl ? { logoUrl } : {}),
        },
      });
      setSettingsForm(settingsToSave);
      setSettingsSaveMessage("Settings saved successfully.");
      setEditingSettings(false);
    } catch (error) {
      if (requestId !== settingsRequestRef.current) return;
      setSettingsSaveError(
        error?.message || "Unable to save company settings.",
      );
    } finally {
      if (requestId === settingsRequestRef.current) {
        setSettingsSaving(false);
      }
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !company?.id || !accessToken) return;

    setLogoBusy(true);
    setLogoError("");
    try {
      const response = await uploadCompanyLogo(accessToken, company.id, file);
      const updated = await fetchCompanySettings(accessToken, company.id);
      setCompanySettings(updated);
      setLogoUrl(
        getCompanyLogoUrl(updated) ||
          getCompanyLogoUrl(response) ||
          getCompanyLogoUrl(company),
      );
    } catch (error) {
      setLogoError(error?.message || "Unable to upload logo.");
    } finally {
      setLogoBusy(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!company?.id || !accessToken) return;
    setLogoBusy(true);
    setLogoError("");
    try {
      await deleteCompanyLogo(accessToken, company.id);
      setLogoUrl("");
    } catch (error) {
      setLogoError(error?.message || "Unable to delete logo.");
    } finally {
      setLogoBusy(false);
    }
  };

  const handleSignatureUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !company?.id || !accessToken) return;

    setSignatureBusy(true);
    setSignatureError("");
    try {
      const response = await uploadCompanySignature(
        accessToken,
        company.id,
        file,
      );
      const updated = await fetchCompanySettings(accessToken, company.id);
      setCompanySettings(updated);
      setSignatureUrl(
        getCompanySignatureUrl(updated) ||
          getCompanySignatureUrl(response) ||
          getCompanySignatureUrl(company),
      );
    } catch (error) {
      setSignatureError(error?.message || "Unable to upload signature.");
    } finally {
      setSignatureBusy(false);
    }
  };

  const handleSignatureDelete = async () => {
    if (!company?.id || !accessToken) return;
    setSignatureBusy(true);
    setSignatureError("");
    try {
      await deleteCompanySignature(accessToken, company.id);
      setSignatureUrl("");
    } catch (error) {
      setSignatureError(error?.message || "Unable to delete signature.");
    } finally {
      setSignatureBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="flex max-h-[85vh] w-full max-w-8xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Company Settings
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {company?.name || "Company"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto p-5">
          {settingsLoading ? (
            <p className="text-sm text-slate-500" role="status">
              Loading company settings...
            </p>
          ) : settingsError ? (
            <p className="text-sm text-red-600" role="alert">
              {settingsError}
            </p>
          ) : !editingSettings ? (
            <div className="space-y-4">
              {settingsSaveMessage && (
                <p className="text-sm text-emerald-700" role="status">
                  {settingsSaveMessage}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsForm(
                      getSettingsFormValues(companySettings, company),
                    );
                    setSettingsSaveMessage("");
                    setSettingsSaveError("");
                    setSettingsFieldErrors({});
                    setEditingSettings(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Pencil size={16} /> Edit Settings
                </button>
              </div>

              <div className="flex justify-center">
                <CompanyLogo src={logoUrl} name={company?.name} />
              </div>

              {signatureUrl && (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Authorised Signature
                  </p>
                  <img
                    src={signatureUrl}
                    alt="Signature"
                    className="h-20 max-w-[240px] rounded border border-slate-100 bg-white object-contain p-1"
                  />
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-max border-collapse text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {flattenSettings(companySettings).map((row, i) => (
                        <th
                          key={`${row.key}-${i}`}
                          className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-700 last:border-r-0"
                        >
                          {row.key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    <tr className="hover:bg-slate-50">
                      {flattenSettings(companySettings).map((row, i) => (
                        <td
                          key={`${row.key}-${i}`}
                          className="max-w-xs break-words border-r border-slate-100 px-4 py-3 text-slate-800 last:border-r-0"
                        >
                          {row.value ?? "—"}
                        </td>
                      ))}
                    </tr>

                    {flattenSettings(companySettings).length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-center text-slate-500">
                          No company settings available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSave}>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsForm(
                      getSettingsFormValues(companySettings, company),
                    );
                    setSettingsSaveMessage("");
                    setSettingsSaveError("");
                    setSettingsFieldErrors({});
                    setEditingSettings(false);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </div>

              {/* Logo upload */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="flex justify-center text-sm font-semibold text-slate-800">
                  Company Logo
                </h3>
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="mx-auto mt-3 h-24 w-24 rounded-full border border-slate-200 bg-white object-contain p-2"
                  />
                )}
                <div className="flex justify-center mt-3 flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Upload size={16} />
                    {logoBusy ? "Please wait..." : "Upload logo"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={logoBusy}
                      onChange={handleLogoUpload}
                      className="sr-only"
                    />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      disabled={logoBusy}
                      onClick={handleLogoDelete}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> Delete logo
                    </button>
                  )}
                </div>
                {logoError && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {logoError}
                  </p>
                )}
              </div>

              {/* Signature upload */}
              <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="flex justify-center text-sm font-semibold text-slate-800">
                  Authorised Signature
                </h3>
                {signatureUrl && (
                  <img
                    src={signatureUrl}
                    alt="Signature"
                    className="mx-auto mt-3 h-20 max-w-[240px] rounded border border-slate-200 bg-white object-contain p-2"
                  />
                )}
                <div className="flex justify-center mt-3 flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Upload size={16} />
                    {signatureBusy ? "Please wait..." : "Upload signature"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={signatureBusy}
                      onChange={handleSignatureUpload}
                      className="sr-only"
                    />
                  </label>
                  {signatureUrl && (
                    <button
                      type="button"
                      disabled={signatureBusy}
                      onClick={handleSignatureDelete}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> Delete signature
                    </button>
                  )}
                </div>
                {signatureError && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {signatureError}
                  </p>
                )}
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {COMPANY_SETTING_FIELDS.map((field) => {
                  const error = settingsFieldErrors[field.name];
                  const rule = FIELD_RULES[field.name];
                  const borderClass = error
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-violet-500 focus:ring-violet-100";

                  const handleChange = (event) => {
                    const value = rule
                      ? rule.transform(event.target.value)
                      : event.target.value;

                    setSettingsForm((current) => {
                      const next = { ...current, [field.name]: value };
                      if (field.name === "gstin" && /^\d{2}/.test(value)) {
                        next.stateCode = value.slice(0, 2);
                      }
                      return next;
                    });

                    setSettingsFieldErrors((current) => ({
                      ...current,
                      [field.name]: undefined,
                      ...(field.name === "gstin"
                        ? { stateCode: undefined }
                        : {}),
                    }));
                  };

                  return (
                    <label
                      key={field.name}
                      className={`block ${
                        field.type === "textarea" ? "sm:col-span-2" : ""
                      }`}
                    >
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500"> *</span>
                        )}
                      </span>

                      {field.type === "textarea" ? (
                        <div>
                          <textarea
                            rows={10}
                            maxLength={800}
                            value={settingsForm[field.name]}
                            onChange={handleChange}
                            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 ${borderClass}`}
                          />
                          <span className="mt-1 block text-right text-xs text-slate-500">
                            {settingsForm[field.name].length}/800
                          </span>
                        </div>
                      ) : (
                        <input
                          required={field.required}
                          type={field.type}
                          inputMode={
                            field.name === "website"
                              ? "url"
                              : field.name === "mobile"
                                ? "numeric"
                                : undefined
                          }
                          maxLength={rule?.maxLength}
                          aria-invalid={Boolean(error)}
                          value={settingsForm[field.name]}
                          onChange={handleChange}
                          onBlur={
                            field.name === "website"
                              ? (event) =>
                                  setSettingsForm((current) => ({
                                    ...current,
                                    website: normalizeWebsite(
                                      event.target.value,
                                    ),
                                  }))
                              : undefined
                          }
                          className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-2 ${borderClass}`}
                        />
                      )}

                      {error && (
                        <span
                          className="mt-1 block text-xs text-red-600"
                          role="alert"
                        >
                          {error}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {settingsSaveError && (
                <p className="text-sm text-red-600" role="alert">
                  {settingsSaveError}
                </p>
              )}
              {settingsSaveMessage && (
                <p className="text-sm text-emerald-700" role="status">
                  {settingsSaveMessage}
                </p>
              )}

              <div className="flex justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSettingsForm(
                      getSettingsFormValues(companySettings, company),
                    );
                    setSettingsSaveMessage("");
                    setSettingsSaveError("");
                    setSettingsFieldErrors({});
                    setEditingSettings(false);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settingsSaving || logoBusy}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {settingsSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
