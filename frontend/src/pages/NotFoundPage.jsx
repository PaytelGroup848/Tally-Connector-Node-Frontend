function NotFoundPage({ path }) {
  const goToDashboard = () => {
    window.history.pushState({}, '', '/dashboard')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-[#f8fafc] px-4 py-10 text-[#17355f]">
      <section className="w-full max-w-lg rounded-lg border border-[#e5ebf2] bg-white p-8 text-center shadow-sm">
        <p className="text-5xl font-semibold text-[#10a878]">404</p>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The requested page does not exist.
        </p>
        {path && (
          <p className="mt-2 break-all text-xs text-slate-400">
            {path}
          </p>
        )}
        <button
          type="button"
          onClick={goToDashboard}
          className="mt-6 rounded-md bg-[#059669] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#047857]"
        >
          Go to Dashboard
        </button>
      </section>
    </div>
  )
}

export default NotFoundPage
