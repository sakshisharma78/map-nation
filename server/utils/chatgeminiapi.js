require("dotenv/config");
/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = "AIzaSyDZa6a-dQzn4Hgaz7z_1waNZo8XiiL2fJU";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
 history: [
  {
    role: "user",
    parts: [
      {text: "{\n  \"initialMessage\": \"How can I help you?\",\n  \"responseFromUser\": \"Context given by the user: \\\"______________________________\\\"\",\n  \"contextResolution\": \"solve the context \\\"______________________________________\\\"\"\n}"},
    ],
  },
  {
    role: "model",
    parts: [
      {text: "```json\n{\"initialMessage\": \"How can I help you?\", \"responseFromUser\": \"Context given by the user: \\\"______________________________\\\"\", \"contextResolution\": \"solve the context \\\"______________________________________\\\"\"}\n\n```"},
    ],
  },
],
});

  const result = await chatSession.sendMessage(prompt);
  let ans = result.response.text()
  console.log(ans);
  // let answer = result.response.text();
  return ans;
}
module.exports = run;