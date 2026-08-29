function getPageMeta(path = '') {
  const normalizedPath = path.toLowerCase()

  if (normalizedPath.includes('/parties/add-new')) {
    return {
      title: 'Add New Party',
      subtitle: 'Create a new customer or vendor profile',
      fields: [
        { label: 'Party Name', placeholder: 'Enter party name' },
        { label: 'Contact Number', placeholder: 'Enter phone number' },
        { label: 'Email', placeholder: 'Enter email address' },
        { label: 'Opening Balance', placeholder: 'Enter amount' },
      ],
    }
  }

  if (normalizedPath.includes('/items/add-new')) {
    return {
      title: 'Add New Item',
      subtitle: 'Create a new stock item',
      fields: [
        { label: 'Item Name', placeholder: 'Enter item name' },
        { label: 'HSN Code', placeholder: 'Enter HSN code' },
        { label: 'Unit', placeholder: 'e.g. Nos, Kg' },
        { label: 'Opening Stock', placeholder: 'Enter stock quantity' },
      ],
    }
  }

  if (normalizedPath.includes('/my-stock-items/add-new')) {
    return {
      title: 'Add New Stock Item',
      subtitle: 'Create a stock item entry',
      fields: [
        { label: 'Stock Item', placeholder: 'Enter stock item name' },
        { label: 'Category', placeholder: 'Enter category' },
        { label: 'Unit Price', placeholder: 'Enter unit price' },
      ],
    }
  }

  if (normalizedPath.includes('/my-ledgers/add-new')) {
    return {
      title: 'Add New Ledger',
      subtitle: 'Create a ledger account',
      fields: [
        { label: 'Ledger Name', placeholder: 'Enter ledger name' },
        { label: 'Group', placeholder: 'Select group' },
        { label: 'Opening Balance', placeholder: 'Enter opening balance' },
      ],
    }
  }

  return {
    title: 'Add New Record',
    subtitle: 'Create a new record',
    fields: [
      { label: 'Name', placeholder: 'Enter name' },
      { label: 'Date', placeholder: 'Select date' },
      { label: 'Amount', placeholder: 'Enter amount' },
    ],
  }
}

function AddNewPage({ path }) {
  const meta = getPageMeta(path)

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Create</div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{meta.title}</h1>
          </div>
          <button type="button" onClick={() => window.history.back()} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
            Back
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 text-sm text-slate-600">{meta.subtitle}</p>

          <div className="grid gap-5 md:grid-cols-2">
            {meta.fields.map((field) => (
              <label key={field.label} className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                {field.label}
                <input
                  type={field.label.toLowerCase().includes('date') ? 'date' : 'text'}
                  placeholder={field.placeholder}
                  className="h-11 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:bg-white"
                />
              </label>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button type="button" onClick={() => window.history.back()} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Cancel
            </button>
            <button type="button" className="rounded-md bg-[#1f2d3d] px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNewPage
