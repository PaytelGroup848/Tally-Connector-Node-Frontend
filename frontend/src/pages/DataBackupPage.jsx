import React, { useState } from 'react'

const DataBackupPage = () => {
  const [billing, setBilling] = useState('1 Year')
  const [selectedPlan, setSelectedPlan] = useState('PRO')
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  const plans = [
    {
      name: 'GROWTH',
      price: '₹ 3,000',
    },
    {
      name: 'PRO',
      price: '₹ 5,000',
    },
    {
      name: 'PRO +',
      price: '₹ 7,000',
    },
  ]

  const features = [
    {
      name: 'App & Web View',
      growth: '✓',
      pro: '✓',
      proPlus: '✓',
    },
    {
      name: '20+ Business Reports',
      growth: '✓',
      pro: '✓',
      proPlus: '✓',
    },
    {
      name: 'Invoice Share on WhatsApp',
      growth: '✓',
      pro: '✓',
      proPlus: '✓',
    },
    {
      name: 'Payment Reminders',
      growth: '100 CREDITS',
      pro: '100 CREDITS',
      proPlus: '100 CREDITS',
    },
    {
      name: 'Create/Edit Vouchers',
      growth: 'FREE 5',
      pro: 'UNLIMITED',
      proPlus: 'UNLIMITED',
    },
    {
      name: 'eWay Bills & eInvoices',
      growth: 'FREE 5',
      pro: 'FREE 5',
      proPlus: 'UNLIMITED',
    },
    {
      name: (
        <>
          <div>Give Access</div>
          <span
            style={{
              display: 'block',
              fontSize: '11px',
              color: '#999',
              marginTop: '3px',
            }}
          >
            Login for Admin / CA / Accountant
          </span>
        </>
      ),
      growth: 'ADMIN ONLY',
      pro: (
        <>
          ADMIN
          <br />
          +1 USER FREE
        </>
      ),
      proPlus: (
        <>
          ADMIN
          <br />
          +1 USER FREE
        </>
      ),
    },
  ]

  const renderValue = (value, type) => {
    if (value === '✓') {
      return (
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#2da43a',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '700',
            margin: '0 auto',
          }}
        >
          ✓
        </div>
      )
    }

    const isUnlimited = value === 'UNLIMITED'
    const isFree = value === 'FREE 5'
    const isCredits = value === '100 CREDITS'
    const isAdmin = value === 'ADMIN ONLY' || value.includes?.('ADMIN')

    return (
      <div
        style={{
          color: isUnlimited || isCredits || isAdmin ? '#159447' : '#ff6b1a',
          border:
            isUnlimited || isFree
              ? `1px solid ${isUnlimited ? '#1478ff' : '#ff6b1a'}`
              : 'none',
          borderRadius: '20px',
          padding:
            isUnlimited || isFree ? '4px 11px' : '0',
          display: 'inline-block',
          fontSize: isCredits || isAdmin ? '11px' : '11px',
          fontWeight: '700',
          lineHeight: '1.35',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.52)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '510px',
          maxHeight: '95vh',
          background: '#fff',
          borderRadius: '7px',
          overflow: 'auto',
          boxShadow: '0 10px 35px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            borderBottom: '1px solid #ddd',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#202020',
            }}
          >
            Choose a Plan
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '25px',
              height: '25px',
              borderRadius: '50%',
              border: 'none',
              background: '#000',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Features table */}
        <div
          style={{
            width: '100%',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              minWidth: '500px',
            }}
          >
            {/* Table heading */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.75fr 1fr 1fr 1fr',
                borderBottom: '1px solid #ddd',
                minHeight: '38px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  padding: '0 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1f1f1f',
                }}
              >
                FEATURES
              </div>

              {['GROWTH', 'PRO', 'PRO +'].map((plan) => (
                <div
                  key={plan}
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#1d1d1d',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      selectedPlan === plan ? '#effbe9' : '#fff',
                  }}
                >
                  {plan === 'PRO' ? (
                    <span
                      style={{
                        background: '#dffbd5',
                        padding: '7px 18px',
                        borderRadius: '20px',
                      }}
                    >
                      {plan}
                    </span>
                  ) : (
                    plan
                  )}
                </div>
              ))}
            </div>

            {/* Features */}
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.75fr 1fr 1fr 1fr',
                  minHeight: index === features.length - 1 ? '65px' : '40px',
                  alignItems: 'center',
                  borderBottom: '1px solid #e4e4e4',
                }}
              >
                <div
                  style={{
                    padding: '7px 12px',
                    fontSize: '12px',
                    color: '#333',
                    lineHeight: '1.3',
                  }}
                >
                  {feature.name}
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    background: '#fff',
                    padding: '5px',
                  }}
                >
                  {renderValue(feature.growth, 'growth')}
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    background:
                      selectedPlan === 'PRO' ? '#f5fff1' : '#fff',
                    padding: '5px',
                  }}
                >
                  {renderValue(feature.pro, 'pro')}
                </div>

                <div
                  style={{
                    textAlign: 'center',
                    padding: '5px',
                  }}
                >
                  {renderValue(feature.proPlus, 'proPlus')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '20px 0 16px',
          }}
        >
          <button
            onClick={() => setBilling('1 Year')}
            style={{
              width: '150px',
              height: '30px',
              border: billing === '1 Year'
                ? '1px solid #222'
                : '1px solid #ddd',
              borderRadius: '6px 0 0 6px',
              background: billing === '1 Year' ? '#fff' : '#f5f5f5',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: billing === '1 Year' ? '600' : '400',
            }}
          >
            1 Year
          </button>

          <button
            onClick={() => setBilling('3 Years')}
            style={{
              height: '30px',
              padding: '0 12px',
              border: '1px solid #ddd',
              borderLeft: 'none',
              borderRadius: '0 6px 6px 0',
              background: billing === '3 Years' ? '#f5f5f5' : '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: billing === '3 Years' ? '600' : '400',
            }}
          >
            3 Years
          </button>

          <span
            style={{
              marginLeft: '-25px',
              transform: 'translateX(70px)',
              background: '#dff7d5',
              color: '#199337',
              padding: '4px 7px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
            }}
          >
            Save upto 25%
          </span>
        </div>

        {/* Plan cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '11px',
            padding: '0 33px 19px',
          }}
        >
          {plans.map((plan) => {
            const selected = selectedPlan === plan.name

            return (
              <button
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                style={{
                  border: selected
                    ? '1px solid #43c33f'
                    : '1px solid #ddd',
                  background: selected ? '#f5fff1' : '#fff',
                  borderRadius: '6px',
                  minHeight: '88px',
                  cursor: 'pointer',
                  padding: '12px 7px',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#1e1e1e',
                    marginBottom: '10px',
                  }}
                >
                  {plan.name}
                </div>

                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#111',
                  }}
                >
                  {plan.price}
                </div>
              </button>
            )
          })}
        </div>

        {/* Proceed */}
        <div
          style={{
            padding: '0 9px 20px',
          }}
        >
          <button
            onClick={() =>
              console.log(
                `Proceeding with ${selectedPlan} - ${billing}`
              )
            }
            style={{
              width: '100%',
              height: '44px',
              border: 'none',
              borderRadius: '4px',
              background: '#293034',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Proceed →
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataBackupPage