async function test() {
  try {
    const res = await fetch('http://localhost:5001/api/v1/auth/register', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "TestUser",
        email: "test12349@example.com",
        password: "password123",
        city: "TestCity",
        contact: "9876543210"
      })
    });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("Network error:", error.message);
  }
}
test();
