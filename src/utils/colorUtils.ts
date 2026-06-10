import * as THREE from 'three'
import { COLORS } from './constants'

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function getEnergyColor(energy: number, isNightMode: boolean): string {
  const thresholds = [100, 150, 200]
  const normalized = Math.min(energy / thresholds[2], 1)
  
  if (normalized < thresholds[0] / thresholds[2]) {
    return isNightMode ? '#1E3A5F' : '#E5E6EB'
  } else if (normalized < thresholds[1] / thresholds[2]) {
    return '#FF7D00'
  } else {
    return '#F53F3F'
  }
}

export function lerpColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  const r = Math.round(c1.r + (c2.r - c1.r) * t)
  const g = Math.round(c1.g + (c2.g - c1.g) * t)
  const b = Math.round(c1.b + (c2.b - c1.b) * t)
  return rgbToHex(r, g, b)
}

export function getFloorColor(
  isSelected: boolean,
  isHovered: boolean,
  isNormal: boolean,
  alarmLevel?: string,
  isNightMode?: boolean
): THREE.Color {
  const theme = isNightMode ? COLORS.night : COLORS.day
  
  if (isSelected) {
    return new THREE.Color(COLORS.primary)
  }
  
  if (!isNormal && alarmLevel) {
    if (alarmLevel === 'high') return new THREE.Color(COLORS.danger)
    if (alarmLevel === 'medium') return new THREE.Color(COLORS.warning)
    return new THREE.Color('#FF7D00')
  }
  
  if (isHovered) {
    return new THREE.Color(theme.floorHover)
  }
  
  return new THREE.Color(theme.floor)
}

export function getWindowColor(
  brightness: number,
  isNightMode: boolean
): THREE.Color {
  const theme = isNightMode ? COLORS.night : COLORS.day
  if (brightness > 0.5) {
    return new THREE.Color(theme.windowLit).multiplyScalar(brightness)
  }
  return new THREE.Color(theme.window)
}
