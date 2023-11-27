# inplay-inc.github.io

## 快速使用

[Hugo 官方文档](https://gohugo.io/documentation/)
[Hugo-book Github](https://github.com/alex-shpak/hugo-book)
[Hugo-book Demo](https://hugo-book-demo.netlify.app/)

`hugo serve` 命令开启本地服务，可用于本地预览，如下:
```
D:\quickstart>hugo serve
Watching for changes in D:\hugo\hugo_extended_0.120.4_windows-amd64\quickstart\{archetypes,assets,content,static,themes}
Watching for config changes in D:\hugo\hugo_extended_0.120.4_windows-amd64\quickstart\hugo.toml
Start building sites …
hugo v0.120.4-f11bca5fec2ebb3a02727fb2a5cfb08da96fd9df+extended windows/amd64 BuildDate=2023-11-08T11:18:07Z VendorInfo=gohugoio


                   | EN
-------------------+-----
  Pages            | 16
  Paginator pages  |  0
  Non-page files   |  0
  Static files     | 79
  Processed images |  0
  Aliases          |  2
  Sitemaps         |  1
  Cleaned          |  0

Built in 217 ms
Environment: "development"
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```
编写好md后提交到main分支，之后GitHub会自动编译到GitPages上。

## 内容编写

在content/docs/路径下编写markdown文件。若需要多级目录，需创建文件夹并在该文件夹下创建_index.md 文件，再在该文件夹下创建子目录或文件，如创建IN6XXE目录，该目录下又有Getting Started目录：
|-- content
|&emsp;&emsp;|-- docs
|&emsp;&emsp;&emsp;&emsp;|-- IN6XXE
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- _index.md 
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- Getting Started
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- _index.md
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- HCI command.md
|&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- introduction.md

### 图片引用

推荐两种方式引用图片：
1. 直接引用：
  在需要引用图片的页面单独建一个文件夹，此文件夹只存放index.md文件及图片资源，如创建picShow页面：
  |-- content
  |&emsp;&emsp;|-- docs
  |&emsp;&emsp;&emsp;&emsp;|-- IN6XXE
  |&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- _index.md 
  |&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- Getting Started
  |&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- _index.md
  |&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|-- picShow
  |&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|--index.md
  |&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|--sample.png

  之后再在index.md里编写内容，引入图片 `![](sample.png)`，这种引用方式是可以部署到GitPages上的，不需要更改引用路径。

2. 利用PicGo 工具:
  [PicGo 下载地址](https://github.com/Molunerfinn/PicGo/releases/tag/v2.3.1)
  [PicGo 文档](https://picgo.github.io/PicGo-Doc/zh/guide/#picgo-is-here)
   
  安装好后打开PicGo，进入图床设置-> Github ，
  仓库名： InPlay-Inc/inplay-inc.github.io
  分支名： main
  Token：需自己创建，勾上repo权限即可
  存储路径: static/images/

  设置好后点击确定即可。
  之后在上传区上传，上传成功会有提示，成功后会默认复制Markdown格式的引用路径，直接粘贴到md文件里即可，如：
  `![](https://raw.githubusercontent.com/InPlay-Inc/inplay-inc.github.io/main/static/images/4_1920.png)`