const translateBtn = document.getElementById('translateBtn');
const latinInput = document.getElementById('latinInput');
const indoOutput = document.getElementById('indoOutput');

translateBtn.addEventListener('click', async () => {
    const text = latinInput.value.trim();
    
    if (!text) {
        alert("Silakan masukkan teks Latin terlebih dahulu.");
        return;
    }

    translateBtn.innerText = "Menerjemahkan...";
    translateBtn.disabled = true;
    indoOutput.value = "Sedang memproses...";

    try {
        // Memanggil API MyMemory langsung dari browser
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=la|id`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            indoOutput.value = data.responseData.translatedText;
        } else {
            indoOutput.value = "Gagal menerjemahkan. Coba lagi.";
        }
    } catch (error) {
        console.error("Error:", error);
        indoOutput.value = "Koneksi gagal. Periksa internet Anda.";
    } finally {
        translateBtn.innerText = "Terjemahkan";
        translateBtn.disabled = false;
    }
});
