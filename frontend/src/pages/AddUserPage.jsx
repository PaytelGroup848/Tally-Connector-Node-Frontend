function AddUserPage() {
  const companyOptions = [
    'Paytel Financial Services Pvt Ltd 22-23',
    'PayTel Financial Technologies Pvt. Ltd.',
  ]

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef1f1] p-4 md:p-5">
      <div className="rounded-[10px] border border-slate-200 bg-[#f4f4f4] p-4 shadow-sm md:p-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Go back" className="text-[22px] text-slate-700 hover:text-slate-900">
              ←
            </button>
            <h1 className="text-[21px] font-bold text-slate-800">Add New User</h1>
          </div>

          <div className="text-[14px] text-slate-600">
            <span>Total Purchased-</span>
            <strong className="font-bold text-slate-800">3 Users</strong>
            <span className="mx-2">•</span>
            <span>In Use-1 Users</span>
          </div>
        </div>

        <div className="rounded-[8px] border border-slate-200 bg-[#eff1f2] p-4 md:p-6">
          <h2 className="mb-5 text-[20px] font-bold text-slate-800">Enter User Details</h2>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1.2fr_1.8fr] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-[14px] font-medium text-slate-700">Name</span>
              <input
                type="text"
                placeholder="Name"
                className="h-[46px] w-full rounded-[8px] border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] font-medium text-slate-700">Mobile Number</span>
              <div className="flex h-[46px] overflow-hidden rounded-[8px] border border-slate-300 bg-white">
                <div className="flex items-center gap-2 border-r border-slate-300 bg-slate-100 px-3 text-[15px] font-medium text-slate-700">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f6f6f6] text-xs">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="w-full border-0 bg-transparent px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            <div className="flex items-end gap-3">
              <label className="block w-full">
                <span className="mb-2 block text-[14px] font-medium text-slate-700">Assign Company</span>
                <div className="relative">
                  <select
                    defaultValue=""
                    className="h-[46px] w-full appearance-none rounded-[8px] border border-slate-300 bg-white px-3 pr-10 text-[15px] text-slate-700 outline-none"
                  >
                    <option value="" disabled>Select Company</option>
                    {companyOptions.map((company) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">▼</span>
                </div>
              </label>
              <button
                type="button"
                className="h-[46px] min-w-[120px] rounded-[8px] bg-[#1f6fe5] px-4 text-[15px] font-semibold text-white shadow-sm transition hover:bg-[#195ec2]"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddUserPage
