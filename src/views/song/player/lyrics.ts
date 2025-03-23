interface t_RawData_Lyric {
  lyric: string // lrc 格式
  version: string
}

interface t_RawData {
  lrc: t_RawData_Lyric
  tlyric: t_RawData_Lyric // 可能为 ''
  romalrc: t_RawData_Lyric // 可能为 ''
}

interface t_LyricWord {
  startTime: number
  endTime: number
  word: string
}

interface t_LyricLine {
  words: t_LyricWord[]
  translatedLyric: string
  romanLyric: string
  startTime: number
  endTime: number
}

interface t_LyricsTimeline {
  [key: number]: string
}

/**
 * 解析 LRC 格式的歌词
 */
export function parseLyrics(lyrics: string | undefined): t_LyricsTimeline {
  if (!lyrics) return {};

  const lyricsLines = lyrics.trim().split('\n');
  const lyricsObject: t_LyricsTimeline = {};

  lyricsLines.forEach((line) => {
    const timeTag = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\]/);
    if (timeTag) {
      const minutes = parseInt(timeTag[1], 10);
      const seconds = parseInt(timeTag[2], 10);
      const milliseconds = parseInt(timeTag[3], 10);
      const timeInMilliseconds = minutes * 60000 + seconds * 1000 + milliseconds;

      // 提取歌词文本
      const lyricText = line.replace(/\[.*?\]/, '').trim();
      lyricsObject[timeInMilliseconds] = lyricText;
    }
  })

  return lyricsObject
}

/**
 * 解析 LRC 和 YRC 歌词为结构化的歌词行
 */
export function parseLrcToLyricLines(lrc: t_RawData): t_LyricLine[] {
  console.clear()

  const lyricLines: t_LyricLine[] = []

  // 解析原始歌词
  const rawLyrics = parseLyrics(lrc.lrc.lyric)
  const translatedLyrics = parseLyrics(lrc.tlyric.lyric)
  const romanLyrics = parseLyrics(lrc.romalrc.lyric)

  // 获取所有时间戳
  const allTimestamps = new Set([
    ...Object.keys(rawLyrics),
    ...Object.keys(translatedLyrics),
    ...Object.keys(romanLyrics)
  ])

  // 将时间戳转换为数字并排序
  const sortedTimestamps = Array.from(allTimestamps)
    .map(Number)
    .sort((a, b) => a - b);

  // 遍历时间戳，构建歌词行
  for (let i = 0; i < sortedTimestamps.length; i++) {
    const startTime = sortedTimestamps[i]
    const endTime =
      i < sortedTimestamps.length - 1
        ? sortedTimestamps[i + 1]
        : startTime + 10000 // 如果没有下一行，假设持续10秒

    const rawLyric = rawLyrics[startTime] || ''
    const translatedLyric = translatedLyrics[startTime] || ''
    const romanLyric = romanLyrics[startTime] || ''

    // 如果有逐字歌词，则拆分 words
    const words = [
      {
        startTime,
        endTime,
        word: rawLyric
      }
    ]

    lyricLines.push({
      words,
      translatedLyric,
      romanLyric,
      startTime,
      endTime
    })
  }

  return lyricLines;
}