import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../../store/useSceneStore'
import { COLORS } from '../../utils/constants'

export function Ground() {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const gridRef = useRef<THREE.GridHelper>(null)
  const planeRef = useRef<THREE.Mesh>(null)
  
  useFrame((_, delta) => {
    if (gridRef.current) {
      const targetOpacity = isNightMode ? 0.3 : 0.5
      const material = gridRef.current.material as THREE.LineBasicMaterial
      material.opacity += (targetOpacity - material.opacity) * delta * 2
      
      const targetColor = new THREE.Color(isNightMode ? COLORS.night.grid : COLORS.day.grid)
      material.color.lerp(targetColor, delta * 2)
    }
    
    if (planeRef.current) {
      const material = planeRef.current.material as THREE.MeshStandardMaterial
      const targetColor = new THREE.Color(isNightMode ? COLORS.night.ground : COLORS.day.ground)
      material.color.lerp(targetColor, delta * 2)
    }
  })
  
  return (
    <group>
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color={isNightMode ? COLORS.night.ground : COLORS.day.ground}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      <gridHelper
        ref={gridRef}
        args={[100, 100, isNightMode ? COLORS.night.grid : COLORS.day.grid, isNightMode ? COLORS.night.grid : COLORS.day.grid]}
        position={[0, 0.01, 0]}
      />
      
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[14, 14.5, 64]} />
        <meshBasicMaterial color={COLORS.primary} transparent opacity={0.6} />
      </mesh>
      
      {[[-18, -18], [18, -18], [-18, 18], [18, 18]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.5, z]}>
          <boxGeometry args={[0.5, 1, 0.5]} />
          <meshStandardMaterial
            color={COLORS.primary}
            emissive={COLORS.primary}
            emissiveIntensity={isNightMode ? 0.5 : 0.2}
          />
        </mesh>
      ))}
    </group>
  )
}
