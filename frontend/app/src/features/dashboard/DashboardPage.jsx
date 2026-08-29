function Arrow() {
  return <span className="arrow" aria-hidden="true">›</span>
}

function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`panel overflow-hidden border border-app-border bg-app-surface ${className}`}>
      <header className="panel-header flex min-h-[35px] items-center border-b border-slate-100 px-[13px] text-[13px]">
        <strong>{title}</strong>
        {action || <span className="chevron">⌄</span>}
      </header>
      {children}
    </section>
  )
}

function DashboardPage({ activeTab, setActiveTab, selectedPeriod, setSelectedPeriod, dayBookDate, setDayBookDate, openCustomDatePicker, customDateInput }) {
  return (
    <div className="dashboard-grid grid grid-cols-1 gap-2 bg-app-muted p-2 md:grid-cols-2 md:gap-x-3">
      <Panel title="Summary" action={<select value={selectedPeriod} onChange={(event) => setSelectedPeriod(event.target.value)}><option>This Year (1st Apr ’26 - 31st Mar ’27)</option><option>This Month</option></select>}>
        <div className="metric-grid">{[['CASH', '₹3,09,591'], ['BANK', '₹8,406'], ['INVENTORY AMOUNT', '₹ 0'], ['PAYABLES', '₹17,800']].map(([label, value]) => <div className="metric" key={label}><span>{label}</span><b>{value}</b><Arrow /></div>)}</div>
      </Panel>

      <Panel title={<><span>Need Attention</span><i className="alert-dot">!</i></>} className="attention">
        <div className="attention-grid">{[['INACTIVE CUSTOMERS', '20'], ['INACTIVE STOCKS', '0'], ['PAYMENT REMINDERS', '0 Mobile Missing   |   0 Email Missing'], ['SMS CREDITS', '10']].map(([label, value]) => <div className="attention-item" key={label}><span>{label}</span><b>{value}</b>{label.includes('INACTIVE') && <Arrow />}</div>)}</div>
      </Panel>

      <Panel title="Sales & Receipt" action={<select defaultValue="year"><option value="year">This Year (1st Apr ’26 - 31st Mar ’27)</option></select>} className="sales-panel">
        <div className="totals"><span>Total Sales <b>₹ 0</b></span><span>Total Receipt <b>₹ 0</b></span></div>
        <div className="legend"><i className="sales-color" /> Sales <i className="receipt-color" /> Receipt</div>
        <div className="chart"><div className="y-labels"><span>1.0</span><span>0.8</span><span>0.6</span><span>0.4</span><span>0.2</span><span>0</span></div><div className="plot"><div className="grid-lines" />{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month) => <span key={month}>{month}</span>)}</div></div>
        <div className="month-stats"><div><b>SALES THIS MONTH</b><strong>₹ 0</strong><span>0% <small>↗ vs Last Month</small></span></div><div><b>RECEIPT THIS MONTH</b><strong>₹ 0</strong><span>0% <small>↗ vs Last Month</small></span></div></div>
      </Panel>

      <Panel title="Receivables" action={<a href="#all">View All</a>} className="receivables">
        <div className="receivable-content"><div className="total-receivable">Total Receivables <b>₹ 0</b></div><div className="aging">{[['0 - 45 Days', '#57e3b0'], ['45 - 90 Days', '#ff8b8b'], ['90 - 135 Days', '#ffbd98'], ['135 - 180 Days', '#f8d77d'], ['180 - 225 Days', '#a9a0e9'], ['> 225 Days', '#70c1df']].map(([label, color]) => <div key={label}><i style={{ background: color }} /> <span>{label}<b>₹ 0</b></span></div>)}</div></div>
        <div className="projection"><span>TOTAL OVERDUE AMOUNT <b>₹ 0</b></span><span>PROJECTIONS IN 15 DAYS <b>₹ 0</b></span><span>PROJECTIONS IN 60 DAYS <b>₹ 0</b></span></div>
      </Panel>

      <Panel title="Top 10" className="table-panel"><div className="tabs">{['Customers', 'Suppliers', 'Items Sold By Quantity', 'Items Sold By Value', 'Item'].map((tab) => <button className={activeTab === tab ? 'selected' : ''} onClick={() => setActiveTab(tab)} key={tab} type="button">{tab}</button>)}</div><div className="empty-table">No data available</div></Panel>
      <Panel title="Day Book" action={<div className="day-tabs"><button className={!dayBookDate ? 'selected' : ''} type="button" onClick={() => setDayBookDate('')}>Today</button><button className={dayBookDate === 'yesterday' ? 'selected' : ''} type="button" onClick={() => setDayBookDate('yesterday')}>Yesterday</button><label className={`custom-date-tab ${dayBookDate && dayBookDate !== 'yesterday' ? 'selected' : ''}`}><button type="button" onClick={openCustomDatePicker}>Custom Date</button><input ref={customDateInput} type="date" value={dayBookDate !== 'yesterday' ? dayBookDate : ''} onChange={(event) => setDayBookDate(event.target.value)} aria-label="Select custom date" /></label></div>} className="table-panel"><div className="table-head"><b>Voucher</b><b>Particulars</b><b>Type</b><b>Amount</b></div><div className="empty-table">{dayBookDate === 'yesterday' ? 'No vouchers for yesterday' : dayBookDate ? `No vouchers for ${dayBookDate}` : 'No vouchers for today'}</div></Panel>
    </div>
  )
}

export default DashboardPage
