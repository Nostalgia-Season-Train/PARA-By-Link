// 标明领域、项目的属性对
const areaKV = ["PARA", "Area"]
const projectKV = ["PARA", "Project"]


// 上级目录
let upAreas = []

upAreas = (dv.current()?.file?.inlinks).filter(link => {
    if(dv.pages(`"${ link.path }"`)[0]?.[areaKV[0]] == areaKV[1])
        return true
    return false
})

if(upAreas.length) {
    dv.span("上级目录：")
    dv.span(upAreas.join(" 丨 "))
}


// 下属项目
let downProjects = []

if(dv.current()?.[areaKV[0]] == areaKV[1]) {
    downProjects = (dv.current()?.file?.outlinks).filter(link => {
        if(dv.pages(`"${ link.path }"`)[0]?.[projectKV[0]] == projectKV[1])
            return true
        return false
    })
}

if(downProjects.length) {
    let result = await dv.query(`
        LIST rows.file.link
        WHERE contains("${ downProjects.path }", file.path)
        GROUP BY file.frontmatter.status as status
        SORT choice(status = "计划中", "1",
        choice(status = "正在进行", "2",
        choice(status = "已完成", "3", "others")))
    `)

    dv.list(result.value.values)
}


// CSS 设置
// 如果使用了 Blue Topaz 主题，可以给项目列表添加看板样式
dv.container.classList.add("kanban")
