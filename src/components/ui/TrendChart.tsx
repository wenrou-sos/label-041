import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { EnergyTrendPoint, CATEGORY_COLORS, CATEGORY_LABELS } from '../../types'
import { useSceneStore } from '../../store/useSceneStore'

interface TrendChartProps {
  data: EnergyTrendPoint[]
  height?: number
  showLegend?: boolean
}

export function TrendChart({ data, height = 200, showLegend = true }: TrendChartProps) {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  
  const chartColors = useMemo(() => ({
    grid: isNightMode ? '#1A2744' : '#E5E6EB',
    text: isNightMode ? '#86909C' : '#4E5969',
    tooltipBg: isNightMode ? '#1D2B4A' : '#FFFFFF',
    tooltipBorder: isNightMode ? '#2A3F5F' : '#E5E6EB',
  }), [isNightMode])
  
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k'
    }
    return value.toFixed(0)
  }
  
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAC" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CATEGORY_COLORS.airConditioning} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CATEGORY_COLORS.airConditioning} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CATEGORY_COLORS.lighting} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CATEGORY_COLORS.lighting} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSocket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CATEGORY_COLORS.socket} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CATEGORY_COLORS.socket} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} opacity={0.3} />
          
          <XAxis
            dataKey="time"
            stroke={chartColors.text}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval={Math.floor(data.length / 6)}
          />
          
          <YAxis
            stroke={chartColors.text}
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.tooltipBg,
              border: `1px solid ${chartColors.tooltipBorder}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: chartColors.text, marginBottom: '8px' }}
            itemStyle={{ padding: '2px 0' }}
            formatter={(value: number) => [`${value.toFixed(1)} Wh`, '']}
          />
          
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => (
                <span style={{ color: chartColors.text }}>{value}</span>
              )}
            />
          )}
          
          <Area
            type="monotone"
            dataKey="airConditioning"
            name={CATEGORY_LABELS.airConditioning}
            stroke={CATEGORY_COLORS.airConditioning}
            fillOpacity={1}
            fill="url(#colorAC)"
            strokeWidth={2}
          />
          
          <Area
            type="monotone"
            dataKey="lighting"
            name={CATEGORY_LABELS.lighting}
            stroke={CATEGORY_COLORS.lighting}
            fillOpacity={1}
            fill="url(#colorLight)"
            strokeWidth={2}
          />
          
          <Area
            type="monotone"
            dataKey="socket"
            name={CATEGORY_LABELS.socket}
            stroke={CATEGORY_COLORS.socket}
            fillOpacity={1}
            fill="url(#colorSocket)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
