const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
// Melayani file statis dari folder 'public'
app.use(express.static('public'));

app.post('/api/translate', async (req, res) => {
    const { text, source } = req.body;
    
    if (!text) {
        return res.status(400).json({ success: false, message: "Teks tidak boleh kosong" });
    }

    try {
        // Logika penentuan bahasa: Jika sumber 'la' (Latin) maka target 'id' (Indonesia) dan sebaliknya
        const target = (source === 'la') ? 'id' : 'la';
        
        // Menggunakan API MyMemory (Gratis tanpa key, tapi ada limit harian)
        const response = await axios.get(`https://api.mymemory.translated.net/get`, {
            params: {
                q: text,
                langpair: `${source}|${target}`
            }
        });

        if (response.data.responseStatus === 200) {
            res.json({
                success: true,
                translation: response.data.responseData.translatedText
            });
        } else {
            // Jika API memberikan pesan error (misal: limit tercapai)
            res.status(response.data.responseStatus).json({ 
                success: false, 
                message: response.data.responseDetails 
            });
        }
    } catch (error) {
        console.error("Error Detail:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Gagal menyambung ke server penerjemah. Pastikan koneksi internet aktif." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server aktif di http://localhost:${PORT}`);
});
