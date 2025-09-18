import type React from 'react'
import BellIcon from '../assets/icons/bell.svg'
import BellOffIcon from '../assets/icons/bell-no.svg'
import MusicIcon from '../assets/icons/music.svg'
import MusicOffIcon from '../assets/icons/music-no.svg'

interface SettingsProps {
  onClose: () => void
  bellEnabled: boolean
  onToggleBell: () => void
  bellVolume: number
  onChangeBellVolume: (v: number) => void
  musicEnabled: boolean
  onToggleMusic: () => void
  musicVolume: number
  onChangeMusicVolume: (v: number) => void
}

function Settings({
  onClose,
  bellEnabled,
  onToggleBell,
  bellVolume,
  onChangeBellVolume,
  musicEnabled,
  onToggleMusic,
  musicVolume,
  onChangeMusicVolume
}: SettingsProps): React.JSX.Element {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative flex flex-col items-center justify-center w-[220px] h-[220px] bg-black/80 z-50">
        <button
          onClick={onClose}
          className=" text-[#E7E7E8]  right-4 top-0 absolute hover:text-white z-10"
        >
          ×
        </button>
        <div className="text-lg  text-[#E7E7E8] top-2 absolute">settings</div>
        <div className="relative  flex flex-col justify-center px-4 w-full">
          <div className="flex items-center mb-3 w-full justify-between">
            <span className="text-sm font-medium text-[#E7E7E8]">sounds</span>
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
          <div className="flex items-center mt-3">
            <span className="mr-3 text-sm font-medium text-[#E7E7E8]">color</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
