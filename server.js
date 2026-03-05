const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Memuat data kamus lokal dari JSON
const rawData = fs.readFileSync(path.join(__dirname, 'data', 'dictionary.json'));
const localDictionary = JSON.parse(rawData);

app.post('/api/translate', async (req, res) => {
    const { text, source } = req.body;
    const cleanText = text.toLowerCase().trim();

    // 1. CEK KAMUS LOKAL (JSON)
    const localResult = localDictionary.find(item => 
        item.latin.toLowerCase() === cleanText || 
        item.indonesia.toLowerCase() === cleanText
    );

    if (localResult) {
        return res.json({
            success: true,
            source: "Database Lokal (Akurat)",
            translation: (source === 'la') ? localResult.indonesia : localResult.latin,
            grammar: localResult.tipe,
            description: localResult.deskripsi,
            example: localResult.contoh
        });
    }

    // 2. JIKA TIDAK ADA DI LOKAL, GUNAKAN API ONLINE
    try {
        const target = (source === 'la') ? 'id' : 'la';
        const response = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: { q: text, langpair: `${source}|${target}` }
        });

        res.json({
            success: true,
            source: "Cloud Translator",
            translation: response.data.responseData.translatedText,
            grammar: "Umum",
            description: "Hasil diterjemahkan secara otomatis oleh mesin.",
            example: "-"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error koneksi ke cloud." });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
