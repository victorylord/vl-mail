// test-api.js
const testData = {
    full_name: "Victory Lord",
    email: `test${Date.now()}@vlmail.com`, // Unique email every time
    phone_number: `+23470${Math.floor(10000000 + Math.random() * 90000000)}`,
    password: "secure123"
};

console.log('📤 Sending registration request...');
console.log('📦 Payload:', testData);

fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
})
.then(res => res.json())
.then(data => {
    console.log('✅ Success:', data);
})
.catch(err => {
    console.error('❌ Error:', err.message);
});