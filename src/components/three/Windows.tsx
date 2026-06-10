import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '../../store/useSceneStore'
import { COLORS } from '../../utils/constants'
import { BUILDING_CONFIG } from '../../utils/constants'

interface WindowsProps {
  floorLevel: number
  energyIntensity: number
}

export function Windows({ floorLevel, energyIntensity }: WindowsProps) {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const timeRef = useRef(0)
  
  const windowConfig = useMemo(() => {
    const windowsPerSide = {
      front: 6,
      back: 6,
      left: 4,
      right: 4,
    }
    
    const positions: Array<{ position: [number, number, number]; rotation: [number, number, number] }> = []
    
    const { width, depth, floorHeight } = BUILDING_CONFIG
    const y = floorLevel * floorHeight + floorHeight / 2 - 0.2
    
    const windowWidth = 1.2
    const windowHeight = 1.5
    const windowGap = 0.8
    
    for (let i = 0; i < windowsPerSide.front; i++) {
      const x = -width / 2 + windowWidth / 2 + i * (windowWidth + windowGap) + 0.8
      positions.push({
        position: [x, y, depth / 2 + 0.01],
        rotation: [0, 0, 0],
      })
    }
    
    for (let i = 0; i < windowsPerSide.back; i++) {
      const x = -width / 2 + windowWidth / 2 + i * (windowWidth + windowGap) + 0.8
      positions.push({
        position: [x, y, -depth / 2 - 0.01],
        rotation: [0, Math.PI, 0],
      })
    }
    
    for (let i = 0; i < windowsPerSide.left; i++) {
      const z = -depth / 2 + windowWidth / 2 + i * (windowWidth + windowGap) + 1
      positions.push({
        position: [-width / 2 - 0.01, y, z],
        rotation: [0, Math.PI / 2, 0],
      })
    }
    
    for (let i = 0; i < windowsPerSide.right; i++) {
      const z = -depth / 2 + windowWidth / 2 + i * (windowWidth + windowGap) + 1
      positions.push({
        position: [width / 2 + 0.01, y, z],
        rotation: [0, -Math.PI / 2, 0],
      })
    }
    
    return { positions, windowWidth, windowHeight }
  }, [floorLevel])
  
  const brightnessValues = useMemo(() => {
    return windowConfig.positions.map(() => {
      const baseBrightness = Math.min(energyIntensity / 100, 1)
      const randomVariation = Math.random() * 0.3
      return Math.min(baseBrightness + randomVariation, 1)
    })
  }, [energyIntensity, windowConfig.positions])
  
  useEffect(() => {
    if (!meshRef.current) return
    
    windowConfig.positions.forEach((win, i) => {
      dummy.position.set(...win.position)
      dummy.rotation.set(...win.rotation)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [windowConfig.positions, dummy])
  
  useFrame((_, delta) => {
    if (!meshRef.current) return
    
    timeRef.current += delta
    const flickerSpeed = 2
    const flickerIntensity = 0.05
    
    const colors = meshRef.current.instanceColor
    if (!colors) {
      const colorArray = new Float32Array(windowConfig.positions.length * 3)
      meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(colorArray, 3)
    }
    
    const colorAttr = meshRef.current.instanceColor!
    const theme = isNightMode ? COLORS.night : COLORS.day
    
    windowConfig.positions.forEach((_, i) => {
      const baseBrightness = brightnessValues[i]
      const flicker = Math.sin(timeRef.current * flickerSpeed + i * 0.5) * flickerIntensity
      const brightness = Math.max(0, Math.min(1, baseBrightness + flicker))
      
      let color: THREE.Color
      if (brightness > 0.4) {
        const warmColor = new THREE.Color(theme.windowLit)
        const intensity = Math.min(brightness * 1.5, 1)
        color = warmColor.multiplyScalar(intensity)
      } else {
        color = new THREE.Color(theme.window)
      }
      
      colorAttr.setXYZ(i, color.r, color.g, color.b)
    })
    
    colorAttr.needsUpdate = true
  })
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, windowConfig.positions.length]}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[windowConfig.windowWidth, windowConfig.windowHeight]} />
      <meshStandardMaterial
        emissive={isNightMode ? COLORS.night.windowLit : '#ffffff'}
        emissiveIntensity={isNightMode ? 0.8 : 0.2}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  )
}
