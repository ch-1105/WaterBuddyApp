import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

interface Achievement {
  id: number
  name: string
  description: string
  completed: boolean
  icon: React.ReactNode
}

interface AchievementListProps {
  achievements: Achievement[]
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  return (
    <ul className="space-y-4">
      {achievements.map((achievement) => (
        <li key={achievement.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {achievement.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <Circle className="w-6 h-6 text-gray-300" />
            )}
          </div>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              {achievement.icon}
              <h3 className="text-lg font-semibold">{achievement.name}</h3>
            </div>
            <p className="text-gray-600">{achievement.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default AchievementList

