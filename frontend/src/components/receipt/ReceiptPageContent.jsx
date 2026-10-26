import ReceiptFormFields from './ReceiptFormFields';
import ReceiptHeader from './ReceiptHeader';
import StatusToast from './StatusToast';
import { useReceiptPageState } from './useReceiptPageState';
import { useEffect, useState } from 'react';

function ReceiptPageContent({
  companyId: companyIdProp,
  selectedCompany,
  documentType = 'Receipt',
}) {
  const {
    companyBanks,
    banksLoading,
    ledgerOptions,
    ledgerPage,
    loadMoreLedgers,
    fetchClosingBalance,
    closingBalance,
    closingBalanceLoading,
    closingBalanceError,
    form,
    updateField,
    setClosingBalance,
    closingBalanceEditedRef,
    optionsLoading,
    optionsError,
    handleSubmit,
    handleViewStatus,
    showSuccessAnimation,
    submitError,
    submitMessage,
    isSubmitting,
  } = useReceiptPageState({ companyId: companyIdProp, selectedCompany, documentType });
const [toastVisible, setToastVisible] = useState(false);

useEffect(() => {
  if (submitMessage || submitError) {
    setToastVisible(true);
  }
}, [submitMessage, submitError]);
  return (
    <div className="relative min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
 <StatusToast
  visible={toastVisible && !!(submitMessage || submitError)}
  message={submitError || submitMessage}
  isError={!!submitError}
  onClose={() => setToastVisible(false)}
/>

      {optionsLoading && (
        <div className="absolute inset-x-0 bottom-0 top-0 z-50 flex items-center justify-center bg-slate-950/15 backdrop-blur-[1px]">
          <div className="rounded-xl border border-slate-200 bg-white/90 px-6 py-5 text-sm font-semibold text-slate-700 shadow-xl">
            Loading...
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1280px] overflow-hidden border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]"
      >
        <ReceiptHeader documentType={documentType} onViewStatus={handleViewStatus} />

        <ReceiptFormFields
          form={form}
          updateField={updateField}
          companyBanks={companyBanks}
          banksLoading={banksLoading}
          ledgerOptions={ledgerOptions}
          ledgerPage={ledgerPage}
          loadMoreLedgers={loadMoreLedgers}
          fetchClosingBalance={fetchClosingBalance}
          closingBalance={closingBalance}
          closingBalanceLoading={closingBalanceLoading}
          closingBalanceError={closingBalanceError}
          setClosingBalance={setClosingBalance}
          closingBalanceEditedRef={closingBalanceEditedRef}
          optionsLoading={optionsLoading}
        />


        {optionsError && (
          <div className="bg-[#f5f7f4] px-5 pb-2 pt-0">
            <p className="text-sm text-amber-600">{optionsError}</p>
          </div>
        )}

        <div className="flex justify-end bg-[#f5f7f4] px-5 pb-5 pt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)] disabled:cursor-not-allowed disabled:opacity-60 hover:bg-slate-700"
          >
            {isSubmitting ? 'Create Voucher' : 'Create Voucher'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReceiptPageContent;
