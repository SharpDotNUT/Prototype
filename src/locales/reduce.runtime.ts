// 扫描 JSON 文件，
// 去除空对象
// 按键排序

const dir = Deno.readDirSync('.')
dir.forEach(async (file) => {
  if (file.name.endsWith('.json')) {
    const data = JSON.parse(await Deno.readTextFile(file.name))
    const sorted = Object.keys(data)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = data[key]
          return acc
        },
        {} as Record<string, any>
      )
    await Deno.writeTextFile(file.name, JSON.stringify(sorted, null, 2))
  }
})
