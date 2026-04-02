import { useParams } from 'react-router-dom'

export default function Symbol() {
  const { symbolId } = useParams<{ symbolId: string }>()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-50">
        {symbolId ? `${symbolId} 详情` : '请选择一个标的'}
      </h1>
      <p className="mt-4 text-slate-400">
        {symbolId
          ? `${symbolId} 的 K 线图与实时行情将在后续版本中实现。`
          : '通过价格卡片点击进入标的详情页。'}
      </p>
    </div>
  )
}
