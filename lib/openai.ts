import { OpenAI } from "openai";


// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,  // Store your API key in an .env file
});

export default openai;