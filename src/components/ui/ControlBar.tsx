import { useState, useEffect } from 'react'
import {
  Sun,
  Moon,
  RotateCcw,
  RefreshCw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Home,
} from 'lucide-react'
import { useSceneStore } from '../../store/useSceneStore'
import { useUIStore } from '../../store/useUIStore'
import { useEnergyData } from '../../hooks/useEnergyData'
import { cn } from '@/lib/utils'

export function ControlBar() {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  const autoRotate = useSceneStore((state) => state.autoRotate)
  const toggleNightMode = useSceneStore((state) => state.toggleNightMode)
  const toggleAutoRotate = useSceneStore((state) => state.toggleAutoRotate)
  const resetCamera = useSceneStore((state) => state.resetCamera)
  const zoomCamera = useSceneStore((state) => state.zoomCamera)
  
  const isRefreshing = useUIStore((state) => state.isRefreshing)
  const showEnergyPanel = useUIStore((state) => state.showEnergyPanel)
  const toggleEnergyPanel = useUIStore((state) => state.toggleEnergyPanel)
  
  const { manualRefresh } = useEnergyData(true)
  
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  const barBg = isNightMode
    ? 'bg-slate-900/80 border-slate-700/50'
    : 'bg-white/80 border-gray-200'
  
  const textPrimary = isNightMode ? 'text-white' : 'text-gray-900'
  const textSecondary = isNightMode ? 'text-gray-400' : 'text-gray-500'
  
  const buttonClass = cn(
    'px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105',
    isNightMode
      ? 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 hover:text-white'
      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm'
  )
  
  const activeButtonClass = cn(
    'px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105',
    'bg-blue-500 text-white hover:bg-blue-600'
  )
  
  const iconButtonClass = cn(
    'p-2 rounded-lg transition-all duration-200 hover:scale-105',
    isNightMode
      ? 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 hover:text-white'
      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm'
  )
  
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  
  return (
    <div className={cn(
      'fixed bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border backdrop-blur-xl px-6 py-3 flex items-center gap-6 z-40',
      barBg
    )}>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">智</span>
        </div>
        <div>
          <h1 className={cn('text-sm font-bold', textPrimary)}>智慧楼宇能耗监控</h1>
          <p className={cn('text-xs', textSecondary)}>
            {currentTime.toLocaleDateString('zh-CN')} {currentTime.toLocaleTimeString('zh-CN')}
          </p>
        </div>
      </div>
      
      <div className="h-8 w-px bg-gray-600/30" />
      
      <div className="flex gap-2">
        <button
          onClick={toggleNightMode}
          className={isNightMode ? activeButtonClass : buttonClass}
          title={isNightMode ? '切换到日间模式' : '切换到夜间模式'}
        >
          {isNightMode ? <Sun size={16} /> : <Moon size={16} />}
          <span className="hidden sm:inline">{isNightMode ? '日间' : '夜间'}</span>
        </button>
        
        <button
          onClick={toggleAutoRotate}
          className={autoRotate ? activeButtonClass : buttonClass}
          title={autoRotate ? '暂停旋转' : '开始旋转'}
        >
          {autoRotate ? <Pause size={16} /> : <Play size={16} />}
          <span className="hidden sm:inline">{autoRotate ? '暂停' : '旋转'}</span>
        </button>
        
        <button
          onClick={manualRefresh}
          disabled={isRefreshing}
          className={cn(buttonClass, isRefreshing && 'animate-pulse')}
          title="刷新数据"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">刷新</span>
        </button>
        
        <button
          onClick={toggleEnergyPanel}
          className={showEnergyPanel ? activeButtonClass : buttonClass}
          title={showEnergyPanel ? '隐藏数据面板' : '显示数据面板'}
        >
          <RotateCcw size={16} />
          <span className="hidden sm:inline">{showEnergyPanel ? '隐藏面板' : '显示面板'}</span>
        </button>
      </div>
      
      <div className="h-8 w-px bg-gray-600/30" />
      
      <div className="flex gap-2">
        <button className={iconButtonClass} onClick={resetCamera} title="重置视角">
          <Home size={18} />
        </button>
        <button className={iconButtonClass} onClick={() => zoomCamera(-3)} title="放大">
          <ZoomIn size={18} />
        </button>
        <button className={iconButtonClass} onClick={() => zoomCamera(3)} title="缩小">
          <ZoomOut size={18} />
        </button>
        <button className={iconButtonClass} onClick={handleFullscreen} title="全屏">
          <Maximize2 size={18} />
        </button>
      </div>
      
      <div className="h-8 w-px bg-gray-600/30" />
      
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full animate-pulse',
          isRefreshing ? 'bg-yellow-400' : 'bg-green-400'
        )} />
        <span className={cn('text-xs', textSecondary)}>
          {isRefreshing ? '更新中...' : '实时监控中'}
        </span>
      </div>
    </div>
  )
}
