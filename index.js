import OpenAI from "openai";
import {
  autoResizeTextarea,
  checkEnvironment,
  setLoading,
  showStream,
} from "./utils.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
checkEnvironment();

const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
  dangerouslyAllowBrowser: true,
});

const giftForm = document.getElementById("gift-form");
const userInput = document.getElementById("user-input");
const outputContent = document.getElementById("output-content");

function start() {
  userInput.addEventListener("input", () => autoResizeTextarea(userInput));
  giftForm.addEventListener("submit", handleGiftRequest);
}

const messages = [
  {
    role: "system",
    content: `You are the Gift Genie!
    Make your gift suggestions thoughtful and practical.
    Your response must be under 100 words. 
    Skip intros and conclusions. 
    Only output gift suggestions.`,
  },
];

async function handleGiftRequest(e) {
  e.preventDefault();

  const userPrompt = userInput.value.trim();
  if (!userPrompt) return;

  setLoading(true);

  messages.push({
    role: "user",
    content: userPrompt,
  });

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
      stream: true,
    });

    let giftSuggestions = "";

    showStream();

    for await (const chunk of stream) {
      giftSuggestions += chunk.choices[0].delta.content;

      const html = marked.parse(giftSuggestions);

      const safeHTML = DOMPurify.sanitize(html);

      outputContent.innerHTML = safeHTML;
    }
  } catch (e) {
    console.log(`Error ${e}`);
    outputContent.textContent = "Error, try again";
  } finally {
    setLoading(false);
  }
}

start();
