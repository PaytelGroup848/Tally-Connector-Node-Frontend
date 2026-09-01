import { useEffect } from 'react'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import PlansPage from './pages/PlansPage'
import useAuthStore from './store/authStore'
import { useCurrentUser } from './hooks/useCurrentUser'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const { isLoading } = useCurrentUser()

  const hasActiveSubscription = Boolean(
    user?.activeSubscription === true ||
    user?.subscriptionActive === true ||
    user?.isActiveSubscription === true ||
    user?.subscriptionStatus === 'active' ||
    user?.status === 'active'
  )

  useEffect(() => {
    if (!isAuthenticated) return

    const currentPath = window.location.pathname
    const targetPath = hasActiveSubscription ? '/dashboard' : '/plans'

    if (currentPath === '/' || (currentPath !== '/plans' && !hasActiveSubscription)) {
      window.history.replaceState({}, '', targetPath)
      return
    }

    if (hasActiveSubscription && currentPath === '/plans') {
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [isAuthenticated, hasActiveSubscription])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  if (!hasActiveSubscription) {
    return <PlansPage />
  }

  return <MainPage />
}

export default App;