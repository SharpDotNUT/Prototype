export interface t_Achievement {
  id: number
  description: string
  rewards: number
}

export interface t_AchievementGroup {
  name: string
  version: string
  achievements: Array<t_Achievement>
}

export interface t_AchievementGoal {
  id: number
  order: number
  name: string
  versions: Array<string>
  numberOfAchievements: number
  numberOfGroups: number
  achievementGroups: Array<t_AchievementGroup>
}

export interface t_AchievementData {
  numberOfGoals: number
  numberOfGroups: number
  numberOfAchievements: number
  versions: string[]
  data: Array<t_AchievementGoal>
}
