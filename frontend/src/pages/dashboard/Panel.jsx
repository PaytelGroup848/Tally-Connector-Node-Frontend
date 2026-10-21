const Panel = ({ title, action, children, className = '' }) => (
  <section className={`cloud-card overflow-hidden ${className}`}>
    <header className="flex min-h-12 items-center justify-between gap-3 border-b border-app-border-light px-4 sm:px-5">
      <h2 className="text-sm font-bold text-app-text">
        {title}
      </h2>

      {action}
    </header>

    {children}
  </section>
)

export default Panel
