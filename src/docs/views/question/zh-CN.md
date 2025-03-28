你好，欢迎访问云翰社答题系统。

目前仅有 1 个题库，为`「星月银0」`。

首个版本，后续会完善.

> 如果您是第一次访问此网站,那么我要在此提醒您本网站在大多数功能都是处于未完成或未完善的状态（苦逼高中生维护）。
> 除了 `音乐播放器` `辞典`

目前 GitHub 储存库不接受公开提交，如果想要提交题目，可以在[哔哩哔哩](https://space.bilibili.com/650631530)私信我或者[发我邮件](mailto:liyufeng0628@outlook.com)。

格式为 JSON，格式如下：

```typescript
export interface QuestionsList {
  name?: string
  author?: string
  link?: {
    [key: string]: URL
  }
  questions: Question[]
}

export interface Question {
  id: number
  question: string // 支持 Markdown
  answer: string | string[]
  answers: {
    [key: string]: string
  }
  tag?: string[]
}
```
