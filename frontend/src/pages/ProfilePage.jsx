import { useState } from 'react'

function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '7011022899',
    postalCode: '',
  })
  const [mobileEditable, setMobileEditable] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleUpdate = () => {
    setMessage('Profile updated successfully.')
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#f3f3f3] p-4 md:p-6">
      <div className="mx-auto max-w-[1100px] rounded-[12px] border border-slate-200 bg-[#f5f5f5] p-4 md:p-6">
        <h1 className="mb-6 text-[28px] font-bold text-slate-900 md:text-[38px]">My Profile</h1>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[15px] font-semibold text-slate-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              placeholder="Full Name"
              onChange={(event) => handleChange('fullName', event.target.value)}
              className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-semibold text-slate-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              placeholder="Email"
              onChange={(event) => handleChange('email', event.target.value)}
              className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="md:col-span-1">
            <label className="mb-2 block text-[15px] font-semibold text-slate-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.mobile}
                placeholder="Mobile Number"
                readOnly={!mobileEditable}
                onChange={(event) => handleChange('mobile', event.target.value)}
                className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 disabled:bg-slate-100"
              />
              <button
                type="button"
                onClick={() => setMobileEditable((current) => !current)}
                className="whitespace-nowrap rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
              >
                ✎ {mobileEditable ? 'Done' : 'Change Number'}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-semibold text-slate-700">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.postalCode}
              placeholder="Postal Code"
              onChange={(event) => handleChange('postalCode', event.target.value)}
              className="w-full rounded-[8px] border border-slate-300 bg-white px-3 py-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleUpdate}
            className="cursor-pointer rounded-[10px] bg-[#1f1f1f] px-10 py-3 text-[18px] font-bold text-white shadow-sm transition hover:bg-black"
          >
            Update
          </button>
          {message && <p className="text-sm font-medium text-emerald-600">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
