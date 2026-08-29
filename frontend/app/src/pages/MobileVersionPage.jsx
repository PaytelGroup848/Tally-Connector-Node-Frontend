
import { useState } from 'react'
import mobileIllustration from '../assets/livekeeping-and-tally.png'

function MobileVersionPage() {
  const [countryCode, setCountryCode] = useState('+91')

  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+61', country: 'Australia' },
    { code: '+65', country: 'Singapore' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+974', country: 'Qatar' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+92', country: 'Pakistan' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+82', country: 'South Korea' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+39', country: 'Italy' },
    { code: '+7', country: 'Russia' },
    { code: '+27', country: 'South Africa' },
    { code: '+34', country: 'Spain' },
    { code: '+31', country: 'Netherlands' },
    { code: '+32', country: 'Belgium' },
    { code: '+41', country: 'Switzerland' },
    { code: '+43', country: 'Austria' },
    { code: '+45', country: 'Denmark' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+48', country: 'Poland' },
    { code: '+52', country: 'Mexico' },
    { code: '+55', country: 'Brazil' },
    { code: '+64', country: 'New Zealand' },
    { code: '+66', country: 'Thailand' },
    { code: '+90', country: 'Turkey' },
    { code: '+93', country: 'Afghanistan' },
    { code: '+98', country: 'Iran' },
    { code: '+212', country: 'Morocco' },
    { code: '+213', country: 'Algeria' },
    { code: '+216', country: 'Tunisia' },
    { code: '+218', country: 'Libya' },
    { code: '+234', country: 'Nigeria' },
    { code: '+254', country: 'Kenya' },
    { code: '+351', country: 'Portugal' },
    { code: '+353', country: 'Ireland' },
    { code: '+358', country: 'Finland' },
    { code: '+380', country: 'Ukraine' },
    { code: '+381', country: 'Serbia' },
    { code: '+386', country: 'Slovenia' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+421', country: 'Slovakia' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+972', country: 'Israel' },
    { code: '+973', country: 'Bahrain' },
    { code: '+974', country: 'Qatar' },
    { code: '+975', country: 'Bhutan' },
    { code: '+976', country: 'Mongolia' },
    { code: '+977', country: 'Nepal' },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f3f3] px-4 py-8 text-slate-900">
      <div className="w-full max-w-[440px]">

        {/* LiveKeeping Logo */}
        <div className="mb-7 flex items-center justify-center gap-3">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-[#0d1f2a] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08)]">
            <div className="h-[20px] w-[20px] rounded-sm bg-gradient-to-br from-[#38d96a] via-[#1f9d5b] to-[#0d1f2a]" />
          </div>

          <div className="text-left">
            <div className="flex items-end gap-2 text-[19px] font-bold leading-none tracking-[-0.03em] text-slate-900">
              Live <span className="text-[#2cbf5a]">Keeping</span>
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              an <span className="text-red-500 not-italic">indiamart</span> Company
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-[25px] font-medium leading-tight tracking-[-0.03em] text-slate-900 md:text-[32px]">
          Access TALLY on Mobile
          <span className="block">anytime anywhere</span>
        </h1>

        {/* Image */}
        <img
          src={mobileIllustration}
          alt="Mobile Version"
          className="mx-auto mt-7 w-full max-w-[420px] rounded-xl shadow-sm"
        />

        {/* Login Text */}
        <div className="mt-7 text-center text-[18px] font-medium text-slate-700">
          Login or Sign up
        </div>

        {/* Phone Input */}
        <div className="mx-auto mt-5 flex w-full max-w-[420px] items-center overflow-hidden rounded-xl border-[1.5px] border-slate-300 bg-white shadow-sm">

          {/* Country Code Dropdown */}
          <div className="flex w-[102px] shrink-0 items-center justify-between gap-1 border-r border-slate-300 bg-slate-50 px-2 py-3 text-sm font-medium text-slate-700">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full cursor-pointer appearance-none bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              {countryCodes.map((item, index) => (
                <option
                  key={`${item.code}-${item.country}-${index}`}
                  value={item.code}
                >
                  {item.code} - {item.country}
                </option>
              ))}
            </select>

            <span className="pointer-events-none text-xs text-slate-400">
              ▾
            </span>
          </div>

          {/* Mobile Number */}
          <input
            type="text"
            placeholder="Enter Mobile Number"
            className="min-w-0 flex-1 border-0 bg-transparent px-3 py-4 text-[16px] text-slate-700 outline-none placeholder:text-slate-400"
          />

          {/* Continue Button */}
          <button
            type="button"
            className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#0f172a] text-xl font-semibold text-white"
            aria-label="Continue"
          >
            →
          </button>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-4 flex items-start gap-2 text-left text-sm text-slate-600">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#0f172a]" />
          <span>
            By signing in, you agree to our{' '}
            <a
              href="#"
              className="text-blue-500 hover:underline"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="text-blue-500 hover:underline"
            >
              Term of Use
            </a>
            .
          </span>
        </div>

      </div>
    </div>
  )
}

export default MobileVersionPage

