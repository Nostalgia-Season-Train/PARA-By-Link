/* 要排除的属性 */
const excludes = ['category']


/* 遍历笔记属性，并在简介中展示 */
let rows = []

const meta = dv.current().file.frontmatter
Object.entries(meta).forEach(([key, value]) => {
    if (!excludes.includes(key)) {
        rows.push([key, value])
    }
})

dv.table(
    ['属性名', '属性值'],  // 表头，一般不显示
    rows
)
