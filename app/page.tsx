"use client"

import { useState, useEffect } from "react"
import HomePage from "@/components/home-page"
import GameBoard from "@/components/game-board"
import TeacherSettings from "@/components/teacher-settings"

type GameState = "home" | "settings" | "game"

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

export default function Page() {
  const [gameState, setGameState] = useState<GameState>("home")
  const [gameConfig, setGameConfig] = useState({
    boxCount: 6,
    selectedLetters: ["a", "d", "h"],
    letterCase: 'uppercase' as 'uppercase' | 'lowercase',
  })
  
  useEffect(() => {
    // Load settings từ localStorage khi component mount
    const saved = loadSettings()
    setGameConfig(saved)
  }, [])

  const handleStartGame = (config: typeof gameConfig) => {
    setGameConfig(config)
    setGameState("game")
  }

  const handleBackHome = () => {
    setGameState("home")
  }

  const handleOpenSettings = () => {
    setGameState("settings")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-lime-100">
      {gameState === "home" && (
        <HomePage onStartGame={() => handleStartGame(gameConfig)} onOpenSettings={handleOpenSettings} />
      )}
      {gameState === "settings" && <TeacherSettings onStartGame={handleStartGame} onCancel={handleBackHome} />}
      {gameState === "game" && <GameBoard config={gameConfig} onBack={handleBackHome} />}
    </div>
  )
}
