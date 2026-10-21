export const normalizeCommandKey = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

export const findFirstMeaningfulValue = (source, candidateKeys) => {
      const normalizedKeys = new Set(
        candidateKeys.map((key) => normalizeCommandKey(key)),
      );

      const queue = [source];

      while (queue.length > 0) {
        const currentValue = queue.shift();

        if (!currentValue || typeof currentValue !== "object") {
          continue;
        }

        for (const [key, value] of Object.entries(currentValue)) {
          const normalizedKey = normalizeCommandKey(key);

          if (
            normalizedKeys.has(normalizedKey) &&
            value !== null &&
            value !== undefined &&
            String(value).trim()
          ) {
            return String(value).trim();
          }

          if (value && typeof value === "object") {
            queue.push(value);
          }
        }
      }

      return "";
    };

export const getCommandFailureDetails = (response, fallbackMessage) => {
      const commandRoot =
        response?.data?.command ??
        response?.command ??
        response?.data ??
        response ??
        {};

      const resultRoot = commandRoot?.result ?? response?.result ?? {};

      const title =
        findFirstMeaningfulValue(commandRoot, [
          "title",
          "heading",
          "errorTitle",
        ]) || "Tally Voucher Creation Failed";

      const message =
        findFirstMeaningfulValue(commandRoot, [
          "errorMessage",
          "message",
          "error",
          "description",
        ]) || fallbackMessage;

      const reason =
        findFirstMeaningfulValue(resultRoot, [
          "reason",
          "rejectionReason",
          "whyRejected",
          "rejectedReason",
        ]) || message;

      const action =
        findFirstMeaningfulValue(resultRoot, [
          "action",
          "recommendedAction",
          "fix",
          "nextAction",
          "whatToDo",
        ]) || "Please review the voucher details and try again.";

      const technicalDetails =
        findFirstMeaningfulValue(commandRoot, [
          "technicalDetails",
          "technical_details",
          "exceptions",
          "exception",
          "errors",
        ]) || "Tally reported an exception during voucher creation.";

      const voucherDetails =
        resultRoot?.voucherDetails || commandRoot?.voucherDetails || {};

      const exceptionCount = Array.isArray(response?.exceptions)
        ? response.exceptions.length
        : Array.isArray(response?.data?.exceptions)
          ? response.data.exceptions.length
          : Array.isArray(commandRoot?.exceptions)
            ? commandRoot.exceptions.length
            : 0;

      return {
        title,
        message,
        reason,
        action,
        voucherDetails,
        technicalDetails:
          exceptionCount > 0
            ? `Tally reported ${exceptionCount} exception(s) during voucher creation.`
            : technicalDetails,
      };
    };
