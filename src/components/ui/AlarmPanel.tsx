import { useMemo, useState } from 'react'
import { AlertTriangle, Bell, Check, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { useAlarm } from '../../hooks/useAlarm'
import { useSceneStore } from '../../store/useSceneStore'
import { useUIStore } from '../../store/useUIStore'
import { formatTime } from '../../utils/energyCalculator'
import { CATEGORY_LABELS } from '../../types'
import { cn } from '@/lib/utils'

const levelColors = {
  low: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const levelLabels = {
  low: '轻微',
  medium: '中等',
  high: '严重',
}

export function AlarmPanel() {
  const { alarms, acknowledgeAlarm, getAlarmStats } = useAlarm()
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const setSelectedFloorId = useSceneStore((state) => state.setSelectedFloorId)
  const setShowFloorDetail = useUIStore((state) => state.setShowFloorDetail)
  const showAlarmPanel = useUIStore((state) => state.showAlarmPanel)
  const toggleAlarmPanel = useUIStore((state) => state.toggleAlarmPanel)
  
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'low' | 'medium' | 'high'>('all')
  
  const stats = getAlarmStats()
  
  const filteredAlarms = useMemo(() => {
    if (filter === 'all') return alarms
    if (filter === 'unacknowledged') return alarms.filter(a => !a.acknowledged)
    return alarms.filter(a => a.level === filter)
  }, [alarms, filter])
  
  const panelBg = isNightMode
    ? 'bg-slate-900/80 border-slate-700/50'
    : 'bg-white/90 border-gray-200'
  
  const textPrimary = isNightMode ? 'text-white' : 'text-gray-900'
  const textSecondary = isNightMode ? 'text-gray-400' : 'text-gray-500'
  
  const handleLocateFloor = (floorId: string) => {
    setSelectedFloorId(floorId)
    setShowFloorDetail(true)
  }
  
  const handleAcknowledge = async (alarmId: string) => {
    await acknowledgeAlarm(alarmId)
  }
  
  return (
    <div className={cn('rounded-2xl border backdrop-blur-md overflow-hidden', panelBg)}>
      <div
        className="p-4 border-b border-inherit flex items-center justify-between cursor-pointer"
        onClick={toggleAlarmPanel}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="text-red-400" size={20} />
            {stats.unacknowledged > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {stats.unacknowledged}
              </span>
            )}
          </div>
          <div>
            <h3 className={cn('text-sm font-semibold', textPrimary)}>异常告警</h3>
            <p className={cn('text-xs', textSecondary)}>
              共 {stats.total} 条 · {stats.unacknowledged} 条待处理
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" title="严重" />
            <span className="text-xs text-red-400">{stats.high}</span>
            <span className="w-2 h-2 rounded-full bg-yellow-500" title="中等" />
            <span className="text-xs text-yellow-400">{stats.medium}</span>
            <span className="w-2 h-2 rounded-full bg-orange-500" title="轻微" />
            <span className="text-xs text-orange-400">{stats.low}</span>
          </div>
          {showAlarmPanel ? <ChevronDown size={16} className={textSecondary} /> : <ChevronUp size={16} className={textSecondary} />}
        </div>
      </div>
      
      {showAlarmPanel && (
        <>
          <div className="p-3 border-b border-inherit flex gap-2 overflow-x-auto">
            {[
              { key: 'all', label: '全部' },
              { key: 'unacknowledged', label: '待处理' },
              { key: 'high', label: '严重' },
              { key: 'medium', label: '中等' },
              { key: 'low', label: '轻微' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={(e) => {
                  e.stopPropagation()
                  setFilter(item.key as typeof filter)
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all',
                  filter === item.key
                    ? 'bg-blue-500 text-white'
                    : isNightMode
                      ? 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {filteredAlarms.length === 0 ? (
              <div className="p-8 text-center">
                <Check size={32} className="mx-auto text-green-400 mb-2" />
                <p className={textSecondary}>暂无告警信息</p>
              </div>
            ) : (
              filteredAlarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={cn(
                    'p-3 border-b border-inherit last:border-b-0 transition-all',
                    alarm.acknowledged && 'opacity-50'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        size={16}
                        className={
                          alarm.level === 'high'
                            ? 'text-red-400 animate-pulse'
                            : alarm.level === 'medium'
                              ? 'text-yellow-400'
                              : 'text-orange-400'
                        }
                      />
                      <span className={cn('font-medium text-sm', textPrimary)}>
                        {alarm.floorName}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs border',
                        levelColors[alarm.level]
                      )}
                    >
                      {levelLabels[alarm.level]}
                    </span>
                  </div>
                  
                  <p className={cn('text-sm mb-2', textSecondary)}>{alarm.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <span className={textSecondary}>
                        {CATEGORY_LABELS[alarm.category]}
                      </span>
                      <span className={cn('flex items-center gap-1', textSecondary)}>
                        <Clock size={12} />
                        {formatTime(alarm.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLocateFloor(alarm.floorId)
                        }}
                        className={cn(
                          'px-2 py-1 rounded text-xs transition-colors',
                          isNightMode
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        )}
                      >
                        定位
                      </button>
                      {!alarm.acknowledged && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAcknowledge(alarm.id)
                          }}
                          className={cn(
                            'px-2 py-1 rounded text-xs transition-colors',
                            isNightMode
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          )}
                        >
                          确认
                        </button>
                      )}
                      {alarm.acknowledged && (
                        <span className="px-2 py-1 rounded text-xs text-green-400 bg-green-500/20 flex items-center gap-1">
                          <Check size={12} />
                          已确认
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
