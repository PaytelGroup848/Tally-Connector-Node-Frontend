function StatCard({ label, value, detail }) {
  return <section className="stat-card"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</section>
}

export default StatCard
