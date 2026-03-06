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
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (data.translation) {
            indoOutput.value = data.translation;
        } else {
            indoOutput.value = "Terjadi kesalahan saat menerjemahkan.";
        }
    } catch (error) {
        console.error("Error:", error);
        indoOutput.value = "Koneksi ke server gagal.";
    } finally {
        translateBtn.innerText = "Terjemahkan";
        translateBtn.disabled = false;
    }
});
