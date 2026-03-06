const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Melayani file statis dari folder 'public'

// Endpoint untuk translasi
app.post('/translate', async (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: "Teks tidak boleh kosong" });
    }

    try {
        // Menggunakan MyMemory API (Gratis & Terbuka)
        // la = Latin, id = Indonesia
        const response = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: text,
                langpair: 'la|id'
            }
        });

        const translatedText = response.data.responseData.translatedText;
        res.json({ translation: translatedText });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal menerjemahkan teks" });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
