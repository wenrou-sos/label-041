import { create } from 'zustand'
import { BuildingData, FloorData, AlarmData, EnergyTrendPoint } from '../types'

interface EnergyStore {
  buildingData: BuildingData | null
  alarms: AlarmData[]
  trendData: EnergyTrendPoint[]
  selectedFloorData: FloorData | null
  isLoading: boolean
  lastUpdate: number | null
  refreshInterval: number | null
  
  setBuildingData: (data: BuildingData | null) => void
  setAlarms: (alarms: AlarmData[]) => void
  setTrendData: (data: EnergyTrendPoint[]) => void
  setSelectedFloorData: (data: FloorData | null) => void
  setIsLoading: (value: boolean) => void
  setLastUpdate: (timestamp: number) => void
  setRefreshInterval: (id: number | null) => void
  
  acknowledgeAlarm: (alarmId: string) => void
  clearAlarms: () => void
  reset: () => void
}

const initialState = {
  buildingData: null,
  alarms: [],
  trendData: [],
  selectedFloorData: null,
  isLoading: false,
  lastUpdate: null,
  refreshInterval: null,
}

export const useEnergyStore = create<EnergyStore>((set) => ({
  ...initialState,
  
  setBuildingData: (data) => set({ buildingData: data }),
  setAlarms: (alarms) => set({ alarms }),
  setTrendData: (data) => set({ trendData: data }),
  setSelectedFloorData: (data) => set({ selectedFloorData: data }),
  setIsLoading: (value) => set({ isLoading: value }),
  setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),
  setRefreshInterval: (id) => set({ refreshInterval: id }),
  
  acknowledgeAlarm: (alarmId) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, acknowledged: true } : alarm
      ),
    })),
  
  clearAlarms: () => set({ alarms: [] }),
  
  reset: () => set(initialState),
}))
