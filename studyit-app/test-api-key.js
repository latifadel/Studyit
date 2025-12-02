require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('GEMINI_API_KEY not found in .env.local');
    process.exit(1);
}

console.log('Found API Key:', apiKey.substring(0, 5) + '...');

// List models to find a working one
async function testModels() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        console.log('Listing models to find a working one...');
        const models = await genAI.listModels();

        console.log(`Found ${models.length} models.`);

        // Filter models that support generateContent
        const contentModels = models
            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
            .map(m => m.name);

        console.log('Models supporting generateContent:', contentModels);

        // Test gemini-pro-latest
        const testModel = 'models/gemini-pro-latest';
        console.log(`Testing model: ${testModel}...`);

        const model = genAI.getGenerativeModel({ model: testModel });
        const result = await model.generateContent('Test received. I\'m here and ready to help. What can I do for you today?');
        const response = await result.response;
        const text = response.text();

        console.log(`SUCCESS with ${testModel}:`, text);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testModels();
