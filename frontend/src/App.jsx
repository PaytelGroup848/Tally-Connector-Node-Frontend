import { useEffect, useState } from 'react'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import PlansPage from './pages/PlansPage'
import ProfilePage from './pages/ProfilePage'
import useAuthStore from './store/authStore'
import { useCurrentUser } from './hooks/useCurrentUser'

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
    return <LoginPage />
  }

  if (!hasActiveSubscription) {
    return <PlansPage />
  }

  /*
   * Profile
   */
  if (currentPath === '/profile') {
    return <ProfilePage />
  }

  /*
   * Dashboard / Main
   */
  return <MainPage />
}

export default App