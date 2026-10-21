export const LegalSection = ({
    id,
    number,
    title,
    children,
    lastStandardSection = false,
}) => {
    return (
        <section
            id={id}
            className={`scroll-mt-8 ${lastStandardSection
                    ? "pb-10"
                    : "border-b border-slate-200 pb-10"
                } ${number === "01" ? "" : "pt-10"}`}
        >
            <SectionNumber number={number} />

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {title}
            </h2>

            <div className="mt-5 space-y-5 text-[15px] leading-8 text-slate-600">
                {children}
            </div>
        </section>
    );
};

export const SectionNumber = ({ number }) => {
    return (
        <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-widest text-emerald-700">
            SECTION {number}
        </div>
    );
};

export const InfoItem = ({ children }) => {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <p className="leading-7 text-slate-700">{children}</p>
        </div>
    );
};

export const RestrictionItem = ({ children }) => {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span>{children}</span>
        </div>
    );
};

export const HighlightBox = ({ icon, title, children }) => {
    return (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                    {icon}
                </div>

                <div>
                    <p className="font-semibold text-emerald-900">{title}</p>

                    <p className="mt-2 leading-7 text-emerald-800">{children}</p>
                </div>
            </div>
        </div>
    );
};

export const DefinitionRow = ({ term, value }) => {
    return (
        <div className="grid border-b border-slate-200 last:border-b-0 sm:grid-cols-3">
            <div className="p-4 text-sm font-semibold text-slate-900">
                {term}
            </div>

            <div className="p-4 text-sm leading-6 text-slate-600 sm:col-span-2">
                {value}
            </div>
        </div>
    );
};

export const ServiceClause = ({ number, title, children }) => {
    return (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm sm:p-6">
            <div className="flex gap-4">
                <div className="shrink-0">
                    <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-emerald-50 px-2 text-xs font-bold text-emerald-700">
                        {number}
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {title}
                    </h3>

                    <p className="mt-2 text-[15px] leading-7 text-slate-600">
                        {children}
                    </p>
                </div>
            </div>
        </div>
    );
};
