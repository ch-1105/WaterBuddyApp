'use client'

import React, { useState } from 'react'
import WaterProgress from '../components/WaterProgress'
import QuickAddButton from '../components/QuickAddButton'
import SettingsMenu from '../components/SettingsMenu'

export default function Home() {
  const [waterConsumed, setWaterConsumed] = useState(0)
  const [dailyGoal, setDailyGoal] = useState(2000) // 2000ml default goal

  const addWater = (amount: number) => {
    setWaterConsumed((prev) => Math.min(prev + amount, dailyGoal))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-blue-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Water Buddy</h1>
        <WaterProgress consumed={waterConsumed} goal={dailyGoal} />
        <div className="mt-8 w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">成就进度</span>
            </div>
            <span className="text-sm text-gray-500">3 / 10</span>
          </div>
          <Progress value={30} className="w-full" />
        </div>
        <div className="mt-8 flex justify-center">
          <QuickAddButton onAdd={() => addWater(250)} /> {/* Add 250ml by default */}
        </div>
        <div className="mt-8">
          <SettingsMenu 
            dailyGoal={dailyGoal} 
            onGoalChange={setDailyGoal}
            onReset={() => setWaterConsumed(0)}
          />
        </div>
      </div>
    </main>
  )
}

