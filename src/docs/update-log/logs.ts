import type { t_UpdateLog } from './types'

const log: t_UpdateLog = [
  {
    version: '2.1.1',
    date: '2025-03-31T22:30:00+0800',
    items: [
      {
        area: 'app',
        type: 'Development',
        'content-zh': '增强 TypeScript 支持',
        'content-en': 'Enhanced TypeScript support'
      },
      {
        area: 'dictionary',
        type: 'UI & UX',
        'content-zh':
          '改为首页和二级页面机制，为后续功能扩展做准备；优化界面；使用虚拟滚动提高性能' +
          '搜索结果将根据输入的关键词实时更新',
        'content-en':
          'Changed to home and secondary page mechanism, preparing for future feature expansion; ' +
          'optimized interface; used virtual scrolling to improve performance; ' +
          'search results will be updated in real time based on the input keyword'
      }
    ]
  },
  {
    version: '2.1.0',
    date: '2025-03-31T22:30:00+0800',
    items: [
      {
        area: 'i18n',
        type: 'Performance',
        'content-zh': '改进翻译',
        'content-en': 'Improved translation'
      },
      {
        area: 'app',
        type: 'Performance',
        'content-zh': '改名为「试作 · 云翰」',
        'content-en': 'Renamed to "Prototype · Yun Han"'
      },
      {
        area: 'update-log',
        type: 'Performance',
        'content-zh': '更新了 README.md',
        'content-en': 'Updated README.md'
      }
    ],
    commits: ['bee94830c15a75a8414a7585ce70842e967f6baf']
  },
  {
    version: '2.0.1',
    date: '2025-03-30T12:00:00+0800',
    items: [
      {
        area: 'update-log',
        type: 'UI & UX',
        'content-zh': '补充了功能列表的翻译；优化了在日文下的字体展示',
        'content-en':
          'Added translation for area list; optimized font display in Japanese'
      },
      {
        area: 'update-log',
        type: 'Others',
        'content-zh': '更改路径为 `/update-log`',
        'content-en': 'Changed path to `/update-log`'
      }
    ],
    commits: ['7f10a7d7220c92609bf2c06748518b80065af418']
  },
  {
    version: '2.0.0',
    date: '2025-03-30T00:00:00+0800',
    'name-zh': '红毹婵娟',
    'name-en': 'Stage Lucida',
    items: [
      {
        area: 'update-log',
        type: 'Feature',
        'content-zh': '添加了「更新日志」功能',
        'content-en': 'Added "Update Log" feature'
      },
      {
        area: 'docs',
        type: 'Performance',
        'content-zh': '更新了 README.md',
        'content-en': 'Updated README.md'
      },
      {
        area: 'song-player',
        type: 'UI & UX',
        'content-zh': '优化字体展示，适配手机端',
        'content-en': 'Optimized font display, adapted to mobile devices'
      },
      {
        area: 'app',
        type: 'Others',
        'content-zh': '升级 Vue@3.5，Vite@6',
        'content-en': 'Bump Vue@3.5, Vite@6'
      }
    ],
    commits: [
      '98beeb776a9ede83c4fc501cbc128ac55a2851e0',
      '7485bb22dc624e7cbbb9f2fedd698262af47206b',
      '8e1d530942588d8e49fb6dec1bafa655dbf0f3a6',
      '1df70efd1fd68ae3015fea469554918783e5b290',
      'b84c2d5d66d2074a47f9be0c4369222c2fa4af09',
      'd99d83552a5b3f5339279f8e7ab451f7d16d13b2'
    ]
  }
]

if (log[0].commits) {
  log[0].commits.unshift(__LAST_COMMIT.sha)
} else {
  log[0].commits = [__LAST_COMMIT.sha]
}

export default log
