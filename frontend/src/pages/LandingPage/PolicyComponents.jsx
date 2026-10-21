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
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <p className="leading-7 text-slate-700">{children}</p>
        </div>
    );
};

export const RefundItem = ({ children }) => {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/40">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span>{children}</span>
        </div>
    );
};

export const NonRefundableItem = ({ children }) => {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4 text-sm text-slate-700">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <span>{children}</span>
        </div>
    );
};

export const ChargebackItem = ({ children }) => {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <p className="leading-7 text-slate-700">{children}</p>
        </div>
    );
};
