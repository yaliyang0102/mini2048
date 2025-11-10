# 2048 NFT Game · Farcaster Mini App

在 **Warpcast** 中一键打开的 2048 小游戏。分数 ≥ **2048** 即可在 **Base** 链上以 **0.001 ETH** 铸造纪念 NFT。  
技术栈：**Next.js 14 (App Router) · wagmi v2 · thirdweb · Farcaster Mini App SDK**。

> Live: _（部署后填上你的域名，如 `https://mini2048.vercel.app`）_  
> Chain: Base Mainnet (8453)

---

## ✨ 特性

- 🎮 原生 2048 游戏（键盘与触控）
- 🟣 Farcaster Mini App 集成（支持内置钱包）
- 🔗 Base 主网 DropERC721 铸造（0.001 ETH）
- 📱 深色 UI、移动端友好
- ⚙️ 纯前端 + 第三方 Dashboard（thirdweb）最小可用实现

---

## 📁 目录结构

src/
├─ app/
│ ├─ layout.tsx
│ ├─ page.tsx
│ ├─ game-client.tsx
│ ├─ providers.tsx
│ ├─ thirdweb.ts
│ └─ globals.css
├─ components/
│ ├─ GameBoard.tsx
│ ├─ MintButton.tsx
│ └─ ScoreDisplay.tsx
└─ wagmi.ts
public/
├─ .well-known/
│ └─ farcaster.json
├─ icon.png
├─ splash.png
└─ og.png


---

## 🔧 本地开发

**环境要求**：Node 18+ / 20+、npm / pnpm / yarn（任选其一）

1. 安装依赖
   ```bash
   npm i
   # 或 pnpm i / yarn

2. 新建本地环境变量 .env.local（见下文「环境变量」）
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDropErc721Address
NEXT_PUBLIC_BASE_URL=http://localhost:3000

3. 启动开发
   npm run dev
# 浏览器打开 http://localhost:3000

4.预构建 & 本地生产模式
npm run build
npm run start
注意：.env* 不要提交到 Git，仓库里应有 Node 的 .gitignore 忽略它们。

🌐 环境变量
变量名	必填	示例	说明
NEXT_PUBLIC_THIRDWEB_CLIENT_ID	✅	xxx_xxxxxxxxx	thirdweb Dashboard 创建的 Client ID
NEXT_PUBLIC_CONTRACT_ADDRESS	✅	0xabc...def	在 Base 链部署的 NFT Drop (ERC721) 合约地址
NEXT_PUBLIC_BASE_URL	✅	https://mini2048.vercel.app	线上完整域名（用于元数据与图片绝对 URL）


本地开发可先写 http://localhost:3000，部署成功拿到域名后，在 Vercel 环境变量中改为线上地址并 Redeploy。

🚀 部署到 Vercel

将仓库连接到 Vercel：Add New → Project → Import Git Repository

Framework 自动识别 Next.js，构建命令用默认值即可：npm run build

在 Project → Settings → Environment Variables 新增：

NEXT_PUBLIC_THIRDWEB_CLIENT_ID

NEXT_PUBLIC_CONTRACT_ADDRESS

NEXT_PUBLIC_BASE_URL（部署完成后改为你的线上域名，再 Redeploy）

点击 Deploy，等待构建完成

🟣 Farcaster Mini App 清单

清单文件路径：public/.well-known/farcaster.json

部署后需保证线上可访问：
https://<你的域名>/.well-known/farcaster.json

推荐用 Warpcast Developer 工具生成/校验正式清单（将占位字段替换为你的实际信息）

页面 <head> 元数据中已包含 fc:miniapp / fc:frame 信息（见 src/app/layout.tsx）。
图片请确保存在且可访问：/og.png、/splash.png、/icon.png

🧱 合约（thirdweb Dashboard）

打开 thirdweb Dashboard → Deploy new contract

选择 NFT Drop (ERC721)，链选 Base (8453)

部署完成后，进入 Claim Conditions：

Price: 0.001 ETH

Max per wallet: 自定（示例 5）

Total supply: 自定（示例 10000）

复制合约地址填入 NEXT_PUBLIC_CONTRACT_ADDRESS

前期也可用 Base Sepolia 测试，流程跑顺畅后切主网。


🧩 关键实现说明

Farcaster 内置钱包：
通过 @farcaster/miniapp-wagmi-connector 注入为 wagmi connector；
在 game-client.tsx 中自动查找名称含 farcaster 的 connector 进行连接。

铸造逻辑：
使用 wagmi 的 useWriteContract 直接调用 DropERC721 的 claim 方法，
携带 value = 0.001 ETH 完成支付。

游戏门槛：
GameBoard 内部判断游戏结束，若分数 ≥ 2048，则在结果区渲染 MintButton。

🩺 常见问题排查（FAQ）

Q: 页面显示 Application error: a client-side exception has occurred？
A: 确保 src/app/page.tsx 顶部有 "use client"；layout.tsx 中导出

export const dynamic = "force-dynamic";
export const revalidate = 0;


避免 SSR 钱包 Hook 报错。

Q: 按钮灰色/无法铸造？

分数未达 2048；或钱包未连接；或环境变量 NEXT_PUBLIC_CONTRACT_ADDRESS 未配置；

thirdweb Dashboard 未启用/发布 Claim Conditions。

Q: Mini App / Frame 加载不了？

public/.well-known/farcaster.json 是否能被线上访问；

NEXT_PUBLIC_BASE_URL 是否为正确的 https 域名；

layout.tsx 里 miniapp/frame 的 imageUrl / splashImageUrl / url 是否对应线上地址。

Q: Farcaster 内置钱包没出现

确认已安装 @farcaster/miniapp-sdk 和 @farcaster/miniapp-wagmi-connector；

wagmi.ts 中是否包含 miniAppConnector()；

在非 Warpcast 环境里测试时，内置钱包不可用（可用 injected 钱包）。


🗺️ Roadmap（可选）

排行榜（Supabase / Vercel Postgres）

动画与音效（Framer Motion / WebAudio）

铸造后元数据个性化（服务端渲染 NFT 图片 & 属性）

多难度/多模式玩法

🤝 贡献

欢迎 PR / Issue！提交前请运行：

npm run build
npm run start

📜 许可证

MIT

🙌 鸣谢

Next.js

wagmi

thirdweb

Farcaster Mini App SDK




