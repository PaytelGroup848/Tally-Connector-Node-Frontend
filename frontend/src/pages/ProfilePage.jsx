import { useEffect, useState } from 'react'
import {
  User,
  Users,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ListChecks,
  ArrowLeft,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
  extractOrganizationProfile,
  extractMySubscription,
  extractTotalUsers,
  fetchMySubscription,
  fetchProfile,
} from '../services/profileApi'

const ProfilePage = () => {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const user = useAuthStore(
    (state) => state.user,
  )

  const [profile, setProfile] = useState(null)
  const [subscriptionFromApi, setSubscriptionFromApi] = useState(null)
  const [totalUsers, setTotalUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [seatLimit, setSeatLimit] = useState(0)

  useEffect(() => {
    let mounted = true

    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')
        setTotalUsers(null)

        const [profileRequest, subscriptionRequest] = await Promise.allSettled([
          fetchProfile(accessToken),
          fetchMySubscription(accessToken),
        ])

        const seatLimit = profileRequest?.value?.data?.subscription?.plan?.seatLimit || 0
        setSeatLimit(seatLimit)
        

        if (profileRequest.status === 'rejected') {
          throw profileRequest.reason
        }

        if (mounted) {
          setProfile(extractOrganizationProfile(profileRequest.value))
          if (subscriptionRequest.status === 'fulfilled') {
            setSubscriptionFromApi(extractMySubscription(subscriptionRequest.value))
            setTotalUsers(extractTotalUsers(subscriptionRequest.value))
          }
        }
      } catch (profileError) {
        if (mounted) {
          setError(
            profileError?.message ||
              'Unable to load profile',
          )
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [accessToken])

  /*
   * Format date as DD/MM/YYYY
   */
  const formatDate = (date) => {
    if (!date) return '-'

    const d = new Date(date)

    if (Number.isNaN(d.getTime())) {
      return '-'
    }

    return d.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  /*
   * Calculate subscription period
   *
   * Formula:
   * Expiry Date - Purchase Date
   *
   * Result:
   * 30 Days
   * 365 Days
   * etc.
   */
  const calculateSubscriptionPeriod = (
    purchaseDate,
    expiryDate,
  ) => {
    if (!purchaseDate || !expiryDate) {
      return '-'
    }

    const start = new Date(purchaseDate)
    const end = new Date(expiryDate)

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return '-'
    }

    const differenceInMilliseconds =
      end.getTime() - start.getTime()

    const differenceInDays = Math.ceil(
      differenceInMilliseconds /
        (1000 * 60 * 60 * 24),
    )

    if (differenceInDays < 0) {
      return 'Expired'
    }

    return `${differenceInDays} Days`
  }

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading profile...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            No profile data found.
          </div>
        </div>
      </div>
    )
  }

  const subscription =
    subscriptionFromApi || profile?.subscription

  const plan =
    subscription?.plan

  /*
   * Active subscription
   */
  const isActive =
    subscription?.status === 'ACTIVE' &&
    subscription?.active === true

  /*
   * Email from authStore
   */
  const email =
    user?.email ||
    user?.user?.email ||
    '-'

  /*
   * Dates
   */
  const purchaseDate =
    subscription?.fromDate

  const expiryDate =
    subscription?.toDate

  /*
   * Subscription period
   */
  const subscriptionPeriod =
    calculateSubscriptionPeriod(
      purchaseDate,
      expiryDate,
    )

  /*
   * Plan features
   *
   * API:
   * subscription.plan.features
   */
  const features =
    plan?.features || []

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">

        {/* Back Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        {/* Page Header */}
       

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Green Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6">
            <div className="flex items-center gap-4">

              {/* User Icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-green-600 shadow">
                <User size={30} />
              </div>

              {/* Header Text */}
              <div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Owner Profile
                </h2>

                <p className="mt-1 text-sm text-green-50">
                  Account and subscription information
                </p>
              </div>

            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Email */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <User size={17} />

                  <span className="text-sm">
                    Email
                  </span>
                </div>

                <p className="break-all text-sm font-semibold text-slate-900">
                  {email}
                </p>
              </div>

              {/* Role */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <ShieldCheck size={17} />

                  <span className="text-sm">
                    Role
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {profile?.role || '-'}
                </p>
              </div>

              {/* Total Users */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Users size={17} />

                  <span className="text-sm">
                    Total Users
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {totalUsers + seatLimit ?? '-'}
                </p>
              </div>

              {/* Subscription Period */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CalendarDays size={17} />

                  <span className="text-sm">
                    Subscription Period
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {subscriptionPeriod}
                </p>
              </div>

              {/* Plan */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CreditCard size={17} />

                  <span className="text-sm">
                    Plan
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {plan?.name || '-'}
                </p>
              </div>

              {/* Status */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CheckCircle2 size={17} />

                  <span className="text-sm">
                    Status
                  </span>
                </div>

                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <CheckCircle2 size={14} />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    <XCircle size={14} />
                    Expired
                  </span>
                )}
              </div>

              {/* Purchase Date */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CalendarDays size={17} />

                  <span className="text-sm">
                    Purchase Date
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {formatDate(purchaseDate)}
                </p>
              </div>

              {/* Expiry Date */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <CalendarDays size={17} />

                  <span className="text-sm">
                    Expiry Date
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {formatDate(expiryDate)}
                </p>
              </div>

            </div>

            {/* Features */}
            <div className="mt-6 rounded-xl border border-slate-200 p-5">

              <div className="mb-4 flex items-center gap-2">
                <ListChecks
                  size={20}
                  className="text-green-600"
                />

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Features
                  </h3>

                  <p className="text-xs text-slate-500">
                    Features included in your plan
                  </p>
                </div>
              </div>

              {features.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2"
                    >
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-green-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {feature}
                      </span>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No features available.
                </p>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage