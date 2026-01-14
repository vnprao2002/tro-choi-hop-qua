"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface GiftBoxProps {
  id: number
  letter: string
  imageUrl: string
  isOpened: boolean
  showLetter: boolean // Hiển thị chữ mờ dần
  showFullResult: boolean // Hiển thị chữ rõ + từ + hình
  letterCase: 'uppercase' | 'lowercase'
  onClick: () => void
}

// Component pháo hoa
const Fireworks = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number; tx: number; ty: number }>>([])

  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#FFD93D']
    const newParticles = Array.from({ length: 30 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 30
      const distance = 50 + Math.random() * 50
      return {
        id: i,
        x: 50,
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.2,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance
      }
    })
    setParticles(newParticles)
    
    // Xóa particles sau animation
    const timer = setTimeout(() => {
      setParticles([])
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-firework"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            boxShadow: `0 0 10px ${particle.color}`,
            animationDelay: `${particle.delay}s`,
            '--tx': `${particle.tx}px`,
            '--ty': `${particle.ty}px`,
          } as React.CSSProperties & { '--tx': string; '--ty': string }}
        />
      ))}
    </div>
  )
}

const playSound = (type: "open" | "reveal" | "click" | "fireworks") => {
  // Create audio context for sound effects
  if (typeof window !== "undefined") {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    if (type === "open") {
      // Box opening sound - ascending pitch
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.frequency.setValueAtTime(400, audioContext.currentTime)
      osc.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.15)
      gain.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.14)
      gain.gain.setValueAtTime(0, audioContext.currentTime + 0.15)

      osc.start(audioContext.currentTime)
      osc.stop(audioContext.currentTime + 0.15)
    } else if (type === "reveal") {
      // Letter reveal sound - cheerful beep
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.frequency.value = 800
      gain.gain.setValueAtTime(0.2, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      gain.gain.setValueAtTime(0, audioContext.currentTime + 0.1)

      osc.start(audioContext.currentTime)
      osc.stop(audioContext.currentTime + 0.1)
    } else if (type === "click") {
      // Click sound - short beep
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)

      osc.frequency.value = 600
      gain.gain.setValueAtTime(0.15, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.09)
      gain.gain.setValueAtTime(0, audioContext.currentTime + 0.1)

      osc.start(audioContext.currentTime)
      osc.stop(audioContext.currentTime + 0.1)
    } else if (type === "fireworks") {
      // Fireworks sound - multiple ascending notes
      const notes = [523, 659, 784, 988] // C5, E5, G5, B5
      notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.connect(gain)
        gain.connect(audioContext.destination)

        osc.frequency.value = freq
        gain.gain.setValueAtTime(0.15, audioContext.currentTime + index * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.05 + 0.2)
        gain.gain.setValueAtTime(0, audioContext.currentTime + index * 0.05 + 0.2)

        osc.start(audioContext.currentTime + index * 0.05)
        osc.stop(audioContext.currentTime + index * 0.05 + 0.2)
      })
    }
  }
}

export default function GiftBox({ id, letter, imageUrl, isOpened, showLetter, showFullResult, letterCase, onClick }: GiftBoxProps) {
  const [isShaking, setIsShaking] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  // Dùng font mặc định (Lexend) cho chữ cái
  
  const displayLetter = letterCase === 'uppercase' ? letter.toUpperCase() : letter

  useEffect(() => {
    if (isOpened && showLetter) {
      // Hiển thị pháo hoa khi mở hộp
      setShowFireworks(true)
      playSound("fireworks")
      playSound("open")
      // Ẩn pháo hoa sau 1 giây
      const timer = setTimeout(() => {
        setShowFireworks(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpened, showLetter])

  const handleClick = () => {
    if (!isOpened) {
      playSound("click")
      setIsShaking(true)
      setTimeout(() => {
        onClick()
      }, 200)
      setTimeout(() => {
        setIsShaking(false)
      }, 400)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-full aspect-square perspective focus:outline-none group ${
        isOpened ? "scale-95" : "hover:scale-110"
      } transition-transform duration-300`}
      disabled={isOpened}
    >
      <div
        className={`w-full h-full rounded-lg shadow-xl relative overflow-hidden
        ${isShaking ? "animate-shake" : isOpened ? "" : "group-hover:shadow-2xl"} transition-shadow flex items-center justify-center bg-transparent`}
      >
        {/* Fireworks effect */}
        {showFireworks && <Fireworks />}
        
        {/* Gift box image */}
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Gift box ${id + 1}`}
          width={300}
          height={300}
          className={`w-full h-full object-contain drop-shadow-lg transition-all duration-300 ${
            isOpened ? "opacity-70" : "opacity-100"
          }`}
          priority
        />

        {/* Opened state - show letter gradually (mờ dần) */}
        {isOpened && showLetter && !showFullResult && (
          <div className="absolute inset-0 flex items-center justify-center relative px-4 py-8">
            <span
              className="text-8xl text-white drop-shadow-lg animate-letter-fade-in"
              style={{ 
                filter: "blur(4px)",
                opacity: 0.5,
                animation: "letterFadeIn 0.6s ease-in-out forwards",
                lineHeight: '1.3',
                paddingTop: '0.2em',
                paddingBottom: '0.2em'
              }}
            >
              {displayLetter}
            </span>
          </div>
        )}

        {/* Full result - show clear letter */}
        {isOpened && showFullResult && (
          <div className="absolute inset-0 flex items-center justify-center relative px-4 py-8">
            <span 
              className="text-8xl text-white drop-shadow-lg animate-letter-grow"
              style={{
                lineHeight: '1.3',
                paddingTop: '0.2em',
                paddingBottom: '0.2em'
              }}
            >
              {displayLetter}
            </span>
          </div>
        )}
      </div>

      {/* Box number */}
      <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-800 shadow-lg z-10">
        {id + 1}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-2deg); }
          20%, 40%, 60%, 80% { transform: translateX(5px) rotate(2deg); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes letterFadeIn {
          0% {
            opacity: 0;
            filter: blur(10px);
          }
          50% {
            opacity: 0.3;
            filter: blur(6px);
          }
          100% {
            opacity: 0.5;
            filter: blur(4px);
          }
        }
        .animate-letter-fade-in {
          animation: letterFadeIn 0.6s ease-in-out forwards;
        }
        @keyframes letterGrow {
          from {
            transform: scale(0.8);
            opacity: 0.7;
            filter: blur(2px);
          }
          to {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }
        .animate-letter-grow {
          animation: letterGrow 0.3s ease-out forwards;
        }
        @keyframes firework {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(0);
            opacity: 0;
          }
        }
        .animate-firework {
          animation: firework 0.8s ease-out forwards;
        }
      `}</style>
    </button>
  )
}
