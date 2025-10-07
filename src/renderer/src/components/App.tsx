import { useCallback, useEffect, useRef, useState } from 'react'
import BackgroundShader from './BackgroundShader'

import Settings from './Settings'

export function App(): React.JSX.Element {
  const [isWork, setIsWork] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [colorIndex, setColorIndex] = useState(0)
  const WORK_TIME = workDuration * 60 // 25分
  const BREAK_TIME = breakDuration * 60 // 5分
  const CIRCUMFERENCE = 2 * Math.PI * 90 // 半径90の円の円周
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [bellEnabled, setBellEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [bellVolume, setBellVolume] = useState(1)
  const [musicVolume, setMusicVolume] = useState(1)
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const bellRef = useRef<HTMLAudioElement | null>(null)
  const breakRef = useRef<HTMLAudioElement | null>(null)

  // カウントダウン処理
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 終了したら切替
          const nextIsWork = !isWork
          setIsWork(nextIsWork)
          return nextIsWork ? workDuration * 60 : breakDuration * 60
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, isWork, workDuration, breakDuration])

  // 作業時間中のBGMを再生（ミュート/音量対応、残り5秒は停止）
  useEffect(() => {
    const audio = bgmRef.current
    if (!audio) return
    if (isRunning && isWork && timeLeft > 5 && musicEnabled) {
      if (timeLeft === WORK_TIME) audio.currentTime = 0
      audio.volume = musicVolume
      audio.play().catch((err) => console.warn('BGM再生失敗:', err))
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [isRunning, isWork, timeLeft, musicEnabled, musicVolume, WORK_TIME])

  // 作業/休憩ともに残り5秒でベル音を再生（ミュート/音量対応）
  useEffect(() => {
    const bell = bellRef.current
    if (!bell) return
    if (isRunning && timeLeft === 5 && bellEnabled) {
      bell.currentTime = 0
      bell.volume = bellVolume
      bell.play().catch((err) => console.warn('ベル再生失敗:', err))
    }
    // 残り5秒区間以外では停止・リセット
    if (!(isRunning && timeLeft > 0 && timeLeft <= 5) || !bellEnabled) {
      bell.pause()
      bell.currentTime = 0
    }
  }, [isRunning, timeLeft, bellEnabled, bellVolume, WORK_TIME])

  // 休憩時間中のBGMを再生（ミュート/音量対応、残り5秒は停止）
  useEffect(() => {
    const br = breakRef.current
    if (!br) return
    if (isRunning && !isWork && timeLeft > 5 && musicEnabled) {
      if (timeLeft === BREAK_TIME) br.currentTime = 0
      br.volume = musicVolume
      br.play().catch((err) => console.warn('休憩BGM再生失敗:', err))
    } else {
      br.pause()
      br.currentTime = 0
    }
  }, [isRunning, isWork, timeLeft, musicEnabled, musicVolume, BREAK_TIME])

  const handleStop = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleStart = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true)
  }, [timeLeft])

  const handleRestart = useCallback(() => {
    // 残り時間を0にリセットして即開始
    setTimeLeft(0)
    // 0なら次のtickで切り替わってしまうので、現在モードの開始に合わせて再設定
    setTimeout(() => {
      const target = isWork ? WORK_TIME : BREAK_TIME
      setTimeLeft(target)
      setIsRunning(true)
    }, 0)
  }, [isWork, WORK_TIME, BREAK_TIME])

  const handleSettings = useCallback(() => {
    setIsSettingsOpen(!isSettingsOpen)
  }, [isSettingsOpen])

  const handleMinimize = useCallback(() => {
    if (window.api && typeof window.api.minimize === 'function') {
      window.api.minimize()
      return
    }
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('minimize')
      return
    }
  }, [])

  const handleClose = useCallback(() => {
    if (window.api && typeof window.api.close === 'function') {
      window.api.close()
      return
    }
    if (window.electron?.ipcRenderer) {
      window.electron.ipcRenderer.send('close')
      return
    }
    console.warn('Close API is not available in window')
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = String(timeLeft % 60).padStart(2, '0')

  // 経過割合（0→1）と描画オフセット（開始時は全オフセット＝透明）
  const totalTime = isWork ? workDuration * 60 : breakDuration * 60
  const strokeDashoffset = CIRCUMFERENCE * (timeLeft / totalTime)

  return (
    <>
      <div className="flex z-10 titlebar border-b border-white/10 w-full p-2">
        <div>
          <img src="/icons/25icon.svg" className="w-6 h-6" />
        </div>
        <div className="ml-auto flex items-center gap-2 app-no-drag">
          <button onClick={handleSettings}>
            <img src="/icons/settings.svg" alt="Settings" className="w-4 h-4" />
          </button>
          <button onClick={handleMinimize}>
            <img src="/icons/minimize.svg" alt="minimize" className="w-4 h-4" />
          </button>
          <button onClick={handleClose}>
            <img src="/icons/close.svg" alt="Close" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="fixed inset-0 bg-[#00000000] mx-auto flex justify-center items-center">
        <div className="relative w-[220px] h-[220px] mt-6 flex flex-col items-center justify-center text-[#E7E7E8]">
          {isRunning && timeLeft <= 5 && timeLeft > 0 && <CountdownOverlay number={timeLeft} />}
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

          {isRunning ? (
            <button
              onClick={handleStop}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[#E7E7E8] hover:bg-white/10 transition z-40"
            >
              <img src="/icons/stop.svg" alt="Stop" className="w-4 h-4" />
            </button>
          ) : (
            <div className="mt-3 flex items-center gap-3 z-40">
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[#E7E7E8] hover:bg-white/10 transition"
              >
                <img src="/icons/start.svg" alt="Start" className="w-4 h-4" />
              </button>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[#E7E7E8] hover:bg-white/10 transition"
              >
                <img src="/icons/restart.svg" alt="Restart" className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="mt-1 text-xs text-[#E7E7E8]">
            {isWork ? 'Work Session' : 'Break Time'}
          </div>
        </div>
      </div>
      <audio ref={bgmRef} src={'/sounds/25.m4a'} loop />
      <audio ref={breakRef} src={'/sounds/break.m4a'} loop />
      <audio ref={bellRef} src={'/sounds/bell.m4a'} />
      <BackgroundShader colorIndex={colorIndex} />
      {isSettingsOpen && (
        <Settings
          onClose={() => setIsSettingsOpen(false)}
          workDuration={workDuration}
          onChangeWorkDuration={(v) => setWorkDuration(v)}
          breakDuration={breakDuration}
          onChangeBreakDuration={(v) => setBreakDuration(v)}
          bellEnabled={bellEnabled}
          onToggleBell={() => setBellEnabled((v) => !v)}
          bellVolume={bellVolume}
          onChangeBellVolume={(v) => setBellVolume(v)}
          musicEnabled={musicEnabled}
          onToggleMusic={() => setMusicEnabled((v) => !v)}
          musicVolume={musicVolume}
          onChangeMusicVolume={(v) => setMusicVolume(v)}
          resetTimer={handleRestart}
          onChangeColorIndex={setColorIndex}
          colorIndex={colorIndex}
        />
      )}
    </>
  )
}

interface Props {
  number: number
}

function CountdownOverlay({ number }: Props): React.JSX.Element {
  return (
    <div
      key={number} // number が変わるたびにアニメーションを再実行
      className="absolute inset-0 flex items-center justify-center z-20
                 text-7xl font-bold text-[#E7E7E8]
                 animate-[countanimate_1s_ease-out_forwards]"
    >
      {number}
    </div>
  )
}
export default App
