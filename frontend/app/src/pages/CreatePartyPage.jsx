import { useState } from 'react'

const countryOptions = [
  'India',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Australia',
  'Canada',
  'Singapore',
  'Germany',
  'France',
  'Saudi Arabia',
  'Nepal',
  'Sri Lanka',
  'Bangladesh',
  'Pakistan',
  'Afghanistan',
  'Malaysia',
  'Thailand',
  'Japan',
  'South Korea',
  'Italy',
  'Spain',
]

const stateOptions = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

function CreatePartyPage() {
  const [form, setForm] = useState({
    gstNumber: '',
    ledgerGroup: '',
    ledgerName: '',
    openingBalance: '',
    country: 'India',
    state: '',
    postalAddress: '',
    postalCode: '',
    gstRegistrationType: '',
    ledgerMobile: '',
    email: '',
    narration: '',
  })

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="flex items-center gap-3 bg-[#5ecb5d] px-5 py-4 text-[22px] font-bold text-white">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/30 bg-white/10 text-2xl text-white transition hover:bg-white/20"
            aria-label="Go back"
          >
            ‹
          </button>
          <span>Create Party</span>
        </div>

        <div className="bg-[#f5f6f5] p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>GST Number</span>
              <input
                value={form.gstNumber}
                onChange={(event) => updateField('gstNumber', event.target.value)}
                placeholder="GST Number (optional)"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>
                Ledger Group <span className="text-red-500">*</span>
              </span>
              <input
                value={form.ledgerGroup}
                onChange={(event) => updateField('ledgerGroup', event.target.value)}
                placeholder="Search Ledger Group"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>
                Ledger Name <span className="text-red-500">*</span>
              </span>
              <input
                value={form.ledgerName}
                onChange={(event) => updateField('ledgerName', event.target.value)}
                placeholder="Ledger Name"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Opening Balance</span>
              <div className="flex items-center gap-2">
                <input
                  value={form.openingBalance}
                  onChange={(event) => updateField('openingBalance', event.target.value)}
                  placeholder="Opening Balance (Optional)"
                  className="h-12 flex-1 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <select
                  value="Credit"
                  onChange={() => {}}
                  className="h-12 min-w-[88px] rounded-md border border-slate-300 bg-white px-2 text-[14px] text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                >
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>
                Country <span className="text-red-500">*</span>
              </span>
              <select
                value={form.country}
                onChange={(event) => updateField('country', event.target.value)}
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                {countryOptions.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>
                State <span className="text-red-500">*</span>
              </span>
              <select
                value={form.state}
                onChange={(event) => updateField('state', event.target.value)}
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Select State</option>
                {stateOptions.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>
                Postal Address <span className="text-red-500">*</span>
              </span>
              <input
                value={form.postalAddress}
                onChange={(event) => updateField('postalAddress', event.target.value)}
                placeholder="Postal Address"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Postal Code</span>
              <input
                value={form.postalCode}
                onChange={(event) => updateField('postalCode', event.target.value)}
                placeholder="Postal Code"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>
                GST Registration Type <span className="text-red-500">*</span>
              </span>
              <select
                value={form.gstRegistrationType}
                onChange={(event) => updateField('gstRegistrationType', event.target.value)}
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Select Registration</option>
                <option value="Regular">Regular</option>
                <option value="Composition">Composition</option>
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Ledger Mobile</span>
              <input
                value={form.ledgerMobile}
                onChange={(event) => updateField('ledgerMobile', event.target.value)}
                placeholder="Ledger Mobile (Optional)"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Email</span>
              <input
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="Email (Optional)"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700 md:col-span-2">
              <span>Narration</span>
              <input
                value={form.narration}
                onChange={(event) => updateField('narration', event.target.value)}
                placeholder="Narration"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          <div className="mt-7 flex justify-end">
            <button
              type="button"
              className="rounded-lg bg-[#111827] px-7 py-3 text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(17,24,39,0.2)] transition hover:bg-[#0b1220]"
            >
              Create Party
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePartyPage
