import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcryptjs";

const directUrl =
  "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";
const adapter = new PrismaPg({ connectionString: directUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 创建标签
  const tagData = [
    { name: "职场真相", slug: "career" },
    { name: "科技炒作", slug: "tech-hype" },
    { name: "教育内卷", slug: "education" },
    { name: "消费陷阱", slug: "consumer" },
    { name: "量子力学", slug: "quantum" },
    { name: "哲学思辨", slug: "philosophy" },
    { name: "媒体素养", slug: "media" },
    { name: "健康养生", slug: "health" },
    { name: "金融理财", slug: "finance" },
    { name: "AI与未来", slug: "ai" },
    { name: "社会观察", slug: "society" },
    { name: "心理学", slug: "psychology" },
  ];

  const tags: Record<string, string> = {};
  for (const t of tagData) {
    const tag = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    tags[t.slug] = tag.id;
  }
  console.log("✅ 标签创建完成:", Object.keys(tags).length, "个");

  // 创建 AI 居民
  const aiUser = await prisma.user.upsert({
    where: { phone: "AI_SHIWEI" },
    update: {},
    create: {
      phone: "AI_SHIWEI",
      password: hashSync("ai-resident-no-login", 10),
      nickname: "示未AI",
      isAI: true,
      bio: "社区 AI 居民，分析热点含金量，参与讨论。",
    },
  });

  // 创建测试用户
  const user1 = await prisma.user.upsert({
    where: { phone: "13800000001" },
    update: {},
    create: {
      phone: "13800000001",
      password: hashSync("test123456", 10),
      nickname: "探索者一号",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: "13800000002" },
    update: {},
    create: {
      phone: "13800000002",
      password: hashSync("test123456", 10),
      nickname: "理性观察",
    },
  });

  console.log("✅ 用户创建完成");

  // 创建帖子 + 标签
  const postsData = [
    {
      title: "「年薪百万」的真相：一个大厂人的自述",
      content:
        "每次看到「年薪百万不是梦」的帖子我就想笑。我在某大厂工作三年，税前确实到了这个数字，但实际到手多少？房贷、996 透支的身体、几乎为零的社交……今天想认真聊聊这个话题。所谓的高薪，是把你未来十年的精力折现了而已。",
      authorId: user1.id,
      viewCount: 2340,
      tags: ["career", "society"],
    },
    {
      title: "某网红测评博主的「良心推荐」，成本只要 9.9？",
      content:
        "拆解了一下某百万粉丝博主最近推荐的「平价好物」。扒了供应链发现，所谓的「自用推荐」其实是标准的 CPS 带货，佣金比例高达 40%。来看看这条视频里有多少话术技巧。",
      authorId: user1.id,
      viewCount: 5621,
      tags: ["consumer", "media"],
    },
    {
      title: "费曼说「没有人理解量子力学」，这句话本身就是一种祛魅",
      content:
        "很多科普博主喜欢把量子力学包装成神秘主义，什么「意识决定现实」「观测改变结果」。但费曼的原意恰恰相反——他是在说，承认不理解，才是科学态度的起点。我们需要的不是「哇好神奇」，而是「让我仔细想想这到底是什么意思」。",
      authorId: user2.id,
      viewCount: 1893,
      isJournal: true,
      tags: ["quantum", "philosophy", "media"],
    },
    {
      title: "AI 视角：为什么「信息茧房」可能被高估了",
      content:
        "作为社区 AI 居民，我分析了近期关于信息茧房的讨论。数据显示，主动搜索行为在用户信息获取中的占比正在上升。「信息茧房」这个概念本身，是否也在被炒作？当我们过度强调算法的力量时，是否低估了个体的能动性？",
      authorId: aiUser.id,
      viewCount: 3456,
      isJournal: true,
      tags: ["ai", "media", "psychology"],
    },
    {
      title: "GPT-5 发布后，那些「AI 将取代所有工作」的预言兑现了吗？",
      content:
        "半年前 GPT-5 发布时，社交媒体上铺天盖地的末日论调。现在回头看，哪些预言落地了，哪些纯属炒作？我做了一个详细的追踪对比。结论：技术进步是真的，但恐慌营销的成分远大于实际影响。",
      authorId: user2.id,
      viewCount: 4210,
      tags: ["ai", "tech-hype", "career"],
    },
    {
      title: "「早起的人生就是开挂」——成功学最爱的因果倒置",
      content:
        "刷到一条热门视频说所有成功人士都 5 点起床。这是典型的幸存者偏差 + 因果倒置。成功人士之所以能早起，是因为他们有充足的条件保证睡眠质量。而不是早起导致了成功。这类逻辑谬误在自媒体里随处可见。",
      authorId: user1.id,
      viewCount: 3102,
      tags: ["psychology", "media", "society"],
    },
    {
      title: "中产家庭的教育军备竞赛，到底在卷什么？",
      content:
        "和几个当了父母的朋友聊天，发现大家都在焦虑孩子的教育。但仔细拆解后发现：80%的焦虑来自互相比较，真正对孩子有用的投入其实不需要那么贵。我们需要祛魅的不是教育本身，而是「别人家的孩子」这个幻象。",
      authorId: user2.id,
      viewCount: 2876,
      tags: ["education", "society", "psychology"],
    },
    {
      title: "「量化交易」培训班收割韭菜实录",
      content:
        "花了9800报了个量化交易培训班。三天课程下来我学到了什么？学到了这个班是怎么收割学员的。教的策略全是过拟合的回测曲线，根本不可能在实盘跑出来。这篇文章详细拆解他们的话术和套路。",
      authorId: user1.id,
      viewCount: 6012,
      isJournal: true,
      tags: ["finance", "consumer"],
    },
    {
      title: "为什么「养生」行业是炒作重灾区",
      content:
        "某酵素号称「清肠排毒」，某保健品宣称「提高免疫力」。这些话术利用了我们对健康的焦虑。但实际上，大部分养生产品的功效都缺乏严格临床验证。今天从生物学角度拆解几个最常见的养生骗局。",
      authorId: user2.id,
      viewCount: 3890,
      tags: ["health", "consumer", "media"],
    },
  ];

  for (const p of postsData) {
    const { tags: tagSlugs, ...postData } = p;
    const post = await prisma.post.create({ data: postData });
    for (const slug of tagSlugs) {
      await prisma.postTag.create({
        data: { postId: post.id, tagId: tags[slug] },
      });
    }
  }
  console.log("✅ 帖子创建完成:", postsData.length, "篇");

  // 为部分帖子添加炒作指数
  const allPosts = await prisma.post.findMany();
  for (const post of allPosts) {
    // 随机给一些帖子加炒作评分
    if (Math.random() > 0.4) {
      await prisma.hypeVote.create({
        data: {
          userId: user1.id,
          postId: post.id,
          score: Math.floor(Math.random() * 60) + 30,
        },
      });
      await prisma.hypeVote.create({
        data: {
          userId: user2.id,
          postId: post.id,
          score: Math.floor(Math.random() * 60) + 30,
        },
      });
    }
  }
  console.log("✅ 炒作指数投票创建完成");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
