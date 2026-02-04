// api/chat.js (Simpan di Repo Vercel)
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: "Anda adalah guru matematika yang ramah. Jawablah pertanyaan ini hanya seputar kombinatorika, permutasi, dan aturan perkalian: " + prompt }] 
        }]
      })
    });

    const data = await response.json();
    
    // Kirim hasil kembali ke website utama
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Gagal menghubungi AI" });
  }
}
