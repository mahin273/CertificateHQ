import axios from 'axios';

async function testWebhook() {
    try {
        const response = await axios.post('http://localhost:3000/webhook', {
            name: 'John Doe',
            email: 'test@example.com' // Ensure this is a safe email or mocked
        });
        console.log('Response:', response.data);
    } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testWebhook();
