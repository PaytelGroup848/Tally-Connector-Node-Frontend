import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  extractOrganizationContext,
  fetchProfile,
} from '../services/profileApi'

export function useCurrentUser() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const setUser = useAuthStore(
    (state) => state.setUser,
  )

  const logout = useAuthStore(
    (state) => state.logout,
  )

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    let mounted = true

    const loadCurrentUser = async () => {
      if (!accessToken) {
        if (mounted) {
          setUser(null)
          setIsLoading(false)
        }

        return
      }

      try {
        setIsLoading(true)

        const response = await fetchProfile(accessToken)
        const organizationContext =
          extractOrganizationContext(response)
        const currentUser =
          response?.user ||
          response?.data?.user ||
          response?.data ||
          response

        if (
          !currentUser ||
          typeof currentUser !== 'object'
        ) {
          throw new Error(
            'User information not found',
          )
        }

        if (!mounted) return

        const subscription =
          organizationContext.subscription

        setUser({
          ...currentUser,
          organization:
            organizationContext.organization,
          organizationId:
            organizationContext.organizationId,
          owner: organizationContext.owner,
          plan: organizationContext.plan,
          ...(subscription
            ? {
                subscription,
                subscriptionStatus: subscription.status,
                activeSubscription:
                  subscription.active === true &&
                  String(subscription.status).toLowerCase() ===
                    'active',
              }
            : {}),
        })
        setIsLoading(false)
      } catch (error) {
        console.error(
          'CURRENT USER ERROR:',
          error,
        )

        if (!mounted) return

        setUser(null)
        setIsLoading(false)

        /*
         * Invalid token:
         * clear local auth session.
         */
        try {
          await logout()
        } catch (logoutError) {
          console.warn(
            'Failed to clear session:',
            logoutError,
          )
        }
      }
    }

    loadCurrentUser()

    return () => {
      mounted = false
    }
  }, [accessToken, setUser, logout])

  return {
    isLoading,
  }
}