import { useState } from 'react'

const steps = ['Log in eInvoice Portal', 'API Registration', 'Verify OTP', 'GST Suvidha Provider', 'Generate e-Invoice']

function EwayPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const goToNextStep = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1))

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-800">Click to proceed</h2>
            <a
              href="https://einvoice1.gst.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-slate-800"
            >
              eInvoice Portal
              <span className="ml-2 text-lg">↗</span>
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs text-slate-500">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400">‹</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400">›</span>
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-400">↻</span>
              <span className="ml-3 font-medium text-slate-600">einvoice1.gst.gov.in</span>
            </div>

            <div className="bg-[linear-gradient(90deg,#0d4d6b_0%,#0d4d6b_35%,#1d5f86_35%,#1d5f86_100%)] px-6 py-4 text-white">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide">
                <span>Government of India</span>
                <span className="text-center text-[9px] leading-tight text-cyan-100">Goods and Services Tax<br />e-Invoice System</span>
                <span className="text-base font-bold text-cyan-100">NIC</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 text-[11px] text-slate-600">
              <span>Home</span>
              <span>Laws</span>
              <span>Help</span>
              <span>Services</span>
              <span>Registration</span>
              <span>Statistics</span>
              <span className="ml-auto font-semibold text-slate-800">Login ↪</span>
            </div>

            <div className="grid gap-6 bg-slate-100 p-6 md:grid-cols-[1.1fr_1.3fr]">
              <div className="flex min-h-[210px] items-center justify-center rounded-xl bg-[radial-gradient(circle_at_center,_#b7d8e8_0%,_#dfeef6_40%,_#ccdeef_100%)] text-center text-3xl font-black uppercase tracking-tight text-slate-600">
                e-Invoice
              </div>

              <div className="rounded-xl bg-white p-5 shadow-inner ring-1 ring-slate-200">
                <div className="mb-4 text-center text-lg font-bold uppercase tracking-wide text-slate-700">E-Invoice System Login</div>
                <div className="space-y-4">
                  <label className="block text-sm text-slate-600">
                    User name
                    <input className="mt-1 block w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none" />
                  </label>
                  <label className="block text-sm text-slate-600">
                    Password
                    <input type="password" className="mt-1 block w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none" />
                  </label>
                  <button type="button" className="w-full rounded-md bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white">Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeStep === 1) {
      return (
        <div className="space-y-4">
          <p className="text-center text-base font-medium text-slate-700">
            Select <span className="font-bold">&apos;API registration&apos;</span> from the main menu on the left side and click on <span className="font-bold">&apos;Create API User&apos;</span>
          </p>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[linear-gradient(90deg,#0c5374,#0d698c)] px-6 py-4 text-white">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide">
                <span>Goods and Services Tax</span>
                <span className="text-center text-[9px] leading-tight text-cyan-100">e-Invoice System</span>
                <span className="text-lg font-black text-cyan-100">NIC</span>
              </div>
            </div>

            <div className="border-b border-slate-200 bg-slate-200 px-4 py-2 text-xs text-slate-600">⌂ Menu</div>

            <div className="grid min-h-[300px] md:grid-cols-[180px_1fr]">
              <aside className="border-r border-slate-200 bg-slate-100 p-2 text-[11px] text-slate-600">
                {['e-Invoice', 'MIS Reports', 'User Management', 'API Registration', 'IP Whitelisting', 'User Credentials', 'Create API User', 'Freeze API User', 'Change API Password'].map((item, index) => (
                  <div
                    key={item}
                    className={`mb-1 rounded border px-2 py-2 ${index === 3 || index === 6 ? 'border-red-400 bg-white font-semibold text-slate-800' : 'border-transparent bg-slate-100'}`}
                  >
                    {item}
                  </div>
                ))}
              </aside>

              <div className="bg-slate-50 p-5">
                <div className="mb-4 text-center text-xl font-bold text-slate-700">Dash Board</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-slate-700">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] text-white">◔</span>
                      Generations
                    </div>
                    <div className="space-y-2 text-xs text-slate-500">
                      <div>Yesterday <span className="float-right font-semibold text-slate-700">0</span></div>
                      <div>During This month <span className="float-right font-semibold text-slate-700">0</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-slate-700">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white">↗</span>
                      Cancelled
                    </div>
                    <div className="space-y-2 text-xs text-slate-500">
                      <div>Yesterday <span className="float-right font-semibold text-slate-700">0</span></div>
                      <div>During This month <span className="float-right font-semibold text-slate-700">0</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-[11px] text-slate-600">
                  <span className="font-semibold text-sky-700">Notes:</span> The Bulk IRN generation facility has been enabled. You may download the tools from the portal under Help → Tools.
                </div>
              </div>
            </div>

            <div className="absolute bottom-14 left-64 rounded-lg border-4 border-red-500 bg-white px-5 py-3 text-lg font-semibold text-slate-800 shadow-lg">
              Create API User
            </div>
            <div className="absolute bottom-16 left-52 text-4xl font-black text-red-500">↙</div>
          </div>
        </div>
      )
    }

    if (activeStep === 2) {
      return (
        <div className="space-y-4">
          <p className="text-center text-base font-medium text-slate-700">
            Enter your mobile number Now, click on <span className="font-bold">&apos;Send OTP&apos;</span> and <span className="font-bold">&apos;Verify OTP&apos;</span> yourself
          </p>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[linear-gradient(90deg,#0c5374,#0d698c)] px-6 py-4 text-white">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide">
                <span>Goods and Services Tax</span>
                <span className="text-center text-[9px] leading-tight text-cyan-100">e-Invoice System</span>
                <span className="text-lg font-black text-cyan-100">NIC</span>
              </div>
            </div>

            <div className="border-b border-slate-200 bg-slate-200 px-4 py-2 text-xs text-slate-600">⌂ Menu</div>

            <div className="mx-auto mt-8 w-full max-w-[620px] rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-lg font-semibold text-slate-700">API Registration</div>
              <div className="flex flex-col items-center justify-center gap-4 p-5 sm:flex-row">
                <label className="flex items-center gap-3 rounded-lg border-4 border-red-500 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  Enter OTP:
                  <input value="871125" readOnly className="ml-2 w-28 border-l border-slate-200 bg-slate-50 px-2 py-2 text-right text-sm font-semibold text-slate-700 outline-none" />
                </label>
                <button type="button" onClick={goToNextStep} className="rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-sky-500">
                  Verify OTP
                </button>
              </div>
            </div>

            <div className="absolute right-24 top-40 text-5xl font-black text-red-500">↗</div>
          </div>
        </div>
      )
    }

    if (activeStep === 3) {
      return (
        <div className="space-y-4">
          <p className="text-center text-base font-medium text-slate-700">
            Select <span className="font-bold">&apos;Through GSP&apos;</span>, choose <span className="font-bold">&apos;Fynamics Techno Solution&apos;</span>, create <span className="font-bold">Username and Password</span>
          </p>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-[linear-gradient(90deg,#0c5374,#0d698c)] px-6 py-4 text-white">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide">
                <span>Goods and Services Tax</span>
                <span className="text-center text-[9px] leading-tight text-cyan-100">e-Invoice System</span>
                <span className="text-lg font-black text-cyan-100">NIC</span>
              </div>
            </div>

            <div className="border-b border-slate-200 bg-slate-200 px-4 py-2 text-xs text-slate-600">⌂ Menu</div>

            <div className="mx-auto mt-7 w-full max-w-[780px] rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-lg font-semibold text-slate-700">API Registration Through GSP</div>

              <div className="px-5 py-5 text-[11px] text-slate-600">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="font-medium text-slate-700">Do you wish to Register your GSTIN for</span>
                  <label className="inline-flex items-center gap-1"><input type="radio" name="registration" /> Directly</label>
                  <label className="inline-flex items-center gap-1"><input type="radio" name="registration" defaultChecked /> Through GSP</label>
                  <label className="inline-flex items-center gap-1"><input type="radio" name="registration" /> Through ERP</label>
                  <label className="inline-flex items-center gap-1"><input type="radio" name="registration" /> Through Client-Id of other</label>
                </div>

                <div className="mx-auto max-w-[430px] rounded-lg border-4 border-red-500 bg-white p-3">
                  <div className="space-y-3 text-[11px] text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="w-[118px] text-right">Select your GSP:</span>
                      <select defaultValue="Fynamics Techno Solution" className="w-[210px] rounded border border-slate-300 bg-slate-50 px-2 py-2 font-semibold text-slate-700 outline-none ring-1 ring-sky-100">
                        <option>Fynamics Techno Solution</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="w-[118px] text-right">Username:</span>
                      <input value="API_xxxxxxxxxxxxx" readOnly className="w-[210px] rounded border border-slate-300 bg-slate-50 px-2 py-2 text-slate-700 outline-none" />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="w-[118px] text-right">Password:</span>
                      <input value="xxxxxxxxxxxxxx" readOnly className="w-[210px] rounded border border-slate-300 bg-slate-50 px-2 py-2 text-slate-700 outline-none" />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="w-[118px] text-right">Re-enter Password:</span>
                      <input value="xxxxxxxxxxxxxx" readOnly className="w-[210px] rounded border border-slate-300 bg-slate-50 px-2 py-2 text-slate-700 outline-none" />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center gap-3">
                    <button type="button" onClick={goToNextStep} className="rounded-md bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm">Submit</button>
                    <button type="button" className="rounded-md bg-rose-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm">Exit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-[780px] space-y-5">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
          Use your GSP user credentials generated from E-Invoice portal.
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
          Please update the GST number in Tally first before GSP registration.
        </div>

        <form className="mx-auto w-full max-w-[420px] space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" onSubmit={(event) => event.preventDefault()}>
          <div className="relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600">GSTIN *</label>
            <input value="33ASQPS3592R1ZL" readOnly className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-700 outline-none" />
          </div>

          <div className="relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600">GSP USERNAME *</label>
            <input value="API_XXXXXXXXXX" readOnly className="mt-2 block w-full rounded-lg border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-700 outline-none" />
          </div>

          <div className="relative">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-600">GSP PASSWORD *</label>
            <div className="mt-2 flex items-center overflow-hidden rounded-lg border border-slate-300 bg-slate-100">
              <input type={showPassword ? 'text' : 'password'} value="XXXXXXXXXX" readOnly className="w-full bg-transparent px-3 py-3 text-sm text-slate-700 outline-none" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="h-full border-l border-slate-300 px-3 text-slate-600 hover:bg-slate-200" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full rounded-lg bg-slate-400 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm">
            Proceed to Generate Eway Bill
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 text-slate-800">
      <div className="mb-5 flex items-start justify-between gap-3">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep
          const isCurrent = index === activeStep
          const isFirst = index === 0

          return (
            <div key={step} className="flex min-w-0 flex-1 items-start justify-center">
              <div className="flex w-full max-w-[220px] flex-col items-center">
                <div className="flex w-full items-center">
                  {!isFirst && (
                    <div className={`h-0.5 flex-1 rounded-full ${index <= activeStep ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  )}
                  <div className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-bold ${isCompleted ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200' : isCurrent ? 'border-emerald-500 bg-white text-emerald-600' : 'border-slate-300 bg-white text-slate-500'}`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 rounded-full ${index < activeStep ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  )}
                </div>
                <div className={`mt-2 text-center text-[11px] font-medium leading-tight ${isCurrent ? 'text-slate-800' : 'text-slate-600'}`}>
                  {step}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">{renderStepContent()}</div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm">
        <span className="flex items-center gap-3">
          <span>For any Help and Support</span>
          <span>☎</span>
          <span className="font-semibold">+91 83 83 83 83 83</span>
        </span>
        {activeStep < 4 && (
          <button type="button" onClick={goToNextStep} className="rounded-xl bg-slate-900 px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-slate-800">
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

export default EwayPage