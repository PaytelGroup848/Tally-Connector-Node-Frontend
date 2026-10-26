// src/pages/Settings/settingsHelpers.js

export const COMPANY_SETTING_FIELDS = [
  { name: "address", label: "Address", type: "text", required: true },
  { name: "gstin", label: "GSTIN", type: "text"},
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

export const FIELD_RULES = {
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

export const EMPTY_BANK_FORM = {
  bankName: "",
  under: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  swiftCode: "",
  branchName: "",
  isDefault: false,
};

export const validateSettings = (form) => {
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

  // if (!errors.gstin) {
  //   errors.gstin = "GSTIN is required";
  // }

  return errors;
};

export const extractBankList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data?.banks)) return response.data.banks;
  if (Array.isArray(response?.banks)) return response.banks;
  if (Array.isArray(response?.data?.items)) return response.data.items;

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

export const extractUnderOptions = (response, banks = []) => {
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

export const getCompanySettingsData = (response) =>
  response?.data?.settings ??
  response?.settings ??
  response?.data ??
  response ??
  {};

export const normalizeSettingKey = (key) =>
  key.toLowerCase().replace(/[^a-z0-9]/g, "");

export const SETTING_FIELD_ALIASES = {
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

export const findSettingValue = (sources, fieldName) => {
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

export const getSettingsFormValues = (response, fallbackCompany) => {
  const sources = [getCompanySettingsData(response), response, fallbackCompany];

  return Object.fromEntries(
    COMPANY_SETTING_FIELDS.map(({ name }) => [
      name,
      findSettingValue(sources, name) ?? "",
    ]),
  );
};

export const normalizeWebsite = (website) => {
  const value = website.trim();
  if (!value || /^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

export const getFinalFieldName = (path) =>
  path
    .replace(/\[\d+\]/g, "")
    .split(".")
    .filter(Boolean)
    .at(-1) || "Value";

export const formatFieldLabel = (path) =>
  getFinalFieldName(path)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const formatFieldValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

export const flattenSettings = (value, parentKey = "") => {
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
