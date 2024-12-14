import { OpenAI } from "openai";
import dotenv from "dotenv";

console.log(process.env);
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,  // Store your API key in an .env file
  dangerouslyAllowBrowser: false
});

export default openai;