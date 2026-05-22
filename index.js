import OpenAI from "openai";
import { checkEnvironment } from "./utils.js";

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
  dangerouslyAllowBrowser: true,
});

checkEnvironment();

const response = await openai.chat.completions.create({
  model: process.env.AI_MODEL,
  messages: [
    {
      role: "user",
      content:
        "Suggest some gifts for someone who loves hiphop music. Respond in under 100 words in formal tone",
    },
  ],
});

console.log(response.choices[0].message.content);
