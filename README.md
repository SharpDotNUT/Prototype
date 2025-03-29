<div align="center">
<center>

<img
  src="/public/img/UI_ChapterIcon_Yunjin.png"
  style="width: 15%;background-color: #777;border-radius: 20%"></img>

# 「试作」

![](https://img.shields.io/github/repo-size/SharpDotNUT/Prototype)
![](https://img.shields.io/github/license/SharpDotNUT/Prototype)
![](https://img.shields.io/github/last-commit/SharpDotNUT/Prototype)
![](https://img.shields.io/github/contributors/SharpDotNUT/Prototype)
![](https://img.shields.io/github/stars/SharpDotNUT/Prototype)

「云婵娟来花婵娟，风流尽在山水间。」

How gently do the clouds and flowers sway, as dancing winds meander through the vales.

</center>
</div>

---

「试作」是一个前端开源，后端部分开源的米哈游游戏工具箱。

"Prototype" is an front-end open source, back-end partly open source HoYo game toolbox.

皆在提供一个纯网页端，支持手机界面的米游戏工具箱。

All in providing a pure web page toolbox, while supporting mobile phones.

[官网](https://prototype.sharpdotnut.com/)

## 支持的功能 Supported features

- [x] 游戏内文字发翻译器 Translator for in-game language
- [x] HoYo-MiX 音乐播放器 HoYo-MiX music player
- [x] 基础成就管理 Achievement management
- [x] 原神辞典 Genshin Impact Dictionary
- [x] 前瞻兑换码查询 Special Program Redemption Code Query
- [ ] 问答 Quiz
- [ ] 卡池浏览 Gacha Pool Browser
- [ ] 抽卡模拟 Gacha Simulator

## 致谢 Thanks

感谢 [Cloudflare](https://www.cloudflare.com/) 提供的免费 CDN 服务，以及 Pages 等服务，他们是本项目免费运行的基础。

Thanks [Cloudflare](https://www.cloudflare.com/) for providing free CDN services, as well as Pages and other services, which are the basis for the free operation of this project.

![Cloudflare](https://user-images.githubusercontent.com/61003590/246605903-f19b5ae7-33f8-41ac-8130-6d0069fde27a.png)

## 启动项目

```bash

# 克隆仓库 Clone the repository
git clone https://github.com/SharpDotNUT/Prototype.git

# 安装依赖 Install dependencies
pnpm install

# 启动项目 Start the project
pnpm run dev

# 打包项目 Build the project
pnpm run build

```

> [!NOTE] 注意
> 本项目的在构建过程中定义了来自 GitHub API 的数据，所以建议在有正常网络连接的环境下进行构建。
> This project defines data from GitHub API during the build process, so it is recommended to build in an environment with normal network connection.
