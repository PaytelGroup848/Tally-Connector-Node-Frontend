export const fallbackPlans = [
  {
    id: "6ab4ea8e13c17fc5c86be1de",
    name: "Pro",
    description: "Complete Tally Sync & Management",

    features: [
      "COMPANY_READ",
      "LEDGER_READ",
      "CUSTOMER_READ",
      "SUPPLIER_READ",
      "STOCK_READ",
      "VOUCHER_READ",
      "REPORTS_READ",
      "CONNECTOR_STATUS",
      "COMMAND_CREATE",
      "SYNC_LEDGER",
      "SYNC_VOUCHER",
      "SYNC_STOCK",
      "SYNC_MASTER",
    ],

    seatLimit: 1,

    pricingOptions: [
      {
        durationMonths: 6,
        price: 1650,
        discountPercent: 0,
        addonPricePerSeat: 1650,
      },
      {
        durationMonths: 12,
        price: 3000,
        discountPercent: 0,
        addonPricePerSeat: 3000,
      },
      {
        durationMonths: 24,
        price: 60000,
        discountPercent: 0,
        addonPricePerSeat: 60000,
      },
    ],

    addonPricePerSeat: 3000,
  },
];

export const durations = [
  {
    months: 6,
    label: "6M",
    fullLabel: "6 Months",
  },
  {
    months: 12,
    label: "1Y",
    fullLabel: "1 Year",
  },
  {
    months: 24,
    label: "2Y",
    fullLabel: "2 Years",
  },
];

export const featureLabels = {
  LEDGER_READ: "Read Ledger",
  SYNC_LEDGER: "Sync Ledger",

  CUSTOMER_READ: "Read Customers",
  SUPPLIER_READ: "Read Suppliers",
  STOCK_READ: "Read Stock",
  VOUCHER_READ: "Read Vouchers",

  REPORTS_READ: "Access Reports",
  COMMAND_CREATE: "Create Entries",

  CONNECTOR_STATUS: "Connector Status",
  COMPANY_READ: "Read Company",

  SYNC_VOUCHER: "Sync Vouchers",
  SYNC_STOCK: "Sync Stock",
  SYNC_MASTER: "Sync Masters",

  EWAY_CREATE: "Create E-Way Bills",
  EWAY_READ: "Read E-Way Bills",

  EINVOICE_CREATE: "Create E-Invoices",
  EINVOICE_READ: "Read E-Invoices",

  PAYMENT_READ: "Read Payments",
  PAYMENT_CREATE: "Create Payments",

  USER_READ: "Read Users",
  USER_CREATE: "Create Users",
};

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN").format(Number(price) || 0);

export const normalizePricingOption = (option, fallbackMonths = 12) => {
  if (typeof option === "number") {
    return {
      durationMonths: fallbackMonths,
      price: Number(option) || 0,
      discountPercent: 0,
      addonPricePerSeat: 0,
    };
  }

  const months = Number(
    option?.durationMonths ??
      option?.months ??
      option?.duration ??
      option?.billingPeriod ??
      fallbackMonths,
  );

  const price = Number(
    option?.price ??
      option?.amount ??
      option?.total ??
      option?.value ??
      option?.planPrice ??
      option?.monthlyPrice ??
      option?.basePrice ??
      0,
  );

  const discountPercent = Number(
    option?.discountPercent ?? option?.discount ?? option?.offerDiscount ?? 0,
  );

  const addonPricePerSeat = Number(
    option?.addonPricePerSeat ??
      option?.extraSeatPrice ??
      option?.additionalSeatPrice ??
      option?.seatPrice ??
      option?.pricePerSeat ??
      option?.perSeatPrice ??
      0,
  );

  return {
    durationMonths: Number.isFinite(months) ? months : fallbackMonths,
    price: Number.isFinite(price) ? price : 0,
    discountPercent: Number.isFinite(discountPercent) ? discountPercent : 0,
    addonPricePerSeat: Number.isFinite(addonPricePerSeat)
      ? addonPricePerSeat
      : 0,
  };
};

export const normalizeFeatures = (plan) => {
  let rawFeatures = [];

  if (Array.isArray(plan?.features)) {
    rawFeatures = plan.features;
  } else if (Array.isArray(plan?.featureList)) {
    rawFeatures = plan.featureList;
  } else if (Array.isArray(plan?.permissions)) {
    rawFeatures = plan.permissions;
  } else if (Array.isArray(plan?.includedFeatures)) {
    rawFeatures = plan.includedFeatures;
  } else if (Array.isArray(plan?.capabilities)) {
    rawFeatures = plan.capabilities;
  }

  return [
    ...new Set(
      rawFeatures
        .map((feature) => {
          if (typeof feature === "string") {
            return feature.trim();
          }

          if (feature && typeof feature === "object") {
            const enabled =
              feature.enabled ??
              feature.active ??
              feature.isActive ??
              feature.included ??
              feature.allowed ??
              true;

            if (enabled === false) {
              return null;
            }

            return (
              feature.code ??
              feature.key ??
              feature.permission ??
              feature.permissionCode ??
              feature.featureCode ??
              feature.slug ??
              feature.id ??
              feature.name ??
              feature.title ??
              null
            );
          }

          return null;
        })
        .filter(Boolean)
        .map((feature) => String(feature).trim()),
    ),
  ];
};

export const normalizePlans = (input) => {
  let rawPlans = [];

  if (Array.isArray(input)) {
    rawPlans = input;
  } else if (Array.isArray(input?.plans)) {
    rawPlans = input.plans;
  } else if (Array.isArray(input?.data?.plans)) {
    rawPlans = input.data.plans;
  } else if (Array.isArray(input?.data)) {
    rawPlans = input.data;
  } else if (Array.isArray(input?.result)) {
    rawPlans = input.result;
  } else if (Array.isArray(input?.result?.plans)) {
    rawPlans = input.result.plans;
  }

  return rawPlans.map((plan, index) => {
    const pricingArray = Array.isArray(plan?.pricingOptions)
      ? plan.pricingOptions
      : Array.isArray(plan?.pricing)
        ? plan.pricing
        : Array.isArray(plan?.prices)
          ? plan.prices
          : Array.isArray(plan?.options)
            ? plan.options
            : [];

    const normalizedPricing = pricingArray.length
      ? pricingArray.map((option) =>
          normalizePricingOption(
            option,
            Number(
              option?.months ??
                option?.durationMonths ??
                option?.duration ??
                12,
            ),
          ),
        )
      : [
          normalizePricingOption(
            {
              durationMonths:
                plan?.durationMonths ?? plan?.duration ?? plan?.months ?? 12,

              price:
                plan?.price ??
                plan?.amount ??
                plan?.monthlyPrice ??
                plan?.basePrice ??
                0,

              discountPercent: plan?.discountPercent ?? plan?.discount ?? 0,

              addonPricePerSeat:
                plan?.addonPricePerSeat ??
                plan?.extraSeatPrice ??
                plan?.additionalSeatPrice ??
                plan?.seatPrice ??
                plan?.pricePerSeat ??
                plan?.perSeatPrice ??
                0,
            },

            Number(
              plan?.durationMonths ?? plan?.duration ?? plan?.months ?? 12,
            ),
          ),
        ];

    const features = normalizeFeatures(plan);

    const normalizedAddonPrice = Number(
      plan?.addonPricePerSeat ??
        plan?.extraSeatPrice ??
        plan?.additionalSeatPrice ??
        plan?.seatPrice ??
        plan?.pricePerSeat ??
        plan?.perSeatPrice ??
        normalizedPricing.find(
          (option) => Number(option?.addonPricePerSeat) > 0,
        )?.addonPricePerSeat ??
        0,
    );

    const pricingOptions = normalizedPricing.map((option) => ({
      ...option,
      addonPricePerSeat:
        Number(option?.addonPricePerSeat) > 0
          ? Number(option.addonPricePerSeat)
          : normalizedAddonPrice,
    }));

    return {
      id:
        plan?.id ??
        plan?.planId ??
        plan?._id ??
        `${plan?.name ?? "plan"}-${index}`,

      name: plan?.name ?? plan?.planName ?? plan?.title ?? `Plan ${index + 1}`,

      description:
        plan?.description ?? plan?.subtitle ?? plan?.summary ?? "Plan details",

      features,

      seatLimit: Number(
        plan?.seatLimit ??
          plan?.maxSeats ??
          plan?.seats ??
          plan?.seat_count ??
          1,
      ),

      pricingOptions,

      addonPricePerSeat: normalizedAddonPrice,
    };
  });
};
