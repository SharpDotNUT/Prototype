
import { useAPIStore } from '@/stores/api'

const API = useAPIStore()

export const checkIfTimeExpired = (time: number) => {
  const currentTime = new Date().getTime()
  const timeToCheck = new Date(time).getTime()
  return currentTime > timeToCheck
}

export type t_Data = Array<{
  id: number
  key: string
  game: string
  server: string
  version: string
  'available-time': number
  'available-time-string'?: string
  expired?: boolean
  'time-to-expire'?: number
}>

export function reduceData(data: t_Data) {
  data.forEach(item => {
    item['available-time-string'] = new Date(
      item['available-time']
    ).toLocaleString()
    item.expired = checkIfTimeExpired(item['available-time'])
    item['time-to-expire'] =
      (new Date(item['available-time']).getTime() - new Date().getTime()) /
      (1000 * 60)
  })
  return data
}
