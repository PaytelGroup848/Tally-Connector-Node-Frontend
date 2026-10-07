"use client"; // needed only in Next.js app router; harmless elsewhere

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, User, Mail, Phone, MessageSquare, ChevronDown, ArrowRight, Search } from "lucide-react";

// ---------- Countries: [name, ISO, dial code] ----------
const RAW = [
["Afghanistan","AF","+93"],["Albania","AL","+355"],["Algeria","DZ","+213"],["American Samoa","AS","+1684"],["Andorra","AD","+376"],["Angola","AO","+244"],["Anguilla","AI","+1264"],["Antigua and Barbuda","AG","+1268"],["Argentina","AR","+54"],["Armenia","AM","+374"],["Aruba","AW","+297"],["Australia","AU","+61"],["Austria","AT","+43"],["Azerbaijan","AZ","+994"],
["Bahamas","BS","+1242"],["Bahrain","BH","+973"],["Bangladesh","BD","+880"],["Barbados","BB","+1246"],["Belarus","BY","+375"],["Belgium","BE","+32"],["Belize","BZ","+501"],["Benin","BJ","+229"],["Bermuda","BM","+1441"],["Bhutan","BT","+975"],["Bolivia","BO","+591"],["Bosnia and Herzegovina","BA","+387"],["Botswana","BW","+267"],["Brazil","BR","+55"],["British Virgin Islands","VG","+1284"],["Brunei","BN","+673"],["Bulgaria","BG","+359"],["Burkina Faso","BF","+226"],["Burundi","BI","+257"],
["Cambodia","KH","+855"],["Cameroon","CM","+237"],["Canada","CA","+1"],["Cape Verde","CV","+238"],["Cayman Islands","KY","+1345"],["Central African Republic","CF","+236"],["Chad","TD","+235"],["Chile","CL","+56"],["China","CN","+86"],["Colombia","CO","+57"],["Comoros","KM","+269"],["Congo (DRC)","CD","+243"],["Congo (Republic)","CG","+242"],["Cook Islands","CK","+682"],["Costa Rica","CR","+506"],["Côte d'Ivoire","CI","+225"],["Croatia","HR","+385"],["Cuba","CU","+53"],["Curaçao","CW","+599"],["Cyprus","CY","+357"],["Czech Republic","CZ","+420"],
["Denmark","DK","+45"],["Djibouti","DJ","+253"],["Dominica","DM","+1767"],["Dominican Republic","DO","+1809"],
["Ecuador","EC","+593"],["Egypt","EG","+20"],["El Salvador","SV","+503"],["Equatorial Guinea","GQ","+240"],["Eritrea","ER","+291"],["Estonia","EE","+372"],["Eswatini","SZ","+268"],["Ethiopia","ET","+251"],
["Falkland Islands","FK","+500"],["Faroe Islands","FO","+298"],["Fiji","FJ","+679"],["Finland","FI","+358"],["France","FR","+33"],["French Guiana","GF","+594"],["French Polynesia","PF","+689"],
["Gabon","GA","+241"],["Gambia","GM","+220"],["Georgia","GE","+995"],["Germany","DE","+49"],["Ghana","GH","+233"],["Gibraltar","GI","+350"],["Greece","GR","+30"],["Greenland","GL","+299"],["Grenada","GD","+1473"],["Guadeloupe","GP","+590"],["Guam","GU","+1671"],["Guatemala","GT","+502"],["Guernsey","GG","+44"],["Guinea","GN","+224"],["Guinea-Bissau","GW","+245"],["Guyana","GY","+592"],
["Haiti","HT","+509"],["Honduras","HN","+504"],["Hong Kong","HK","+852"],["Hungary","HU","+36"],
["Iceland","IS","+354"],["India","IN","+91"],["Indonesia","ID","+62"],["Iran","IR","+98"],["Iraq","IQ","+964"],["Ireland","IE","+353"],["Isle of Man","IM","+44"],["Israel","IL","+972"],["Italy","IT","+39"],
["Jamaica","JM","+1876"],["Japan","JP","+81"],["Jersey","JE","+44"],["Jordan","JO","+962"],
["Kazakhstan","KZ","+7"],["Kenya","KE","+254"],["Kiribati","KI","+686"],["Kosovo","XK","+383"],["Kuwait","KW","+965"],["Kyrgyzstan","KG","+996"],
["Laos","LA","+856"],["Latvia","LV","+371"],["Lebanon","LB","+961"],["Lesotho","LS","+266"],["Liberia","LR","+231"],["Libya","LY","+218"],["Liechtenstein","LI","+423"],["Lithuania","LT","+370"],["Luxembourg","LU","+352"],
["Macau","MO","+853"],["Madagascar","MG","+261"],["Malawi","MW","+265"],["Malaysia","MY","+60"],["Maldives","MV","+960"],["Mali","ML","+223"],["Malta","MT","+356"],["Marshall Islands","MH","+692"],["Martinique","MQ","+596"],["Mauritania","MR","+222"],["Mauritius","MU","+230"],["Mayotte","YT","+262"],["Mexico","MX","+52"],["Micronesia","FM","+691"],["Moldova","MD","+373"],["Monaco","MC","+377"],["Mongolia","MN","+976"],["Montenegro","ME","+382"],["Montserrat","MS","+1664"],["Morocco","MA","+212"],["Mozambique","MZ","+258"],["Myanmar","MM","+95"],
["Namibia","NA","+264"],["Nauru","NR","+674"],["Nepal","NP","+977"],["Netherlands","NL","+31"],["New Caledonia","NC","+687"],["New Zealand","NZ","+64"],["Nicaragua","NI","+505"],["Niger","NE","+227"],["Nigeria","NG","+234"],["Niue","NU","+683"],["North Korea","KP","+850"],["North Macedonia","MK","+389"],["Northern Mariana Islands","MP","+1670"],["Norway","NO","+47"],
["Oman","OM","+968"],
["Pakistan","PK","+92"],["Palau","PW","+680"],["Palestine","PS","+970"],["Panama","PA","+507"],["Papua New Guinea","PG","+675"],["Paraguay","PY","+595"],["Peru","PE","+51"],["Philippines","PH","+63"],["Poland","PL","+48"],["Portugal","PT","+351"],["Puerto Rico","PR","+1787"],
["Qatar","QA","+974"],
["Réunion","RE","+262"],["Romania","RO","+40"],["Russia","RU","+7"],["Rwanda","RW","+250"],
["Saint Helena","SH","+290"],["Saint Kitts and Nevis","KN","+1869"],["Saint Lucia","LC","+1758"],["Saint Pierre and Miquelon","PM","+508"],["Saint Vincent and the Grenadines","VC","+1784"],["Samoa","WS","+685"],["San Marino","SM","+378"],["São Tomé and Príncipe","ST","+239"],["Saudi Arabia","SA","+966"],["Senegal","SN","+221"],["Serbia","RS","+381"],["Seychelles","SC","+248"],["Sierra Leone","SL","+232"],["Singapore","SG","+65"],["Sint Maarten","SX","+1721"],["Slovakia","SK","+421"],["Slovenia","SI","+386"],["Solomon Islands","SB","+677"],["Somalia","SO","+252"],["South Africa","ZA","+27"],["South Korea","KR","+82"],["South Sudan","SS","+211"],["Spain","ES","+34"],["Sri Lanka","LK","+94"],["Sudan","SD","+249"],["Suriname","SR","+597"],["Sweden","SE","+46"],["Switzerland","CH","+41"],["Syria","SY","+963"],
["Taiwan","TW","+886"],["Tajikistan","TJ","+992"],["Tanzania","TZ","+255"],["Thailand","TH","+66"],["Timor-Leste","TL","+670"],["Togo","TG","+228"],["Tonga","TO","+676"],["Trinidad and Tobago","TT","+1868"],["Tunisia","TN","+216"],["Turkey","TR","+90"],["Turkmenistan","TM","+993"],["Turks and Caicos Islands","TC","+1649"],["Tuvalu","TV","+688"],
["Uganda","UG","+256"],["Ukraine","UA","+380"],["United Arab Emirates","AE","+971"],["United Kingdom","GB","+44"],["United States","US","+1"],["Uruguay","UY","+598"],["US Virgin Islands","VI","+1340"],["Uzbekistan","UZ","+998"],
["Vanuatu","VU","+678"],["Vatican City","VA","+39"],["Venezuela","VE","+58"],["Vietnam","VN","+84"],
["Yemen","YE","+967"],["Zambia","ZM","+260"],["Zimbabwe","ZW","+263"],
];

const COUNTRIES = RAW.map(([name, iso, dial]) => ({ name, iso, dial }));
const DEFAULT_COUNTRY = "IN";

// ---------- Searchable country code dropdown ----------
function CountryCodeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  const selected = COUNTRIES.find((c) => c.iso === value) || COUNTRIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase() === q ||
        c.dial.replace("+", "").startsWith(q)
    );
  }, [query]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
    else setQuery("");
  }, [open]);

  const pick = (c) => {
    onChange(c.iso);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-full items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        <span>{selected.iso}</span>
        <span>{selected.dial}</span>
        <ChevronDown size={12} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation(); // don't close the whole modal
                  setOpen(false);
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (filtered[0]) pick(filtered[0]);
                }
              }}
              placeholder="Search country or code"
              className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-sm text-slate-400">No country found</li>
            )}
            {filtered.map((c) => (
              <li key={c.iso}>
                <button
                  type="button"
                  role="option"
                  aria-selected={c.iso === value}
                  onClick={() => pick(c)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-amber-50 ${
                    c.iso === value ? "bg-amber-50 font-semibold" : ""
                  }`}
                >
                  <span className="truncate text-slate-800">{c.name}</span>
                  <span className="shrink-0 text-xs text-slate-500">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const API_URL = "https://api.marketing.cloudedata.com/api/public/submit";

// Hidden from the UI, always sent in the payload
const PRODUCT_NAME = "ctrl books";

const initialForm = { name: "", email: "", country: DEFAULT_COUNTRY, phone: "", message: "" };

export default function EnquirySection({ id = "enquiry" }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.country === "IN") {
      if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a 10-digit phone number";
    } else if (!/^\d{4,15}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number";
    }
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const selected = COUNTRIES.find((c) => c.iso === form.country);
      const payload = {
        country: selected?.name,
        email: form.email.trim(),
        message: form.message,
        name: form.name.trim(),
        phone: `${selected?.dial}${form.phone}`,
        product: PRODUCT_NAME,
      };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setSuccess(true);
      setForm(initialForm);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300";
  const border = (key) => (errors[key] ? "border-red-400" : "border-slate-200");

  const Label = ({ icon: Icon, children, required }) => (
    <label className="mb-1.5 flex items-center gap-1.5 text-base font-medium uppercase tracking-widest text-slate-800">
      <Icon size={12} className="text-slate-500" />
      {children}
      {required && <span> *</span>}
    </label>
  );

  const Error = ({ k }) =>
    errors[k] ? <p className="mt-1 text-xs text-red-500">{errors[k]}</p> : null;

  return (
    <section
      id={id}
      className="scroll-mt-24 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl shadow-slate-200">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">Get Free Demo</h2>
          <p className="text-xs font-semibold text-slate-400">
            Reply within <span className="text-emerald-700">1 hour</span>
          </p>
        </div>

    {/* Success banner */}
    {success && (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
        <Check size={14} />
        Thank you! We'll reach you within 1 hour.
      </div>
    )}
    {errors.form && (
      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
        {errors.form}
      </div>
    )}

    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Name */}
      <div>
        <Label icon={User} required>Name</Label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="John Doe"
          className={`${inputBase} ${border("name")}`}
        />
        <Error k="name" />
      </div>

      {/* Email */}
      <div>
        <Label icon={Mail} required>Email</Label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          placeholder="john@company.com"
          className={`${inputBase} ${border("email")}`}
        />
        <Error k="email" />
      </div>

      {/* Phone */}
      <div>
        <Label icon={Phone} required>Phone</Label>
        <div className="flex gap-2">
          <CountryCodeSelect
            value={form.country}
            onChange={(iso) => setField("country", iso)}
          />
          <input
            type="tel"
            inputMode="numeric"
            maxLength={form.country === "IN" ? 10 : 15}
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value.replace(/\D/g, ""))}
            placeholder={form.country === "IN" ? "10 digits" : "Phone number"}
            className={`${inputBase} ${border("phone")}`}
          />
        </div>
        <Error k="phone" />
      </div>

      {/* Message */}
      <div>
        <Label icon={MessageSquare}>Message</Label>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setField("message", e.target.value)}
          placeholder="Your requirements..."
          className={`${inputBase} ${border("message")} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 py-3 text-sm font-bold text-emerald-950 shadow-md transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Request Demo"}
        {!loading && <ArrowRight size={14} />}
      </button>
    </form>
      </div>
    </section>
  );
}