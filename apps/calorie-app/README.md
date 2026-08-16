# 🥗 食物熱量辨識 App

> GitHub Pages 靜態網站 — 上傳照片，AI 幫你估算熱量

## 功能

- 上傳照片，AI 自動辨識是否為食物
- 如果是食物：顯示食物名稱、熱量（大卡）、營養成分
- 如果不是食物：顯示「這個不是食物」
- **API Key 僅存在你本機瀏覽器**，不會傳到任何伺服器

## 使用方式

直接打開 `index.html` 即可使用，無需任何後端：

1. 到 [DeepInfra](https://deepinfra.com) 註冊並申請 API Key
2. 在頁面中輸入並儲存 API Key（存在瀏覽器 localStorage）
3. 上傳照片開始分析

> 底層使用 DeepSeek Janus-Pro-7B 多模態模型，透過 DeepInfra 託管服務调用。

## 部署到 GitHub Pages

```bash
git remote add origin https://github.com/你的帳號/你的-repo.git
git push -u origin main
```

在 GitHub repo 的 **Settings → Pages** 中，選 `main` 分支、根目錄 `/` 即可啟用。

## 技術棧

- 純 HTML + CSS + JavaScript
- DeepSeek Janus-Pro-7B（透過 DeepInfra API 調用，OpenAI 相容格式）
- 無須任何後端伺服器
