// 作者：旧日丨四季列车
// 使用方法：https://github.com/Nostalgia-Season-Train/PARA-By-Link

// 类型标明：
// 标明卡片、领域、项目的属性：[属性名, 属性值]
// 注：PARA: Area 和 PARA: Project 是为了兼容上个版本流动式 PARA
const cardKV = [
    ["category", "卡片"]
]

const areaKV = [
    ["category", "领域"],
    ["PARA", "Area"]
]

const projectKV = [
    ["category", "项目"],
    ["PARA", "Project"]
]

const archiveKV = [
    ["archive", true]
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

// 是否归档（未归档返回真）
const isArchive = (pageOrLink) => {
    const path = getPath(pageOrLink)

    for (i = 0; i < archiveKV.length; i++)
        if (dv.page(path)?.[archiveKV[i][0]] != archiveKV[i][1])
            return true
    return false
}

// 是否为领域、项目
const isArea = (pageOrLink) => {
    const path = getPath(pageOrLink)

    for (i = 0; i < areaKV.length; i++)
        if (dv.page(path)?.[areaKV[i][0]] == areaKV[i][1])
            return true
    return false
}

const isProject = (pageOrLink) => {
    const path = getPath(pageOrLink)

    for (i = 0; i < projectKV.length; i++)
        if (dv.page(path)?.[projectKV[i][0]] == projectKV[i][1])
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

// 子级项目：领域或项目 A -> 项目 B，称 B 为 A 的子级项目，在导航栏以看板分栏显示 B
let projectPaths = []

if (isArea(dv.current()) || isProject(dv.current())) {
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

        const projectPath = projectPaths[i]
        const projectStem = path.basename(projectPath, path.extname(projectPath))
        const projectLink = `[[${projectPath}|${projectStem}]]`

        if        (projectStatus == "计划中") {
            plan    += `    - ${projectLink}\n`
        } else if (projectStatus == "正在进行") {
            ongoing += `    - ${projectLink}\n`
        } else if (projectStatus == "已完成") {
            finish  += `    - ${projectLink}\n`
        } else if (projectStatus == "挂起") {
            standby += `    - ${projectLink}\n`
        } else {  // 优先按状态分类，不行按任务分类
            const taskNumAll    = dv.page(projectPath).file.tasks.length
            const taskNumFinish = dv.page(projectPath).file.tasks.filter(t => t.completed).length

            if        (taskNumFinish == 0) {
                plan    += `    - ${projectLink}\n`
            } else if (taskNumFinish < taskNumAll) {
                ongoing += `    - ${projectLink}\n`
            } else if (taskNumFinish == taskNumAll) {
                finish  += `    - ${projectLink}\n`
            }
        }
    }

    if (standby == "- 挂起\n") {  // 只有项目挂起，才会显示挂起分栏
        dv.span(`${plan}\n${ongoing}\n${finish}`)
    } else {
        dv.span(`${plan}\n${ongoing}\n${finish}\n${standby}`)
    }
}
