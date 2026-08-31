import React, { useState } from 'react'
import DateRangePicker from '../components/DateRangePicker'

const ManageReminderPage = () => {
  const [search, setSearch] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2027-03-31')

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="flex min-h-[45px] items-center justify-between border-b border-slate-200 bg-white px-4">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          <button
            type="button"
            aria-label="Go back"
            onClick={() => window.history.back()}
            className="text-[27px] font-light leading-none text-slate-900 hover:text-black"
          >
            ←
          </button>

          <div className="leading-tight">

            <h1 className="text-[14px] font-semibold text-slate-900">
              Manage Payment Reminder
            </h1>

            <div className="mt-1 text-[12px] text-slate-900">
              Total Reminder:
              <strong className="ml-1 font-semibold">
                0
              </strong>
            </div>

          </div>
        </div>

        {/* ===================================================
            DATE RANGE
        =================================================== */}
        <div className="flex items-center">

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(nextStart || startDate)
              setEndDate(nextEnd || endDate)
            }}
            compact
          />

        </div>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}
      <section className="mx-2 mt-2 overflow-hidden rounded-lg border border-white bg-white">

        {/* ===================================================
            TOOLBAR
        =================================================== */}
        <div className="flex min-h-[67px] items-center px-5 py-3">

          <div className="flex items-center">

            {/* SEARCH */}
            <label className="flex h-[29px] w-[200px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400">

              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search"
                className="w-full bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400"
              />

            </label>

            {/* ROWS PER PAGE */}
            <div className="ml-4 flex items-center gap-2 text-[12px] text-slate-700">

              <span>
                Rows per page:
              </span>

              <select
                value={rowsPerPage}
                onChange={(event) =>
                  setRowsPerPage(Number(event.target.value))
                }
                className="border-0 bg-transparent px-0 text-[12px] font-medium text-slate-700 outline-none"
              >
                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={30}>
                  30
                </option>
              </select>

              <span className="text-[10px] text-slate-500">
                ▾
              </span>

            </div>

          </div>

        </div>

        {/* ===================================================
            TABLE
        =================================================== */}
        <div className="mx-5 overflow-x-auto">

          {/* TABLE HEADER */}
          <div className="grid min-w-[900px] grid-cols-[1.3fr_1fr_1.15fr_0.85fr_0.65fr] border-y border-slate-300 bg-[#edf2f6] px-4 py-2.5 text-[12px] font-semibold text-slate-800">

            <div>
              Ledger Name
            </div>

            <div>
              Sent Date
            </div>

            <div>
              Next Reminder Date
            </div>

            <div>
              Type
            </div>

            <div className="text-center">
              Action
            </div>

          </div>

          {/* EMPTY TABLE */}
          <div className="flex min-h-[47px] min-w-[900px] items-center justify-center border-b border-slate-200 text-[12px] text-slate-500">
            No data available
          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}
        <div className="flex min-h-[51px] items-center justify-between px-5">

          {/* RECORD COUNT */}
          <span className="text-[12px] text-slate-800">
            1–0 of 0
          </span>

          {/* PAGINATION */}
          <div className="flex items-center gap-1">

            <button
              type="button"
              disabled
              className="flex h-7 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-[18px] text-slate-300 shadow-sm"
            >
              ‹
            </button>

            <button
              type="button"
              disabled
              className="flex h-7 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-[18px] text-slate-300 shadow-sm"
            >
              ›
            </button>

          </div>

        </div>

      </section>
    </div>
  )
}

export default ManageReminderPage