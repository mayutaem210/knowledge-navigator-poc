# 部署操作指南

## 路线A：只用GitHub上传，不安装Node.js
1. 在GitHub新建空仓库，例如 `knowledge-navigator-poc`。
2. 下载并解压本压缩包。
3. 在仓库页面选择 **Add file → Upload files**。
4. 将解压后的所有文件和文件夹上传到仓库根目录。
5. 提交更改。

## 发布到Cloudflare Pages
1. 登录Cloudflare。
2. 进入 Workers & Pages，创建 Pages 项目。
3. 连接GitHub并选择仓库。
4. 选择静态HTML或不使用框架。
5. Build command留空。
6. 输出目录先填写 `/`；如果界面要求相对目录，填写 `.`。
7. 部署后使用系统分配的 `pages.dev` 地址访问。

> Cloudflare控制台字段可能随版本调整。

## 更新内容
修改Markdown文件后重新上传，或直接在GitHub网页中编辑。保存到连接的分支后，由Cloudflare Pages按项目配置重新部署。

## 安全提醒
该POC默认公网可访问。不要上传内部敏感资料、客户数据、员工个人信息、价格、合同、账号或系统配置。
