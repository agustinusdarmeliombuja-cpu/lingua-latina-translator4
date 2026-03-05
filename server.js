const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Agar file index.html bisa langsung dibuka via server
app.use(express.static(__dirname));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/translate', async (req, res) => {
    try {
        const { text } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            console.error("ERROR: API Key tidak ditemukan di file .env");
            return res.status(500).json({ error: "Konfigurasi server salah (API Key hilang)." });
        }

        console.log(`Menerima permintaan terjemahan: "${text}"`);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Menggunakan model mini agar lebih cepat dan murah
            messages: [
                {
                    role: "system",
                    content: `Anda adalah pakar bahasa Latin. 
                    Tugas: Terjemahkan dan analisis teks Latin ke Bahasa Indonesia.
                    Output WAJIB dalam format JSON murni tanpa markdown, tanpa tanda petik backtick.
                    Format JSON:
                    {
                        "terjemahan": "string",
                        "parsing_tabel": [{"kata": "string", "jenis": "string", "analisis": "string", "arti": "string"}],
                        "sintaksis": "string",
                        "konteks": "string"
                    }`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.3,
        });

        // Membersihkan output AI jika ada tanda backtick ```json
        let rawContent = response.choices[0].message.content;
        rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

        const dataFinal = JSON.parse(rawContent);
        console.log("Berhasil memproses terjemahan.");
        res.json(dataFinal);

    } catch (error) {
        console.error("DETIL ERROR:", error.message);
        res.status(500).json({ 
            error: "Gagal memproses data.",
            details: error.message 
        });
    }
});

// Menjalankan index.html saat akses ke "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`✅ SERVER AKTIF DI: http://localhost:${PORT}`);
    console.log(`👉 Silakan buka link di atas di browser!`);
    console.log(`=========================================`);
});
