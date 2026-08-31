import { useState } from 'react'

const DataBackupPage = () => {
  const [billing, setBilling] = useState('1 Year')
  const [selectedPlan, setSelectedPlan] = useState('PRO')

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

  const renderValue = (value) => {
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
    const isAdmin =
      value === 'ADMIN ONLY' ||
      value.includes?.('ADMIN')

    return (
      <div
        style={{
          color:
            isUnlimited ||
            isCredits ||
            isAdmin
              ? '#159447'
              : '#ff6b1a',

          border:
            isUnlimited || isFree
              ? `1px solid ${
                  isUnlimited
                    ? '#1478ff'
                    : '#ff6b1a'
                }`
              : 'none',

          borderRadius: '20px',

          padding:
            isUnlimited || isFree
              ? '4px 11px'
              : '0',

          display: 'inline-block',
          fontSize: '11px',
          fontWeight: '700',
          lineHeight: '1.35',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    )
  }

  const handleProceed = () => {
    console.log(
      `Proceeding with ${selectedPlan} - ${billing}`
    )
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        background: '#eef3f8',
        padding: '20px',
        fontFamily:
          'Arial, Helvetica, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* PAGE HEADER */}

      <div
        style={{
          background: '#fff',
          border: '1px solid #e1e5e9',
          borderRadius: '6px',
          minHeight: '58px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          marginBottom: '12px',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600',
            color: '#202020',
          }}
        >
          Data Backup
        </h1>
      </div>

      {/* MAIN PAGE CARD */}

      <div
        style={{
          width: '100%',
          background: '#fff',
          border: '1px solid #e1e5e9',
          borderRadius: '7px',
          overflow: 'hidden',
          boxShadow:
            '0 2px 10px rgba(0,0,0,0.04)',
          boxSizing: 'border-box',
        }}
      >
        {/* PAGE TITLE */}

        <div
          style={{
            padding: '18px 20px 14px',
            borderBottom:
              '1px solid #e5e5e5',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: '600',
              color: '#202020',
            }}
          >
            Choose a Plan
          </h2>

          <p
            style={{
              margin:
                '6px 0 0',
              fontSize: '12px',
              color: '#777',
            }}
          >
            Select a plan for your data
            backup requirements.
          </p>
        </div>

        {/* FEATURES TABLE */}

        <div
          style={{
            width: '100%',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              minWidth: '650px',
            }}
          >
            {/* TABLE HEADER */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1.75fr 1fr 1fr 1fr',
                borderBottom:
                  '1px solid #ddd',
                minHeight: '42px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  padding: '0 16px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1f1f1f',
                }}
              >
                FEATURES
              </div>

              {[
                'GROWTH',
                'PRO',
                'PRO +',
              ].map((plan) => (
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
                    justifyContent:
                      'center',
                    background:
                      selectedPlan === plan
                        ? '#effbe9'
                        : '#fff',
                  }}
                >
                  {plan === 'PRO' ? (
                    <span
                      style={{
                        background:
                          '#dffbd5',
                        padding:
                          '7px 18px',
                        borderRadius:
                          '20px',
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

            {/* FEATURES */}

            {features.map(
              (feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1.75fr 1fr 1fr 1fr',
                    minHeight:
                      index ===
                      features.length - 1
                        ? '65px'
                        : '44px',
                    alignItems: 'center',
                    borderBottom:
                      '1px solid #e4e4e4',
                  }}
                >
                  <div
                    style={{
                      padding:
                        '7px 16px',
                      fontSize: '12px',
                      color: '#333',
                      lineHeight: '1.3',
                    }}
                  >
                    {feature.name}
                  </div>

                  <div
                    style={{
                      textAlign:
                        'center',
                      background:
                        '#fff',
                      padding: '5px',
                    }}
                  >
                    {renderValue(
                      feature.growth
                    )}
                  </div>

                  <div
                    style={{
                      textAlign:
                        'center',
                      background:
                        selectedPlan === 'PRO'
                          ? '#f5fff1'
                          : '#fff',
                      padding: '5px',
                    }}
                  >
                    {renderValue(
                      feature.pro
                    )}
                  </div>

                  <div
                    style={{
                      textAlign:
                        'center',
                      background:
                        selectedPlan ===
                        'PRO +'
                          ? '#f5fff1'
                          : '#fff',
                      padding: '5px',
                    }}
                  >
                    {renderValue(
                      feature.proPlus
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* BILLING */}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent:
              'center',
            alignItems: 'center',
            gap: '0',
            margin:
              '22px 20px 18px',
          }}
        >
          <button
            type="button"
            onClick={() =>
              setBilling('1 Year')
            }
            style={{
              width: '150px',
              height: '34px',
              border:
                billing === '1 Year'
                  ? '1px solid #222'
                  : '1px solid #ddd',
              borderRadius:
                '6px 0 0 6px',
              background:
                billing === '1 Year'
                  ? '#fff'
                  : '#f5f5f5',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight:
                billing === '1 Year'
                  ? '600'
                  : '400',
            }}
          >
            1 Year
          </button>

          <button
            type="button"
            onClick={() =>
              setBilling('3 Years')
            }
            style={{
              height: '34px',
              padding: '0 16px',
              border:
                '1px solid #ddd',
              borderLeft: 'none',
              borderRadius:
                '0 6px 6px 0',
              background:
                billing === '3 Years'
                  ? '#f5f5f5'
                  : '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight:
                billing === '3 Years'
                  ? '600'
                  : '400',
            }}
          >
            3 Years
          </button>

          <span
            style={{
              marginLeft:
                '12px',
              background:
                '#dff7d5',
              color:
                '#199337',
              padding:
                '5px 8px',
              borderRadius:
                '4px',
              fontSize: '10px',
              fontWeight: '700',
              whiteSpace:
                'nowrap',
            }}
          >
            Save upto 25%
          </span>
        </div>

        {/* PLAN CARDS */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(3, minmax(0, 1fr))',
            gap: '12px',
            padding:
              '0 20px 20px',
          }}
        >
          {plans.map((plan) => {
            const selected =
              selectedPlan ===
              plan.name

            return (
              <button
                key={plan.name}
                type="button"
                onClick={() =>
                  setSelectedPlan(
                    plan.name
                  )
                }
                style={{
                  border: selected
                    ? '1px solid #43c33f'
                    : '1px solid #ddd',
                  background: selected
                    ? '#f5fff1'
                    : '#fff',
                  borderRadius:
                    '6px',
                  minHeight:
                    '95px',
                  cursor:
                    'pointer',
                  padding:
                    '14px 8px',
                  transition:
                    'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    fontSize:
                      '13px',
                    fontWeight:
                      '600',
                    color:
                      '#1e1e1e',
                    marginBottom:
                      '10px',
                  }}
                >
                  {plan.name}
                </div>

                <div
                  style={{
                    fontSize:
                      '20px',
                    fontWeight:
                      '700',
                    color: '#111',
                  }}
                >
                  {plan.price}
                </div>
              </button>
            )
          })}
        </div>

        {/* PROCEED */}

        <div
          style={{
            padding:
              '0 20px 20px',
          }}
        >
          <button
            type="button"
            onClick={handleProceed}
            style={{
              width: '100%',
              height: '44px',
              border: 'none',
              borderRadius:
                '4px',
              background:
                '#293034',
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