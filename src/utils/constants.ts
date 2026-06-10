export const BUILDING_CONFIG = {
  width: 12,
  depth: 8,
  floorHeight: 3,
  floorCount: 10,
  roomsPerFloor: 8,
}

export const ENERGY_THRESHOLDS = {
  normal: 100,
  warning: 150,
  danger: 200,
}

export const COLORS = {
  primary: '#165DFF',
  success: '#00B42A',
  warning: '#FF7D00',
  danger: '#F53F3F',
  info: '#86909C',
  
  day: {
    background: '#F2F3F5',
    floor: '#E5E6EB',
    floorSelected: '#165DFF',
    floorHover: '#C9CDD4',
    window: '#FFFFFF',
    windowLit: '#FFD700',
    glass: 'rgba(200, 220, 255, 0.3)',
    ground: '#E5E6EB',
    grid: '#C9CDD4',
  },
  
  night: {
    background: '#0A1628',
    floor: '#1D2B4A',
    floorSelected: '#165DFF',
    floorHover: '#2A3F5F',
    window: '#1A2744',
    windowLit: '#FFD700',
    glass: 'rgba(22, 93, 255, 0.2)',
    ground: '#0F1C2E',
    grid: '#1A2744',
  },
}

export const ALARM_LEVELS = {
  low: { color: '#FF7D00', label: '轻微' },
  medium: { color: '#F7BA1E', label: '中等' },
  high: { color: '#F53F3F', label: '严重' },
}

export const REFRESH_INTERVAL = 5000
