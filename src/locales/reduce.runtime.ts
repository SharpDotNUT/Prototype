// 扫描 JSON 文件，
// 去除空对象
// 按键排序

import path from 'node:path'
const dirname = import.meta.dirname

const dir = Deno.readDirSync(dirname)
dir.forEach(async (file) => {
  if (file.name.endsWith('.json')) {
    const filename = path.join(dirname, file.name)
    const data = JSON.parse(await Deno.readTextFile(filename))
    const sorted = Object.keys(data)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = data[key]
          return acc
        },
        {} as Record<string, any>
      )
    await Deno.writeTextFile(filename, JSON.stringify(sorted, null, 2))
  }
})
