import { EnergyData, FloorData, RoomData } from '../types'

export function calculateTotalEnergy(rooms: RoomData[]): EnergyData {
  const now = Date.now()
  return rooms.reduce(
    (acc, room) => ({
      timestamp: now,
      total: acc.total + room.energy.total,
      airConditioning: acc.airConditioning + room.energy.airConditioning,
      lighting: acc.lighting + room.energy.lighting,
      socket: acc.socket + room.energy.socket,
    }),
    { timestamp: now, total: 0, airConditioning: 0, lighting: 0, socket: 0 }
  )
}

export function calculateBuildingTotal(floors: FloorData[]): EnergyData {
  const now = Date.now()
  return floors.reduce(
    (acc, floor) => ({
      timestamp: now,
      total: acc.total + floor.energy.total,
      airConditioning: acc.airConditioning + floor.energy.airConditioning,
      lighting: acc.lighting + floor.energy.lighting,
      socket: acc.socket + floor.energy.socket,
    }),
    { timestamp: now, total: 0, airConditioning: 0, lighting: 0, socket: 0 }
  )
}

export function calculateEnergyPerUnitArea(
  energy: number,
  area: number
): number {
  return area > 0 ? energy / area : 0
}

export function formatEnergyValue(value: number): string {
  if (value >= 1000) {
    return (value / 1000).toFixed(2) + ' kWh'
  }
  return value.toFixed(1) + ' Wh'
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculatePercentage(part: number, total: number): number {
  return total > 0 ? (part / total) * 100 : 0
}

export function checkEnergyNormal(
  energy: EnergyData,
  threshold: number = 150
): boolean {
  return energy.total <= threshold
}

export function getAlarmLevel(energy: number): 'low' | 'medium' | 'high' | undefined {
  if (energy > 200) return 'high'
  if (energy > 150) return 'medium'
  if (energy > 120) return 'low'
  return undefined
}
