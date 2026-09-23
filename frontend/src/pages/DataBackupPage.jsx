// import { useState } from 'react'

// const DataBackupPage = () => {
//   const [billing, setBilling] = useState('1 Year')
//   const [selectedPlan, setSelectedPlan] = useState('PRO')

//   const plans = [
//     { name: 'GROWTH', price: '₹ 3,000' },
//     { name: 'PRO', price: '₹ 5,000' },
//     { name: 'PRO +', price: '₹ 7,000' },
//   ]

//   const features = [
//     { name: 'App & Web View', growth: '✓', pro: '✓', proPlus: '✓' },
//     { name: '20+ Business Reports', growth: '✓', pro: '✓', proPlus: '✓' },
//     { name: 'Invoice Share on WhatsApp', growth: '✓', pro: '✓', proPlus: '✓' },
//     { name: 'Payment Reminders', growth: '100 CREDITS', pro: '100 CREDITS', proPlus: '100 CREDITS' },
//     { name: 'Create/Edit Vouchers', growth: 'FREE 5', pro: 'UNLIMITED', proPlus: 'UNLIMITED' },
//     { name: 'eWay Bills & eInvoices', growth: 'FREE 5', pro: 'FREE 5', proPlus: 'UNLIMITED' },
//     {
//       name: (
//         <>
//           <div>Give Access</div>
//           <span className="mt-1 block text-[11px] text-slate-400">
//             Login for Admin / CA / Accountant
//           </span>
//         </>
//       ),
//       growth: 'ADMIN ONLY',
//       pro: (
//         <>
//           ADMIN
//           <br />
//           +1 USER FREE
//         </>
//       ),
//       proPlus: (
//         <>
//           ADMIN
//           <br />
//           +1 USER FREE
//         </>
//       ),
//     },
//   ]

//   const renderValue = (value) => {
//     if (value === '✓') {
//       return (
//         <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#2da43a] text-sm font-bold text-white">
//           ✓
//         </div>
//       )
//     }

//     const isUnlimited = value === 'UNLIMITED'
//     const isFree = value === 'FREE 5'
//     const isCredits = value === '100 CREDITS'
//     const isAdmin = value === 'ADMIN ONLY' || value.includes?.('ADMIN')

//     const toneClasses = isUnlimited || isCredits || isAdmin ? 'text-[#159447]' : 'text-[#ff6b1a]'
//     const pillClasses = isUnlimited || isFree ? 'border border-solid px-3 py-1' : 'px-0 py-0'
//     const borderColor = isUnlimited ? 'border-[#1478ff]' : isFree ? 'border-[#ff6b1a]' : 'border-transparent'

//     return (
//       <div
//         className={`${toneClasses} ${pillClasses} ${borderColor} inline-block rounded-full text-[11px] font-bold leading-[1.35] whitespace-nowrap`}
//         style={{
//           borderColor: isUnlimited ? '#1478ff' : isFree ? '#ff6b1a' : undefined,
//         }}
//       >
//         {value}
//       </div>
//     )
//   }

//   const handleProceed = () => {
//     console.log(`Proceeding with ${selectedPlan} - ${billing}`)
//   }

//   return (
//     <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 font-sans box-border">
//       <div className="mb-3 flex min-h-[58px] items-center rounded-md border border-slate-200 bg-white px-4 shadow-sm">
//         <h1 className="m-0 text-lg font-semibold text-slate-900">Data Backup</h1>
//       </div>

//       <div className="w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
//         <div className="border-b border-slate-200 px-5 pb-3.5 pt-4">
//           <h2 className="m-0 text-[17px] font-semibold text-slate-900">Choose a Plan</h2>
//           <p className="mt-1.5 text-xs text-slate-500">Select a plan for your data backup requirements.</p>
//         </div>

//         <div className="w-full overflow-x-auto">
//           <div className="min-w-[650px]">
//             <div className="grid min-h-[42px] grid-cols-[1.75fr_1fr_1fr_1fr] items-center border-b border-slate-300">
//               <div className="px-4 text-[12px] font-bold text-slate-900">FEATURES</div>

//               {['GROWTH', 'PRO', 'PRO +'].map((plan) => (
//                 <div
//                   key={plan}
//                   className={`flex h-full items-center justify-center text-center text-[12px] font-bold text-slate-900 ${selectedPlan === plan ? 'bg-[#effbe9]' : 'bg-white'}`}
//                 >
//                   {plan === 'PRO' ? (
//                     <span className="rounded-full bg-[#dffbd5] px-[18px] py-[7px]">{plan}</span>
//                   ) : (
//                     plan
//                   )}
//                 </div>
//               ))}
//             </div>

//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="grid min-h-[44px] grid-cols-[1.75fr_1fr_1fr_1fr] items-center border-b border-slate-200"
//               >
//                 <div className="px-4 py-[7px] text-[12px] leading-[1.3] text-slate-700">{feature.name}</div>

//                 <div className="bg-white p-1.5 text-center">{renderValue(feature.growth)}</div>

//                 <div className={`p-1.5 text-center ${selectedPlan === 'PRO' ? 'bg-[#f5fff1]' : 'bg-white'}`}>
//                   {renderValue(feature.pro)}
//                 </div>

//                 <div className={`p-1.5 text-center ${selectedPlan === 'PRO +' ? 'bg-[#f5fff1]' : 'bg-white'}`}>
//                   {renderValue(feature.proPlus)}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="m-[22px_20px_18px] flex flex-wrap items-center justify-center gap-0">
//           <button
//             type="button"
//             onClick={() => setBilling('1 Year')}
//             className={`h-[34px] w-[150px] cursor-pointer border text-[12px] ${billing === '1 Year' ? 'border-slate-900 bg-white font-semibold' : 'border-slate-300 bg-slate-100 font-normal'} rounded-l-md`}
//           >
//             1 Year
//           </button>

//           <button
//             type="button"
//             onClick={() => setBilling('3 Years')}
//             className={`h-[34px] cursor-pointer border border-l-0 px-4 text-[12px] ${billing === '3 Years' ? 'border-slate-300 bg-slate-100 font-semibold' : 'border-slate-300 bg-white font-normal'} rounded-r-md`}
//           >
//             3 Years
//           </button>

//           <span className="ml-3 whitespace-nowrap rounded bg-[#dff7d5] px-2 py-1 text-[10px] font-bold text-[#199337]">
//             Save upto 25%
//           </span>
//         </div>

//         <div className="grid grid-cols-3 gap-3 px-5 pb-5">
//           {plans.map((plan) => {
//             const selected = selectedPlan === plan.name

//             return (
//               <button
//                 key={plan.name}
//                 type="button"
//                 onClick={() => setSelectedPlan(plan.name)}
//                 className={`min-h-[95px] cursor-pointer rounded-md border p-3 text-left transition-all ${selected ? 'border-[#43c33f] bg-[#f5fff1]' : 'border-slate-300 bg-white'}`}
//               >
//                 <div className="mb-2 text-[13px] font-semibold text-slate-800">{plan.name}</div>
//                 <div className="text-[20px] font-bold text-slate-900">{plan.price}</div>
//               </button>
//             )
//           })}
//         </div>

//         <div className="px-5 pb-5">
//           <button
//             type="button"
//             onClick={handleProceed}
//             className="h-11 w-full cursor-pointer rounded bg-[#293034] text-sm font-semibold text-white transition hover:bg-slate-800"
//           >
//             Proceed →
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DataBackupPage



import { Clock3, DatabaseBackup, Rocket } from "lucide-react";

const DataBackupPage = () => {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 font-sans box-border">
      {/* Page Header */}
      <div className="mb-3 flex min-h-[58px] items-center rounded-md border border-slate-200 bg-white px-4 shadow-sm">
        <h1 className="m-0 text-lg font-semibold text-slate-900">
          Data Backup
        </h1>
      </div>

      {/* Coming Soon Card */}
      <div className="flex min-h-[calc(100vh-150px)] w-full items-center justify-center rounded-md border border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-2xl px-6 py-12 text-center">

          {/* Icon */}
          <div className="mb-7 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#092f52] shadow-lg">
              <DatabaseBackup
                size={46}
                strokeWidth={1.7}
                className="text-white"
              />

              {/* Small status icon */}
              <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#10a66f] shadow-md">
                <Clock3
                  size={18}
                  strokeWidth={2}
                  className="text-white"
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-extrabold tracking-tight text-[#092f52] sm:text-5xl">
            Coming Soon
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Our Data Backup feature is currently under development.
            We're working on making your business data backup experience
            secure, reliable, and easy to use.
          </p>

          {/* Status */}
          <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10a66f]" />

            <span className="text-xs font-semibold text-slate-700">
              Feature under development
            </span>
          </div>

          {/* Divider */}
          <div className="mx-auto my-9 h-px max-w-md bg-slate-200" />

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <DatabaseBackup
                size={22}
                className="mx-auto mb-2 text-[#092f52]"
                strokeWidth={1.8}
              />

              <p className="text-xs font-semibold text-slate-800">
                Secure Backup
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Keep your business data protected.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Rocket
                size={22}
                className="mx-auto mb-2 text-[#10a66f]"
                strokeWidth={1.8}
              />

              <p className="text-xs font-semibold text-slate-800">
                Easy to Use
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Simple and convenient backup management.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Clock3
                size={22}
                className="mx-auto mb-2 text-[#1478ff]"
                strokeWidth={1.8}
              />

              <p className="text-xs font-semibold text-slate-800">
                Coming Soon
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                This feature will be available soon.
              </p>
            </div>
          </div>

          {/* Bottom Message */}
          <p className="mt-9 text-xs text-slate-400">
            Thank you for your patience while we build this feature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataBackupPage;
