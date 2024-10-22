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

const apiKey = process.env.GEMINI_API_KEY;
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
          {text: "{\n  \"language_name\": {\n    \"Day 1\": {\n      \"Topic\": \"_____\",\n      \"Description\": \"___________________\"\n  , \"Resources\": \"(most viewed youtube link for the given topic)\"\n , \"tasks\":\"(give 2-3 tasks according to the topic)\" },\n    \"Day 2\": {\n      \"Topic\": \"_____\",\n      \"Description\": \"_________________\"\n    },\n    ...\n  }\n}\n\nthis is the format of giving the response in json format \n\nwhen user inputs the Programing language name and number of days or months(convert it into days)"},
        ],
      },
      // {
      //   role: "model",
      //   parts: [
      //     {text: "```json\n{\"language_name\": {\"Day 1\": {\"Topic\": \"Introduction to  [language_name]\", \"Description\": \"This session will cover the basics of [language_name], including its history, syntax, data types, variables, and basic operations.\"}, \"Day 2\": {\"Topic\": \"Control Flow and Data Structures\", \"Description\": \"Learn about conditional statements, loops, arrays, and other fundamental data structures in [language_name].\"}, \"Day 3\": {\"Topic\": \"Functions and Modules\", \"Description\": \"Explore how to define and use functions, and learn about the concept of modules and libraries in [language_name].\"}, \"Day 4\": {\"Topic\": \"Object-Oriented Programming (OOP)\", \"Description\": \"This session delves into the principles of OOP, including classes, objects, inheritance, and polymorphism in [language_name].\"}, \"Day 5\": {\"Topic\": \"File Handling and Input/Output\", \"Description\": \"Learn how to read and write data from files, and understand the basics of input and output operations in [language_name].\"}, \"Day 6\": {\"Topic\": \"Error Handling and Debugging\", \"Description\": \"This session covers best practices for handling errors and debugging code effectively in [language_name].\"}, \"Day 7\": {\"Topic\": \"Advanced Topics in [language_name]\", \"Description\": \"Explore advanced concepts like regular expressions, network programming, and other specialized features of [language_name].\"}}}\n\n```"},
      //   ],
      // },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  let ans = result.response.text()
  console.log(ans);
  // let answer = result.response.text();
  return ans;
}
module.exports = run;