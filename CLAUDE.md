# CLAUDE.md — 示未 SHIWEI 项目规范

> 这是「示未」论坛的完整项目规范。Claude Code 请严格按照此文档开发。

---

## 产品概述

**产品名**：示未 SHIWEI
**一句话定位**：一个认真的、有品位的认知祛魅社区，人与 AI 共同探索真相。
**品牌调性**：冷静、理性、有深度、高级简约。不是小众圈子玩梗，而是让各行各业的人都觉得有质感、值得花时间的平台。
**Slogan**：世界的奥秘就是祛魅。

### 核心价值

1. **信息祛魅**：对抗短视频博主的「炸了」「颠覆」等炒作话术，还原真相
2. **认知共鸣**：给那些「想明白了但身边没人能聊」的人一个找到同频灵魂的地方
3. **人机共创**：AI 作为社区平等参与者（Phase 2 实现），与人共同讨论

### 用户画像

- 大学生、年轻职场人、独立思考者
- 对信息质量有要求，厌倦被博主贩卖焦虑
- 各年龄、各阶层都欢迎，普适性平台

---

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 14 (App Router) | 全栈框架，前后端一体 |
| TypeScript | 类型安全 |
| PostgreSQL | 数据库 |
| Prisma | ORM |
| Tailwind CSS | 样式 |
| bcryptjs | 密码加密 |
| jsonwebtoken | 用户认证 |
| Vercel | 部署 |

---

## 设计规范

### 视觉风格

参考知乎的简约大气 + SHIT期刊的克制排版。整体白色背景，大量留白，不要花哨装饰。

- **主色**：#1a1a1a（近黑色，用于文字和重点元素）
- **强调色**：#1a6dff（蓝色，用于链接、排名数字等少量点缀）
- **AI 标识色**：#6e5fba（紫色，仅用于 AI 居民标签）
- **炒作高分色**：#cf4040（红色）
- **炒作中分色**：#c8873a（橙色）
- **背景**：#ffffff（主背景）、#f5f5f5（标签/输入框背景）、#fafafa（卡片背景）
- **分割线**：#eee 或 #f2f2f0
- **次要文字**：#999、#aaa、#bbb（层级递减）

### 字体

```css
font-family: -apple-system, 'PingFang SC', 'Noto Sans SC', 'Helvetica Neue', sans-serif;
```

示未刊标题使用衬线体：

```css
font-family: 'Noto Serif SC', serif;
```

Google Fonts 引入：

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

### 布局

- 最大宽度：960px，居中
- 内容区 + 右侧边栏（侧栏宽 240px，间距 40px）
- 导航栏高度：52px，sticky 固定顶部
- 帖子间用 1px #f5f5f3 分割线

### 导航栏

从左到右：
1. Logo「示未」（Noto Serif SC, 20px, font-weight 900, letter-spacing 4px）
2. 导航项：广场 | 示未刊（当前页加粗 + 底部 2px 黑色下划线）
3. 搜索框（圆角 18px，#f5f5f5 背景）
4. 「发帖」按钮（#1a1a1a 背景，白色文字，圆角 18px）

### 帖子卡片样式

每个帖子包含：
- 第一行：板块名 · 作者名 [AI标签] · 时间（均为 12px，#aaa 色）
- 第二行：标题（16px，font-weight 600，hover 变蓝 #1a6dff）
- 第三行：内容预览（14px，#888，最多两行截断）
- 第四行：赞同数 · 评论数 [炒作指数标签]（12px，#aaa）
- AI 帖子在作者名后显示紫色「AI」标签

### 炒作指数标签

- 分数 > 70：红色背景 #fef0f0，红色文字 #cf4040
- 分数 40-70：橙色背景 #fef8f0，橙色文字 #c8873a
- 分数 < 40：绿色背景 #f0fef4，绿色文字 #3a8a5c
- 格式：圆角药丸形，显示「炒作 78」

---

## 页面结构

### 1. 广场（首页）`/`

这是用户进来的默认页面，论坛风格。

**左侧主区域**：
- 板块筛选标签（药丸形，选中为黑底白字，未选为 #f5f5f5 底灰字）
- 排序切换：热门 | 最新（下划线指示当前项）
- 帖子列表

**右侧边栏**：
- 「正在讨论」热榜（前3名蓝色序号，后面灰色）
- 示未 AI 卡片（简介社区 AI 居民）
- 「示未刊」入口卡片（点击跳转示未刊页面）
- 底部版权信息

### 2. 示未刊 `/journal`

期刊风格页面，收录社区精选深度长文。

**顶部**：
- 期号标识：示未刊 / SHIWEI JOURNAL · VOL.1 · 2026（居中，小号字，大间距）
- 大标题：世界的奥秘就是祛魅（Noto Serif SC，28px，font-weight 900）
- 副标题说明（15px，#888）

**正文区**：
- 最大宽度 640px 居中
- 文章列表：日期 + 标题（衬线体）+ 作者 + 阅读量
- 每篇之间用 1px #eee 分割
- 底部「投稿至示未刊」卡片

### 3. 帖子详情 `/post/[id]`

- 顶部：作者信息 + 时间 + 板块 + AI标签
- 标题（22px，衬线体）
- 正文内容
- 炒作指数投票区（如果是炒作鉴定板块）：滑动条 0-100，显示当前均分和投票人数
- 操作栏：赞同 | 评论 | 收藏
- 评论区：嵌套回复，AI 评论有紫色标识

### 4. 登录 `/auth/login`

- 简洁表单：手机号 + 密码 + 登录按钮
- 底部：没有账号？去注册

### 5. 注册 `/auth/register`

- 表单：手机号 + 昵称 + 密码 + 确认密码 + 注册按钮
- 底部：已有账号？去登录

---

## 数据库模型（Prisma Schema）

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  phone       String   @unique
  password    String
  nickname    String
  avatar      String?
  bio         String?
  isAI        Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts       Post[]
  comments    Comment[]
  votes       Vote[]
  hypeVotes   HypeVote[]
}

model Board {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())

  posts       Post[]
}

model Post {
  id             String   @id @default(cuid())
  title          String
  content        String
  images         String[]
  isAnonymous    Boolean  @default(false)
  isPinned       Boolean  @default(false)
  isJournal      Boolean  @default(false)
  journalContent String?
  viewCount      Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
  board       Board    @relation(fields: [boardId], references: [id])
  boardId     String

  comments    Comment[]
  votes       Vote[]
  hypeVotes   HypeVote[]

  @@index([boardId, createdAt])
  @@index([createdAt])
}

model Comment {
  id          String   @id @default(cuid())
  content     String
  isAnonymous Boolean  @default(false)
  createdAt   DateTime @default(now())

  author      User     @relation(fields: [authorId], references: [id])
  authorId    String
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId      String

  parent      Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  parentId    String?
  replies     Comment[] @relation("CommentReplies")

  @@index([postId, createdAt])
}

model Vote {
  id          String   @id @default(cuid())
  value       Int
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  userId      String
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId      String

  @@unique([userId, postId])
}

model HypeVote {
  id          String   @id @default(cuid())
  score       Int
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  userId      String
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId      String

  @@unique([userId, postId])
}
```

---

## 种子数据

项目初始化后需要创建以下数据：

**四个板块**：
1. 生活祛魅 (slug: life) — 打破人生幻觉，还原真实
2. 炒作鉴定 (slug: hype) — 拆解夸大宣传，看清真相
3. 深度探索 (slug: deep) — 哲学、宇宙与未知
4. 自由讨论 (slug: free) — 畅所欲言

**一个 AI 居民账号**：
- nickname: 示未AI
- isAI: true
- bio: 社区 AI 居民，分析热点含金量，参与讨论。

---

## API 设计

### 认证

- `POST /api/auth/register` — 手机号注册（手机号、昵称、密码）
- `POST /api/auth/login` — 登录（手机号、密码），返回 JWT
- 认证方式：JWT 存在 httpOnly cookie 中

### 帖子

- `GET /api/posts` — 获取帖子列表（支持 boardSlug、sort、page 参数）
- `GET /api/posts/[id]` — 获取帖子详情
- `POST /api/posts` — 发帖（需登录）
- `GET /api/posts/trending` — 热门帖子

### 评论

- `GET /api/comments?postId=xxx` — 获取某帖子的评论
- `POST /api/comments` — 发表评论（需登录）

### 投票

- `POST /api/votes` — 赞同/反对帖子（需登录）
- `POST /api/hype` — 提交炒作指数打分（需登录，0-100）
- `GET /api/hype?postId=xxx` — 获取某帖子的炒作指数均分和投票人数

### 示未刊

- `GET /api/journal` — 获取示未刊文章列表（isJournal = true 的帖子）

---

## 开发顺序

严格按以下顺序开发，每步完成后测试：

### Step 1：项目初始化
```bash
npx create-next-app@latest shiwei --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd shiwei
npm install prisma @prisma/client bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
npx prisma init
```

### Step 2：数据库
- 复制上面的 Prisma Schema 到 `prisma/schema.prisma`
- 配置 `.env` 中的 DATABASE_URL
- 执行 `npx prisma db push` 和 `npx prisma generate`
- 创建种子数据并执行 `npx prisma db seed`

### Step 3：全局布局和导航栏
- `src/lib/prisma.ts` — Prisma 客户端单例
- `src/components/Navbar.tsx` — 按设计规范实现
- `src/app/layout.tsx` — 引入字体、导航栏

### Step 4：广场首页
- `src/components/PostCard.tsx` — 帖子卡片
- `src/components/BoardFilter.tsx` — 板块筛选
- `src/components/HypeIndicator.tsx` — 炒作指数标签
- `src/components/TrendingSidebar.tsx` — 热榜侧栏
- `src/app/page.tsx` — 组装首页
- `src/app/api/posts/route.ts` — 帖子列表 API

### Step 5：用户认证
- `src/lib/auth.ts` — JWT 工具函数
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`

### Step 6：发帖和详情
- `src/components/ComposeModal.tsx` — 发帖弹窗
- `src/app/post/[id]/page.tsx` — 帖子详情页
- 支持匿名发帖选项

### Step 7：互动功能
- `src/components/CommentSection.tsx` — 评论区（嵌套回复）
- `src/app/api/comments/route.ts`
- `src/app/api/votes/route.ts` — 赞同/反对
- `src/components/HypeVoteSlider.tsx` — 炒作指数投票滑动条
- `src/app/api/hype/route.ts`

### Step 8：示未刊
- `src/app/journal/page.tsx` — 期刊风格精选页
- Markdown 渲染（安装 react-markdown）

### Step 9：完善和部署
- 热门排序算法（综合赞同数、评论数、时间衰减）
- 手机端响应式适配
- 部署到 Vercel

---

## 注意事项

1. **所有界面文字都是中文**，不要出现英文功能名
2. **风格保持克制**，宁可少一个功能也不要页面显得杂乱
3. **AI 居民**的帖子和评论要有明确的紫色「AI」标签，但视觉上不要过于突出
4. **匿名发帖**时显示「匿名用户」，不暴露真实身份
5. **炒作指数**只在「炒作鉴定」板块的帖子上显示
6. **示未刊**的内容是从普通帖子中筛选的，管理员将 isJournal 设为 true 即可
7. **不要过度设计**，MVP 阶段先跑通核心流程，后续迭代
