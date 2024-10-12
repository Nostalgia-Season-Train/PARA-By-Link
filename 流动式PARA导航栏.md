---
cssclasses: kanban
---

```dataviewjs
// 活动文件（可见页面）
const activeFile = app.workspace.getActiveFile()

if(dv.current().file.path == activeFile.path)
    throw new Error("为防止本文件反链过多引发卡顿，该脚本不会在打开本文件时执行！")


// 显示上级领域
let upAreas = ""
let inlinks = (dv.page(activeFile.path).file.inlinks)
let areas = dv.pages().filter(p => p.file.frontmatter?.PARA == "Area")
areas.map(area => {
    for(i = 0; i < inlinks.length; i++)
        if(dv.equal(area.file.link, inlinks[i]))
            upAreas += area.file.link + " 丨 "
})

if(upAreas) {
    dv.span("上级领域：")
    dv.span(upAreas.slice(0, -2))
}
```

```dataviewjs
// JS 代码分开以保证显示顺序
// 否则 dv.execute 将在 dv.span 之前显示
const activeFile = app.workspace.getActiveFile()

if(dv.current().file.path == activeFile.path)
    throw new Error("为防止本文件反链过多引发卡顿，该脚本不会在打开本文件时执行！")


// 显示当前项目
let currentProjects = []
let outlinks = (dv.page(activeFile.path).file.outlinks)
let projects = dv.pages().filter(p => p.file.frontmatter?.PARA == "Project")

currentProjects = projects.filter(project => {
    for(i = 0; i < outlinks.length; i++)
        if(dv.equal(project.file.link, outlinks[i]))
            return true
    return false
})

if(currentProjects.length) {dv.execute(`
    LIST rows.file.link
    WHERE contains("${ currentProjects.file.path }", file.path)
    GROUP BY file.frontmatter.status AS 状态
    SORT choice(状态 = "计划中", "1",
    choice(状态 = "正在进行", "2",
    choice(状态 = "已完成", "3", "others")))
`)}
```
