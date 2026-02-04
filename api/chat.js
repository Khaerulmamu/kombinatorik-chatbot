export default async function handler(req, res) {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Kunci aman di sini

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Anda adalah guru matematika. Jawablah pertanyaan ini hanya seputar kombinatorika: " + prompt }] }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
