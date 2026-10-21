import useAuthStore from "../store/authStore";
import CreatePartyModal from "./parties/CreatePartyModal";
import PartiesPagination from "./parties/PartiesPagination";
import PartiesStyles from "./parties/PartiesStyles";
import PartiesTable from "./parties/PartiesTable";
import PartiesToolbar from "./parties/PartiesToolbar";
import PartyCreatedDialog from "./parties/PartyCreatedDialog";
import usePartiesData from "./parties/usePartiesData";
import { getCompanyId } from "./parties/utils";

function PartiesPage({ selectedCompany: selectedCompanyProp }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const storedSelectedCompany = useAuthStore(
    (state) => state.selectedCompany,
  );
  const selectedCompany = selectedCompanyProp || storedSelectedCompany;
  const companyId = getCompanyId(selectedCompany);
  const {
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
  } = usePartiesData({ accessToken, companyId });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageItems =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : page <= 4
        ? [1, 2, 3, 4, 5, "...", totalPages]
        : page >= totalPages - 3
          ? [
              1,
              "...",
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ]
          : [1, "...", page - 1, page, page + 1, "...", totalPages];

  const closeCreatedDialog = () => setIsPartyCreatedOpen(false);
  const viewPartyStatus = () => {
    setIsPartyCreatedOpen(false);
    window.history.pushState({}, "", "/my-parties");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        background: "#ffffff",
      }}
    >
      <PartiesToolbar
        companyId={companyId}
        limit={limit}
        page={page}
        search={search}
        onSearchChange={handleSearchChange}
        onLimitChange={handleLimitChange}
        onAddParty={openCreateParty}
      />

      {!companyId && (
        <div
          style={{
            margin: "16px",
            padding: "18px",
            textAlign: "center",
            border: "1px solid #fde68a",
            borderRadius: "7px",
            background: "#fffbeb",
            color: "#b45309",
            fontSize: "13px",
          }}
        >
          Please select a company to view parties.
        </div>
      )}

      {companyId && error && (
        <div
          style={{
            margin: "12px 14px",
            padding: "10px 14px",
            border: "1px solid #fecaca",
            borderRadius: "6px",
            background: "#fef2f2",
            color: "#dc2626",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      <PartiesTable
        companyId={companyId}
        parties={parties}
        loading={loading}
        search={search}
      />

      {companyId && (
        <PartiesPagination
          currentPage={page}
          totalPages={totalPages}
          pageItems={pageItems}
          loading={loading}
          onPageChange={setPage}
        />
      )}

      {isCreateOpen && (
        <CreatePartyModal
          partyForm={partyForm}
          gstLookup={gstLookup}
          createError={createError}
          createMessage={createMessage}
          isCreating={isCreating}
          onClose={closeCreateParty}
          onSubmit={handleCreateParty}
          updatePartyField={updatePartyField}
        />
      )}

      {isPartyCreatedOpen && (
        <PartyCreatedDialog
          onClose={closeCreatedDialog}
          onViewStatus={viewPartyStatus}
        />
      )}

      <PartiesStyles />
    </div>
  );
}

export default PartiesPage;
