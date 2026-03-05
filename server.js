const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Mengizinkan HTML mengakses server ini

// Konfigurasi OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ambil key dari file .env
});

// Endpoint Utama untuk Terjemahan
app.post('/api/translate', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Teks tidak boleh kosong" });
        }

        // PROMPT UNTUK AI
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Atau gpt-4o-mini untuk biaya lebih murah
            messages: [
                {
                    role: "system",
                    content: `Anda adalah Magister Linguae Latinae. 
                    Tugas Anda adalah menerjemahkan teks Latin ke Bahasa Indonesia untuk guru dan siswa.
                    
                    WAJIB MEMBERIKAN OUTPUT DALAM FORMAT JSON BERIKUT:
                    {
                        "terjemahan": "Hasil terjemahan yang puitis namun akurat",
                        "parsing_tabel": [
                            {
                                "kata": "Kata Latin",
                                "jenis": "Noun/Verb/Adj/Prep",
                                "analisis": "Detail (Kasus, Gender, Number atau Tense, Mood, Person)",
                                "arti": "Arti kata tunggal"
                            }
                        ],
                        "sintaksis": "Penjelasan struktur kalimat (seperti Ablative Absolute, dll)",
                        "konteks": "Info sejarah atau kutipan tokoh jika ada"
                    }`
                },
                {
                    role: "user",
                    content: `Terjemahkan dan analisislah teks ini: "${text}"`
                }
            ],
            response_format: { type: "json_object" }, // Memastikan output selalu JSON
            temperature: 0.3,
        });

        const hasilAI = JSON.parse(response.choices[0].message.content);
        res.json(hasilAI);

    } catch (error) {
        console.error("Error Server:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server AI." });
    }
});

// Jalankan Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`Server Magister Linguae berjalan!`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`-----------------------------------------`);
});
