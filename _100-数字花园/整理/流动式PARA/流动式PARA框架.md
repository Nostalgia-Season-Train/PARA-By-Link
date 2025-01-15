---
category: 卡片
status: 归档
---
```dataviewjs
await dv.view("_Obsidian主页/_代码/流动式PARA导航栏")
```

# 流动式 PARA 简介

流动式 PARA 框架是本人为了解决卡片笔记和 PARA 冲突而提出的方法
- 卡片笔记：将知识细化成一系列卡片，并通过双链网络相互引用
- PARA：以行动为导向，将笔记分成四类（项目、领域、资源和归档）并放到相应文件夹下

将卡片笔记用 PARA 管理的话，会遇到很多问题，例如：
- 新建卡片属于哪个 PARA 类型：资源还是归档，又或者创建一个收件箱？
- 卡片定期回顾时，是否移动？移动到何处？
	- 比如，正在进行的项目链接了归档文件夹下的卡片，是否要将该卡片移动到资源文件夹？

很明显，PARA 限制了卡片笔记畅快的写作和思考方式，破坏了卡片笔记随想随写的特性（哪怕 PARA 分类只需思考一两秒，也足以造成思维卡顿），最重要的是，并不是每一张卡片并都适合 PARA 分类。除此之外，纯粹依靠四个分类并不能有效管理笔记，有时候需要把 PARA 领域当成项目资源的工作台，再次进行二次分类。

虽然卡片笔记跟 PARA 不协调，但是，如果将两套系统分开，则割裂了笔记系统中的知识与行动，卡片记下的知识难以参与 PARA 行动输出成果的过程。

因此，本人思考并实践得出一套流动式 PARA 框架，其不再以文件夹进行分类，而是将 PARA 搭建在卡片双链网络之上，**将项目和资源链接到相应的领域下，将领域视作管理项目和资源的内容地图**，以此平衡卡片笔记跟 PARA 间的冲突。一共有两种方式，更推荐第二种：

1、[[领域1|直接型]]流动式 PARA：直接在领域中添加链接。
- 好处：
	- 简洁直观
	- 不需要插件
- 坏处：
	- 需要在领域卡片下编辑
	- 对项目资源链接到领域的情况无效

2、[[领域2|改进型]]流动式 PARA：1、卡片属性添加“PARA: PARA 类型”。2、Dataview 查询链接领域的项目资源。
- 好处：
	- 笔记 PARA 类型由自身确定，更加方便流动
	- 项目资源只要链接到领域就行，不用去领域下添加链接
	- 项目资源既可以通过领域管理，也可以通过单独的页面管理
- 坏处：
	- 迁徙到其他笔记平台不方便

# 主页与领域

在有[[主页]]的情况下，搭配改进型 PARA，通过主页 -> 领域 -> 项目，可以快速找到自己做事的领域，并开始一个项目
- 例：主页 -> Obsidian -> 插件开发

## 卡片属性

项目卡片：
```
PARA: Project
```

领域卡片：
```
PARA: Area
```

资源卡片：
```
PARA: Resource
```

## 主页

主页
```
LIST
FROM "卡片盒"
WHERE file.frontmatter.PARA = "Area"
```

## 领域

领域下属项目：
```
LIST rows.file.link
FROM "卡片盒"
WHERE contains(this.file.outlinks, file.link) OR contains(this.file.inlinks, file.link)
WHERE file.frontmatter.PARA = "Project"
GROUP BY file.frontmatter.status AS 状态
SORT choice(状态 = "计划中", "1",
choice(状态 = "正在进行", "2",
choice(状态 = "已完成", "3", "others")))
```

领域下属资源：
```
LIST
FROM "卡片盒"
WHERE contains(this.file.outlinks, file.link) OR contains(this.file.inlinks, file.link)
WHERE file.frontmatter.PARA = "Resource"
```
