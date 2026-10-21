function withTimeout(promise, timeoutMs, message) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

export function createVoucherSubmitHandler(options) {
  const { title, accessToken, isJournalStyleVoucher, isSalesInvoice, defaultVoucherType, isReceiptDeliveryNote, requestCompanyId, setSubmitError, setShowSuccessAnimation, advancedVoucherFieldNames, journalRows, isStockJournal, getJournalTotalsInPaise, formatJournalPaise, isSalesOrder, isNoteVoucher, sourceRows, destinationRows, itemRows, setIsSubmitting, submitRequestRef, calculateRowTaxBreakdown, calculateRowAmount, calculateLedgerTotals, subtotal, isJournal, isContra, isSameState, selectedGstin, setSelectedGstin, postCompanyCommand, extractCommandId, fetchCommandStatus, extractCommandStatus, getCommandFailureDetails, setSelectedParty, setSelectedVoucherNumber, resetSelectedPartyBalance, setAdditionalLedgers, setShowLedgerPanel, setJournalRows, createJournalRow, setSourceRows, setDestinationRows, createStockJournalRow, resetItemRows, successTimerRef } = options;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitRequestRef.current) return;

    const form = event.currentTarget;

    setSubmitError(null);
    setShowSuccessAnimation(false);

    const values = Object.fromEntries(new FormData(form).entries());

    const advancedSettings = Object.fromEntries(
      advancedVoucherFieldNames.map((fieldName) => [
        fieldName,
        values[fieldName === "orderDate" ? "advancedOrderDate" : fieldName] ||
        "",
      ]),
    );
    const journalPartyName =
      journalRows.find((row) => row.partyName.trim())?.partyName || "";

    const submittedPartyName = isJournalStyleVoucher
      ? journalPartyName
      : values.partyName;

    const voucherType =
      values.voucherType || (isSalesInvoice ? "Sales" : defaultVoucherType);

    const validationError = (message) => ({
      title: "Check Voucher Details",
      message,
      reason: message,
      action: "Complete the highlighted voucher fields and try again.",
      voucherDetails: {
        voucherType,
        voucherNumber: values.voucherNumber || "",
        party: submittedPartyName || "",
        date: values.date || "",
        company: requestCompanyId || "",
      },
      technicalDetails:
        "The voucher was not submitted because required fields are missing or invalid.",
    });

    if (!accessToken) {
      setSubmitError(
        validationError("Your session has expired. Please sign in again."),
      );
      return;
    }

    if (!requestCompanyId) {
      setSubmitError(
        validationError("Please select a company before creating a voucher."),
      );
      return;
    }

    if (!voucherType || voucherType === "Select Voucher Type") {
      setSubmitError(validationError("Select a voucher type."));
      return;
    }

    if (!isStockJournal && !submittedPartyName?.trim()) {
      setSubmitError(validationError("Select a party ledger."));
      return;
    }

    if (!values.date) {
      setSubmitError(validationError("Select a voucher date."));
      return;
    }

    if (Number.isNaN(Date.parse(values.date))) {
      setSubmitError(validationError("Enter a valid voucher date."));
      return;
    }

    // if (!values.voucherNumber?.trim()) {
    //   setSubmitError(validationError("Enter a voucher number."));
    //   return;
    // }

    if (
      (isSalesInvoice ||
        isSalesOrder ||
        title === "Quotation" ||
        title === "Purchase" ||
        title === "Purchase Order" ||
        isNoteVoucher) &&
      !values.ledgerType?.trim()
    ) {
      setSubmitError(validationError("Select a ledger type."));
      return;
    }

    if (
      isReceiptDeliveryNote &&
      (!values.orderType?.trim() ||
        !values.orderNumber?.trim() ||
        !values.orderDate)
    ) {
      setSubmitError(
        validationError(
          "Complete the order type, order number, and order date for this note.",
        ),
      );
      return;
    }

    if (isJournalStyleVoucher) {
      const { debit: debitTotal, credit: creditTotal } =
        getJournalTotalsInPaise(journalRows);

      const hasEnteredAmount = journalRows.some(
        (row) => String(row.amount ?? "").trim() !== "",
      );

      if (hasEnteredAmount && debitTotal !== creditTotal) {
        setSubmitError(
          validationError(
            `Debit total ₹${formatJournalPaise(debitTotal)} and Credit total ₹${formatJournalPaise(creditTotal)} are not equal. Both amounts should be the same before creating this ${title} voucher.`,
          ),
        );
        return;
      }

      const invalidJournalRow = journalRows.find((row) => {
        const amount = Number(row.amount);

        return (
          !row.type ||
          !row.partyName.trim() ||
          !Number.isFinite(amount) ||
          amount <= 0
        );
      });

      // Keep your existing invalidJournalRow error handling below.

      if (invalidJournalRow) {
        setSubmitError(
          validationError(
            "Complete each journal row with a type, party, and amount greater than 0.",
          ),
        );
        return;
      }
    }
    if (isJournalStyleVoucher) {
      const debitTotal = journalRows
        .filter((row) => row.type === "Debit")
        .reduce((total, row) => total + (Number(row.amount) || 0), 0);

      const creditTotal = journalRows
        .filter((row) => row.type === "Credit")
        .reduce((total, row) => total + (Number(row.amount) || 0), 0);

      if (Math.abs(debitTotal - creditTotal) > 0.009) {
        setSubmitError(
          validationError("Debit and Credit amounts must be the same."),
        );
        return;
      }
    }
    if (isStockJournal) {
      const stockRows = [...sourceRows, ...destinationRows];
      const invalidStockRow = stockRows.find((row) => {
        const quantity = Number(row.qty);
        const rate = Number(row.rate || 0);
        return (
          !row.item?.trim() ||
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isFinite(rate) ||
          rate < 0
        );
      });

      if (invalidStockRow) {
        setSubmitError(
          validationError(
            "Complete each stock row with an item, quantity greater than 0, and a valid rate.",
          ),
        );
        return;
      }
    }

    const itemBasedVoucher = [
      "Sales",
      "Sales Order",
      "Quotation",
      "Purchase",
      "Purchase Order",
      "Delivery Note",
      "Receipt Note",
      "Credit Note",
      "Debit Note",
    ].includes(title);

    if (itemBasedVoucher) {
      const invalidRow = itemRows.find((row) => {
        const quantity = Number(row.quantity);
        const rate = Number(row.rate || 0);
        const discount = Number(row.discount || 0);
        return (
          !row.item?.trim() ||
          !Number.isFinite(quantity) ||
          quantity <= 0 ||
          !Number.isFinite(rate) ||
          rate < 0 ||
          !Number.isFinite(discount) ||
          discount < 0 ||
          discount > 100
        );
      });

      if (invalidRow) {
        setSubmitError(
          validationError(
            "Complete each item with a quantity greater than 0, a valid rate, and a discount between 0 and 100.",
          ),
        );
        return;
      }
    }

    try {
      submitRequestRef.current = true;
      setIsSubmitting(true);
      window.setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);

      const items = isStockJournal
        ? {
          source: sourceRows.map((row) => ({
            ...row,
            quantity: Number(row.qty) || 0,
            amount: (Number(row.qty) || 0) * (Number(row.rate) || 0),
          })),
          destination: destinationRows.map((row) => ({
            ...row,
            quantity: Number(row.qty) || 0,
            amount: (Number(row.qty) || 0) * (Number(row.rate) || 0),
          })),
        }
        : isJournalStyleVoucher
          ? journalRows.map((row) => ({
            type: row.type,
            partyName: row.partyName,
            amount: Number(row.amount) || 0,
          }))
          : itemRows.map((row) => {
            const taxBreakdown = calculateRowTaxBreakdown(row);
            return {
              itemName: row.item || "",
              quantity: Number(row.quantity) || 0,
              rate: Number(row.rate) || 0,
              units: row.units || "",
              discount: Number(row.discount) || 0,
              hsnCode: row.hsnCode || "",
              godown: row.godown || "",
              description: row.description || "",
              amount: calculateRowAmount(row),
              gstRate: Number(row.gstRate ?? 18),
              taxableValue: Number(calculateRowAmount(row).toFixed(2)),
              taxAmount: taxBreakdown.taxAmount,
              cgstAmount: taxBreakdown.cgstAmount,
              sgstAmount: taxBreakdown.sgstAmount,
              igstAmount: taxBreakdown.igstAmount,
              taxInclusive: Boolean(row.taxInclusive),
            };
          });

      const ledgerTotals = calculateLedgerTotals();

      const journalPayload = {
        voucherType,
        voucherNumber: values.voucherNumber || "",
        date: values.date || "",
        particulars: journalRows.map((row) => ({
          type: row.type || "",
          partyName: row.partyName || "",
          amount: Number(row.amount) || 0,
        })),
        narration: values.narration || "",
        advancedSettings,
        ...advancedSettings,
      };

      const command = {
        type: "CREATE_VOUCHER",
        payload: isJournal
          ? journalPayload
          : {
            voucherType,
            partyLedger: isContra ? "" : submittedPartyName || "",
            ledgerType: values.ledgerType || "",
            gstin: voucherType === "Delivery Note" || voucherType === "Receipt Note" ? "" : values.gstin || selectedGstin || "",
              gstType:
                voucherType === "Delivery Note" || voucherType === "Receipt Note"
                  ? ""
                  : isSameState === null
                    ? ""
                    : isSameState
                      ? "CGST_SGST"
                      : "IGST",
            date: values.date || "",
            voucherNumber: values.voucherNumber || "",
            items,
            ledgers: ledgerTotals.entries.map((row) => ({
              ledgerName: row.ledgerName,
              category: row.category,
              calculationType: row.calculationType,
              value: Number(row.value) || 0,
              effect: row.effect,
              amount: Number(row.amount.toFixed(2)),
            })),
            subTotal: Number(subtotal.toFixed(2)),
            taxes: Number(ledgerTotals.taxes.toFixed(2)),
            otherLedgerAmount: Number(ledgerTotals.otherLedgers.toFixed(2)),
            grandTotal: Number(ledgerTotals.grandTotal.toFixed(2)),
            narration: values.narration || "",
            referenceNumber: values.referenceNumber || "",
            referenceDate: values.referenceDate || "",
            orderType: values.orderType || "",
            orderNumber: values.orderNumber || "",
            orderDate: values.orderDate || "",
            reasonForReturn: values.reasonForReturn || "",
            advancedSettings,
            ...advancedSettings,
            ...(isReceiptDeliveryNote && {
              orderDate: values.orderDate || "",
            }),
          },
      };

      form.reset();
      setSelectedParty("");
      setSelectedVoucherNumber("");
      setSelectedGstin("");
      resetSelectedPartyBalance();
      setAdditionalLedgers([]);
      setShowLedgerPanel(false);
      setJournalRows([
        { ...createJournalRow(1), type: "Debit" },
        { ...createJournalRow(2), type: "Credit" },
      ]);
      setSourceRows([createStockJournalRow(1)]);
      setDestinationRows([createStockJournalRow(2)]);
      resetItemRows();

      const commandResponse = isReceiptDeliveryNote
        ? await withTimeout(
          postCompanyCommand(accessToken, requestCompanyId, command),
          30000,
          "Voucher submission timed out. Check the voucher list before trying again.",
        )
        : await postCompanyCommand(accessToken, requestCompanyId, command);

      setShowSuccessAnimation(true);
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = window.setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 7000);

      const commandId = extractCommandId(commandResponse);

      let latestStatus = "";
      let latestStatusResponse = null;

      if (commandId) {
        for (let attempt = 0; attempt < 30; attempt += 1) {
          if (attempt > 0) {
            await new Promise((resolve) => window.setTimeout(resolve, 1000));
          }

          const statusResponse = isReceiptDeliveryNote
            ? await withTimeout(
              fetchCommandStatus(accessToken, commandId),
              5000,
              "Timed out while checking voucher creation status.",
            )
            : await fetchCommandStatus(accessToken, commandId);

          latestStatusResponse = statusResponse;
          latestStatus = extractCommandStatus(statusResponse);

          const normalizedStatus = latestStatus.toLowerCase();

          if (
            [
              "completed",
              "complete",
              "success",
              "succeeded",
              "failed",
              "failure",
              "error",
              "cancelled",
              "done",
            ].includes(normalizedStatus)
          ) {
            break;
          }
        }
      }

      const normalizedLatestStatus = latestStatus.toLowerCase();

      if (
        ["failed", "failure", "error", "cancelled"].includes(
          normalizedLatestStatus,
        )
      ) {
        setSubmitError(
          getCommandFailureDetails(
            latestStatusResponse,
            `${voucherType} voucher submission failed.`,
          ),
        );
        return;
      }
      
      const successfulStatuses = [
        "completed",
        "complete",
        "success",
        "succeeded",
        "done",
      ];
      if (
        isReceiptDeliveryNote &&
        commandId &&
        !successfulStatuses.includes(normalizedLatestStatus)
      ) {
        setSubmitError(
          {
            title: "Voucher Status Not Confirmed",
            message: `The voucher command was submitted, but creation was not confirmed${latestStatus ? ` (latest status: ${latestStatus})` : ""}.`,
            reason:
              "The command status did not reach a recognized successful or failed state before status checking ended.",
            action:
              "Check the voucher list before retrying. Do not submit the same voucher again until you confirm whether it was created.",
            voucherDetails: {
              voucherType,
              voucherNumber: values.voucherNumber || "",
              party: submittedPartyName || "",
              date: values.date || "",
              company: requestCompanyId || "",
            },
            technicalDetails: `Command ID: ${commandId}. Latest reported status: ${latestStatus || "No status returned"}.`,
          },
        );
        return;
      }

    } catch (error) {
      setSubmitError(
        getCommandFailureDetails(
          error,
          error?.message || "Unable to create sales invoice.",
        ),
      );
    } finally {
      submitRequestRef.current = false;
    }
  };

  return handleSubmit;
}
