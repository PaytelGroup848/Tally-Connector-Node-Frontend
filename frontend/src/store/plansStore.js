import { create } from 'zustand'

const usePlansStore = create((set) => ({
  plans: [],
  selectedPlanId: null,
  setPlans: (plans) => set({ plans }),
  setSelectedPlanId: (selectedPlanId) => set({ selectedPlanId }),
  clearPlans: () => set({ plans: [], selectedPlanId: null }),
}))

export default usePlansStore
