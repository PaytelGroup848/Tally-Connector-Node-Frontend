export const getDisplayValue = (entry, keys) => {
      for (const key of keys) {
        if (
          entry?.[key] !== undefined &&
          entry[key] !== null &&
          String(entry[key]).trim()
        ) {
          return String(entry[key]);
        }
      }

      return "";
    };

export const getStockValue = (item, keys) => {
      const normalizedKeys = keys.map((key) =>
        key.replace(/[^a-z0-9]/gi, "").toLowerCase(),
      );

      const candidates = [item, item?.data, item?.payload, item?.item];

      for (const candidate of candidates) {
        if (!candidate || typeof candidate !== "object") {
          continue;
        }

        const matchingKey = Object.keys(candidate).find((key) =>
          normalizedKeys.includes(key.replace(/[^a-z0-9]/gi, "").toLowerCase()),
        );

        if (
          matchingKey &&
          candidate[matchingKey] !== null &&
          candidate[matchingKey] !== undefined &&
          String(candidate[matchingKey]).trim()
        ) {
          return String(candidate[matchingKey]).trim();
        }
      }

      return "";
    };

export const normalizeItemName = (value) =>
      String(value ?? "")
        .trim()
        .toLowerCase();

export const findStockItem = (stockItems, itemName) => {
      const normalizedItemName = normalizeItemName(itemName);

      if (!normalizedItemName) {
        return null;
      }

      return (
        stockItems.find(
          (item) =>
            normalizeItemName(
              getStockValue(item, [
                "itemName",
                "item_name",
                "stockName",
                "stock_name",
                "stockItemName",
                "stock_item_name",
                "item",
                "name",
                "displayName",
              ]),
            ) === normalizedItemName,
        ) || null
      );
    };

export const findStockRate = (stockItems, itemName) => {
      const matchingItem = findStockItem(stockItems, itemName);

      return matchingItem
        ? getStockValue(matchingItem, [
            "rate",
            "salesRate",
            "sellingRate",
            "price",
            "mrp",
            "avgPurRate",
            "purchaseRate",
          ])
        : "";
    };

export const findStockQuantity = (stockItems, itemName) => {
      const matchingItem = findStockItem(stockItems, itemName);

      if (!matchingItem) return "";

      return getStockValue(matchingItem, [
        "quantity",
        "qty",
        "availableQuantity",
        "availableQty",
        "stockQuantity",
        "stockQty",
        "closingQuantity",
        "closingQty",
        "currentStock",
      ]);
    };

export const findStockUnits = (stockItems, itemName) => {
      const matchingItem = findStockItem(stockItems, itemName);

      if (!matchingItem) return "";

      const normalizeKey = (key) =>
        String(key)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

      const unitFieldKeys = new Set([
        "unit",
        "units",
        "unitname",
        "unitsname",
        "uom",
        "uomname",
        "stockunit",
        "stockunits",
        "stockunitname",
        "itemunit",
        "itemunits",
        "measure",
        "measurementunit",
        "unitofmeasure",
        "unitofmeasurement",
        "baseunit",
        "baseunits",
        "primaryunit",
        "unitdetails",
        "unitinfo",
        "unitlist",
        "quantityunit",
      ]);

      const unitLabelKeys = new Set([
        "name",
        "unit",
        "unitname",
        "displayname",
        "formalname",
        "symbol",
        "code",
        "value",
        "abbreviation",
        "shortname",
        "uom",
        "uomname",
      ]);

      const isValue = (value) =>
        (typeof value === "string" || typeof value === "number") &&
        String(value).trim() !== "";

      // Extract the readable unit name from a string or nested object.
      const getUnitLabel = (value) => {
        if (isValue(value)) {
          return String(value).trim();
        }

        if (!value || typeof value !== "object") {
          return "";
        }

        const pending = [value];
        const visited = new Set();

        while (pending.length > 0) {
          const current = pending.shift();

          if (!current || typeof current !== "object") continue;
          if (visited.has(current)) continue;

          visited.add(current);

          const entries = Array.isArray(current)
            ? current.map((entry, index) => [String(index), entry])
            : Object.entries(current);

          for (const [key, child] of entries) {
            if (unitLabelKeys.has(normalizeKey(key)) && isValue(child)) {
              return String(child).trim();
            }
          }

          for (const child of Object.values(current)) {
            if (child && typeof child === "object") {
              pending.push(child);
            }
          }
        }

        return "";
      };

      // Search the entire stock item, including raw and nested objects.
      const pending = [matchingItem];
      const visited = new Set();

      while (pending.length > 0) {
        const current = pending.shift();

        if (!current || typeof current !== "object") continue;
        if (visited.has(current)) continue;

        visited.add(current);

        const entries = Array.isArray(current)
          ? current.map((entry, index) => [String(index), entry])
          : Object.entries(current);

        for (const [key, value] of entries) {
          if (unitFieldKeys.has(normalizeKey(key))) {
            const unitName = getUnitLabel(value);

            if (unitName) {
              return unitName;
            }
          }
        }

        for (const value of Object.values(current)) {
          if (value && typeof value === "object") {
            pending.push(value);
          }
        }
      }

      return "";
    };

export const findStockHsnCode = (stockItems, itemName) => {
      const matchingItem = findStockItem(stockItems, itemName);

      if (!matchingItem) return "";

      const normalizeKey = (key) =>
        String(key)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

      const hsnKeys = new Set([
        "hsn",
        "hsncode",
        "hsncodevalue",
        "hsnnumber",
        "hsnno",
        "itemhsn",
        "itemhsncode",
        "hsnsac",
        "hsnsaccode",
        "hsnsacdetails",
        "hsnorsac",
        "gsthsncode",
        "sac",
        "saccode",
        "sacnumber",
      ]);

      const isValue = (value) =>
        (typeof value === "string" || typeof value === "number") &&
        String(value).trim() !== "";

      const queue = [matchingItem];
      const visited = new Set();

      while (queue.length > 0) {
        const current = queue.shift();

        if (!current || typeof current !== "object") continue;
        if (visited.has(current)) continue;

        visited.add(current);

        const entries = Array.isArray(current)
          ? current.map((value, index) => [String(index), value])
          : Object.entries(current);

        for (const [key, value] of entries) {
          const normalizedKey = normalizeKey(key);

          if (hsnKeys.has(normalizedKey)) {
            if (isValue(value)) {
              return String(value).trim();
            }

            // Handle HSN stored inside an object.
            if (value && typeof value === "object") {
              const nestedQueue = [value];
              const nestedVisited = new Set();

              while (nestedQueue.length > 0) {
                const nested = nestedQueue.shift();

                if (!nested || typeof nested !== "object") continue;
                if (nestedVisited.has(nested)) continue;

                nestedVisited.add(nested);

                const nestedEntries = Array.isArray(nested)
                  ? nested.map((child, index) => [String(index), child])
                  : Object.entries(nested);

                for (const [nestedKey, nestedValue] of nestedEntries) {
                  const normalizedNestedKey = normalizeKey(nestedKey);

                  if (
                    [
                      "code",
                      "value",
                      "number",
                      "hsn",
                      "hsncode",
                      "sac",
                      "saccode",
                    ].includes(normalizedNestedKey) &&
                    isValue(nestedValue)
                  ) {
                    return String(nestedValue).trim();
                  }

                  if (nestedValue && typeof nestedValue === "object") {
                    nestedQueue.push(nestedValue);
                  }
                }
              }
            }
          }

          // Continue searching nested objects such as raw and gstDetails.
          if (value && typeof value === "object") {
            queue.push(value);
          }
        }
      }

      return "";
    };
