import { useCallback, useEffect, useState } from 'react'
import BackgroundShader from './BackgroundShader'

const WORK_TIME = 25 * 60 // 25分
const BREAK_TIME = 5 * 60 // 5分
const CIRCUMFERENCE = 2 * Math.PI * 90 // 半径90の円の円周

export function App(): React.JSX.Element {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isWork, setIsWork] = useState(true)
  const [isRunning, setIsRunning] = useState(false)

  // カウントダウン処理
  useEffect(() => {
    if (!isRunning) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 終了したら切替
          const nextIsWork = !isWork
          setIsWork(nextIsWork)
          return nextIsWork ? WORK_TIME : BREAK_TIME
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, isWork])

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = String(timeLeft % 60).padStart(2, '0')

  // 経過割合（0→1）と描画オフセット（開始時は全オフセット＝透明）
  const totalTime = isWork ? WORK_TIME : BREAK_TIME
  const strokeDashoffset = CIRCUMFERENCE * (timeLeft / totalTime)

  return (
    <>
      <div className="fixed inset-0 bg-[#00000000] z-30 mx-auto flex justify-center items-center">
        <div className="relative w-[220px] h-[220px] z-10 mt-6 flex flex-col items-center justify-center text-[#E7E7E8]">
          <svg width="220" height="220" className="absolute mb-6">
            <circle
              cx="110"
              cy="110"
              r="90"
              stroke="#E7E7E8"
              strokeOpacity="0.25"
              strokeWidth="16"
              fill="none"
            />
            <circle
              cx="110"
              cy="110"
              r="90"
              stroke="#E7E7E8"
              strokeWidth="16"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <div className="text-5xl font-bold">
            {minutes}:{seconds}
          </div>

          <button
            onClick={toggleTimer}
            className="px-4 py-2 rounded-2xl text-[#E7E7E8] hover:bg-white/10 transition z-40"
          >
            {isRunning ? '■stop' : '▶start'}
          </button>
          <div className="mt-1 text-xs text-[#E7E7E8]">
            {isWork ? 'Work Session' : 'Break Time'}
          </div>
        </div>
      </div>
      <BackgroundShader />
    </>
  )
}

export default App
