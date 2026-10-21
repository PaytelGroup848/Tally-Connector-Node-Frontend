const MetricCard = ({ icon: Icon, label, value, change, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="cloud-metric-card w-full text-left"
  >
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-app-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold text-app-text-secondary">
          {label}
        </p>

        <p className="mt-1 text-xl font-bold tracking-tight text-app-text">
          {value}
        </p>
      </div>
    </div>
  </button>
)

export default MetricCard
