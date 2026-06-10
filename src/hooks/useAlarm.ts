import { useCallback, useEffect } from 'react'
import { useEnergyStore } from '../store/useEnergyStore'
import { useUIStore } from '../store/useUIStore'
import { mockApi } from '../api/mockApi'
import { AlarmData } from '../types'

export function useAlarm() {
  const { alarms, acknowledgeAlarm, setAlarms } = useEnergyStore()
  const { showNotification } = useUIStore()
  
  const fetchAlarms = useCallback(async () => {
    try {
      const data = await mockApi.getAlarms()
      setAlarms(data)
    } catch (error) {
      console.error('Failed to fetch alarms:', error)
    }
  }, [setAlarms])
  
  const handleAcknowledge = useCallback(async (alarmId: string) => {
    try {
      const result = await mockApi.acknowledgeAlarm(alarmId)
      if (result.success) {
        acknowledgeAlarm(alarmId)
        showNotification('告警已确认', 'success')
      }
    } catch (error) {
      console.error('Failed to acknowledge alarm:', error)
      showNotification('确认失败', 'error')
    }
  }, [acknowledgeAlarm, showNotification])
  
  const getAlarmsByLevel = useCallback(
    (level: 'low' | 'medium' | 'high') => {
      return alarms.filter((a) => a.level === level)
    },
    [alarms]
  )
  
  const getUnacknowledgedAlarms = useCallback(() => {
    return alarms.filter((a) => !a.acknowledged)
  }, [alarms])
  
  const getAlarmStats = useCallback(() => {
    const stats = {
      total: alarms.length,
      unacknowledged: 0,
      high: 0,
      medium: 0,
      low: 0,
    }
    
    alarms.forEach((alarm) => {
      if (!alarm.acknowledged) stats.unacknowledged++
      if (alarm.level === 'high') stats.high++
      else if (alarm.level === 'medium') stats.medium++
      else if (alarm.level === 'low') stats.low++
    })
    
    return stats
  }, [alarms])
  
  const getMostRecentAlarm = useCallback((): AlarmData | undefined => {
    return alarms[0]
  }, [alarms])
  
  useEffect(() => {
    fetchAlarms()
  }, [fetchAlarms])
  
  return {
    alarms,
    fetchAlarms,
    acknowledgeAlarm: handleAcknowledge,
    getAlarmsByLevel,
    getUnacknowledgedAlarms,
    getAlarmStats,
    getMostRecentAlarm,
  }
}
