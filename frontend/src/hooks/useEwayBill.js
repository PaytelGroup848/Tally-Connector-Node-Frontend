import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import useAuthStore from "../store/authStore";
import {
  fetchEwayBills,
  fetchEwayBillDetails,
  fetchEwayBillQR,
  generateEwayBill,
  cancelEwayBill,
  updateVehicle,
  saveNICConfig,
  fetchNICConfig,
  verifyNICConfig,
} from "../services/ewayBillApi";

// List Hook
export function useEwayBills(companyId, page, limit, search) {
  const token = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["ewayBills", companyId, page, limit, search],
    queryFn: () => fetchEwayBills(token, companyId, page, limit, search),
    enabled: !!token && !!companyId,
    keepPreviousData: true, // Page change par purana data dikhta rahe
  });
}

// Details Hook
export function useEwayBillDetails(companyId, id) {
  const token = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["ewayBill", companyId, id],
    queryFn: () => fetchEwayBillDetails(token, companyId, id),
    enabled: !!token && !!companyId && !!id,
  });
}

// e-Invoice QR Hook
export function useEwayBillQR(companyId, id) {
  const token = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["ewayBillQR", companyId, id],
    queryFn: () => fetchEwayBillQR(token, companyId, id),
    enabled: !!token && !!companyId && !!id,
  });
}

// Generate Mutation
export function useGenerateEwayBill(companyId) {
  const token = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => generateEwayBill(token, companyId, payload),
    onSuccess: () => {
      // List ko refresh karo
      queryClient.invalidateQueries({ queryKey: ["ewayBills", companyId] });
    },
  });
}

// Cancel Mutation
export function useCancelEwayBill(companyId) {
  const token = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reasonCode, remark }) =>
      cancelEwayBill(token, companyId, id, reasonCode, remark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ewayBills", companyId] });
      queryClient.invalidateQueries({ queryKey: ["ewayBill", companyId] });
    },
  });
}

// Update Vehicle Mutation
export function useUpdateVehicle(companyId) {
  const token = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) =>
      updateVehicle(token, companyId, id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ewayBill", companyId, variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["ewayBills", companyId] });
    },
  });
}

// NIC Config save Mutation
export function useSaveNICConfig(companyId) {
  const token = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => saveNICConfig(token, companyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nicConfig", companyId] });
    },
  });
}

// NIC Config verify Mutation
export function useVerifyNICConfig(companyId) {
  const token = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: () => verifyNICConfig(token, companyId),
  });
}

// NIC Config Query (consignor auto-fill)
export function useNICConfig(companyId) {
  const token = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["nicConfig", companyId],
    queryFn: () => fetchNICConfig(token, companyId),
    enabled: !!token && !!companyId,
    staleTime: 5 * 60 * 1000,
  });
}
