# 《支付之门》静态站点

这是目标网页的本地静态副本。页面、样式、脚本和图片均包含在 `index.html` 中，不需要安装依赖。

## 访问控制

网页正文已使用 AES-256-GCM 加密，浏览器通过 PBKDF2-SHA-256 从访问密码派生解密密钥。密码不会写入网页或发送到服务器，输入错误密码时无法恢复正文。

此方案适用于 GitHub Pages 静态托管，但不提供用户账号、密码找回、单用户撤销或登录审计。

## 本地预览

```bash
cd /Users/liubocheng/Documents/Code/apps/payment-gate
python3 -m http.server 8080
```

然后访问 <http://localhost:8080>。
