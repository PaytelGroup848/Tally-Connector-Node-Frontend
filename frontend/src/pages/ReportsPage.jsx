const groups = [['Favorites', ['★  My Entries - My Vouchers', '★  Accounting Reports - Ledger Report', '★  Financial Reports - Balance Sheet', '★  Accounting Reports - Day Book']], ['Accounting Reports', ['★  Day Book', '☆  Expenses', '☆  Inactive Customers', '☆  Inactive Items', '★  Ledger Report']], ['My Entries', ['☆  My Vouchers', '☆  My Quotations', '☆  My eWay Bills']]]
const salesReports = ['☆  By Month', '☆  By Bills', '☆  By Ledger', '☆  By Stock Item', '☆  By Voucher Type', '☆  By Ledger Group', '☆  By Stock Group', '☆  By Stock Category']
const stockReports = ['☆  In Stock', '☆  Not In Stock', '☆  Negative Stock']

function ReportGroup({ title, items }) { return <section className="report-group"><h2>▧　{title}</h2>{items.map((item) => <a href="#report" key={item}>{item}</a>)}</section> }
function ReportsPage() { return <div className="reports-page reference-reports"><header><h1>Reports</h1><label>⌕ <input placeholder="Search" /></label></header><div className="reports-columns"><div>{groups.map(([title, items]) => <ReportGroup title={title} items={items} key={title} />)}</div><div><ReportGroup title="Sales Overview" items={salesReports} /><ReportGroup title="Stock Reports" items={stockReports} /></div></div></div> }

export default ReportsPage