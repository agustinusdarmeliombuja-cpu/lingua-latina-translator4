// 1. Load Environment Variables (Harus di baris paling atas!)
require('dotenv').config();

const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const path = require('path');

const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Melayani file index.html secara otomatis

// 3. Validasi API Key (Mencegah error sebelum server jalan)
if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY tidak ditemukan di file .env!");
    console.error("Pastikan Anda sudah membuat file .env dan mengisi API Key.");
    process.exit(1); // Hentikan server jika kunci tidak ada
}

// 4. Inisialisasi OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 5. Endpoint Terjemahan & Analisis
app.post('/api/translate', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Teks Latin kosong!" });
        }

        console.log(`--- Memproses Teks: "${text}" ---`);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Model cepat dan akurat untuk JSON
            messages: [
                {
                    role: "system",
                    content: `Anda adalah Magister Linguae Latinae (Pakar Bahasa Latin). 
                    Tugas: Terjemahkan teks ke Bahasa Indonesia dan berikan analisis gramatikal lengkap.
                    
                    OUTPUT WAJIB DALAM FORMAT JSON MURNI:
                    {
                        "terjemahan": "string",
                        "parsing_tabel": [
                            {"kata": "string", "jenis": "string", "analisis": "string", "arti": "string"}
                        ],
                        "sintaksis": "string",
                        "konteks": "string"
                    }`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            response_format: { type: "json_object" }, // Memaksa AI memberikan JSON
            temperature: 0.3
        });

        // Mengambil hasil dari AI
        const result = JSON.parse(response.choices[0].message.content);
        
        console.log("✅ Berhasil menganalisis teks.");
        res.json(result);

    } catch (error) {
        console.error("❌ Detail Error:", error.message);
        res.status(500).json({ 
            error: "Gagal menghubungi OpenAI.",
            details: error.message 
        });
    }
});

// 6. Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🚀 Server Magister Linguae Aktif!`);
    console.log(`🌐 Akses di: http://localhost:${PORT}`);
    console.log(`🔑 Status API Key: TERHUBUNG`);
    console.log(`===========================================`);
});
