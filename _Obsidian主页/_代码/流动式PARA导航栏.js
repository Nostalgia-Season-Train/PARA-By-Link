// 类型标明：
// 标明卡片、领域、项目的属性：[属性名, 属性值]
// 注：PARA: Area 和 PARA: Project 是为了兼容上个版本流动式 PARA
const areaKV = [
    ["category", "内容地图"],
    ["PARA", "Area"]
]

const projectKV = [
    ["category", "项目文档"],
    ["PARA", "Project"]
]

const starKV = [
    ["status", "收藏"]
]

const archiveKV = [
    ["status", "归档"]
]

// 导航栏样式：
dv.container.classList.add("parabylink-nav")


// ======== 判断模块 ========

// 获取页面或链接的文件路径
const getPath = (pageOrLink) => {
    let path = pageOrLink?.file?.path

    // 没有 file 属性代表传入链接
    if (path == null)
        path = pageOrLink?.path

    return path
}

// 是否收藏
const isStar = (path) => {
    for (i = 0; i < starKV.length; i++)
        if (dv.pages(`"${path}"`)[0]?.[starKV[i][0]] == [starKV[i][1]])
            return true
    return false
}

// 是否归档（未归档返回真）
const isArchive = (pageOrLink) => {
    let path = getPath(pageOrLink)

    for (i = 0; i < archiveKV.length; i++)
        if (dv.pages(`"${path}"`)[0]?.[archiveKV[i][0]] != [archiveKV[i][1]])
            return true
    return false
}

// 是否为领域、项目
// dv.pages() 返回数组，dv.pages(path) 查询路径只有一个结果，直接从偏移 0 取就行
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
let upAreas = (dv.current()?.file?.inlinks).filter(isArea).filter(isArchive)

if (upAreas.length) {
    dv.span("上级目录：")
    dv.span(upAreas.join("丨"))
}

// 反向链接：页面 A -> 页面 B，称 A 为 B 的反向链接，当 B 没有上级目录时在导航栏显示 A
let backLinks = (dv.current()?.file?.inlinks).filter(isArchive)

if (!upAreas.length && backLinks.length) {
    if (backLinks.length) {
        dv.span("反向链接：")
        dv.span(backLinks.join("，"))
    }
}

// 收藏夹：状态等于收藏的笔记
// 取得链接的文件的路径，使用 Set 去重，最后还原回数组
let starPaths = [...new Set((dv.current()?.file?.inlinks?.path).concat(dv.current()?.file?.outlinks?.path))].filter(isStar)

if (starPaths.length) {
    // 有上级目录或反向链接时换行
    if (upAreas.length || backLinks.length)
        dv.span("</br>")

    dv.span("收藏：")

    let stars = []
    for(i = 0; i < starPaths.length; i++)
        stars.push(dv.pages(`"${starPaths[i]}"`)[0]?.file?.link)
    dv.span(stars.join("、"))
}

// 子项目：领域或项目 A -> 项目 B，称 B 为 A 的子项目，在导航栏以无序列表显示 B（不止一个子项目）
let projectPaths = []

if (isArea(dv.current()) || isProject(dv.current)) {
    // 项目链接
    let projectLinks = ((dv.current()?.file?.outlinks).filter(isProject).filter(isArchive)).values

    // 项目路径（去重）
    projectLinks.forEach(link => {
        if (!projectPaths.includes(link?.path))
            projectPaths.push(link?.path)
    })
}

const path = require('path');

if (projectPaths.length) {
    let plan    = "- 计划中\n"
    let ongoing = "- 正在进行\n"
    let finish  = "- 已完成\n"
    let standby = "- 挂起\n"

    for (i = 0; i < projectPaths.length; i++) {
        let projectStatus = dv.pages(`"${projectPaths[i]}"`)[0]?.status

        let projectPath = projectPaths[i]
        let projectStem = path.basename(projectPath, path.extname(projectPath))
        let projectLink = `[[${projectPath}|${projectStem}]]`

        if        (projectStatus == "计划中") {
            plan    += `    - ${projectLink}\n`
        } else if (projectStatus == "正在进行") {
            ongoing += `    - ${projectLink}\n`
        } else if (projectStatus == "已完成") {
            finish  += `    - ${projectLink}\n`
        } else if (projectStatus == "挂起") {
            standby += `    - ${projectLink}\n`
        }
    }

    dv.span(`${plan}\n${ongoing}\n${finish}\n${standby}`)
}
