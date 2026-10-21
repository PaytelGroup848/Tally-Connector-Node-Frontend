import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Settings,
  Landmark,
  ChevronRight,
  X,
  User,
  Pencil,
  Trash2,
  Star,
  Upload,
  Save,
  Plus,
  ArrowLeft,
} from "lucide-react";

import useAuthStore from "../store/authStore";
import {
  deleteCompanyLogo,
  deleteCompanyBank,
  createCompanyBank,
  fetchCompanyBanks,
  fetchCompanySettings,
  setDefaultCompanyBank,
  getCompanyLogoUrl,
  updateCompanyBank,
  updateCompanySettings,
  uploadCompanyLogo,
  getCompanySignatureUrl,
  uploadCompanySignature,
  deleteCompanySignature,
} from "../services/CompanyDetailsAndBanksApi";

import { fetchCompanyBank, extractBank } from "../services/companiesApi";
import {
  extractCompanies,
  fetchCompanies,
  normalizeCompany,
} from "../services/companiesApi";

const COMPANY_SETTING_FIELDS = [
  { name: "address", label: "Address", type: "text", required: true },
  { name: "gstin", label: "GSTIN", type: "text" },
  { name: "cin", label: "CIN (optional)", type: "text" },
  { name: "pan", label: "PAN (optional)", type: "text" },
  { name: "mobile", label: "Mobile", type: "tel", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "website", label: "Website (optional)", type: "text" },
  { name: "state", label: "State", type: "text", required: true },
  { name: "stateCode", label: "State Code", type: "text", required: true },
  { name: "msmeNumber", label: "MSME Number (optional)", type: "text" },
  {
    name: "termsAndConditions",
    label: "Terms and Conditions (optional)",
    type: "textarea",
  },
];
const FIELD_RULES = {
  gstin: {
    maxLength: 15,
    transform: (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    message: "Enter a valid 15-character GSTIN (e.g. 07ABCDE1234F1Z5)",
  },
  cin: {
    maxLength: 21,
    transform: (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    pattern: /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
    message: "Enter a valid 21-character CIN (e.g. U12345DL2020PTC123456)",
  },
  pan: {
    maxLength: 10,
    transform: (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
    message: "Enter a valid 10-character PAN (e.g. ABCDE1234F)",
  },
};

const validateSettings = (form) => {
  const errors = {};

  for (const { name, label, required } of COMPANY_SETTING_FIELDS) {
    const value = String(form[name] ?? "").trim();
    const rule = FIELD_RULES[name];

    if (!value) {
      if (required) errors[name] = `${label} is required`;
      continue;
    }
    if (rule && !rule.pattern.test(value)) {
      errors[name] = rule.message;
    }
  }

  // A GSTIN contains the PAN in characters 3-12
  if (!errors.gstin && !errors.pan && form.gstin.slice(2, 12) !== form.pan) {
    errors.gstin = "GSTIN does not match the PAN";
  }

  return errors;
};
const EMPTY_BANK_FORM = {
  bankName: "",
  under: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  swiftCode: "",
  branchName: "",
  isDefault: false,
};

const extractBankList = (response) => {
  if (Array.isArray(response)) return response;

  const pending = [response];
  while (pending.length > 0) {
    const value = pending.shift();
    if (!value || typeof value !== "object") continue;
    if (Array.isArray(value)) return value;

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (
        Array.isArray(child) &&
        ["banks", "bankdetails", "items", "records", "results"].includes(
          normalizedKey,
        )
      ) {
        return child;
      }
      if (child && typeof child === "object") pending.push(child);
    }
  }

  return [];
};

const extractUnderOptions = (response, banks = []) => {
  const optionKeys = new Set([
    "underoptions",
    "underlist",
    "bankgroups",
    "groups",
  ]);
  const pending = [response];
  const options = [];

  while (pending.length > 0) {
    const value = pending.shift();
    if (!value || typeof value !== "object") continue;

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (optionKeys.has(normalizedKey) && Array.isArray(child)) {
        for (const option of child) {
          const label =
            typeof option === "string"
              ? option
              : option?.under ||
                option?.groupName ||
                option?.name ||
                option?.label ||
                option?.value;
          if (typeof label === "string" && label.trim()) {
            options.push(label.trim());
          }
        }
      }
      if (child && typeof child === "object") pending.push(child);
    }
  }

  for (const bank of banks) {
    if (typeof bank?.under === "string" && bank.under.trim()) {
      options.push(bank.under.trim());
    }
  }

  return [...new Set(options)];
};

const getCompanySettingsData = (response) =>
  response?.data?.settings ??
  response?.settings ??
  response?.data ??
  response ??
  {};

const normalizeSettingKey = (key) =>
  key.toLowerCase().replace(/[^a-z0-9]/g, "");

const SETTING_FIELD_ALIASES = {
  address: ["address", "companyaddress"],
  gstin: ["gstin", "gstnumber", "gstregistrationnumber"],
  cin: ["cin", "corporateidentificationnumber"],
  pan: ["pan", "pannumber"],
  mobile: ["mobile", "mobilenumber", "phone", "phonenumber", "contactnumber"],
  email: ["email", "emailaddress"],
  website: ["website", "websiteurl"],
  state: ["state", "statename"],
  stateCode: ["statecode", "stateid"],
  msmeNumber: ["msmenumber", "msme", "udyamnumber", "udyamregistrationnumber"],
  termsAndConditions: ["termsandconditions", "termsconditions", "terms", "tnc"],
};

const findSettingValue = (sources, fieldName) => {
  const aliases = new Set(
    (SETTING_FIELD_ALIASES[fieldName] || [fieldName]).map(normalizeSettingKey),
  );
  let emptyValueFound = false;

  for (const source of sources) {
    const pending = [source];
    while (pending.length > 0) {
      const value = pending.shift();
      if (!value || typeof value !== "object") continue;

      for (const [key, child] of Object.entries(value)) {
        if (aliases.has(normalizeSettingKey(key))) {
          if (child !== null && child !== undefined && String(child).trim()) {
            return String(child);
          }
          emptyValueFound = true;
        }

        if (child && typeof child === "object") pending.push(child);
      }
    }
  }

  return emptyValueFound ? "" : undefined;
};

const getSettingsFormValues = (response, fallbackCompany) => {
  const sources = [getCompanySettingsData(response), response, fallbackCompany];

  return Object.fromEntries(
    COMPANY_SETTING_FIELDS.map(({ name }) => [
      name,
      findSettingValue(sources, name) ?? "",
    ]),
  );
};

const normalizeWebsite = (website) => {
  const value = website.trim();
  if (!value || /^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const getFinalFieldName = (path) =>
  path
    .replace(/\[\d+\]/g, "")
    .split(".")
    .filter(Boolean)
    .at(-1) || "Value";

const formatFieldLabel = (path) =>
  getFinalFieldName(path)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatFieldValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const flattenSettings = (value, parentKey = "") => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [{ key: formatFieldLabel(parentKey), value: "[]" }];
    }
    return value.flatMap((item, index) =>
      flattenSettings(item, `${parentKey}[${index}]`),
    );
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value).filter(
      ([key]) =>
        ![
          "id",
          "statuscode",
          "success",
          "message",
          "companyname",
          "createdat",
          "updatedat",
          "logourl",
        ].includes(key.replace(/[^a-z0-9]/gi, "").toLowerCase()),
    );

    if (entries.length === 0) {
      return Object.keys(value).length === 0
        ? [{ key: formatFieldLabel(parentKey), value: "{}" }]
        : [];
    }

    return entries.flatMap(([key, childValue]) =>
      flattenSettings(childValue, parentKey ? `${parentKey}.${key}` : key),
    );
  }

  return [
    {
      key: formatFieldLabel(parentKey),
      value: formatFieldValue(value),
    },
  ];
};

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

const SettingsPage = () => {
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [bankModalCompany, setBankModalCompany] = useState(null);
  const [banksCompanyId, setBanksCompanyId] = useState(null);
  const [companyBanks, setCompanyBanks] = useState([]);
  const [bankUnderOptions, setBankUnderOptions] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState("");
  const [bankFormOpen, setBankFormOpen] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);
  const [bankEditOriginal, setBankEditOriginal] = useState(null);
  const [bankForm, setBankForm] = useState(EMPTY_BANK_FORM);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankSaveError, setBankSaveError] = useState("");
  const [bankActionBusyId, setBankActionBusyId] = useState(null);
  const [bankActionError, setBankActionError] = useState("");
  const [settingsCompany, setSettingsCompany] = useState(null);
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
  const banksRequestRef = useRef(0);

  const accessToken = useAuthStore((state) => state.accessToken);

  // Fetch companies from API
  useEffect(() => {
    if (!accessToken) {
      setCompanies([]);
      setCompaniesLoading(false);
      setCompaniesError("Sign in to load companies.");
      return;
    }

    let isMounted = true;

    const loadCompanies = async () => {
      setCompaniesLoading(true);
      setCompaniesError("");

      try {
        const response = await fetchCompanies(accessToken);

        if (!isMounted) return;

        const companyList = extractCompanies(response).map(normalizeCompany);

        setCompanies(companyList);
      } catch (error) {
        if (!isMounted) return;

        setCompanies([]);
        setCompaniesError(error?.message || "Unable to load companies.");
      } finally {
        if (isMounted) {
          setCompaniesLoading(false);
        }
      }
    };

    loadCompanies();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const openCompanySettings = async (company) => {
    const requestId = ++settingsRequestRef.current;
    setSettingsCompany(company);
    setCompanySettings(null);
    setEditingSettings(false);
    setSettingsLoading(false);
    setSettingsSaving(false);
    setLogoBusy(false);
    setSettingsError("");
    setSettingsForm(getSettingsFormValues(null));
    setSettingsSaveMessage("");
    setSettingsSaveError("");
    setSettingsFieldErrors({});
    setLogoUrl("");
    setLogoError("");

    setSignatureUrl("");
    setSignatureError("");
    setSignatureBusy(false);

    if (!company.id) {
      setSettingsError("This company does not have an ID.");
      return;
    }

    if (!accessToken) {
      setSettingsError("Sign in to load company settings.");
      return;
    }
    setSettingsLoading(true);

    try {
      const response = await fetchCompanySettings(accessToken, company.id);
      if (requestId !== settingsRequestRef.current) return;
      setCompanySettings(response);
      setSettingsForm(getSettingsFormValues(response, company));
      setLogoUrl(getCompanyLogoUrl(response) || getCompanyLogoUrl(company));
      setSignatureUrl(
        getCompanySignatureUrl(response) || getCompanySignatureUrl(company),
      );
    } catch (error) {
      if (requestId !== settingsRequestRef.current) return;
      setSettingsError(error?.message || "Unable to load company settings.");
    } finally {
      if (requestId === settingsRequestRef.current) setSettingsLoading(false);
    }
  };

  const saveCompanySettings = async (event) => {
    event.preventDefault();
    const companyId = settingsCompany?.id;
    if (!companyId || !accessToken) return;

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
      await updateCompanySettings(accessToken, companyId, settingsToSave);
      if (requestId !== settingsRequestRef.current) return;
      setCompanySettings({
        data: {
          ...settingsToSave,
          ...(logoUrl ? { logoUrl } : {}),
        },
      });
      setSettingsForm(settingsToSave);
      setSettingsSaveMessage("");
      setEditingSettings(false);
    } catch (error) {
      if (requestId !== settingsRequestRef.current) return;
      setSettingsSaveError(
        error?.message || "Unable to save company settings.",
      );
    } finally {
      if (requestId === settingsRequestRef.current) setSettingsSaving(false);
    }
  };

  const handleCompanyLogoUpload = async (event) => {
    const logoFile = event.target.files?.[0];
    event.target.value = "";
    if (!logoFile || !settingsCompany?.id || !accessToken) return;

    const requestId = settingsRequestRef.current;
    setLogoBusy(true);
    setLogoError("");

    try {
      const response = await uploadCompanyLogo(
        accessToken,
        settingsCompany.id,
        logoFile,
      );
      if (requestId !== settingsRequestRef.current) return;
      const updatedSettings = await fetchCompanySettings(
        accessToken,
        settingsCompany.id,
      );
      if (requestId !== settingsRequestRef.current) return;
      setCompanySettings(updatedSettings);
      setLogoUrl(
        getCompanyLogoUrl(updatedSettings) ||
          getCompanyLogoUrl(response) ||
          getCompanyLogoUrl(settingsCompany),
      );
    } catch (error) {
      if (requestId !== settingsRequestRef.current) return;
      setLogoError(error?.message || "Unable to upload company logo.");
    } finally {
      if (requestId === settingsRequestRef.current) setLogoBusy(false);
    }
  };

  const handleCompanyLogoDelete = async () => {
    if (!settingsCompany?.id || !accessToken) return;

    const requestId = settingsRequestRef.current;
    setLogoBusy(true);
    setLogoError("");

    try {
      await deleteCompanyLogo(accessToken, settingsCompany.id);
      if (requestId !== settingsRequestRef.current) return;
      setLogoUrl("");
    } catch (error) {
      if (requestId !== settingsRequestRef.current) return;
      setLogoError(error?.message || "Unable to delete company logo.");
    } finally {
      if (requestId === settingsRequestRef.current) setLogoBusy(false);
    }
  };

  const handleCompanySignatureUpload = async (event) => {
    const signatureFile = event.target.files?.[0];
    event.target.value = "";
    if (!signatureFile || !settingsCompany?.id || !accessToken) return;

    const requestId = settingsRequestRef.current;
    setSignatureBusy(true);
    setSignatureError("");

    try {
      const response = await uploadCompanySignature(
        accessToken,
        settingsCompany.id,
        signatureFile,
      );
      if (requestId !== settingsRequestRef.current) return;
      const updatedSettings = await fetchCompanySettings(
        accessToken,
        settingsCompany.id,
      );
      if (requestId !== settingsRequestRef.current) return;
      setCompanySettings(updatedSettings);
      setSignatureUrl(
        getCompanySignatureUrl(updatedSettings) ||
          getCompanySignatureUrl(response) ||
          getCompanySignatureUrl(settingsCompany),
      );
    } catch (error) {
      if (requestId !== settingsRequestRef.current) return;
      setSignatureError(error?.message || "Unable to upload signature.");
    } finally {
      if (requestId === settingsRequestRef.current) setSignatureBusy(false);
    }
  };

  const handleCompanySignatureDelete = async () => {
    if (!settingsCompany?.id || !accessToken) return;

    const requestId = settingsRequestRef.current;
    setSignatureBusy(true);
    setSignatureError("");

    try {
      await deleteCompanySignature(accessToken, settingsCompany.id);
      if (requestId !== settingsRequestRef.current) return;
      setSignatureUrl("");
    } catch (error) {
      if (requestId !== settingsRequestRef.current) return;
      setSignatureError(error?.message || "Unable to delete signature.");
    } finally {
      if (requestId === settingsRequestRef.current) setSignatureBusy(false);
    }
  };

  const toggleBankDetails = async (company, sectionKey) => {
    if (activeCard === sectionKey) {
      banksRequestRef.current += 1;
      setActiveCard(null);
      setBankModalCompany(null);
      setBanksCompanyId(null);
      setBankUnderOptions([]);
      setBanksLoading(false);
      setBankFormOpen(false);
      return;
    }

    setActiveCard(sectionKey);
    setBankModalCompany(company);
    setBanksCompanyId(company.id);
    setCompanyBanks([]);
    setBankUnderOptions([]);
    setBanksError("");
    setBankFormOpen(false);
    setEditingBankId(null);
    setBankEditOriginal(null);
    setBankForm(EMPTY_BANK_FORM);
    setBankSaveError("");
    setBankActionError("");

    if (!company.id) {
      setBanksError("This company does not have an ID.");
      return;
    }
    if (!accessToken) {
      setBanksError("Sign in to load bank details.");
      return;
    }

    const requestId = ++banksRequestRef.current;
    setBanksLoading(true);

    try {
      // 👇 Dono API parallel fetch karo
      const [tallyRes, appRes] = await Promise.allSettled([
        fetchCompanyBank(accessToken, company.id, {
          page: 1,
          limit: 100,
          q: "",
        }),
        fetchCompanyBanks(accessToken, company.id),
      ]);

      if (requestId !== banksRequestRef.current) return;

      // Tally banks
      const tallyBanks =
        tallyRes.status === "fulfilled" ? extractBank(tallyRes.value) : [];

      // App banks (jisme isDefault hota hai)
      const appBanks =
        appRes.status === "fulfilled" ? extractBankList(appRes.value) : [];

      const mergedBanks = tallyBanks.map((tallyBank) => {
        const details = tallyBank.bankDetails || {};
        const matchedAppBank = appBanks.find((appBank) => {
          // Match karo: accountNumber + ifscCode
          const sameAccount =
            String(appBank.accountNumber || "").trim() ===
            String(details.accountNumber || "").trim();
          const sameIfsc =
            String(appBank.ifscCode || "")
              .toUpperCase()
              .trim() ===
            String(details.ifscCode || "")
              .toUpperCase()
              .trim();
          const sameBankName =
            String(appBank.bankName || "")
              .toLowerCase()
              .trim() ===
            String(tallyBank.name || "")
              .toLowerCase()
              .trim();

          return (sameAccount && sameIfsc) || sameBankName;
        });

        return {
          ...tallyBank,
          // App ka _id (set default / delete ke liye)
          appBankId: matchedAppBank?._id || null,
          isDefault: Boolean(matchedAppBank?.isDefault),
        };
      });

      setCompanyBanks(mergedBanks);

      const underOptions = [
        ...new Set(mergedBanks.map((b) => b.parent || b.group).filter(Boolean)),
      ];
      setBankUnderOptions(underOptions);
    } catch (error) {
      if (requestId !== banksRequestRef.current) return;
      setBanksError(error?.message || "Unable to load bank details.");
    } finally {
      if (requestId === banksRequestRef.current) setBanksLoading(false);
    }
  };
  const closeBankModal = () => {
    banksRequestRef.current += 1;
    setActiveCard(null);
    setBankModalCompany(null);
    setBanksCompanyId(null);
    setBanksLoading(false);
    setBankFormOpen(false);
    setEditingBankId(null);
    setBankEditOriginal(null);
    setBankActionBusyId(null);
    setBankActionError("");
  };

  const saveCompanyBank = async (event) => {
    event.preventDefault();
    if (!banksCompanyId || !accessToken) return;

    const requestId = banksRequestRef.current;
    setBankSaving(true);
    setBankSaveError("");

    try {
      let apiResponse = null;

      if (editingBankId) {
        const updates = Object.fromEntries(
          Object.entries(bankForm).filter(
            ([key, value]) =>
              key !== "isDefault" && value !== bankEditOriginal?.[key],
          ),
        );

        if (Object.keys(updates).length === 0) {
          setBankFormOpen(false);
          setEditingBankId(null);
          setBankEditOriginal(null);
          setBankSaving(false);
          return;
        }

        setBankSaveError(
          "Editing Tally-synced banks is not supported yet. Please contact support.",
        );
        setBankSaving(false);
        return;
      }

      apiResponse = await createCompanyBank(
        accessToken,
        banksCompanyId,
        bankForm,
      );

      if (requestId !== banksRequestRef.current) return;

      // Tally sync check
      const responseData = apiResponse?.data || apiResponse;
      if (responseData?.tallySynced === false) {
        setBankSaveError(
          "Bank saved, but failed to sync with Tally. It may not appear in the list yet.",
        );
      }

      const response = await fetchCompanyBank(accessToken, banksCompanyId, {
        page: 1,
        limit: 100,
        q: "",
      });
      if (requestId !== banksRequestRef.current) return;

      const banks = extractBank(response);
      setCompanyBanks(banks);

      const underOptions = [
        ...new Set(banks.map((b) => b.parent || b.group).filter(Boolean)),
      ];
      setBankUnderOptions(underOptions);

      setBankForm(EMPTY_BANK_FORM);
      setEditingBankId(null);
      setBankEditOriginal(null);
      setBankFormOpen(false);
    } catch (error) {
      if (requestId !== banksRequestRef.current) return;
      const errorMessage = error?.message || "Unable to save bank details.";
      if (errorMessage.toLowerCase().includes("tally")) {
        setBankSaveError(`Tally Sync Error: ${errorMessage}`);
      } else {
        setBankSaveError(errorMessage);
      }
    } finally {
      if (requestId === banksRequestRef.current) setBankSaving(false);
    }
  };

  const handleBankAction = async (bank, action) => {
    // App bank ka _id use karo (Tally ka nahi)
    const bankId = bank.appBankId;

    if (!banksCompanyId || !bankId || !accessToken) {
      setBankActionError(
        "This bank is not linked to your account yet. Please refresh or add it manually.",
      );
      return;
    }

    const requestId = banksRequestRef.current;
    setBankActionBusyId(bankId);
    setBankActionError("");

    try {
      if (action === "default") {
        await setDefaultCompanyBank(accessToken, banksCompanyId, bankId);
      }

      if (requestId !== banksRequestRef.current) return;

      // Wapas dono fetch + merge
      const [tallyRes, appRes] = await Promise.allSettled([
        fetchCompanyBank(accessToken, banksCompanyId, {
          page: 1,
          limit: 100,
          q: "",
        }),
        fetchCompanyBanks(accessToken, banksCompanyId),
      ]);

      if (requestId !== banksRequestRef.current) return;

      const tallyBanks =
        tallyRes.status === "fulfilled" ? extractBank(tallyRes.value) : [];
      const appBanks =
        appRes.status === "fulfilled" ? extractBankList(appRes.value) : [];

      const mergedBanks = tallyBanks.map((tallyBank) => {
        const details = tallyBank.bankDetails || {};
        const matchedAppBank = appBanks.find((appBank) => {
          const sameAccount =
            String(appBank.accountNumber || "").trim() ===
            String(details.accountNumber || "").trim();
          const sameIfsc =
            String(appBank.ifscCode || "")
              .toUpperCase()
              .trim() ===
            String(details.ifscCode || "")
              .toUpperCase()
              .trim();
          const sameBankName =
            String(appBank.bankName || "")
              .toLowerCase()
              .trim() ===
            String(tallyBank.name || "")
              .toLowerCase()
              .trim();
          return (sameAccount && sameIfsc) || sameBankName;
        });

        return {
          ...tallyBank,
          appBankId: matchedAppBank?._id || null,
          isDefault: Boolean(matchedAppBank?.isDefault),
        };
      });

      setCompanyBanks(mergedBanks);
    } catch (error) {
      if (requestId !== banksRequestRef.current) return;
      setBankActionError(error?.message || "Unable to update bank details.");
    } finally {
      if (requestId === banksRequestRef.current) setBankActionBusyId(null);
    }
  };

  const sections = [
    {
      id: "settings",
      title: "Company Settings",
      description: "Configure company preferences",
      icon: Settings,
      color: "violet",
    },
    {
      id: "bank",
      title: "Bank Details",
      description: "Update payment information",
      icon: Landmark,
      color: "blue",
    },
  ];

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Company & Bank Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your company and account preferences
          </p>
        </div>

        {/* Loading State */}
        {companiesLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
              Loading companies...
            </div>
          </div>
        )}

        {/* Error State */}
        {!companiesLoading && companiesError && (
          <div
            className="rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-600"
            role="alert"
          >
            {companiesError}
          </div>
        )}

        {/* Empty State */}
        {!companiesLoading && !companiesError && companies.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            <Building2 size={24} className="mb-3 text-slate-400" />

            <p className="font-medium text-slate-700">No companies found</p>

            <p className="mt-1">
              Your companies will appear here once they are available.
            </p>
          </div>
        )}

        {/* Company Cards: Actual API Data */}
        {!companiesLoading && !companiesError && companies.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.map((company, companyIndex) => (
              <div
                key={
                  company.id || `${company.name || "company"}-${companyIndex}`
                }
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:shadow-md"
              >
                {/* Actual Company Name */}
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4">
                  {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                      <Building2 size={19} strokeWidth={2} />
                    </div> */}

                  <div className="min-w-0 flex-1">
                    {/* <p className="flex justify-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Company Name
                      </p> */}

                    <h2
                      className="flex justify-center mt-1 break-words text-sm font-semibold text-slate-900"
                      title={company.name || "Unnamed Company"}
                    >
                      {company.name || "Unnamed Company"}
                    </h2>

                    {company.meta && (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {company.meta}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company Settings and Bank Details */}
                <div>
                  {sections.map((section, sectionIndex) => {
                    const Icon = section.icon;

                    const sectionKey = `${
                      company.id || company.name || companyIndex
                    }-${section.id}`;

                    const isActive = activeCard === sectionKey;

                    return (
                      <div key={section.id}>
                        <button
                          type="button"
                          aria-expanded={isActive}
                          onClick={() => {
                            if (section.id === "settings") {
                              openCompanySettings(company);
                              return;
                            }

                            toggleBankDetails(company, sectionKey);
                          }}
                          className={`group flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 ${
                            sectionIndex < sections.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }`}
                        >
                          {/* Section Icon */}
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              section.color === "violet"
                                ? "bg-violet-50 text-violet-600 ring-1 ring-violet-100"
                                : "bg-blue-50 text-blue-600 ring-1 ring-blue-100"
                            }`}
                          >
                            <Icon size={16} strokeWidth={2} />
                          </div>

                          {/* Section Text */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {section.title}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {section.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <ChevronRight
                            size={16}
                            className={`shrink-0 text-slate-300 transition group-hover:text-slate-500 ${
                              isActive ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bankModalCompany && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={closeBankModal}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-bank-details-title"
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Bank Details
                </p>
                <h2
                  id="company-bank-details-title"
                  className="mt-1 text-lg font-bold text-slate-900"
                >
                  {bankModalCompany.name || "Company"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close bank details"
                onClick={closeBankModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </header>

            <div className="space-y-4 overflow-y-auto p-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setBankForm(EMPTY_BANK_FORM);
                    setEditingBankId(null);
                    setBankEditOriginal(null);
                    setBankSaveError("");
                    setBankFormOpen((open) => !open);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Plus size={16} />
                  {bankFormOpen ? "Close Form" : "Add Bank"}
                </button>
              </div>

              {banksLoading && (
                <p className="text-sm text-slate-500" role="status">
                  Loading bank details...
                </p>
              )}
              {banksError && (
                <p className="text-sm text-red-600" role="alert">
                  {banksError}
                </p>
              )}
              {bankActionError && (
                <p className="text-sm text-red-600" role="alert">
                  {bankActionError}
                </p>
              )}
              {!banksLoading &&
                !banksError &&
                companyBanks.length === 0 &&
                !bankFormOpen && (
                  <div className="rounded-xl border border-slate-200 p-5 text-center text-sm text-slate-500">
                    No bank accounts found.
                  </div>
                )}
              {companyBanks.map((bank, bankIndex) => {
                const details = bank.bankDetails || {};
                const bankName =
                  bank.name || bank.bankName || details.bankName || "Bank";
                const under = bank.parent || bank.group || "Bank Accounts";

                return (
                  <div
                    key={bank._id || bank.tallyExternalId || bankIndex}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {bankName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {bank.isDefault && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            Default
                          </span>
                        )}
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {under}
                        </span>
                      </div>
                    </div>
                    <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
                      {[
                        [
                          "Account Holder",
                          details.accountHolderName || bank.accountHolderName,
                        ],
                        [
                          "Account Number",
                          details.accountNumber || bank.accountNumber,
                        ],
                        ["IFSC Code", details.ifscCode || bank.ifscCode],
                        ["SWIFT Code", details.swiftCode || bank.swiftCode],
                        ["Branch", details.branchName || bank.branchName],
                        [
                          "Closing Balance",
                          bank.closingBalance != null
                            ? `₹${Number(bank.closingBalance).toLocaleString("en-IN")}`
                            : null,
                        ],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-xs text-slate-500">{label}</dt>
                          <dd className="break-words font-medium text-slate-800">
                            {value || "—"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                      {bank.appBankId && !bank.isDefault && (
                        <button
                          type="button"
                          disabled={Boolean(bankActionBusyId)}
                          onClick={() => handleBankAction(bank, "default")}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                        >
                          <Star size={14} />
                          {bankActionBusyId === bank.appBankId
                            ? "Setting..."
                            : "Set Default"}
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={Boolean(bankActionBusyId)}
                        onClick={() => {
                          const bankId = bank._id || bank.tallyExternalId;
                          setBankForm({
                            bankName: bankName,
                            under: under,
                            accountHolderName: details.accountHolderName || "",
                            accountNumber: details.accountNumber || "",
                            ifscCode: details.ifscCode || "",
                            swiftCode: details.swiftCode || "",
                            branchName: details.branchName || "",
                            isDefault: false,
                          });
                          setBankEditOriginal({
                            bankName: bankName,
                            under: under,
                            accountHolderName: details.accountHolderName || "",
                            accountNumber: details.accountNumber || "",
                            ifscCode: details.ifscCode || "",
                            swiftCode: details.swiftCode || "",
                            branchName: details.branchName || "",
                            isDefault: false,
                          });
                          setEditingBankId(bankId);
                          setBankSaveError("");
                          setBankFormOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}

              {bankFormOpen && (
                <div
                  className="fixed inset-0 z-[310] flex items-center justify-center bg-slate-950/50 p-4"
                  onClick={() => !bankSaving && setBankFormOpen(false)}
                >
                  <section
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-bank-title"
                    className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                          Bank Details
                        </p>
                        <h3
                          id="add-bank-title"
                          className="mt-1 text-lg font-bold text-slate-900"
                        >
                          {editingBankId
                            ? "Edit Bank Account"
                            : "Add Bank Account"}
                        </h3>
                      </div>
                      <button
                        type="button"
                        aria-label="Close add bank dialog"
                        disabled={bankSaving}
                        onClick={() => {
                          setBankFormOpen(false);
                          setEditingBankId(null);
                        }}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                      >
                        <X size={18} />
                      </button>
                    </header>
                    <form
                      className="space-y-4 overflow-y-auto p-5"
                      onSubmit={saveCompanyBank}
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                          ["bankName", "Bank Name"],
                          ["under", "Under"],
                          ["accountHolderName", "Account Holder Name"],
                          ["accountNumber", "Account Number"],
                          ["ifscCode", "IFSC Code"],
                          ["swiftCode", "SWIFT Code (optional)"],
                          ["branchName", "Branch Name (optional)"],
                        ].map(([name, label]) => (
                          <label key={name} className="block">
                            <span className="mb-1.5 block text-sm font-medium text-slate-700">
                              {label}
                            </span>
                            {name === "under" ? (
                              <select
                                value={bankForm.under}
                                onChange={(event) =>
                                  setBankForm((current) => ({
                                    ...current,
                                    under: event.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="">Select Under</option>
                                {bankForm.under &&
                                  !bankUnderOptions.includes(
                                    bankForm.under,
                                  ) && (
                                    <option value={bankForm.under}>
                                      {bankForm.under}
                                    </option>
                                  )}
                                {bankUnderOptions.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                required={[
                                  "bankName",
                                  "accountHolderName",
                                  "accountNumber",
                                  "ifscCode",
                                ].includes(name)}
                                value={bankForm[name]}
                                onChange={(event) =>
                                  setBankForm((current) => ({
                                    ...current,
                                    [name]: event.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />
                            )}
                          </label>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={bankForm.isDefault}
                          disabled={Boolean(
                            editingBankId && bankEditOriginal?.isDefault,
                          )}
                          onChange={(event) =>
                            setBankForm((current) => ({
                              ...current,
                              isDefault: event.target.checked,
                            }))
                          }
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {editingBankId && bankEditOriginal?.isDefault
                          ? "Default bank account"
                          : "Set as default bank"}
                      </label>
                      {bankSaveError && (
                        <p className="text-sm text-red-600" role="alert">
                          {bankSaveError}
                        </p>
                      )}
                      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                        <button
                          type="button"
                          disabled={bankSaving}
                          onClick={() => {
                            setBankFormOpen(false);
                            setEditingBankId(null);
                          }}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={bankSaving}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {bankSaving
                            ? editingBankId
                              ? "Saving..."
                              : "Adding..."
                            : editingBankId
                              ? "Save Changes"
                              : "Add Bank"}
                        </button>
                      </div>
                    </form>
                  </section>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {settingsCompany && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4"
          onClick={() => {
            settingsRequestRef.current += 1;
            setSettingsCompany(null);
            setSettingsLoading(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-settings-title"
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  Company Settings
                </p>
                <h2
                  id="company-settings-title"
                  className="mt-1 text-lg font-bold text-slate-900"
                >
                  {settingsCompany.name || "Company"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close company settings"
                onClick={() => {
                  settingsRequestRef.current += 1;
                  setSettingsCompany(null);
                  setSettingsLoading(false);
                }}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
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
                          getSettingsFormValues(
                            companySettings,
                            settingsCompany,
                          ),
                        );
                        setSettingsSaveMessage("");
                        setSettingsSaveError("");
                        setSettingsFieldErrors({});
                        setEditingSettings(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      <Pencil size={16} />
                      Edit Settings
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <CompanyLogo src={logoUrl} name={settingsCompany.name} />
                  </div>

                  {signatureUrl && (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Authorised Signature
                      </p>
                      <img
                        src={signatureUrl}
                        alt="Authorised signature"
                        className="h-20 max-w-[240px] rounded border border-slate-100 bg-white object-contain p-1"
                      />
                    </div>
                  )}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full min-w-[400px] border-collapse text-left text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700">
                            Field
                          </th>
                          <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {flattenSettings(companySettings).map((row, index) => (
                          <tr
                            key={`${row.key}-${index}`}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="w-2/5 break-words border-b border-slate-100 px-4 py-3 font-medium text-slate-600">
                              {row.key}
                            </td>
                            <td className="break-all border-b border-slate-100 px-4 py-3 text-slate-800">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  {" "}
                  <form className="space-y-5" onSubmit={saveCompanySettings}>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsForm(
                            getSettingsFormValues(
                              companySettings,
                              settingsCompany,
                            ),
                          );
                          setSettingsSaveMessage("");
                          setSettingsSaveError("");
                          setSettingsFieldErrors({});
                          setEditingSettings(false);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                      <h3 className="text-sm font-semibold text-slate-800"></h3>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h3 className="flex justify-center text-sm font-semibold text-slate-800">
                        Company Logo
                      </h3>
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt={`${settingsCompany.name || "Company"} logo`}
                          className="mx-auto mt-3 h-24 w-24 rounded-full border border-slate-200 bg-white object-contain p-2"
                        />
                      )}
                      <div className="flex justify-center mt-3 flex flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                          <Upload size={16} />
                          {logoBusy ? "Please wait..." : "Upload logo"}
                          <input
                            type="file"
                            name="logo"
                            accept="image/*"
                            disabled={logoBusy}
                            onChange={handleCompanyLogoUpload}
                            className="sr-only"
                          />
                        </label>
                        {logoUrl && (
                          <button
                            type="button"
                            disabled={logoBusy}
                            onClick={handleCompanyLogoDelete}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Delete logo
                          </button>
                        )}
                      </div>
                      {logoError && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {logoError}
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h3 className="flex justify-center text-sm font-semibold text-slate-800">
                        Authorised Signature
                      </h3>
                      {signatureUrl && (
                        <img
                          src={signatureUrl}
                          alt="Authorised signature"
                          className="mx-auto mt-3 h-20 max-w-[240px] rounded border border-slate-200 bg-white object-contain p-2"
                        />
                      )}
                      <div className="flex justify-center mt-3 flex-wrap items-center gap-3">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                          <Upload size={16} />
                          {signatureBusy
                            ? "Please wait..."
                            : "Upload signature"}
                          <input
                            type="file"
                            name="signature"
                            accept="image/*"
                            disabled={signatureBusy}
                            onChange={handleCompanySignatureUpload}
                            className="sr-only"
                          />
                        </label>
                        {signatureUrl && (
                          <button
                            type="button"
                            disabled={signatureBusy}
                            onClick={handleCompanySignatureDelete}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Delete signature
                          </button>
                        )}
                      </div>
                      {signatureError && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {signatureError}
                        </p>
                      )}
                    </div>
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

                            // First 2 digits of a GSTIN are the state code
                            if (
                              field.name === "gstin" &&
                              /^\d{2}/.test(value)
                            ) {
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
                            className={`block ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
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
                            getSettingsFormValues(
                              companySettings,
                              settingsCompany,
                            ),
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
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
};

export default SettingsPage;
