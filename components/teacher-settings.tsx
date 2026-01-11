"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { VOCABULARY } from "@/lib/vocabulary"

interface TeacherSettingsProps {
  onStartGame: (config: {
    boxCount: number
    selectedLetters: string[]
    letterCase: 'uppercase' | 'lowercase'
  }) => void
  onCancel: () => void
}

const VIETNAMESE_LETTERS = [
  "a",
  "ă",
  "â",
  "b",
  "c",
  "d",
  "đ",
  "e",
  "ê",
  "g",
  "h",
  "i",
  "k",
  "l",
  "m",
  "n",
  "o",
  "ô",
  "ơ",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "ư",
  "v",
  "x",
  "y",
]

const playClickSound = () => {
  if (typeof window !== "undefined") {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.frequency.value = 700
    gain.gain.setValueAtTime(0.15, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.07)
    gain.gain.setValueAtTime(0, audioContext.currentTime + 0.08)

    osc.start(audioContext.currentTime)
    osc.stop(audioContext.currentTime + 0.08)
  }
}

const STORAGE_KEY = 'letter-game-settings'

const loadSettings = () => {
  if (typeof window === 'undefined') {
    return { boxCount: 6, selectedLetters: ["a", "d", "h"], letterCase: 'uppercase' as const }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        boxCount: parsed.boxCount || 6,
        selectedLetters: parsed.selectedLetters || ["a", "d", "h"],
        letterCase: parsed.letterCase || 'uppercase'
      }
    }
  } catch (e) {
    console.error('Error loading settings:', e)
  }
  return { boxCount: 6, selectedLetters: ["a", "d", "h"], letterCase: 'uppercase' as const }
}

const saveSettings = (settings: { boxCount: number; selectedLetters: string[]; letterCase: 'uppercase' | 'lowercase' }) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
      console.error('Error saving settings:', e)
    }
  }
}

export default function TeacherSettings({ onStartGame, onCancel }: TeacherSettingsProps) {
  const [boxCount, setBoxCount] = useState(6)
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [letterCase, setLetterCase] = useState<'uppercase' | 'lowercase'>('uppercase')
  const [showWordPool, setShowWordPool] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings từ localStorage sau khi component mount
  useEffect(() => {
    const settings = loadSettings()
    setBoxCount(settings.boxCount)
    setSelectedLetters(settings.selectedLetters)
    setLetterCase(settings.letterCase)
    setIsLoaded(true)
  }, [])

  const toggleLetter = (letter: string) => {
    playClickSound()
    setSelectedLetters((prev) => {
      const newLetters = prev.includes(letter)
        ? prev.filter((l) => l !== letter)
        : [...prev, letter]
      // Lưu cài đặt khi thay đổi
      saveSettings({ boxCount, selectedLetters: newLetters, letterCase })
      return newLetters
    })
  }

  const handleBoxCountChange = (count: number) => {
    playClickSound()
    setBoxCount(count)
    saveSettings({ boxCount: count, selectedLetters, letterCase })
  }

  const handleLetterCaseChange = (caseType: 'uppercase' | 'lowercase') => {
    playClickSound()
    setLetterCase(caseType)
    saveSettings({ boxCount, selectedLetters, letterCase: caseType })
  }

  const handleStart = () => {
    if (selectedLetters.length > 0) {
      playClickSound()
      saveSettings({ boxCount, selectedLetters, letterCase })
      onStartGame({ boxCount, selectedLetters, letterCase })
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <p className="text-lg font-potta-one text-gray-600">Đang tải cài đặt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-potta-one text-gray-800 mb-8 text-center">⚙ Cài Đặt cho Cô Giáo</h1>

        {/* Box count setting */}
        <div className="mb-8">
          <h2 className="text-2xl font-potta-one text-gray-700 mb-4">Số Lượng Hộp Quà</h2>
          <div className="flex gap-4 flex-wrap">
            {[3, 4, 6, 9, 12].map((count) => (
              <button
                key={count}
                onClick={() => handleBoxCountChange(count)}
                className={`px-6 py-3 rounded-full font-potta-one text-lg transition-all active:scale-95 ${
                  boxCount === count
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Letter case setting */}
        <div className="mb-8">
          <h2 className="text-2xl font-potta-one text-gray-700 mb-4">Chữ Hoa / Chữ Thường</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleLetterCaseChange('uppercase')}
              className={`px-6 py-3 rounded-full font-potta-one text-lg transition-all active:scale-95 ${
                letterCase === 'uppercase'
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-110"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              A (Hoa)
            </button>
            <button
              onClick={() => handleLetterCaseChange('lowercase')}
              className={`px-6 py-3 rounded-full font-potta-one text-lg transition-all active:scale-95 ${
                letterCase === 'lowercase'
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-110"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              a (Thường)
            </button>
          </div>
        </div>

        {/* Letter selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-potta-one text-gray-700 mb-4">Chọn Chữ Cái Tiếng Việt</h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
            {VIETNAMESE_LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => toggleLetter(letter)}
                className={`py-3 rounded-lg font-potta-one text-lg transition-all active:scale-95 ${
                  selectedLetters.includes(letter)
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg scale-110"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {letterCase === 'uppercase' ? letter.toUpperCase() : letter}
              </button>
            ))}
          </div>
          <p className="text-sm font-potta-one text-gray-600 mt-4">Đã chọn: {selectedLetters.length} chữ cái</p>
        </div>

        {/* Word pool viewer section */}
        <div className="mb-8">
          <Button
            onClick={() => setShowWordPool(!showWordPool)}
            variant="outline"
            className="w-full mb-4 text-lg font-potta-one py-3 rounded-full border-2 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all"
          >
            {showWordPool ? "▼ Ẩn" : "▶ Xem"} Pool Từ Vựng
          </Button>

          {showWordPool && (
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-potta-one text-purple-700 mb-4 text-center">
                📚 Pool Từ Vựng ({selectedLetters.length} chữ cái)
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedLetters.length > 0 ? (
                  selectedLetters.map((letter) => (
                    <div key={letter} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h4 className="text-3xl font-potta-one text-orange-600 mb-3 text-center border-b-2 border-orange-200 pb-2" style={{ lineHeight: '1.3', paddingTop: '0.2em', paddingBottom: '0.2em' }}>
                        {letterCase === 'uppercase' ? letter.toUpperCase() : letter}
                      </h4>
                      {VOCABULARY[letter] ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {VOCABULARY[letter].words.map((word, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                              <span className="text-2xl">{VOCABULARY[letter].images[idx]}</span>
                              <span className="text-lg font-montserrat text-gray-800 font-semibold flex-1">
                                {word}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic text-center font-montserrat">Chưa có từ vựng</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 font-potta-one">Chưa chọn chữ cái nào</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleStart}
            disabled={selectedLetters.length === 0}
            className="flex-1 font-potta-one bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-lg py-6 rounded-full disabled:opacity-50 transition-all active:scale-95"
          >
            ▶ Bắt Đầu Chơi
          </Button>
          <Button
            onClick={() => {
              playClickSound()
              onCancel()
            }}
            variant="outline"
            className="flex-1 font-potta-one text-lg py-6 rounded-full border-2 bg-transparent transition-all active:scale-95"
          >
            ✕ Hủy
          </Button>
        </div>
      </div>
    </div>
  )
}
