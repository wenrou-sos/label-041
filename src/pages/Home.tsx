import { useEffect } from 'react'
import { BuildingScene } from '../components/three/Scene'
import { EnergyPanel } from '../components/ui/EnergyPanel'
import { AlarmPanel } from '../components/ui/AlarmPanel'
import { FloorDetailPanel } from '../components/ui/FloorDetailPanel'
import { ControlBar } from '../components/ui/ControlBar'
import { useSceneStore } from '../store/useSceneStore'
import { useUIStore } from '../store/useUIStore'
import { useEnergyData } from '../hooks/useEnergyData'
import { cn } from '@/lib/utils'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'

export default function Home() {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const selectedFloorId = useSceneStore((state) => state.selectedFloorId)
  const showEnergyPanel = useUIStore((state) => state.showEnergyPanel)
  const notification = useUIStore((state) => state.notification)
  const hideNotification = useUIStore((state) => state.hideNotification)
  const setShowFloorDetail = useUIStore((state) => state.setShowFloorDetail)
  
  useEnergyData(true)
  
  useEffect(() => {
    if (selectedFloorId) {
      setShowFloorDetail(true)
    }
  }, [selectedFloorId, setShowFloorDetail])
  
  const bgColor = isNightMode ? 'bg-slate-950' : 'bg-gray-100'
  
  const notificationIcon = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <AlertCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-blue-400" />,
  }
  
  const notificationBg = {
    success: 'bg-green-500/20 border-green-500/30',
    error: 'bg-red-500/20 border-red-500/30',
    info: 'bg-blue-500/20 border-blue-500/30',
  }
  
  const notificationColor = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
  }
  
  return (
    <div className={cn('w-screen h-screen overflow-hidden relative', bgColor)}>
      <div className="w-full h-full">
        <BuildingScene />
      </div>
      
      <div className="absolute top-4 right-4 w-80 space-y-4 z-30">
        {showEnergyPanel && (
          <EnergyPanel />
        )}
        <AlarmPanel />
      </div>
      
      <FloorDetailPanel />
      
      <ControlBar />
      
      {notification && (
        <div
          className={cn(
            'fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl border backdrop-blur-md flex items-center gap-3 z-50 animate-bounce',
            notificationBg[notification.type]
          )}
          style={{ animation: 'slideDown 0.3s ease-out' }}
        >
          {notificationIcon[notification.type]}
          <span className={cn('font-medium', notificationColor[notification.type])}>
            {notification.message}
          </span>
          <button
            onClick={hideNotification}
            className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={16} className={notificationColor[notification.type]} />
          </button>
        </div>
      )}
      
      <div className="absolute top-4 left-4 z-20">
        <div className={cn(
          'px-4 py-3 rounded-xl border backdrop-blur-md',
          isNightMode
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/90 border-gray-200'
        )}>
          <h2 className={cn('text-lg font-bold', isNightMode ? 'text-white' : 'text-gray-900')}>
            智慧大厦A座
          </h2>
          <p className={cn('text-xs', isNightMode ? 'text-gray-400' : 'text-gray-500')}>
            3D 楼宇能耗监控系统
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className={cn('text-xs', isNightMode ? 'text-gray-400' : 'text-gray-500')}>
              实时数据同步中
            </span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-28 left-4 z-20">
        <div className={cn(
          'px-4 py-3 rounded-xl border backdrop-blur-md text-sm',
          isNightMode
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/90 border-gray-200'
        )}>
          <p className={cn('text-xs font-medium mb-2', isNightMode ? 'text-gray-400' : 'text-gray-500')}>
            操作提示
          </p>
          <div className={cn('space-y-1 text-xs', isNightMode ? 'text-gray-300' : 'text-gray-600')}>
            <p>🖱️ 鼠标左键拖动 - 旋转视角</p>
            <p>🖱️ 鼠标右键拖动 - 平移视角</p>
            <p>🔍 滚轮 - 缩放</p>
            <p>👆 点击楼层 - 查看详情</p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          overflow: hidden;
        }
        
        canvas {
          display: block;
        }
      `}</style>
    </div>
  )
}
