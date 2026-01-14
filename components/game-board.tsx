"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import GiftBox from "@/components/gift-box"
import ResultModal from "@/components/result-modal"
import { VOCABULARY } from "@/lib/vocabulary"

interface GameBoardProps {
  config: {
    boxCount: number
    selectedLetters: string[]
    letterCase: 'uppercase' | 'lowercase'
  }
  onBack: () => void
}

const GIFT_BOX_IMAGES = ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.png"]

export default function GameBoard({ config, onBack }: GameBoardProps) {
  const [boxes, setBoxes] = useState<Array<{ id: number; letter: string; imageUrl: string; word: string; image: string }>>([])
  const [openedBox, setOpenedBox] = useState<number | null>(null)
  const [showFullResult, setShowFullResult] = useState(false)
  const [result, setResult] = useState<{ letter: string; word: string; image: string } | null>(null)

  useEffect(() => {
    initializeBoxes()
  }, [config.boxCount, config.selectedLetters])

  const initializeBoxes = () => {
    const newBoxes = Array.from({ length: config.boxCount }, (_, i) => {
      const letter = config.selectedLetters[Math.floor(Math.random() * config.selectedLetters.length)]
      const vocabList = VOCABULARY[letter]
      const randomIndex = vocabList ? Math.floor(Math.random() * vocabList.words.length) : 0
      
      return {
        id: i,
        letter,
        imageUrl: GIFT_BOX_IMAGES[Math.floor(Math.random() * GIFT_BOX_IMAGES.length)],
        word: vocabList?.words[randomIndex] || "",
        image: vocabList?.images[randomIndex] || "",
      }
    })
    setBoxes(newBoxes)
    setOpenedBox(null)
    setShowFullResult(false)
    setResult(null)
  }

  const handleBoxClick = (boxId: number) => {
    if (openedBox !== null && openedBox !== boxId) {
      // Nếu đã mở hộp khác, đóng hộp cũ trước
      setOpenedBox(null)
      setShowFullResult(false)
      setResult(null)
      setTimeout(() => {
        openBoxAndShowResult(boxId)
      }, 300)
    } else {
      openBoxAndShowResult(boxId)
    }
  }

  const openBoxAndShowResult = (boxId: number) => {
    setOpenedBox(boxId)
    const box = boxes.find((b) => b.id === boxId)
    if (box) {
      // Tự động hiện kết quả sau khi mở hộp
      setTimeout(() => {
        setShowFullResult(true)
        setResult({
          letter: box.letter,
          word: box.word,
          image: box.image,
        })
      }, 800) // Sau 0.8 giây (nhanh hơn)
    }
  }

  const handleNextBox = () => {
    setResult(null)
    setOpenedBox(null)
    setShowFullResult(false)
  }

  const handlePlayAgain = () => {
    initializeBoxes()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-lime-100">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-20 left-20 w-28 h-28 bg-blue-300 rounded-full opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-40 right-40 w-20 h-20 bg-green-300 rounded-full opacity-20 animate-float" style={{ animationDelay: "0.5s" }}></div>

      {/* Top bar */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl text-orange-600 drop-shadow-lg">Trò Chơi Mở Hộp Quà</h1>
        <div className="flex gap-3">
          <Button onClick={handlePlayAgain} variant="outline" className="rounded-full bg-white/80 backdrop-blur-sm">
            🔄 Tải Lại
          </Button>
          <Button onClick={onBack} variant="outline" className="rounded-full bg-white/80 backdrop-blur-sm">
            🏠 Quay Về
          </Button>
        </div>
      </div>

      {/* Game board */}
      <div className="relative z-10">
        <div
          className={`grid gap-6 ${
            config.boxCount === 3
              ? "grid-cols-3"
              : config.boxCount === 4
                ? "grid-cols-2 sm:grid-cols-2"
                : config.boxCount === 6
                  ? "grid-cols-2 sm:grid-cols-3"
                  : config.boxCount === 9
                    ? "grid-cols-3"
                    : "grid-cols-3 sm:grid-cols-4"
          } max-w-4xl`}
        >
          {boxes.map((box) => (
            <GiftBox
              key={box.id}
              id={box.id}
              letter={box.letter}
              imageUrl={box.imageUrl}
              isOpened={openedBox === box.id}
              showLetter={openedBox === box.id && !showFullResult}
              showFullResult={openedBox === box.id && showFullResult}
              letterCase={config.letterCase}
              onClick={() => handleBoxClick(box.id)}
            />
          ))}
        </div>
      </div>

      {/* Result modal */}
      {result && showFullResult && (
        <ResultModal
          letter={result.letter}
          word={result.word}
          image={result.image}
          letterCase={config.letterCase}
          onNext={handleNextBox}
          onPlayAgain={handlePlayAgain}
          onGoHome={onBack}
        />
      )}

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
