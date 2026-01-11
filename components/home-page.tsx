"use client"

import { Button } from "@/components/ui/button"

interface HomePageProps {
  onStartGame: () => void
  onOpenSettings: () => void
}

const playButtonSound = () => {
  if (typeof window !== "undefined") {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()
    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.frequency.setValueAtTime(500, audioContext.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
    gain.gain.setValueAtTime(0.2, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.09)
    gain.gain.setValueAtTime(0, audioContext.currentTime + 0.1)

    osc.start(audioContext.currentTime)
    osc.stop(audioContext.currentTime + 0.1)
  }
}

export default function HomePage({ onStartGame, onOpenSettings }: HomePageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-lime-100">
      {/* Animated background - trees, sky, animals */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-float">☀️</div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full opacity-30 animate-float" style={{ animationDelay: "2s" }}>☁️</div>
        <div className="absolute top-40 left-1/4 w-20 h-20 bg-white rounded-full opacity-25 animate-float" style={{ animationDelay: "1s" }}>☁️</div>
        
        {/* Floating decorations */}
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-float" style={{ animationDelay: "1.5s" }}>🌸</div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-green-300 rounded-full opacity-20 animate-float" style={{ animationDelay: "0.5s" }}>🌳</div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-300 rounded-full opacity-20 animate-float" style={{ animationDelay: "2.5s" }}>🦋</div>
        
        {/* Animal decorations */}
        <div className="absolute bottom-32 left-1/3 text-6xl opacity-20 animate-float" style={{ animationDelay: "1s" }}>🐰</div>
        <div className="absolute top-1/2 right-1/3 text-5xl opacity-20 animate-float" style={{ animationDelay: "2s" }}>🐦</div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl">
        <h1 className="text-6xl md:text-7xl font-potta-one text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 animate-pulse drop-shadow-lg">
          TRÒ CHƠI
        </h1>
        <h2 className="text-5xl md:text-6xl font-potta-one text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-lg">
          MỞ HỘP QUÀ
        </h2>

        <p className="text-xl text-gray-700 mb-12 text-balance font-medium">
          Giúp các bé nhận diện chữ cái tiếng Việt qua trò chơi mở hộp quà thú vị! 🎁
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {
              playButtonSound()
              onStartGame()
            }}
            size="lg"
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all active:scale-95 transform hover:scale-105"
          >
            ▶️ Bắt Đầu
          </Button>
          <Button
            onClick={() => {
              playButtonSound()
              onOpenSettings()
            }}
            size="lg"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-gray-100 text-gray-800 text-lg px-8 py-6 rounded-full border-2 border-gray-300 shadow-lg transition-all active:scale-95 transform hover:scale-105"
          >
            ⚙️ Cài Đặt cho Cô
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
