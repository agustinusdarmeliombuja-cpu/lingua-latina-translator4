<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Magister Linguae</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #fdfaf6; font-family: 'Georgia', serif; }</style>
</head>
<body class="p-10">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-amber-200">
        <h1 class="text-4xl text-center text-indigo-900 mb-6">🏛️ Magister Linguae</h1>
        
        <textarea id="inputTeks" class="w-full p-4 border rounded-lg text-xl mb-4" placeholder="Masukkan teks Latin..."></textarea>
        
        <button onclick="translate()" id="btn" class="w-full bg-indigo-700 text-white py-3 rounded-lg font-bold hover:bg-indigo-800 transition">
            Analis & Terjemahkan
        </button>

        <div id="loading" class="hidden text-center mt-4 text-indigo-600 animate-bounce">Sedang menganalisis teks klasik...</div>

        <div id="hasil" class="hidden mt-8 space-y-6">
            <div class="p-4 bg-indigo-50 border-l-4 border-indigo-600">
                <h3 class="font-bold text-indigo-800">Terjemahan:</h3>
                <p id="txtTerjemahan" class="text-xl italic"></p>
            </div>
            
            <table class="w-full border-collapse border mt-4">
                <thead>
                    <tr class="bg-indigo-100 text-left">
                        <th class="p-2 border">Kata</th>
                        <th class="p-2 border">Analisis</th>
                        <th class="p-2 border">Arti</th>
                    </tr>
                </thead>
                <tbody id="tabelBody"></tbody>
            </table>

            <div class="p-4 bg-amber-50 rounded-lg">
                <h3 class="font-bold text-amber-800">Sintaksis & Konteks:</h3>
                <p id="txtSintaksis" class="text-sm"></p>
            </div>
        </div>
    </div>

    <script>
        async function translate() {
            const text = document.getElementById('inputTeks').value;
            const btn = document.getElementById('btn');
            const loading = document.getElementById('loading');
            const hasil = document.getElementById('hasil');

            if(!text) return alert("Isi teks dulu!");

            btn.disabled = true;
            loading.classList.remove('hidden');
            hasil.classList.add('hidden');

            try {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ text })
                });

                const data = await response.json();

                document.getElementById('txtTerjemahan').innerText = data.terjemahan;
                document.getElementById('txtSintaksis').innerText = data.sintaksis + " " + data.konteks;
                
                const tbody = document.getElementById('tabelBody');
                tbody.innerHTML = "";
                data.parsing_tabel.forEach(item => {
                    tbody.innerHTML += `<tr><td class="p-2 border font-bold">${item.kata}</td><td class="p-2 border italic">${item.analisis}</td><td class="p-2 border">${item.arti}</td></tr>`;
                });

                hasil.classList.remove('hidden');
            } catch (e) {
                alert("Error: " + e.message);
            } finally {
                btn.disabled = false;
                loading.classList.add('hidden');
            }
        }
    </script>
</body>
</html>
