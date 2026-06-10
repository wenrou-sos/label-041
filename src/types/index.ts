export type EnergyCategory = 'airConditioning' | 'lighting' | 'socket'

export interface EnergyData {
  timestamp: number
  total: number
  airConditioning: number
  lighting: number
  socket: number
}

export interface RoomData {
  id: string
  name: string
  floor: number
  area: number
  energy: EnergyData
  isNormal: boolean
}

export interface FloorData {
  id: string
  name: string
  level: number
  rooms: RoomData[]
  energy: EnergyData
  isNormal: boolean
  alarmLevel?: 'low' | 'medium' | 'high'
}

export interface BuildingData {
  id: string
  name: string
  floors: FloorData[]
  totalEnergy: EnergyData
  lastUpdate: number
}

export interface AlarmData {
  id: string
  floorId: string
  floorName: string
  level: 'low' | 'medium' | 'high'
  category: EnergyCategory
  message: string
  timestamp: number
  acknowledged: boolean
}

export interface SceneState {
  isNightMode: boolean
  autoRotate: boolean
  selectedFloorId: string | null
  hoveredFloorId: string | null
  cameraPosition: [number, number, number]
}

export interface EnergyTrendPoint {
  time: string
  total: number
  airConditioning: number
  lighting: number
  socket: number
}

export const CATEGORY_LABELS: Record<EnergyCategory, string> = {
  airConditioning: '空调',
  lighting: '照明',
  socket: '插座',
}

export const CATEGORY_COLORS: Record<EnergyCategory, string> = {
  airConditioning: '#165DFF',
  lighting: '#FF7D00',
  socket: '#00B42A',
}
