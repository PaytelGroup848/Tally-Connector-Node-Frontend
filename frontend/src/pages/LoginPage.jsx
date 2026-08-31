
import React, { useState } from 'react'

const LoginPage = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log('Email:', email)

    // Add your login API here
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fb',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08)',
        }}
      >
        <h2
          style={{
            margin: '0 0 8px',
            textAlign: 'center',
            fontSize: '26px',
            color: '#1f2937',
          }}
        >
          Login
        </h2>

        <p
          style={{
            margin: '0 0 25px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6b7280',
          }}
        >
          Enter your email address to continue
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              height: '46px',
              padding: '0 14px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              outline: 'none',
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '18px',
            }}
          />

          <button
            type="submit"
            style={{
              width: '100%',
              height: '46px',
              border: 'none',
              borderRadius: '8px',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
