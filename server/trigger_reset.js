async function trigger() {
    try {
        const res = await fetch('http://localhost:5001/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contact: '9860017971' })
        });
        const data = await res.json();
        console.log('Response:', data);
    } catch (err) {
        console.error('Trigger Error:', err.message);
    }
}
trigger();
