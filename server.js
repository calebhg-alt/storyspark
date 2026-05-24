import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Serve built frontend
app.use(express.static(join(__dirname, "dist")));

// Proxy /api/chat → Anthropic, injecting the server-side API key
app.use(
  "/api/chat",
  createProxyMiddleware({
    target: "https://api.anthropic.com",
    changeOrigin: true,
    pathRewrite: { "^/api/chat": "/v1/messages" },
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.setHeader("x-api-key", process.env.ANTHROPIC_API_KEY || "");
        proxyReq.setHeader("anthropic-version", "2023-06-01");
      },
    },
  })
);

// Fallback to index.html for SPA routing
app.get("*", (_, res) => res.sendFile(join(__dirname, "dist", "index.html")));

app.listen(PORT, () => console.log(`StorySpark server running on port ${PORT}`));
