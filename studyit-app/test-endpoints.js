// Using built-in fetch in Node.js

async function testEndpoints() {
    const baseUrl = 'http://localhost:3000/api';
    const userId = 'test-user-id'; // Mock ID

    console.log('Testing Tutor API...');
    try {
        const res = await fetch(`${baseUrl}/tutor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'Hello, help me study math.', userId })
        });
        const data = await res.json();
        console.log('Tutor Response:', data.reply ? 'SUCCESS' : 'FAILED', data.reply || data.error);
    } catch (e) {
        console.error('Tutor API Failed:', e.message);
    }

    await new Promise(r => setTimeout(r, 2000)); // Wait 2s

    console.log('\nTesting Flashcards API...');
    try {
        const res = await fetch(`${baseUrl}/flashcards/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, topic: 'Calculus', count: 3 })
        });
        const data = await res.json();
        console.log('Flashcards Response:', data.cards ? 'SUCCESS' : 'FAILED', data.cards ? `${data.cards.length} cards` : data.error);
    } catch (e) {
        console.error('Flashcards API Failed:', e.message);
    }

    await new Promise(r => setTimeout(r, 2000)); // Wait 2s

    console.log('\nTesting Quiz API...');
    try {
        const res = await fetch(`${baseUrl}/quiz/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: 'History', count: 3 })
        });
        const data = await res.json();
        console.log('Quiz Response:', data.questions ? 'SUCCESS' : 'FAILED', data.questions ? `${data.questions.length} questions` : data.error);
    } catch (e) {
        console.error('Quiz API Failed:', e.message);
    }
}

testEndpoints();
