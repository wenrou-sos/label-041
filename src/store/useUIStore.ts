import { create } from 'zustand'

interface UIStore {
  showEnergyPanel: boolean
  showAlarmPanel: boolean
  showFloorDetail: boolean
  isRefreshing: boolean
  notification: { message: string; type: 'success' | 'error' | 'info' } | null
  
  toggleEnergyPanel: () => void
  setShowEnergyPanel: (value: boolean) => void
  toggleAlarmPanel: () => void
  setShowAlarmPanel: (value: boolean) => void
  toggleFloorDetail: () => void
  setShowFloorDetail: (value: boolean) => void
  setIsRefreshing: (value: boolean) => void
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  hideNotification: () => void
  reset: () => void
}

const initialState = {
  showEnergyPanel: true,
  showAlarmPanel: true,
  showFloorDetail: false,
  isRefreshing: false,
  notification: null,
}

export const useUIStore = create<UIStore>((set) => ({
  ...initialState,
  
  toggleEnergyPanel: () =>
    set((state) => ({ showEnergyPanel: !state.showEnergyPanel })),
  setShowEnergyPanel: (value) => set({ showEnergyPanel: value }),
  
  toggleAlarmPanel: () =>
    set((state) => ({ showAlarmPanel: !state.showAlarmPanel })),
  setShowAlarmPanel: (value) => set({ showAlarmPanel: value }),
  
  toggleFloorDetail: () =>
    set((state) => ({ showFloorDetail: !state.showFloorDetail })),
  setShowFloorDetail: (value) => set({ showFloorDetail: value }),
  
  setIsRefreshing: (value) => set({ isRefreshing: value }),
  
  showNotification: (message, type) => set({ notification: { message, type } }),
  hideNotification: () => set({ notification: null }),
  
  reset: () => set(initialState),
}))
