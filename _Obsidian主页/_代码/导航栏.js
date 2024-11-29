// 类型标明：
// 标明卡片、领域、项目的属性：[属性名, 属性值]
// 注：PARA: Area 和 PARA: Project 是为了兼容上个版本流动式 PARA
const cardKV = [
    ["category", "卡片笔记"],
]

const areaKV = [
    ["category", "内容地图"],
    ["PARA", "Area"]
]

const projectKV = [
    ["category", "项目文档"],
    ["PARA", "Project"]
]

// 导航栏样式：
// 添加 Blue Topaz 主题下 kanban 样式
dv.container.classList.add("kanban")


// ======== 判断模块 ========

// 获取页面或链接的文件路径
const getPath = (pageOrLink) => {
    let path = pageOrLink?.file?.path

    // 没有 file 属性代表传入链接
    if (path == null)
        path = pageOrLink?.path

    return path
}

// 根据属性判断是否为领域、项目
// dv.pages() 返回数组，路径查询只有一个结果，直接从偏移 0 取就行
const isArea = (pageOrLink) => {
    let path = getPath(pageOrLink)

    for (i = 0; i < areaKV.length; i++)
        if (dv.pages(`"${path}"`)[0]?.[areaKV[i][0]] == areaKV[i][1])
            return true
    return false
}

const isProject = (pageOrLink) => {
    let path = getPath(pageOrLink)

    for (i = 0; i < projectKV.length; i++)
        if (dv.pages(`"${path}"`)[0]?.[projectKV[i][0]] == projectKV[i][1])
            return true
    return false
}


// ======== 显示模块 ========

// 上级目录：领域 A -> 页面 B，称 A 为 B 的上级目录，在导航栏显示 A
let upAreas = (dv.current()?.file?.inlinks).filter(isArea)

if (upAreas.length) {
    dv.span("上级目录：")
    dv.span(upAreas.join(" | "))
}

// 反向链接：页面 A -> 页面 B，称 A 为 B 的反向链接，当 B 没有上级目录时在导航栏显示 A
if (!upAreas.length) {
    let backLinks = dv.current()?.file?.inlinks

    if (backLinks.length) {
        dv.span("反向链接：")
        dv.span(backLinks.join(", "))
    }
}

// 子项目：领域或项目 A -> 项目 B，称 B 为 A 的子项目，在导航栏以无序列表显示 B（不止一个子项目）
let downProjects = []

if (isArea(dv.current()) || isProject(dv.current)) {
    downProjects = (dv.current()?.file?.outlinks).filter(isProject)
}

if (downProjects.length) {
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
