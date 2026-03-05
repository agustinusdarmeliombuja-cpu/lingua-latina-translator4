const response = await openai.chat.completions.create({
  model: "gpt-4o", // Pastikan menggunakan model yang mendukung JSON Mode
  messages: [
    {
      "role": "system",
      "content": "Anda adalah asisten ahli bahasa Latin. Tugas Anda menerjemahkan dan menganalisis teks. Output WAJIB dalam format JSON yang sangat terstruktur sesuai skema pendidikan. Jangan berikan teks pembuka atau penutup, hanya JSON."
    },
    {
      "role": "user",
      "content": `Analisislah kalimat ini: "${textInput}". 
      Berikan JSON dengan key: 'terjemahan', 'parsing_tabel' (array), 'sintaksis', 'konteks', dan 'tips_belajar'.`
    }
  ],
  response_format: { type: "json_object" }, // Fitur otomatis OpenAI agar output selalu JSON
});

const hasilPintar = JSON.parse(response.choices[0].message.content);
res.json(hasilPintar);
