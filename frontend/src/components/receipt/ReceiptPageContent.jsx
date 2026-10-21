import { useEffect, useRef, useState } from 'react';

import ReceiptFormFields from './ReceiptFormFields';
import ReceiptHeader from './ReceiptHeader';
import StatusToast from './StatusToast';
import {
  extractLedgers,
  extractVoucherTypes,
  fetchCompanyBank,
  fetchCompanyLedgers,
  fetchCompanyVoucherTypes,
  postCompanyCommand,
  extractBank,
} from '../../services/companiesApi';
import { extractCustomers } from '../../services/customersApi';
import { fetchParties } from '../../services/partiesApi';
import { advancedVoucherFieldNames } from '../../pages/DocumentVoucherPage';
import useAuthStore from '../../store/authStore';
import {
  getBalanceValue,
  getCompanyId,
  getDisplayName,
  getToday,
  getVoucherTypeName,
  LEDGER_PAGE_SIZE,
} from '../../utils/receipt';

function ReceiptPage({
  companyId: companyIdProp,
  selectedCompany,
  documentType = 'Receipt',
}) {
  const [companyBanks, setCompanyBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const companyId = companyIdProp || getCompanyId(selectedCompany);

  const [voucherTypes, setVoucherTypes] = useState([documentType]);
  const [voucherType, setVoucherType] = useState(documentType);
  const [voucherTypesLoading, setVoucherTypesLoading] = useState(false);
  const [voucherTypesError, setVoucherTypesError] = useState('');

  const [ledgerOptions, setLedgerOptions] = useState([]);
  const [ledgerPage, setLedgerPage] = useState({
    nextPage: 1,
    hasMore: false,
    loading: false,
    error: '',
  });
  const ledgerPageRef = useRef(ledgerPage);

  const [closingBalance, setClosingBalance] = useState('');
  const [closingBalanceLoading, setClosingBalanceLoading] = useState(false);
  const [closingBalanceError, setClosingBalanceError] = useState('');
  const closingBalanceRequestRef = useRef(0);
  const closingBalanceEditedRef = useRef(false);

  const [optionsLoading, setOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState('');

  const [form, setForm] = useState({
    voucherType: documentType,
    voucherNumber: '',
    partyName: '',
    date: getToday(),
    transactionType: '',
    ledger: '',
    amount: '',
    narration: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const successTimerRef = useRef(null);
  const submitCooldownTimerRef = useRef(null);
  const submitRequestRef = useRef(false);

  const updateLedgerPage = (pageState) => {
    ledgerPageRef.current = pageState;
    setLedgerPage(pageState);
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetClosingBalance = () => {
    closingBalanceRequestRef.current += 1;
    closingBalanceEditedRef.current = false;
    setClosingBalance('');
    setClosingBalanceLoading(false);
    setClosingBalanceError('');
  };

  const resetForm = () => {
    resetClosingBalance();
    setForm({
      voucherType: documentType,
      voucherNumber: '',
      partyName: '',
      date: getToday(),
      transactionType: '',
      ledger: '',
      amount: '',
      narration: '',
    });
  };

  const loadMoreLedgers = async () => {
    const currentPage = ledgerPageRef.current;
    if (!currentPage.hasMore || currentPage.loading) return;

    updateLedgerPage({ ...currentPage, loading: true, error: '' });

    try {
      const response = await fetchCompanyLedgers(accessToken, companyId, {
        page: currentPage.nextPage,
        limit: LEDGER_PAGE_SIZE,
      });

      const ledgers = extractLedgers(response).filter((ledger) =>
        getDisplayName(ledger, [
          'ledgerName',
          'name',
          'displayName',
          'partyName',
        ]),
      );

      setLedgerOptions((existingLedgers) => [...existingLedgers, ...ledgers]);
      updateLedgerPage({
        nextPage: currentPage.nextPage + 1,
        hasMore: ledgers.length >= LEDGER_PAGE_SIZE,
        loading: false,
        error: '',
      });
    } catch (error) {
      updateLedgerPage({
        ...currentPage,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load more ledgers.',
      });
    }
  };

  const fetchClosingBalance = async (partyName) => {
    const requestId = ++closingBalanceRequestRef.current;
    closingBalanceEditedRef.current = false;
    setClosingBalance('');
    setClosingBalanceError('');

    if (!partyName || !companyId || !accessToken) {
      setClosingBalanceLoading(false);
      return;
    }

    setClosingBalanceLoading(true);

    const [partiesResult, ledgersResult] = await Promise.allSettled([
      fetchParties({
        companyId,
        accessToken,
        page: 1,
        limit: LEDGER_PAGE_SIZE,
        q: partyName,
      }),
      fetchCompanyLedgers(accessToken, companyId, {
        page: 1,
        limit: LEDGER_PAGE_SIZE,
        q: partyName,
      }),
    ]);

    if (requestId !== closingBalanceRequestRef.current) return;

    const matchingEntries = [
      ...(partiesResult.status === 'fulfilled'
        ? extractCustomers(partiesResult.value)
        : []),
      ...(ledgersResult.status === 'fulfilled'
        ? extractLedgers(ledgersResult.value)
        : []),
    ].filter((entry) => {
      const name = getDisplayName(entry, [
        'partyName',
        'name',
        'customerName',
        'ledgerName',
        'displayName',
      ]);

      return name.toLowerCase().trim() === partyName.toLowerCase().trim();
    });

    const balance = matchingEntries
      .map(getBalanceValue)
      .find((value) => value !== null);

    if (balance !== undefined) {
      if (!closingBalanceEditedRef.current) setClosingBalance(balance);
      setClosingBalanceError('');
    } else if (
      partiesResult.status === 'rejected' &&
      ledgersResult.status === 'rejected'
    ) {
      setClosingBalanceError(
        partiesResult.reason?.message ||
          ledgersResult.reason?.message ||
          'Unable to load the selected party closing balance.',
      );
    } else {
      setClosingBalanceError(
        'Closing balance is unavailable for the selected party.',
      );
    }

    setClosingBalanceLoading(false);
  };

  useEffect(() => {
    let active = true;

    const loadBanks = async () => {
      if (!accessToken || !companyId) {
        setCompanyBanks([]);
        return;
      }

      setBanksLoading(true);

      try {
        const response = await fetchCompanyBank(accessToken, companyId, {
          page: 1,
          limit: 100,
          q: '',
        });

        const banks = extractBank(response);
        if (active) setCompanyBanks(banks);
      } catch (error) {
        console.error('Failed to fetch banks:', error);
        if (active) setCompanyBanks([]);
      } finally {
        if (active) setBanksLoading(false);
      }
    };

    loadBanks();
    return () => {
      active = false;
    };
  }, [accessToken, companyId]);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
      if (submitCooldownTimerRef.current) {
        window.clearTimeout(submitCooldownTimerRef.current);
      }
    };
  }, []);

  const selectedParty = ledgerOptions.find(
    (party) =>
      getDisplayName(party, [
        'partyName',
        'name',
        'customerName',
        'ledgerName',
        'displayName',
      ]) === form.partyName,
  );

  const selectedLedger = ledgerOptions.find(
    (ledger) =>
      getDisplayName(ledger, [
        'ledgerName',
        'name',
        'displayName',
        'partyName',
      ]) === form.ledger,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitRequestRef.current) return;

    const formElement = event.currentTarget;
    const formValues = Object.fromEntries(new FormData(formElement).entries());
    const advancedSettings = Object.fromEntries(
      advancedVoucherFieldNames.map((fieldName) => [
        fieldName,
        formValues[fieldName] || '',
      ]),
    );

    setSubmitMessage('');
    setSubmitError('');
    setShowSuccessAnimation(false);

    if (!accessToken || !companyId) {
      setSubmitError(
        `Please select a company before creating a ${documentType.toLowerCase()}.`,
      );
      return;
    }

    const amount = Number(form.amount);

    if (!form.ledger || !form.date || !form.transactionType) {
      setSubmitError(
        'Select a party, date and transaction type before submitting.',
      );
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setSubmitError('Amount must be greater than 0.');
      return;
    }

    const command = {
      type: 'CREATE_VOUCHER',
      payload: {
        voucherType,
        voucherNumber: form.voucherNumber,
        partyLedger:
          getDisplayName(selectedParty, [
            'ledgerName',
            'partyLedger',
            'partyName',
            'name',
            'displayName',
          ]) || form.partyName,
        ledgerType: getDisplayName(selectedParty, [
          'ledgerType',
          'ledger_type',
          'type',
        ]),
        date: form.date,
        transactionType: form.transactionType,
        ledger: form.ledger,
        amount,
        advancedSettings,
        ...advancedSettings,
        narration: form.narration,
      },
    };

    submitRequestRef.current = true;
    setIsSubmitting(true);
    submitCooldownTimerRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
      submitCooldownTimerRef.current = null;
    }, 2000);

    try {
      formElement.reset();
      resetForm();
      setSubmitMessage('');
      await postCompanyCommand(accessToken, companyId, command);

      setShowSuccessAnimation(true);
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }

      successTimerRef.current = window.setTimeout(() => {
        setShowSuccessAnimation(false);
        setSubmitMessage('');
      }, 7000);
    } catch (error) {
      console.error(`${documentType} creation failed:`, error);
      setShowSuccessAnimation(false);
      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          `Unable to create ${documentType.toLowerCase()}.`,
      );
    } finally {
      submitRequestRef.current = false;
    }
  };

  useEffect(() => {
    if (!accessToken || !companyId) {
      setVoucherTypes([documentType]);
      setVoucherType(documentType);
      return undefined;
    }

    let mounted = true;
    setVoucherTypesLoading(true);
    setVoucherTypesError('');

    fetchCompanyVoucherTypes(accessToken, companyId)
      .then((response) => {
        if (!mounted) return;

        const apiVoucherTypes = extractVoucherTypes(response)
          .map(getVoucherTypeName)
          .filter(Boolean);

        const nextVoucherTypes = [...new Set([documentType, ...apiVoucherTypes])];
        setVoucherTypes(nextVoucherTypes);
        setVoucherType((current) =>
          nextVoucherTypes.includes(current) ? current : documentType,
        );
      })
      .catch((error) => {
        if (!mounted) return;

        setVoucherTypes([documentType]);
        setVoucherType(documentType);
        setVoucherTypesError(error?.message || 'Unable to load voucher types.');
      })
      .finally(() => {
        if (mounted) setVoucherTypesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [accessToken, companyId, documentType]);

  useEffect(() => {
    if (!accessToken || !companyId) {
      setLedgerOptions([]);
      updateLedgerPage({
        nextPage: 1,
        hasMore: false,
        loading: false,
        error: '',
      });
      return undefined;
    }

    let mounted = true;
    setOptionsLoading(true);
    setOptionsError('');
    updateLedgerPage({
      nextPage: 1,
      hasMore: false,
      loading: false,
      error: '',
    });

    fetchCompanyLedgers(accessToken, companyId, {
      page: 1,
      limit: LEDGER_PAGE_SIZE,
    })
      .then((response) => {
        if (!mounted) return;

        const firstPage = extractLedgers(response).filter((ledger) =>
          getDisplayName(ledger, [
            'ledgerName',
            'name',
            'displayName',
            'partyName',
          ]),
        );

        setLedgerOptions(firstPage);
        updateLedgerPage({
          nextPage: 2,
          hasMore: firstPage.length >= LEDGER_PAGE_SIZE,
          loading: false,
          error: '',
        });
      })
      .catch((error) => {
        if (!mounted) return;

        setLedgerOptions([]);
        updateLedgerPage({
          nextPage: 1,
          hasMore: false,
          loading: false,
          error: '',
        });
        setOptionsError(error?.message || 'Unable to load ledger options.');
      })
      .finally(() => {
        if (mounted) setOptionsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [accessToken, companyId]);

  const handleViewStatus = () => {
    let path = '/';

    if (documentType === 'Receipt') {
      path = '/my-receipts';
    } else if (documentType === 'Payment') {
      path = '/my-payments';
    }

    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="relative min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <StatusToast
        visible={showSuccessAnimation}
        message="Voucher created successfully, click view status"
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

        {(submitMessage || submitError) && (
          <div className="bg-[#f5f7f4] px-5 pb-2 pt-0">
            <p
              className={`text-sm ${
                submitError ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {submitError || submitMessage}
            </p>
          </div>
        )}

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

export default ReceiptPage;
