import { useEffect, useCallback } from 'react'
import { useEnergyStore } from '../store/useEnergyStore'
import { useSceneStore } from '../store/useSceneStore'
import { useUIStore } from '../store/useUIStore'
import { mockApi } from '../api/mockApi'
import { REFRESH_INTERVAL } from '../utils/constants'

export function useEnergyData(autoRefresh: boolean = true) {
  const {
    setBuildingData,
    setAlarms,
    setTrendData,
    setSelectedFloorData,
    setIsLoading,
    setLastUpdate,
    setRefreshInterval,
    buildingData,
  } = useEnergyStore()
  
  const { selectedFloorId } = useSceneStore()
  const { setIsRefreshing, showNotification } = useUIStore()
  
  const fetchAllData = useCallback(async (showLoader: boolean = false) => {
    if (showLoader) {
      setIsRefreshing(true)
    }
    setIsLoading(true)
    
    try {
      const { building, alarms } = await mockApi.refreshAll()
      const trend = await mockApi.getTrendData()
      
      setBuildingData(building)
      setAlarms(alarms)
      setTrendData(trend)
      setLastUpdate(Date.now())
      
      if (selectedFloorId) {
        const floor = building.floors.find((f) => f.id === selectedFloorId)
        if (floor) {
          setSelectedFloorData(floor)
        }
      }
      
      const unacknowledged = alarms.filter((a) => !a.acknowledged).length
      if (unacknowledged > 0) {
        showNotification(`检测到 ${unacknowledged} 条异常告警`, 'error')
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      showNotification('数据加载失败', 'error')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [
    selectedFloorId,
    setBuildingData,
    setAlarms,
    setTrendData,
    setSelectedFloorData,
    setIsLoading,
    setLastUpdate,
    setIsRefreshing,
    showNotification,
  ])
  
  const fetchFloorDetail = useCallback(async (floorId: string) => {
    setIsLoading(true)
    try {
      const floor = await mockApi.getFloor(floorId)
      if (floor) {
        setSelectedFloorData(floor)
      }
    } catch (error) {
      console.error('Failed to fetch floor data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [setSelectedFloorData, setIsLoading])
  
  const manualRefresh = useCallback(() => {
    fetchAllData(true)
  }, [fetchAllData])
  
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])
  
  useEffect(() => {
    if (autoRefresh) {
      const interval = window.setInterval(() => {
        fetchAllData()
      }, REFRESH_INTERVAL)
      setRefreshInterval(interval)
      
      return () => {
        window.clearInterval(interval)
        setRefreshInterval(null)
      }
    }
  }, [autoRefresh, fetchAllData, setRefreshInterval])
  
  useEffect(() => {
    if (selectedFloorId && buildingData) {
      const floor = buildingData.floors.find((f) => f.id === selectedFloorId)
      if (floor) {
        setSelectedFloorData(floor)
      }
    } else {
      setSelectedFloorData(null)
    }
  }, [selectedFloorId, buildingData, setSelectedFloorData])
  
  return {
    manualRefresh,
    fetchFloorDetail,
    isLoading: useEnergyStore((state) => state.isLoading),
  }
}
