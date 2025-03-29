const _prompt = await Deno.readTextFile('./prompt.md')
const zhHans = await Deno.readTextFile('./zh-Hans.json')
const en = await Deno.readTextFile('./en.json')
const ja = await Deno.readTextFile('./ja.json')

console.log(`

${_prompt}

### zh-Hans
\`\`\`json
${zhHans}
\`\`\`

### en
\`\`\`json
${en}
\`\`\`

### ja
\`\`\`json
${ja}
\`\`\`

    
`)
