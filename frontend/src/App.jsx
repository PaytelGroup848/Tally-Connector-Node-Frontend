import { useEffect, useState } from 'react'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import PlansPage from './pages/PlansPage'
import useAuthStore from './store/authStore'
import { useCurrentUser } from './hooks/useCurrentUser'
import SuperAdminPage from './pages/SuperAdminPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsAndConditions from './pages/TermsAndConditions'
import RefundPolicy from './pages/RefundPolicy'
function App() {

  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname,
  )

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  )

  const user = useAuthStore(
    (state) => state.user,
  )
  const isSuperAdmin =
    String(user?.role || '').toUpperCase() === 'SUPER_ADMIN' ||
    user?.isSuperAdmin === true ||
    window.localStorage.getItem('isSuperAdmin') === 'true'

    /*
 * Public Privacy Policy page
 */
if (currentPath === '/privacy-policy') {
  return <PrivacyPage />
}
if (currentPath === '/terms-and-conditions') {
  return <TermsAndConditions />
}
if (currentPath === '/refund-policy') {
  return <RefundPolicy />
}
  const { isLoading } =
    useCurrentUser()

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener(
      'popstate',
      handlePathChange,
    )

    return () => {
      window.removeEventListener(
        'popstate',
        handlePathChange,
      )
    }
  }, [])

  /*
   * This supports subscription information
   * if your verify-token API already returns it.
   *
   * The ProfilePage independently fetches
   * /organizations/me for the authoritative
   * organization subscription data.
   */
  const subscriptionStatus =
    user?.subscriptionStatus ||
    user?.status ||
    user?.subscription?.status ||
    user?.plan?.status ||
    ''

  const hasActiveSubscription =
    Boolean(
      user?.paymentVerified === true ||
      user?.activeSubscription === true ||
      user?.subscriptionActive === true ||
      user?.isActiveSubscription === true ||
      user?.isSubscribed === true ||
      user?.subscription?.active === true ||
      user?.plan?.active === true ||
      String(subscriptionStatus).toLowerCase() ===
      'active' ||
      String(subscriptionStatus).toLowerCase() ===
      'paid' ||
      String(subscriptionStatus).toLowerCase() ===
      'success',
    )

  useEffect(() => {
    if (!isAuthenticated) return

    if (isLoading) return

    if (isSuperAdmin) return

    /*
     * Root redirect
     */
    if (currentPath === '/') {
      window.history.replaceState(
        {},
        '',
        hasActiveSubscription
          ? '/dashboard'
          : '/plans',
      )

      window.dispatchEvent(
        new PopStateEvent('popstate'),
      )

      return
    }

    if (hasActiveSubscription) {
      if (currentPath === '/plans') {
        window.history.replaceState(
          {},
          '',
          '/dashboard',
        )
        window.dispatchEvent(
          new PopStateEvent('popstate'),
        )
      }

      return
    }

    if (currentPath !== '/plans') {
      window.history.replaceState(
        {},
        '',
        '/plans',
      )
      window.dispatchEvent(
        new PopStateEvent('popstate'),
      )
    }
  }, [
    isAuthenticated,
    isLoading,
    currentPath,
    hasActiveSubscription,
  ])

  /*
   * Authentication loading
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    )
  }

  /*
   * Not authenticated
   */
  if (!isAuthenticated) {
    if (currentPath === '/login' || currentPath === '/login/admin') {
      return <LoginPage />
    }

    return <LandingPage />
  }

  if (isSuperAdmin) {
    if (currentPath === '/super-admin' || currentPath.startsWith('/super-admin/')) {
      return <SuperAdminPage />
    }
  }

  if (!hasActiveSubscription) {
    return <PlansPage />
  }

  /*
   * Dashboard / Main
   */
  return <MainPage />
}

export default App