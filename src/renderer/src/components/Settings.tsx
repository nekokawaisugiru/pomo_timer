import type React from 'react'
import clsx from 'clsx'

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
  onChangeColorIndex: (v: number) => void
  colorIndex: number
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
  resetTimer,
  onChangeColorIndex,
  colorIndex
}: SettingsProps): React.JSX.Element {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="relative flex flex-col items-center justify-center w-[260px] h-[340px] bg-white/80 z-50  border-white/60 rounded-lg">
        <button
          onClick={onClose}
          className=" text-black  right-4 top-0 absolute hover:text-white z-10"
        >
          ×
        </button>
        <div className="text-lg  text-black top-2 absolute px-4 mb-2">settings</div>
        <div className="px-4 w-full">
          <div className="mt-1 w-full border-t border-black/80">
            <span className="text-sm font-medium text-black mt-1">sounds</span>
          </div>

          <div className="flex items-center mb-4 w-full gap-3">
            <button onClick={onToggleBell} className="app-no-drag text-red">
              {/* <img
                src={bellEnabled ? BellIcon : BellOffIcon}
                alt="bell"
                className="w-4 h-4 hover:opacity-80 mx-1 bg-red"
                style={{ maskImage: 'url(/icons/bell.svg)' }}
              /> */}
              <div
                className={clsx(
                  'w-4 h-4 hover:opacity-80 mx-1 bg-[#585155] mask-image',
                  bellEnabled
                    ? '[mask-image:url(/icons/bell.svg)]'
                    : '[mask-image:url(/icons/bell-no.svg)]'
                )}
              />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={bellVolume}
              onChange={(e) => onChangeBellVolume(parseFloat(e.target.value))}
              className="w-full accent-[#726762] mx-1"
            />
          </div>

          <div className="flex items-center w-full gap-3">
            <button onClick={onToggleMusic} className="app-no-drag">
              {/* <img
                src={musicEnabled ? MusicIcon : MusicOffIcon}
                alt="music"
                className="w-4 h-4 hover:opacity-80 mx-1"
              /> */}
              <div
                className={clsx(
                  'w-4 h-4 hover:opacity-80 mx-1 bg-[#585155] mask-image',
                  musicEnabled
                    ? '[mask-image:url(/icons/music.svg)]'
                    : '[mask-image:url(/icons/music-no.svg)]'
                )}
              />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={musicVolume}
              onChange={(e) => onChangeMusicVolume(parseFloat(e.target.value))}
              className="w-full accent-[#726762] mx-1"
            />
          </div>
          <div className="flex flex-col border-t border-black/80 mt-3">
            <span className="mr-3 text-sm font-medium text-black">timer</span>
            <div className="flex items-center">
              <span className="text-sm font-light text-black">work:</span>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => onChangeWorkDuration(Number(e.target.value))}
                className="w-10 mx-2 text-[#111111] font-bold text-center"
              />
              <span className="text-sm font-light text-black ml-2">break:</span>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => onChangeBreakDuration(Number(e.target.value))}
                className="w-10 mx-2 text-[#111111] font-bold text-center"
              />
            </div>
          </div>
          <div className="flex flex-col mt-3 border-t border-black/80">
            <span className="mr-3 text-sm font-medium text-black">color</span>
            <div className="grid grid-cols-5 gap-2 w-40 ml-8">
              {Array.from({ length: 10 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onChangeColorIndex(index)}
                  className={clsx(
                    'w-6 h-6 rounded-full overflow-hidden',
                    colorIndex === index ? 'border-2 border-black' : ''
                  )}
                >
                  <img src={`/colors/color${index + 1}.jpg`} className="w-full h-full" />
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={resetTimer}
            className="ml-10 mt-4 w-28 p-[1px] rounded-full border-2 border-black text-black hover:bg-white/10 transition z-40"
          >
            save
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
