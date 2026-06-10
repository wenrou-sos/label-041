import {
  BuildingData,
  FloorData,
  RoomData,
  EnergyData,
  AlarmData,
  EnergyTrendPoint,
  EnergyCategory,
} from '../types'
import { BUILDING_CONFIG } from '../utils/constants'
import {
  calculateTotalEnergy,
  calculateBuildingTotal,
  checkEnergyNormal,
  getAlarmLevel,
} from '../utils/energyCalculator'

const ROOM_NAMES = [
  '会议室A', '办公室B', '休息区', '数据中心',
  '开放工位区', '经理室', '财务室', '机房',
]

function generateEnergyData(baseValue: number = 80): EnergyData {
  const now = Date.now()
  const variance = () => Math.random() * 40 - 20
  const airConditioning = Math.max(20, baseValue * 0.4 + variance())
  const lighting = Math.max(10, baseValue * 0.3 + variance() * 0.5)
  const socket = Math.max(15, baseValue * 0.3 + variance() * 0.5)
  
  return {
    timestamp: now,
    total: airConditioning + lighting + socket,
    airConditioning,
    lighting,
    socket,
  }
}

function generateRoomData(floor: number, index: number): RoomData {
  const baseEnergy = 70 + Math.random() * 60
  const energy = generateEnergyData(baseEnergy)
  const isNormal = checkEnergyNormal(energy)
  
  return {
    id: `room-${floor}-${index}`,
    name: ROOM_NAMES[index % ROOM_NAMES.length] + (Math.floor(index / ROOM_NAMES.length) > 0 ? ` ${Math.floor(index / ROOM_NAMES.length) + 1}` : ''),
    floor,
    area: 30 + Math.random() * 50,
    energy,
    isNormal,
  }
}

function generateFloorData(level: number): FloorData {
  const roomCount = BUILDING_CONFIG.roomsPerFloor
  const rooms = Array.from({ length: roomCount }, (_, i) =>
    generateRoomData(level, i)
  )
  
  const energy = calculateTotalEnergy(rooms)
  const isNormal = checkEnergyNormal(energy, 1000)
  const alarmLevel = getAlarmLevel(energy.total / 10)
  
  return {
    id: `floor-${level}`,
    name: `${level}层`,
    level,
    rooms,
    energy,
    isNormal,
    alarmLevel,
  }
}

function generateBuildingData(): BuildingData {
  const floors = Array.from(
    { length: BUILDING_CONFIG.floorCount },
    (_, i) => generateFloorData(i + 1)
  )
  
  const totalEnergy = calculateBuildingTotal(floors)
  
  return {
    id: 'building-001',
    name: '智慧大厦A座',
    floors,
    totalEnergy,
    lastUpdate: Date.now(),
  }
}

function generateAlarms(building: BuildingData): AlarmData[] {
  const alarms: AlarmData[] = []
  const categories: EnergyCategory[] = ['airConditioning', 'lighting', 'socket']
  const messages: Record<EnergyCategory, string> = {
    airConditioning: '空调能耗超标',
    lighting: '照明能耗异常',
    socket: '插座用电异常',
  }
  
  building.floors.forEach((floor) => {
    if (!floor.isNormal && floor.alarmLevel) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      alarms.push({
        id: `alarm-${floor.id}-${Date.now()}`,
        floorId: floor.id,
        floorName: floor.name,
        level: floor.alarmLevel,
        category,
        message: `${floor.name} ${messages[category]}`,
        timestamp: Date.now() - Math.random() * 3600000,
        acknowledged: Math.random() > 0.7,
      })
    }
  })
  
  return alarms.sort((a, b) => b.timestamp - a.timestamp)
}

function generateTrendData(hours: number = 24): EnergyTrendPoint[] {
  const now = new Date()
  const data: EnergyTrendPoint[] = []
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    const hourFactor = Math.sin((time.getHours() - 6) * Math.PI / 12) * 0.5 + 0.5
    const baseEnergy = 500 + hourFactor * 800 + Math.random() * 200
    
    data.push({
      time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      total: baseEnergy,
      airConditioning: baseEnergy * 0.4 + Math.random() * 100,
      lighting: baseEnergy * 0.3 + Math.random() * 50,
      socket: baseEnergy * 0.3 + Math.random() * 50,
    })
  }
  
  return data
}

export const mockApi = {
  async getBuilding(): Promise<BuildingData> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return generateBuildingData()
  },
  
  async getFloor(floorId: string): Promise<FloorData | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const levelMatch = floorId.match(/floor-(\d+)/)
    if (!levelMatch) return null
    const level = parseInt(levelMatch[1])
    return generateFloorData(level)
  },
  
  async getTrendData(floorId?: string, period: number = 24): Promise<EnergyTrendPoint[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return generateTrendData(period)
  },
  
  async getAlarms(): Promise<AlarmData[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    const building = generateBuildingData()
    return generateAlarms(building)
  },
  
  async acknowledgeAlarm(_alarmId: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return { success: true }
  },
  
  async refreshAll(): Promise<{
    building: BuildingData
    alarms: AlarmData[]
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const building = generateBuildingData()
    const alarms = generateAlarms(building)
    return { building, alarms }
  },
}
