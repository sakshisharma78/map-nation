const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the client with your API key
const client = new GoogleGenerativeAI({
  apiKey: "AIzaSyCBWfK9726f4fBwwfHwMQK1NS8xlD8iheU", // Ensure your API key is stored in an environment variable
});

// Generate Roadmap using AI
exports.generateRoadmap = async (inputData) => {
  try {
    const response = await client.text.generate({
      prompt: inputData.prompt, // Assuming inputData contains a 'prompt' field
      model: 'text-davinci-003', // Replace with your model choice
      maxTokens: 1500, // Set according to your needs
    });
    
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate roadmap');
  }
};

// Generate BibTeX File using AI
exports.generateBibTeX = async (roadmapData) => {
  try {
    const response = await client.text.generate({
      prompt: roadmapData.prompt, // Assuming roadmapData contains a 'prompt' field
      model: 'text-davinci-003',
      maxTokens: 1000,
    });
    
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error generating BibTeX file:', error);
    throw new Error('Failed to generate BibTeX file');
  }
};

// Generate Quiz using AI


const aiClient = new GoogleGenerativeAI({ key: 'AIzaSyCBWfK9726f4fBwwfHwMQK1NS8xlD8iheU' });

async function generateQuizQuestions(topics) {
  try {
    const response = await aiClient.generate({
      prompt: `Create a 5-question quiz on the following topics: ${topics.join(', ')}`,
    });

    return response.data.questions.map(question => ({
      questionText: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer,
    }));
  } catch (error) {
    console.error('AI Quiz Generation Error:', error);
    throw new Error('Failed to generate quiz questions');
  }
}

module.exports = { generateQuizQuestions };

