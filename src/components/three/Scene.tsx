import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Building } from './Building'
import { Ground } from './Ground'
import { useSceneStore } from '../../store/useSceneStore'
import { COLORS } from '../../utils/constants'

function CameraAnimation() {
  const { camera } = useThree()
  const cameraPosition = useSceneStore((state) => state.cameraPosition)
  const targetPos = useRef(new THREE.Vector3(...cameraPosition))
  
  useEffect(() => {
    targetPos.current.set(...cameraPosition)
  }, [cameraPosition])
  
  useFrame((_, delta) => {
    camera.position.lerp(targetPos.current, delta * 3)
    camera.lookAt(0, 15, 0)
  })
  
  return null
}

function SceneLighting() {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const directionalRef = useRef<THREE.DirectionalLight>(null)
  const hemisphereRef = useRef<THREE.HemisphereLight>(null)
  
  useFrame((_, delta) => {
    if (!ambientRef.current || !directionalRef.current || !hemisphereRef.current) return
    
    const targetAmbientIntensity = isNightMode ? 0.2 : 0.6
    const targetDirectionalIntensity = isNightMode ? 0.3 : 1.0
    const targetHemisphereIntensity = isNightMode ? 0.1 : 0.5
    
    ambientRef.current.intensity += (targetAmbientIntensity - ambientRef.current.intensity) * delta * 2
    directionalRef.current.intensity += (targetDirectionalIntensity - directionalRef.current.intensity) * delta * 2
    hemisphereRef.current.intensity += (targetHemisphereIntensity - hemisphereRef.current.intensity) * delta * 2
  })
  
  return (
    <>
      <ambientLight ref={ambientRef} intensity={isNightMode ? 0.2 : 0.6} />
      <directionalLight
        ref={directionalRef}
        position={[10, 20, 10]}
        intensity={isNightMode ? 0.3 : 1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight
        ref={hemisphereRef}
        args={[isNightMode ? '#1a2744' : '#ffffff', isNightMode ? '#0a1628' : '#86909c', isNightMode ? 0.1 : 0.5]}
      />
    </>
  )
}

function SceneBackground() {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const { scene } = useThree()
  
  useEffect(() => {
    const targetColor = new THREE.Color(isNightMode ? COLORS.night.background : COLORS.day.background)
    const startColor = scene.background ? (scene.background as THREE.Color).clone() : targetColor.clone()
    const duration = 500
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      const currentColor = startColor.clone().lerp(targetColor, easeProgress)
      scene.background = currentColor
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [isNightMode, scene])
  
  return isNightMode ? (
    <Stars
      radius={100}
      depth={50}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  ) : null
}

function CameraController() {
  const autoRotate = useSceneStore((state) => state.autoRotate)
  const controlsRef = useRef<{ autoRotate: boolean; autoRotateSpeed: number } | null>(null)
  
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
      controlsRef.current.autoRotateSpeed = 0.5
    }
  }, [autoRotate])
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={10}
      maxDistance={50}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2 - 0.1}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
    />
  )
}

function PostProcessing() {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={isNightMode ? 1.5 : 0.5}
        mipmapBlur
      />
      <Vignette offset={0.5} darkness={isNightMode ? 0.5 : 0.3} />
    </EffectComposer>
  )
}

export function BuildingScene() {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={[isNightMode ? COLORS.night.background : COLORS.day.background, 30, 80]} />
        <SceneBackground />
        <SceneLighting />
        <CameraAnimation />
        <CameraController />
        <Ground />
        <Building />
        <PostProcessing />
      </Canvas>
    </div>
  )
}
