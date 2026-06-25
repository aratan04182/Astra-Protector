const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// 転送先
const TARGET = "https://example.com";

app.use(
  "/",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      "^/": "/",
    },
  })
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
