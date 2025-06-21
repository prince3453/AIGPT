const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/*
  Expected .env file variables:
    AZURE_OPENAI_ENDPOINT: Your Azure OpenAI endpoint URL. e.g. "https://your-resource-name.openai.azure.com/"
    AZURE_DEPLOYMENT_NAME: Your deployment name in Azure OpenAI.
    AZURE_API_VERSION: The API version to use (e.g., "2023-03-15-preview").
    AZURE_OPENAI_KEY: Your Azure OpenAI resource key.
*/
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const DEPLOYMENT_NAME = process.env.AZURE_DEPLOYMENT_NAME;
const API_VERSION = process.env.AZURE_API_VERSION;
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;

// Construct the Azure OpenAI chat completions endpoint
const apiUrl = `${AZURE_ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`;

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-4.1", // or your deployed model name
        messages: [{ role: "user", content: message }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": AZURE_OPENAI_KEY
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Error calling Azure OpenAI API:", err.response?.data || err.message);
    res.status(500).json({ reply: "Error retrieving response." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));