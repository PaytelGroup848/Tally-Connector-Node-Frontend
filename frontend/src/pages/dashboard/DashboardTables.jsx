import HorizontalScrollTable from './HorizontalScrollTable'
import Panel from './Panel'

const DashboardTables = ({ customers, dayBook }) => (
  <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <Panel
      title="Top Customers"
      className="h-full"
    >
      <HorizontalScrollTable>
        <table className="cloud-table table-fixed min-w-[640px]">
          <colgroup>
            <col className="w-[7%]" />
            <col className="w-[31%]" />
            <col className="w-[15%]" />
            <col className="w-[16%]" />
            <col className="w-[21%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Sales (&#8377;)</th>
              <th>Receipts (&#8377;)</th>
              <th>Outstanding (&#8377;)</th>
              <th>Days</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? customers.map((row, index) => (
              <tr key={row[0]}>
                <td>{index + 1}</td>
                <td className="break-words font-semibold text-app-text">{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                    {row[4]}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-xs text-app-text-secondary">
                  No customer data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </HorizontalScrollTable>
    </Panel>

    <Panel
      title="Day Book"
      className="h-full"
     
    >
      <HorizontalScrollTable>
        <table className="cloud-table table-fixed min-w-[620px]">
          <colgroup>
            <col className="w-[19%]" />
            <col className="w-[31%]" />
            <col className="w-[20%]" />
            <col className="w-[17%]" />
            <col className="w-[13%]" />
          </colgroup>
          <thead>
            <tr>
              <th>Date</th>
              <th>Particulars</th>
              <th>Type</th>
              <th className="text-right">Amount (&#8377;)</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {dayBook.length > 0 ? dayBook.map((row) => (
              <tr key={`${row[0]}-${row[1]}`}>
                <td className="whitespace-nowrap">{row[0]}</td>
                <td className="break-words font-medium text-app-text">{row[1]}</td>
                <td>{row[2]}</td>
                <td className="text-right font-semibold text-app-text">{row[3]}</td>
                <td>
                  <span className={`status-badge ${row[4] === 'Paid' ? 'status-paid' : 'status-posted'}`}>
                    {row[4]}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="py-12 text-center text-xs text-app-text-secondary">
                  No day book data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </HorizontalScrollTable>
    </Panel>
  </div>
)

export default DashboardTables
