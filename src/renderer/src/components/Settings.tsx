import type React from 'react'
import BellIcon from '../assets/icons/bell.svg'
import BellOffIcon from '../assets/icons/bell-no.svg'
import MusicIcon from '../assets/icons/music.svg'
import MusicOffIcon from '../assets/icons/music-no.svg'

interface SettingsProps {
  onClose: () => void
  workDuration: number
  breakDuration: number
  onChangeWorkDuration: (v: number) => void
  onChangeBreakDuration: (v: number) => void
  bellEnabled: boolean
  onToggleBell: () => void
  bellVolume: number
  onChangeBellVolume: (v: number) => void
  musicEnabled: boolean
  onToggleMusic: () => void
  musicVolume: number
  onChangeMusicVolume: (v: number) => void
  resetTimer: () => void
}

function Settings({
  onClose,
  workDuration,
  breakDuration,
  onChangeWorkDuration,
  onChangeBreakDuration,
  bellEnabled,
  onToggleBell,
  bellVolume,
  onChangeBellVolume,
  musicEnabled,
  onToggleMusic,
  musicVolume,
  onChangeMusicVolume,
  resetTimer
}: SettingsProps): React.JSX.Element {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative flex flex-col items-center justify-center w-[220px] h-[340px] bg-black/80 z-50">
        <button
          onClick={onClose}
          className=" text-[#E7E7E8]  right-4 top-0 absolute hover:text-white z-10"
        >
          ×
        </button>
        <div className="text-lg  text-[#E7E7E8] top-2 absolute px-4 mb-2">settings</div>
        <div className="px-4 w-full">
          <div className="mt-1 w-full border-t border-white/10">
            <span className="text-sm font-medium text-[#E7E7E8] mt-1">sounds</span>
          </div>

          <div className="flex items-center mb-4 w-full gap-3">
            <button onClick={onToggleBell} className="app-no-drag">
              <img
                src={bellEnabled ? BellIcon : BellOffIcon}
                alt="bell"
                className="w-4 h-4 hover:opacity-80 mx-1"
              />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={bellVolume}
              onChange={(e) => onChangeBellVolume(parseFloat(e.target.value))}
              className="w-full accent-[#d2ff55] mx-1"
            />
          </div>

          <div className="flex items-center w-full gap-3">
            <button onClick={onToggleMusic} className="app-no-drag">
              <img
                src={musicEnabled ? MusicIcon : MusicOffIcon}
                alt="music"
                className="w-4 h-4 hover:opacity-80 mx-1"
              />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={musicVolume}
              onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-[#d2ff55] mx-1"
            />
          </div>
          <div className="flex flex-col border-t border-white/10 mt-3">
            <span className="mr-3 text-sm font-medium text-[#E7E7E8]">timer</span>
            <div className="flex items-center">
              <span className="text-sm font-extralight text-[#E7E7E8]">work:</span>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => onChangeWorkDuration(Number(e.target.value))}
                className="w-10 mx-2 text-[#111111] font-bold text-center"
              />
              <span className="text-sm font-extralight text-[#E7E7E8] ml-2">break:</span>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => onChangeBreakDuration(Number(e.target.value))}
                className="w-10 mx-2 text-[#111111] font-bold text-center"
              />
            </div>
          </div>
          <div className="flex flex-col mt-3 border-t border-white/10">
            <span className="mr-3 text-sm font-medium text-[#E7E7E8]">color</span>
            <div className="grid grid-cols-5 gap-2 w-40 ml-8">
              <button className="w-6 h-6 rounded-full bg-[#53538d]"></button>
              <button className="w-6 h-6 rounded-full bg-[#5454b3]"></button>
              <button className="w-6 h-6 rounded-full bg-[#d261d6]"></button>
              <button className="w-6 h-6 rounded-full bg-[#53538d]"></button>
              <button className="w-6 h-6 rounded-full bg-[#5454b3]"></button>
              <button className="w-6 h-6 rounded-full bg-[#d261d6]"></button>
              <button className="w-6 h-6 rounded-full bg-[#53538d]"></button>
              <button className="w-6 h-6 rounded-full bg-[#5454b3]"></button>
              <button className="w-6 h-6 rounded-full bg-[#d261d6]"></button>
              <button className="w-6 h-6 rounded-full bg-[#82af2e]"></button>
            </div>
          </div>
          <button
            onClick={resetTimer}
            className="ml-10 mt-4 w-28 p-[1px] rounded-full border-2 border-[#E7E7E8] text-[#E7E7E8] hover:bg-white/10 transition z-40"
          >
            save
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
