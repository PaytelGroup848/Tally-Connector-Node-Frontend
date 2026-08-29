import { useState } from 'react'
import '../css/EwayPage.css'
import '../css/pages/eway.css'

function EwayPage() {
  const steps = ['Log in eInvoice Portal', 'API Registration', 'Verify OTP', 'GST Suvidha Provider', 'Generate e-Invoice']
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const goToNextStep = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1))

  return (
    <div className="eway-page">
      <div className="eway-steps">
        {steps.map((step, index) => <div className={`eway-step ${index === activeStep ? 'current' : ''} ${index < activeStep ? 'completed' : ''}`} key={step}>
          <button type="button" onClick={() => index > 0 && setActiveStep(index)} disabled={index === 0} aria-label={`Go to ${step}`}><span>{index < activeStep ? '✓' : index + 1}</span></button>
          {index === 0 ? <a className="eway-step-label" href="https://einvoice1.gst.gov.in/" target="_blank" rel="noreferrer">{step}</a> : <b>{step}</b>}
        </div>)}
      </div>
      {activeStep === 0 ? <div className="eway-content">
          <div className="eway-instructions"><h1>Click to proceed</h1><a className="eway-portal-button" href="https://einvoice1.gst.gov.in/" target="_blank" rel="noreferrer">eInvoice Portal <span>↗</span></a></div>
          <div className="eway-preview" aria-label="eInvoice portal preview">
            <div className="preview-browser"><span>‹</span><span>›</span><span>↻</span><small>einvoice1.gst.gov.in</small></div>
            <div className="preview-banner"><strong>GOVERNMENT<br />OF INDIA</strong><b>GOODS AND SERVICES TAX<br /><small>e-Invoice System</small></b><em>National Informatics Centre</em></div>
            <div className="preview-nav">Home　 Laws　 Help　 Services　 Registration　 Statistics <b>Login ↪</b></div>
            <div className="preview-body"><div className="preview-art">e-INVOICE<br /><small>GST portal</small></div><div className="preview-login"><strong>E-INVOICE SYSTEM LOGIN</strong><label>User name<input /></label><label>Password<input /></label><button type="button">Login</button></div></div>
          </div>
        </div> : activeStep === 1 ? <div className="eway-api-content">
          <p>Select <b>'API registration'</b> from the main menu on the left side and click on <b>'Create API User'</b></p>
          <div className="api-preview" aria-label="API registration instructions">
            <div className="api-banner"><strong>♜　GOODS AND SERVICES TAX<br />　　e - INVOICE SYSTEM</strong><b>Nation<br />Master<br />Management</b><em>NIC</em></div>
            <div className="api-toolbar">⌂　♟ <span>◉</span></div>
            <div className="api-workspace"><div className="api-sidebar"><div>▣　e-Invoice　⌄</div><div>▣　MIS Reports　⌄</div><div>♣　User Management　⌄</div><div className="api-highlight">▣　API Registration　⌄</div><div>▣　IP Whitelisting　›</div><div>♟　User Credentials　›</div><div className="api-highlight">▣　Create API User</div><div>▣　Freeze API User</div><div>▣　Change API Password</div></div><div className="api-dashboard"><h2>Dash Board</h2><div className="api-cards"><div>◐ <b>Generations</b><span>Yesterday　　　　　　　　 0</span><span>During This month　　　　 0</span></div><div>↗ <b>Cancelled</b><span>Yesterday　　　　　　　　 0</span><span>During This month　　　　 0</span></div></div><div className="api-notes"><b>Notes:</b>　The Bulk IRN generation facility has been enabled. You may download the tools from the portal under <b>Help --&gt; Tools.</b></div></div></div>
            <strong className="api-callout">Create API User</strong><span className="api-arrow">↙</span>
          </div>
        </div> : activeStep === 2 ? <div className="eway-otp-content">
          <p>Enter your mobile number Now, clickon <b>‘Send OTP’</b> and <b>‘Verify OTP’</b> yourself</p>
          <div className="otp-preview" aria-label="Verify OTP instructions">
            <div className="otp-banner"><strong>♜　GOODS AND SERVICES TAX<br />　　e - INVOICE SYSTEM</strong><b>Nation<br />Master<br />Management</b><em>NIC</em></div>
            <div className="otp-toolbar">⌂　♟ <span>◉</span></div>
            <div className="otp-panel"><h2>API Registration</h2><div className="otp-form"><label>Enter OTP:<input value="871125" readOnly /></label><button type="button" onClick={goToNextStep}>Verify OTP</button></div></div>
            <span className="otp-arrow">↗</span>
          </div>
        </div> : activeStep === 3 ? <div className="eway-final-content">
          <p>Select <b>'Through GSP'</b>, choose <b>'Fynamics Techno Solution'</b>, create <b>Username and Password</b></p>
          <div className="provider-preview" aria-label="GST Suvidha Provider instructions">
            <div className="provider-banner"><strong>♜　GOODS AND SERVICES TAX<br />　　e - INVOICE SYSTEM</strong><b>Nation<br />Master<br />Management</b><em>NIC</em></div>
            <div className="provider-toolbar">⌂　♟ <span>◉</span></div>
            <div className="provider-panel"><h2>API Registration Through GSP</h2><div className="provider-options">DO you wish to Register your GSTIN for　<label><input type="radio" name="registration" /> Directly</label><label><input type="radio" name="registration" defaultChecked /> Through GSP</label><label><input type="radio" name="registration" /> Through ERP</label><label><input type="radio" name="registration" /> Through Client-Id of other</label></div><span className="api-interface">API Interface:</span><div className="provider-form"><label>Select your GSP:<select defaultValue="Fynamics Techno Solution"><option>Fynamics Techno Solution</option></select></label><label>Username:<input value="API_    xxxxxxxxxxxxx" readOnly /></label><label>Password:<input value="xxxxxxxxxxxxxx" readOnly /></label><label>Re-enter Password:<input value="xxxxxxxxxxxxxx" readOnly /></label><div><button type="button" onClick={goToNextStep}>Submit</button><button type="button">Exit</button></div></div></div>
          </div>
        </div> : <div className="generate-content">
          <div className="generate-tip">Use your GSP user credentials generated from E-Invoice portal.</div>
          <div className="generate-warning">Please update the GST number in Tally first before GSP registration.</div>
          <form className="generate-form" onSubmit={(event) => event.preventDefault()}>
            <label>GSTIN <em>*</em><input disabled /></label>
            <label>GSP USERNAME <em>*</em><input disabled /></label>
            <label>GSP PASSWORD <em>*</em><span className="password-input"><input type={showPassword ? 'text' : 'password'} disabled /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>◉</button></span></label>
            <button className="generate-submit" type="submit" disabled>PROCEED TO GENERATE EWAY BILL</button>
          </form>
        </div>}
      <div className="eway-footer"><span>For any Help and Support　☎　<span className="whatsapp">●</span>　+91 83 83 83 83 83</span>{activeStep < 4 && <button type="button" onClick={goToNextStep}>Next　→</button>}</div>
    </div>
  )
}

export default EwayPage