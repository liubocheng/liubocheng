# 📂 Code 目录索引

> 本目录同时是 GitHub 仓库 **github.com/liubocheng/liubocheng**（个人主页 + GitHub Pages）的仓库根目录。
> `index.html` 与 `README.md` 必须保留在根目录（分别是 Pages 首页与 GitHub 个人资料 README）。
> 整理完成于 2026-08（本次深度整理：所有项目已按类别归入子目录，git 历史通过 `git mv` 完整保留）。

## 目录结构

```
Code/  (= 仓库根)
├── index.html                  # 个人主页（Pages 首页，勿移动）
├── README.md                   # GitHub 个人资料 README（勿移动）
├── PROJECTS.md                 # 本文件：目录索引
├── .gitignore                  # 忽略规则（node_modules/.env/lingxi-claw/learning/archive 等）
│
├── apps/                       # 🖥 Web 应用与网站
│   ├── calorie-app/            #   AI 食物热量识别（DeepInfra + Janus-Pro 多模态）
│   ├── opencode-dashboard/     #   React + Vite + TypeScript 仪表盘（有 node_modules，可 npm run dev）
│   ├── pulse/                  #   Project Pulse 项目管理工具（Next.js 静态导出版）
│   ├── Si Zhe/                 #   Guopop Studio 产品官网（思哲）
│   └── supply-chain-dashboard/ #   供应链数据大屏（原生 JS）
│
├── games/                      # 🎮 游戏
│   ├── tetris/                 #   俄罗斯方块
│   ├── Game demo/              #   “10秒赚多少钱”游戏
│   └── 10-second-money/        #   “10秒赚多少钱”另一版本（与 Game demo 疑似迭代关系）
│
├── demos/                      # 🧪 网页演示与小工具
│   ├── mamma-mia-pizza/        #   披萨店官网演示
│   ├── Pisa Shop 2/            #   披萨店演示（单文件版）
│   ├── PisaShop demo/          #   披萨店演示（含流程图与截图）
│   ├── YouHuiQuan Demo/        #   红包 × 团购优惠券页面演示
│   ├── vditor/                 #   Vditor Markdown 编辑器演示
│   ├── pomodoro.html           #   番茄钟
│   └── weather.html            #   天气页面
│
├── tools/                      # 🛠 工具
│   ├── I Ching/                #   蓍草易占（易经占卦工具）
│   └── bookmark-organizer/     #   书签整理工具（main.py + 前端 + Arc 书签导出）
│
├── data/                       # 📊 数据分析
│   └── 用户行为数据可视化分析/    #   CSV + 3D 散点图 HTML + 图表 PNG
│
├── diagrams/                   # 📐 图表文档
│   ├── 聚合支付流程_optimized.puml
│   └── 聚合支付流程_plantuml.drawio
│
├── comics/                     # 🎨 AI 生成漫画
│   └── comic/                  #   含 2 个科普漫画：AI 模型原理、数据库范式（SVG + 提示词）
│
├── skills/                     # 🤖 Agent 技能
│   └── guizang-ppt-skill/      #   杂志风网页 PPT 生成技能（SKILL.md，自带独立 .git 仓库）
│
├── miniprogram/                # 📱 微信小程序
│   └── miniprogram-1/          #   标准小程序骨架（未纳入 git 追踪）
│
├── learning/                   # 📚 学习资料（git 忽略）
│   ├── Python/                 #   《Python编程：从入门到实践》代码 + PDF 资料
│   └── 《AI工程》代码资源/        #   《AI工程》书籍配套资源
│
├── archive/                    # 🗄 个人数据归档（git 忽略）
│   └── applist_20260805_141218.txt  # iOS 应用清单导出
│
└── lingxi-claw/                # ⚙️ 灵犀 Claw 工具会话输出目录（原位保留、git 忽略）
```

## ⚠️ 重要事项

### 1. Git 仓库状态
- 本次整理通过 `git mv` 完成，全部 **160 个文件重命名已暂存**，git 历史完整保留。
- `my-first-repo/`（测试文件）已按你的选择从 git 中移除。
- **尚未提交**。确认无误后执行：
  ```bash
  cd /Users/liubocheng/Documents/Code
  git commit -m "chore: 按类别重组项目目录结构"
  ```

### 2. GitHub Pages 路径变化
移动后已发布页面路径随之改变，若 Pages 已启用需注意：

| 旧路径 | 新路径 |
|---|---|
| `/pulse/…` | `/apps/pulse/…` ⚠️ |
| `/tetris/` | `/games/tetris/` |
| `/pomodoro.html` | `/demos/pomodoro.html` |
| `/weather.html` | `/demos/weather.html` |
| `/Si Zhe/` | `/apps/Si Zhe/` |
| `/I Ching/` | `/tools/I Ching/` |
| `/mamma-mia-pizza/` 等演示 | `/demos/…` |

> ⚠️ **pulse 特别注意**：其静态导出内部使用绝对路径 `/pulse/_next/...`（25 个文件），
> 移到 `apps/pulse/` 后直接部署会 404。需要重新构建（assetPrefix 改为 `/apps/pulse`）
> 或批量替换内部引用路径。

### 3. 未纳入 git 的内容（请决定是否 `git add`）
- `miniprogram/miniprogram-1/` — 微信小程序项目（此前未追踪）
- `tools/bookmark-organizer/` — 书签整理工具（此前未追踪）
- `learning/`、`archive/`、`lingxi-claw/` — 已在 .gitignore 中忽略，不入库

### 4. 其他
- `skills/guizang-ppt-skill/` 内部自带一个独立 `.git` 仓库（嵌套仓库），父仓库按普通文件追踪它，属既有结构。
- `apps/opencode-dashboard/` 是完整 Vite 工程，`node_modules` 已在本地保留，可直接开发。
- 建议后续把含空格/中文的目录名统一为 kebab-case（如 `Si Zhe` → `si-zhe`），更利于脚本与 CI 处理。

## 常见开发入口

```bash
# 仪表盘开发（React/Vite）
cd apps/opencode-dashboard && npm run dev

# 查看整理结果
git status

# 提交本次整理
git commit -m "chore: 按类别重组项目目录结构"
```
