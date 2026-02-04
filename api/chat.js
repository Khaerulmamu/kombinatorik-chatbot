export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // 1. Ambil "message" sesuai format dari chatbot.js
  const { message } = req.body; 
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Anda adalah guru matematika. Jawablah pertanyaan ini seputar kombinatorika: " + message }] }]
      })
    });

    const data = await response.json();
    
    // 2. Ambil teks jawaban saja
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya sedang tidak bisa berpikir.";

    // 3. Kirim balik dengan format { "response": "..." } sesuai keinginan chatbot.js
    res.status(200).json({ response: aiText });

  } catch (error) {
    res.status(500).json({ response: "Terjadi kesalahan pada server AI." });
  }
}
