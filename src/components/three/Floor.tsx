import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FloorData } from '../../types'
import { useSceneStore } from '../../store/useSceneStore'
import { COLORS, BUILDING_CONFIG } from '../../utils/constants'
import { getFloorColor } from '../../utils/colorUtils'
import { usePulseAnimation } from '../../hooks/useAnimation'
import { Windows } from './Windows'

interface FloorProps {
  floorData: FloorData
}

export function Floor({ floorData }: FloorProps) {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const selectedFloorId = useSceneStore((state) => state.selectedFloorId)
  const hoveredFloorId = useSceneStore((state) => state.hoveredFloorId)
  const setSelectedFloorId = useSceneStore((state) => state.setSelectedFloorId)
  const setHoveredFloorId = useSceneStore((state) => state.setHoveredFloorId)
  const setAutoRotate = useSceneStore((state) => state.setAutoRotate)
  
  const groupRef = useRef<THREE.Group>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)
  
  const isSelected = selectedFloorId === floorData.id
  const isHovered = hoveredFloorId === floorData.id
  const hasAlarm = !floorData.isNormal
  
  const pulseRef = usePulseAnimation(hasAlarm && !isSelected, 2, hasAlarm ? 0.8 : 0)
  
  const { width, depth, floorHeight } = BUILDING_CONFIG
  const y = floorData.level * floorHeight
  
  const targetColor = useMemo(() => {
    return getFloorColor(
      isSelected,
      isHovered,
      floorData.isNormal,
      floorData.alarmLevel,
      isNightMode
    )
  }, [isSelected, isHovered, floorData.isNormal, floorData.alarmLevel, isNightMode])
  
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const currentColor = useRef(new THREE.Color(targetColor))
  
  useFrame((_, delta) => {
    if (!materialRef.current) return
    
    currentColor.current.lerp(targetColor, delta * 4)
    materialRef.current.color.copy(currentColor.current)
    
    const targetEmissive = hasAlarm || isSelected || isHovered ? currentColor.current.clone() : new THREE.Color(0x000000)
    materialRef.current.emissive.lerp(targetEmissive, delta * 3)
    materialRef.current.emissiveIntensity = hasAlarm ? 0.6 : isSelected ? 0.4 : isHovered ? 0.2 : 0
    
    if (edgesRef.current) {
      const edgeColor = isSelected 
        ? new THREE.Color(COLORS.primary)
        : hasAlarm
          ? new THREE.Color(COLORS.danger)
          : new THREE.Color(isNightMode ? '#2A3F5F' : '#C9CDD4')
      
      const edgeMaterial = edgesRef.current.material as THREE.LineBasicMaterial
      edgeMaterial.color.lerp(edgeColor, delta * 4)
      edgeMaterial.opacity = isSelected || isHovered || hasAlarm ? 1 : 0.3
    }
    
    if (groupRef.current) {
      const targetY = y + (isSelected ? 0.3 : 0) + (isHovered ? 0.1 : 0)
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * delta * 3
    }
  })
  
  const handleClick = (e: THREE.Event) => {
    e.stopPropagation()
    setSelectedFloorId(isSelected ? null : floorData.id)
  }
  
  const handlePointerOver = (e: THREE.Event) => {
    e.stopPropagation()
    setHoveredFloorId(floorData.id)
    setAutoRotate(false)
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = () => {
    setHoveredFloorId(null)
    setAutoRotate(true)
    document.body.style.cursor = 'auto'
  }
  
  const edgesGeometry = useMemo(() => {
    const geometry = new THREE.BoxGeometry(width, floorHeight * 0.95, depth)
    return new THREE.EdgesGeometry(geometry)
  }, [width, depth, floorHeight])
  
  return (
    <group
      ref={groupRef}
      position={[0, y, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh ref={pulseRef} castShadow receiveShadow>
        <boxGeometry args={[width * 0.98, floorHeight * 0.95, depth * 0.98]} />
        <meshStandardMaterial
          ref={materialRef}
          color={targetColor}
          roughness={0.7}
          metalness={0.3}
          transparent
          opacity={isSelected ? 0.85 : 0.95}
        />
      </mesh>
      
      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          color={isNightMode ? '#2A3F5F' : '#C9CDD4'}
          transparent
          opacity={0.3}
        />
      </lineSegments>
      
      <mesh position={[0, floorHeight * 0.48, 0]}>
        <boxGeometry args={[width * 0.99, 0.02, depth * 0.99]} />
        <meshStandardMaterial
          color={isNightMode ? '#0F1C2E' : '#DADCE0'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      <Windows floorLevel={floorData.level} energyIntensity={floorData.energy.total / 10} />
    </group>
  )
}
