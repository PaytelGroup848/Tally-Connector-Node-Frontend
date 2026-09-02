import { create } from 'zustand'
import { logoutUser } from '../services/authApi'

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(
    'accessToken',
  )
}

const useAuthStore = create((set, get) => ({
  accessToken: getStoredToken(),

  user: null,

  isAuthenticated: !!getStoredToken(),

  setAuth: ({ accessToken, user }) => {
    if (typeof window !== 'undefined') {
      if (accessToken) {
        window.localStorage.setItem(
          'accessToken',
          accessToken,
        )
      } else {
        window.localStorage.removeItem(
          'accessToken',
        )
      }
    }

    set({
      accessToken: accessToken || null,
      user: user || null,
      isAuthenticated: !!accessToken,
    })
  },

  setUser: (user) => {
    set({
      user: user || null,
      isAuthenticated: !!get().accessToken,
    })
  },

  logout: async () => {
    const currentToken = get().accessToken

    try {
      if (currentToken) {
        await logoutUser(currentToken)
      }
    } catch (error) {
      console.warn(
        'Logout API failed, clearing local session anyway:',
        error,
      )
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(
        'accessToken',
      )
    }

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    })
  },
}))

export default useAuthStore