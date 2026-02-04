export default async function handler(req, res) {
  // ============================================
  // CORS HEADERS - WAJIB UNTUK ALLOW REQUESTS
  // ============================================
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Atau ganti dengan domain spesifik
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

  // Only allow POST method for actual requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Ambil "message" dari request body
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Anda adalah guru matematika yang ramah dan sabar. Jawablah pertanyaan ini seputar kombinatorika dengan jelas dan mudah dipahami. Gunakan contoh jika perlu: " + message
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    
    // 2. Ambil teks jawaban
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya sedang tidak bisa berpikir.";

    // 3. Kirim response dengan format yang benar
    res.status(200).json({ response: aiText });

  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).json({ 
      response: "Terjadi kesalahan pada server AI.",
      error: error.message 
    });
  }
}
