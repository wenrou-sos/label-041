import { create } from 'zustand'
import { SceneState } from '../types'

interface SceneStore extends SceneState {
  toggleNightMode: () => void
  setNightMode: (value: boolean) => void
  toggleAutoRotate: () => void
  setAutoRotate: (value: boolean) => void
  setSelectedFloorId: (id: string | null) => void
  setHoveredFloorId: (id: string | null) => void
  setCameraPosition: (position: [number, number, number]) => void
  resetCamera: () => void
  zoomCamera: (delta: number) => void
  reset: () => void
}

const initialState: SceneState = {
  isNightMode: true,
  autoRotate: true,
  selectedFloorId: null,
  hoveredFloorId: null,
  cameraPosition: [20, 15, 20],
}

export const useSceneStore = create<SceneStore>((set) => ({
  ...initialState,
  
  toggleNightMode: () =>
    set((state) => ({ isNightMode: !state.isNightMode })),
  
  setNightMode: (value: boolean) =>
    set({ isNightMode: value }),
  
  toggleAutoRotate: () =>
    set((state) => ({ autoRotate: !state.autoRotate })),
  
  setAutoRotate: (value: boolean) =>
    set({ autoRotate: value }),
  
  setSelectedFloorId: (id: string | null) =>
    set({ selectedFloorId: id }),
  
  setHoveredFloorId: (id: string | null) =>
    set({ hoveredFloorId: id }),
  
  setCameraPosition: (position: [number, number, number]) =>
    set({ cameraPosition: position }),
  
  resetCamera: () =>
    set({ cameraPosition: [20, 15, 20] }),
  
  zoomCamera: (delta: number) =>
    set((state) => {
      const [x, y, z] = state.cameraPosition
      const length = Math.sqrt(x * x + y * y + z * z)
      const factor = (length + delta) / length
      return {
        cameraPosition: [x * factor, y * factor, z * factor] as [number, number, number],
      }
    }),
  
  reset: () => set(initialState),
}))
