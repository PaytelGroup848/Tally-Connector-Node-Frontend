function DataTable({ columns = [], rows = [], emptyMessage = 'No data available' }) {
  return <div className="data-table">{columns.length > 0 && <div className="data-table-header">{columns.map((column) => <b key={column}>{column}</b>)}</div>}{rows.length > 0 ? rows.map((row, index) => <div className="data-table-row" key={row.id || index}>{columns.map((column) => <span key={column}>{row[column] ?? '-'}</span>)}</div>) : <div className="data-table-empty">{emptyMessage}</div>}</div>
}

export default DataTable