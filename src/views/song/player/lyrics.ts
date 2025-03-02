export interface t_RawLyrics {
  [key: number]: string
}
export interface t_Lyrics {
  [key: number]: { raw: string; translation: string; romaji: string }
}

export function parseLyrics(lyrics: string | undefined) {

  if (!lyrics) return {}

  const lyricsLines = lyrics.trim().split('\n')
  const lyricsObject: t_RawLyrics = {}

  lyricsLines.forEach(line => {
    const timeTag = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/)
    if (timeTag) {
      const minutes = parseInt(timeTag[1], 10)
      const seconds = parseInt(timeTag[2], 10)
      const milliseconds = parseInt(timeTag[3], 10)
      const timeInMilliseconds = minutes * 60000 + seconds * 1000 + milliseconds

      // 提取歌词文本
      const lyricText = line.replace(/\[.*?\]/, '').trim()
      lyricsObject[timeInMilliseconds] = lyricText
    }
  })
  return lyricsObject
}

export function mergeLyrics(
  raw: t_RawLyrics,
  translation: t_RawLyrics,
  romaji: t_RawLyrics
) {
  const mergedLyrics: t_Lyrics = {}

  // 将所有时间戳合并到一个集合中
  const allTimestamps = new Set([
    ...Object.keys(raw),
    ...Object.keys(translation),
    ...Object.keys(romaji)
  ])

  // 遍历所有时间戳，并合并对应的歌词
  let lastIsBlank = false
  allTimestamps.forEach(timestamp => {
    const time = parseInt(timestamp, 10)
    const isBlank = !raw[time] && !translation[time] && !romaji[time]
    if (true) {
      mergedLyrics[time] = {
        raw: raw[time] || '',
        translation: translation[time] || '',
        romaji: romaji[time] || ''
      }
      lastIsBlank = isBlank ? true : false
    } else {
      lastIsBlank = true
    }
  })

  return mergedLyrics
}
