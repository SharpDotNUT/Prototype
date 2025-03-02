import { defineStore } from 'pinia'

export const useAPIStore = defineStore('api', () => {
  //@ts-ignore
  const APIHost = import.meta.env.VITE_API_HOST as string
  const fetchAPI = async (
    url: string,
    query?: Record<string, string>,
    method?: string,
    body?: any
  ) => {
    let SearchParams = query
      ? new URLSearchParams(query)
      : new URLSearchParams()
    const _url = `${APIHost}${url}?${SearchParams.toString()}`
    const response = await fetch(_url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    return response.json()
  }
  return {
    fetchAPI
  }
})
