const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/proxy", async (req, res) => {
  try {
    const targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).send("URL is required");
    }

    const parsed = new URL(targetUrl);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return res.status(400).send("Only HTTP/HTTPS allowed");
    }

    const blockedHosts = [
      "localhost",
      "127.0.0.1",
      "::1"
    ];

    if (blockedHosts.includes(parsed.hostname)) {
      return res.status(403).send("Blocked host");
    }

    const response = await axios.get(targetUrl, {
      timeout: 5000,
      maxRedirects: 3,
      responseType: "text",
      headers: {
        "User-Agent": "SafeWebProxy/1.0"
      }
    });

    res.setHeader(
      "Content-Type",
      "text/html; charset=utf-8"
    );

    res.send(response.data);

  } catch (error) {
    res.status(500).send("Failed to fetch page");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
