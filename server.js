const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Melayani file HTML dari folder public

// Endpoint Terjemah
app.post('/api/translate', async (req, res) => {
    const { text, source } = req.body;
    
    try {
        // Logika Integrasi API (Contoh menggunakan API MyMemory atau Google)
        // Jika Anda memiliki API Key, ganti URL dengan endpoint provider terkait
        const target = source === 'la' ? 'id' : 'la';
        const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`);
        
        const translation = response.data.responseData.translatedText;

        res.json({
            success: true,
            translation: translation,
            info: "Terjemahan berbasis database linguistik Latin-Indonesia"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Gagal menerjemahkan teks." });
    }
});

app.listen(PORT, () => {
    console.log(`Server Magister Latin berjalan di http://localhost:${PORT}`);
});
