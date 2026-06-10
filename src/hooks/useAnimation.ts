import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function usePulseAnimation(
  active: boolean,
  speed: number = 2,
  intensity: number = 0.5
) {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)
  
  useFrame((_, delta) => {
    if (!active || !meshRef.current) return
    
    timeRef.current += delta * speed
    const pulse = Math.sin(timeRef.current) * 0.5 + 0.5
    const scale = 1 + pulse * intensity * 0.05
    
    meshRef.current.scale.setScalar(scale)
    
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    if (material.emissive) {
      material.emissiveIntensity = 0.5 + pulse * intensity
    }
  })
  
  return meshRef
}

export function useSmoothPosition(target: [number, number, number], speed: number = 2) {
  const groupRef = useRef<THREE.Group>(null)
  const currentPos = useRef(new THREE.Vector3(...target))
  const targetPos = useMemo(() => new THREE.Vector3(...target), [target])
  
  useFrame((_, delta) => {
    if (!groupRef.current) return
    
    currentPos.current.lerp(targetPos, delta * speed)
    groupRef.current.position.copy(currentPos.current)
  })
  
  return groupRef
}

export function useFloatAnimation(
  active: boolean = true,
  height: number = 0.2,
  speed: number = 1
) {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = useRef<number | null>(null)
  const timeRef = useRef(0)
  
  useFrame((_, delta) => {
    if (!active || !meshRef.current) return
    
    if (initialY.current === null) {
      initialY.current = meshRef.current.position.y
    }
    
    timeRef.current += delta * speed
    const offset = Math.sin(timeRef.current) * height
    meshRef.current.position.y = initialY.current + offset
  })
  
  return meshRef
}

export function useRotationAnimation(
  active: boolean = true,
  speed: number = 0.5
) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((_, delta) => {
    if (!active || !groupRef.current) return
    groupRef.current.rotation.y += delta * speed
  })
  
  return groupRef
}

export function useColorTransition(
  targetColor: THREE.Color,
  speed: number = 3
) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const currentColor = useRef(new THREE.Color(targetColor))
  
  useFrame((_, delta) => {
    if (!materialRef.current) return
    
    currentColor.current.lerp(targetColor, delta * speed)
    materialRef.current.color.copy(currentColor.current)
    materialRef.current.needsUpdate = true
  })
  
  return materialRef
}
