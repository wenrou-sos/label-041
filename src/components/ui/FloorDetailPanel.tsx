import { useMemo } from 'react'
import { X, Thermometer, Lightbulb, Plug, Users, Maximize2, AlertTriangle, CheckCircle } from 'lucide-react'
import { PieChart } from './PieChart'
import { TrendChart } from './TrendChart'
import { StatCard } from './StatCard'
import { useEnergyStore } from '../../store/useEnergyStore'
import { useSceneStore } from '../../store/useSceneStore'
import { useUIStore } from '../../store/useUIStore'
import { formatEnergyValue, formatTime } from '../../utils/energyCalculator'
import { cn } from '@/lib/utils'
import { CATEGORY_LABELS } from '../../types'

export function FloorDetailPanel() {
  const selectedFloorData = useEnergyStore((state) => state.selectedFloorData)
  const trendData = useEnergyStore((state) => state.trendData)
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const setSelectedFloorId = useSceneStore((state) => state.setSelectedFloorId)
  const setShowFloorDetail = useUIStore((state) => state.setShowFloorDetail)
  const showFloorDetail = useUIStore((state) => state.showFloorDetail)
  
  const floorTrendData = useMemo(() => {
    return trendData.map(item => ({
      ...item,
      total: item.total * (0.8 + Math.random() * 0.4),
      airConditioning: item.airConditioning * (0.8 + Math.random() * 0.4),
      lighting: item.lighting * (0.8 + Math.random() * 0.4),
      socket: item.socket * (0.8 + Math.random() * 0.4),
    }))
  }, [trendData])
  
  const roomStats = useMemo(() => {
    if (!selectedFloorData) return []
    
    return selectedFloorData.rooms.map((room) => ({
      ...room,
      acPercent: ((room.energy.airConditioning / room.energy.total) * 100).toFixed(1),
      lightPercent: ((room.energy.lighting / room.energy.total) * 100).toFixed(1),
      socketPercent: ((room.energy.socket / room.energy.total) * 100).toFixed(1),
    }))
  }, [selectedFloorData])
  
  const panelBg = isNightMode
    ? 'bg-slate-900/95 border-slate-700/50'
    : 'bg-white/95 border-gray-200'
  
  const textPrimary = isNightMode ? 'text-white' : 'text-gray-900'
  const textSecondary = isNightMode ? 'text-gray-400' : 'text-gray-500'
  
  const handleClose = () => {
    setSelectedFloorId(null)
    setShowFloorDetail(false)
  }
  
  if (!selectedFloorData) return null
  
  return (
    <div
      className={cn(
        'fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 z-50',
        panelBg,
        showFloorDetail ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      <div className="p-4 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Maximize2 className="text-blue-400" size={20} />
          </div>
          <div>
            <h2 className={cn('text-xl font-bold', textPrimary)}>
              {selectedFloorData.name} 详细信息
            </h2>
            <p className={cn('text-xs', textSecondary)}>
              共 {selectedFloorData.rooms.length} 个房间 · 更新于 {formatTime(selectedFloorData.energy.timestamp)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!selectedFloorData.isNormal && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
              <AlertTriangle size={12} />
              <span>能耗异常</span>
            </div>
          )}
          {selectedFloorData.isNormal && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
              <CheckCircle size={12} />
              <span>运行正常</span>
            </div>
          )}
          <button
            onClick={handleClose}
            className={cn('p-2 rounded-lg transition-colors', isNightMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100')}
          >
            <X size={20} className={textSecondary} />
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            title="总能耗"
            value={formatEnergyValue(selectedFloorData.energy.total)}
            icon={<Maximize2 size={18} />}
            color="primary"
          />
          <StatCard
            title="空调用电"
            value={formatEnergyValue(selectedFloorData.energy.airConditioning)}
            icon={<Thermometer size={18} />}
            color="primary"
          />
          <StatCard
            title="照明用电"
            value={formatEnergyValue(selectedFloorData.energy.lighting)}
            icon={<Lightbulb size={18} />}
            color="warning"
          />
          <StatCard
            title="插座用电"
            value={formatEnergyValue(selectedFloorData.energy.socket)}
            icon={<Plug size={18} />}
            color="success"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={cn('rounded-xl border p-4', isNightMode ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-200 bg-gray-50')}>
            <h3 className={cn('text-sm font-medium mb-3', textPrimary)}>分项用电占比</h3>
            <PieChart data={selectedFloorData.energy} height={180} />
          </div>
          
          <div className={cn('rounded-xl border p-4', isNightMode ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-200 bg-gray-50')}>
            <h3 className={cn('text-sm font-medium mb-3', textPrimary)}>用电趋势</h3>
            <TrendChart data={floorTrendData} height={180} showLegend={true} />
          </div>
        </div>
        
        <div className={cn('rounded-xl border p-4', isNightMode ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-200 bg-gray-50')}>
          <h3 className={cn('text-sm font-medium mb-4', textPrimary)}>房间能耗明细</h3>
          <div className="space-y-2">
            {roomStats.map((room) => (
              <div
                key={room.id}
                className={cn(
                  'p-3 rounded-lg transition-all duration-200',
                  isNightMode ? 'bg-slate-900/50 hover:bg-slate-700/50' : 'bg-white hover:bg-gray-100',
                  !room.isNormal && 'ring-1 ring-red-500/50'
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={14} className={textSecondary} />
                    <span className={cn('text-sm font-medium', textPrimary)}>{room.name}</span>
                    <span className={cn('text-xs px-2 py-0.5 rounded', isNightMode ? 'bg-slate-700' : 'bg-gray-200', textSecondary)}>
                      {room.area.toFixed(0)}㎡
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-sm font-semibold', textPrimary)}>
                      {formatEnergyValue(room.energy.total)}
                    </span>
                    {!room.isNormal && (
                      <AlertTriangle size={14} className="text-red-400" />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {(['airConditioning', 'lighting', 'socket'] as const).map((category) => (
                    <div key={category} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className={textSecondary}>{CATEGORY_LABELS[category]}</span>
                        <span className={textPrimary}>
                          {category === 'airConditioning' ? room.acPercent : category === 'lighting' ? room.lightPercent : room.socketPercent}%
                        </span>
                      </div>
                      <div className={cn('h-1.5 rounded-full overflow-hidden', isNightMode ? 'bg-slate-700' : 'bg-gray-200')}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${category === 'airConditioning' ? room.acPercent : category === 'lighting' ? room.lightPercent : room.socketPercent}%`,
                            backgroundColor: category === 'airConditioning' ? '#165DFF' : category === 'lighting' ? '#FF7D00' : '#00B42A',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
