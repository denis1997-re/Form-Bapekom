// Konfigurasi URL Google Apps Script terbaru Anda
const scriptURL = "https://script.google.com/macros/s/AKfycbywz8JNfOWLn2U5usg01aZv82omYQWaNpglLaOgg836XxSgITpk9zETMwJDKygqPs7x2w/exec";

// Ambil elemen-elemen penting
const form = document.getElementById("biodata-form");
const btn = document.getElementById("submit-btn");
const statusMsg = document.getElementById("status-message");
const dropZone = document.getElementById("drop-zone");
const fileInput = document.querySelector(".drop-zone__input");

// --- 1. Interaksi Drag & Drop / Pilih Foto ---
dropZone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
    if (fileInput.files.length) {
        const fileName = fileInput.files[0].name;
        dropZone.querySelector(".drop-zone__prompt").textContent = `✅ Terpilih: ${fileName}`;
        dropZone.style.borderColor = "#37352f";
        dropZone.style.background = "#f0fdf4";
    }
});

// --- 2. Auto-resize Textarea (Alamat) ---
const textarea = document.querySelector("textarea");
if(textarea) {
    textarea.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });
}

// --- 3. Proses Pengiriman Data ---
form.addEventListener("submit", e => {
    e.preventDefault(); 
    
    // Validasi file: Pastikan user sudah memilih foto
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Mohon maaf, pas foto wajib diunggah!");
        dropZone.style.borderColor = "#ff4d4d";
        return;
    }

    // Tampilan tombol saat proses pengiriman
    btn.disabled = true;
    btn.innerHTML = "<span>Memproses...</span>";
    statusMsg.innerHTML = "<i>Sedang mengirim data ke server Bapekom...</i>";

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function() {
        const base64Data = reader.result.split(",")[1];
        
        const formData = new FormData(form);
        const dataObj = {};
        
        formData.forEach((value, key) => {
            if (key !== 'foto') {
                dataObj[key] = value;
            }
        });

        dataObj.fotoContent = base64Data;
        dataObj.fotoName = file.name;
        dataObj.fotoType = file.type;

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(dataObj)
        })
        .then(() => {
            // Tampilan jika BERHASIL
            statusMsg.innerHTML = "<b style='color: #2e7d32;'>✅ Data Berhasil Terkirim! Mengalihkan...</b>";
            
            // REDIRECT: Pindah ke halaman success.html setelah 1 detik
            setTimeout(() => {
                window.location.href = "sucess.html";
            }, 1000);
        })
        .catch(error => {
            console.error('Error!', error.message);
            statusMsg.innerHTML = "<b style='color: #d32f2f;'>❌ Gagal mengirim. Periksa koneksi internet Anda.</b>";
            btn.disabled = false;
            btn.innerHTML = "<span>Coba Lagi</span>";
        });
    };
});