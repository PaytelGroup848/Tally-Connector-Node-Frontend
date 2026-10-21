import { useEffect, useState } from "react";
import { fetchParties } from "../../services/partiesApi";
import { postCompanyCommand } from "../../services/companiesApi";
import { useGstLookup } from "../../hooks/useGstLookup";
import { getGstStateCode, initialPartyForm } from "./utils";

export default function usePartiesData({ accessToken, companyId }) {
  const [parties, setParties] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [partyForm, setPartyForm] = useState(initialPartyForm);
  const [isPartyCreatedOpen, setIsPartyCreatedOpen] = useState(false);
  const gstLookup = useGstLookup(partyForm.gstNumber);

  useEffect(() => {
    if (!accessToken || !companyId) {
      setParties([]);
      setTotal(0);
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    async function loadParties() {
      try {
        setLoading(true);
        setError("");

        const response = await fetchParties({
          accessToken,
          companyId,
          page,
          limit,
          q: search,
        });

        if (!mounted) return;

        const items = response?.data?.items;
        const totalCount = response?.data?.total;

        setParties(Array.isArray(items) ? items : []);
        setTotal(
          Number.isFinite(Number(totalCount)) ? Number(totalCount) : 0,
        );
      } catch (requestError) {
        if (!mounted) return;
        setParties([]);
        setTotal(0);
        setError(requestError?.message || "Failed to load parties.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadParties();
    return () => {
      mounted = false;
    };
  }, [accessToken, companyId, page, limit, search, refreshKey]);

  useEffect(() => {
    if (gstLookup.status !== "valid" || !gstLookup.data) return;

    const data = gstLookup.data;
    setPartyForm((current) => ({
      ...current,
      state: data.state || current.state,
      stateCode: getGstStateCode(data.state) || current.stateCode,
      postalCode: data.pincode || current.postalCode,
      postalAddress: data.address || current.postalAddress,
      gstRegistrationType:
        data.registration_type || current.gstRegistrationType,
      partyName:
        current.partyName || data.trade_name || data.legal_name || "",
    }));
  }, [gstLookup.status, gstLookup.data]);

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
  }

  function handleLimitChange(event) {
    setLimit(Number(event.target.value));
    setPage(1);
  }

  function updatePartyField(field, value) {
    setPartyForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateParty() {
    setCreateError("");
    setCreateMessage("");
    setIsCreateOpen(true);
  }

  function closeCreateParty() {
    if (isCreating) return;
    setIsCreateOpen(false);
    setCreateError("");
    setCreateMessage("");
    setPartyForm(initialPartyForm);
  }

  async function handleCreateParty(event) {
    event.preventDefault();
    if (!accessToken || !companyId) {
      setCreateError("Please select a company before creating a party.");
      return;
    }

    try {
      setIsCreating(true);
      setCreateError("");
      setCreateMessage("");

      await postCompanyCommand(accessToken, companyId, {
        type: "CREATE_PARTY",
        payload: {
          ...partyForm,
          openingBalance: Number(partyForm.openingBalance) || 0,
        },
      });

      setIsCreateOpen(false);
      setPartyForm(initialPartyForm);
      setPage(1);
      setRefreshKey((current) => current + 1);
      setCreateMessage("");
      setIsPartyCreatedOpen(true);
    } catch (requestError) {
      setCreateError(requestError?.message || "Unable to create party.");
    } finally {
      setIsCreating(false);
    }
  }

  return {
    parties,
    page,
    setPage,
    limit,
    total,
    search,
    loading,
    error,
    isCreateOpen,
    isCreating,
    createError,
    createMessage,
    partyForm,
    isPartyCreatedOpen,
    setIsPartyCreatedOpen,
    gstLookup,
    handleSearchChange,
    handleLimitChange,
    updatePartyField,
    openCreateParty,
    closeCreateParty,
    handleCreateParty,
  };
}
