import { Clock3, DatabaseBackup, Rocket } from "lucide-react";

const DataBackupPage = () => {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 font-sans box-border">
      {/* Page Header */}
      <div className="mb-3 flex min-h-[58px] items-center rounded-md border border-slate-200 bg-white px-4 shadow-sm">
        <h1 className="m-0 text-lg font-semibold text-slate-900">
          Data Backup
        </h1>
      </div>

      {/* Coming Soon Card */}
      <div className="flex min-h-[calc(100vh-150px)] w-full items-center justify-center rounded-md border border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-2xl px-6 py-12 text-center">

          {/* Icon */}
          <div className="mb-7 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#092f52] shadow-lg">
              <DatabaseBackup
                size={46}
                strokeWidth={1.7}
                className="text-white"
              />

              {/* Small status icon */}
              <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 shadow-md">
                <Clock3
                  size={18}
                  strokeWidth={2}
                  className="text-white"
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-extrabold tracking-tight text-[#092f52] sm:text-5xl">
            Coming Soon
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Our Data Backup feature is currently under development.
            We're working on making your business data backup experience
            secure, reliable, and easy to use.
          </p>

          {/* Status */}
          <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#10a66f]" />

            <span className="text-xs font-semibold text-slate-700">
              Feature under development
            </span>
          </div>

          {/* Divider */}
          <div className="mx-auto my-9 h-px max-w-md bg-slate-200" />

          {/* Features */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <DatabaseBackup
                size={22}
                className="mx-auto mb-2 text-[#092f52]"
                strokeWidth={1.8}
              />

              <p className="text-xs font-semibold text-slate-800">
                Secure Backup
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Keep your business data protected.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Rocket
                size={22}
                className="mx-auto mb-2 text-[#10a66f]"
                strokeWidth={1.8}
              />

              <p className="text-xs font-semibold text-slate-800">
                Easy to Use
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Simple and convenient backup management.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Clock3
                size={22}
                className="mx-auto mb-2 text-[#1478ff]"
                strokeWidth={1.8}
              />

              <p className="text-xs font-semibold text-slate-800">
                Coming Soon
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                This feature will be available soon.
              </p>
            </div>
          </div>

          {/* Bottom Message */}
          <p className="mt-9 text-xs text-slate-400">
            Thank you for your patience while we build this feature.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataBackupPage;
