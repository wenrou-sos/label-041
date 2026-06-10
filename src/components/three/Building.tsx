import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Floor } from './Floor'
import { useEnergyStore } from '../../store/useEnergyStore'
import { useSceneStore } from '../../store/useSceneStore'
import { COLORS, BUILDING_CONFIG } from '../../utils/constants'

export function Building() {
  const buildingData = useEnergyStore((state) => state.buildingData)
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const selectedFloorId = useSceneStore((state) => state.selectedFloorId)
  const groupRef = useRef<THREE.Group>(null)
  
  const { width, depth, floorCount, floorHeight } = BUILDING_CONFIG
  const buildingHeight = floorCount * floorHeight
  
  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = selectedFloorId ? 1.02 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2)
    }
  })
  
  if (!buildingData) {
    return (
      <group>
        <mesh position={[0, buildingHeight / 2, 0]}>
          <boxGeometry args={[width, buildingHeight, depth]} />
          <meshStandardMaterial color="#cccccc" transparent opacity={0.5} />
        </mesh>
      </group>
    )
  }
  
  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[width + 1, 0.2, depth + 1]} />
        <meshStandardMaterial
          color={COLORS.primary}
          emissive={COLORS.primary}
          emissiveIntensity={isNightMode ? 0.3 : 0.1}
        />
      </mesh>
      
      <mesh position={[0, buildingHeight / 2, -depth / 2 + 0.1]}>
        <boxGeometry args={[0.5, buildingHeight, 0.5]} />
        <meshStandardMaterial
          color={isNightMode ? '#1D2B4A' : '#E5E6EB'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, buildingHeight / 2, depth / 2 - 0.1]}>
        <boxGeometry args={[0.5, buildingHeight, 0.5]} />
        <meshStandardMaterial
          color={isNightMode ? '#1D2B4A' : '#E5E6EB'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      <mesh position={[0, buildingHeight + 0.5, 0]}>
        <boxGeometry args={[width * 0.6, 1, depth * 0.6]} />
        <meshStandardMaterial
          color={COLORS.primary}
          emissive={COLORS.primary}
          emissiveIntensity={isNightMode ? 0.4 : 0.1}
        />
      </mesh>
      
      <mesh position={[0, buildingHeight + 1.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 8]} />
        <meshStandardMaterial
          color={COLORS.danger}
          emissive={COLORS.danger}
          emissiveIntensity={isNightMode ? 0.8 : 0.3}
        />
      </mesh>
      
      {buildingData.floors.map((floor) => (
        <Floor key={floor.id} floorData={floor} />
      ))}
      
      <mesh position={[0, buildingHeight + 2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={COLORS.danger} />
      </mesh>
    </group>
  )
}
