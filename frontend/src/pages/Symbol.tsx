import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { marketItems, symbolKlineData } from '../data/mockData'
import SymbolInfoHeader from '../components/SymbolInfoHeader'
import PeriodSwitcher, { type Period } from '../components/PeriodSwitcher'
import IndicatorToggle from '../components/IndicatorToggle'
import CandlestickChart from '../components/CandlestickChart'

export default function Symbol() {
  const { symbolId } = useParams<{ symbolId: string }>()
  const navigate = useNavigate()

  const [period, setPeriod] = useState<Period>('1D')
  const [showEMA, setShowEMA] = useState(true)
  const [showMACD, setShowMACD] = useState(true)

  const item = marketItems.find((m) => m.symbol === symbolId)
  const kline = symbolId ? symbolKlineData[symbolId] : undefined

  if (!item || !kline) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          ← 返回
        </button>
        <p className="text-slate-400">未找到该标的</p>
      </div>
    )
  }

  const candleData = kline[period]

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col gap-4">
      <button
        onClick={() => navigate(-1)}
        className="self-start text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        ← 返回
      </button>

      <SymbolInfoHeader
        symbol={item.symbol}
        name={item.name}
        price={item.price}
        changePercent={item.changePercent}
      />

      <div className="flex items-center justify-between">
        <PeriodSwitcher current={period} onChange={setPeriod} />
        <IndicatorToggle
          showEMA={showEMA}
          showMACD={showMACD}
          onToggleEMA={() => setShowEMA((v) => !v)}
          onToggleMACD={() => setShowMACD((v) => !v)}
        />
      </div>

      <CandlestickChart data={candleData} showEMA={showEMA} showMACD={showMACD} />
    </div>
  )
}
