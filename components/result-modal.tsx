"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ResultModalProps {
  letter: string
  word: string
  image: string
  letterCase: 'uppercase' | 'lowercase'
  onNext: () => void
  onPlayAgain: () => void
  onGoHome?: () => void
}

const playModalSound = () => {
  if (typeof window !== "undefined") {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Success chime - two ascending notes
    const notes = [523, 659] // C5, E5
    notes.forEach((freq, index) => {
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.19)
      gain.gain.setValueAtTime(0, audioContext.currentTime + index * 0.1 + 0.2)

      osc.start(audioContext.currentTime + index * 0.1)
      osc.stop(audioContext.currentTime + index * 0.1 + 0.2)
    })
  }
}

export default function ResultModal({ letter, word, image, letterCase, onNext, onPlayAgain, onGoHome }: ResultModalProps) {
  // Random chọn font Dancing Script hoặc Pacifico (dựa trên letter để consistent)
  const letterFont = letter.charCodeAt(0) % 2 === 0 ? 'font-dancing-script' : 'font-pacifico'
  const displayLetter = letterCase === 'uppercase' ? letter.toUpperCase() : letter
  
  React.useEffect(() => {
    playModalSound()
  }, [letter, word])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center animate-scale-in overflow-visible">
        <div className="mb-6 min-h-[250px] flex items-center justify-center px-4 pt-2 pb-8">
          <div 
            className={`${letterFont} text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 drop-shadow-lg animate-letter-grow break-words overflow-visible`} 
            style={{ 
              fontSize: displayLetter.length > 1 ? 'clamp(4rem, 12vw, 8rem)' : 'clamp(6rem, 15vw, 12rem)', 
              lineHeight: '1.3',
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              paddingTop: '0.1em',
              paddingBottom: '0.5em'
            }}
          >
            {displayLetter}
          </div>
        </div>

        {/* Image */}
        <div className="text-8xl mb-6 animate-bounce">{image}</div>

        {/* Vocabulary */}
        <h2 className="text-6xl sm:text-7xl font-montserrat font-bold text-gray-800 mb-8">{word}</h2>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onNext}
              className="flex-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-lg py-6 rounded-full transition-all active:scale-95"
            >
              🎁 Mở Hộp Khác
            </Button>
            <Button
              onClick={onPlayAgain}
              variant="outline"
              className="flex-1 text-lg py-6 rounded-full border-2 bg-transparent transition-all active:scale-95"
            >
              🔄 Chơi Tiếp
            </Button>
          </div>
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="w-full text-lg py-6 rounded-full border-2 bg-transparent transition-all active:scale-95"
            >
              🏠 Quay Về
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        @keyframes letter-grow {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-letter-grow {
          animation: letter-grow 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
