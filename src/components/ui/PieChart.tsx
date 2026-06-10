import { useMemo } from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { EnergyData, CATEGORY_COLORS, CATEGORY_LABELS, EnergyCategory } from '../../types'
import { useSceneStore } from '../../store/useSceneStore'
import { calculatePercentage } from '../../utils/energyCalculator'

interface PieChartProps {
  data: EnergyData
  height?: number
  showLegend?: boolean
}

export function PieChart({ data, height = 180, showLegend = true }: PieChartProps) {
  const isNightMode = useSceneStore((state) => state.isNightMode)
  
  const chartData = useMemo(() => {
    const categories: EnergyCategory[] = ['airConditioning', 'lighting', 'socket']
    return categories.map((category) => ({
      name: CATEGORY_LABELS[category],
      value: data[category],
      percentage: calculatePercentage(data[category], data.total),
      color: CATEGORY_COLORS[category],
    }))
  }, [data])
  
  const textColor = isNightMode ? '#86909C' : '#4E5969'
  const bgColor = isNightMode ? '#1D2B4A' : '#FFFFFF'
  const borderColor = isNightMode ? '#2A3F5F' : '#E5E6EB'
  
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          
          <Tooltip
            contentStyle={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number, name: string, props: { payload: { percentage: number } }) => [
              `${value.toFixed(1)} Wh (${props.payload.percentage.toFixed(1)}%)`,
              name,
            ]}
          />
          
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: textColor, fontSize: '11px' }}>{value}</span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
