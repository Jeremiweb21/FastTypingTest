// script.js

document.addEventListener('DOMContentLoaded', () => {

    const KALIMAT_TES = [
        "Pengembangan kecerdasan buatan telah mencapai titik di mana mesin dapat belajar dan beradaptasi dengan lingkungan baru tanpa intervensi manusia secara langsung.",
        "Perubahan iklim global menyebabkan pola cuaca ekstrem, mencairnya lapisan es di kutub, dan naiknya permukaan air laut yang mengancam wilayah pesisir di seluruh dunia.",
        "Dalam novel klasik tersebut, penulis mengeksplorasi tema-tema kompleks seperti keadilan sosial, moralitas individu, dan pencarian makna hidup di tengah kekacauan.",
        "Meskipun internet menyediakan akses informasi yang belum pernah ada sebelumnya, kita juga harus waspada terhadap penyebaran disinformasi dan hoaks yang cepat.",
        "Globalisasi ekonomi telah membuka pasar baru bagi banyak negara, namun juga menciptakan tantangan signifikan terkait kesenjangan pendapatan dan persaingan tenaga kerja.",
        "Ekosistem terumbu karang, yang sering disebut sebagai 'hutan hujan laut', sangat penting bagi keanekaragaman hayati laut tetapi kini terancam oleh pemanasan global.",
        "Proklamasi kemerdekaan bukanlah akhir dari perjuangan, melainkan awal dari sebuah perjalanan panjang untuk membangun negara yang berdaulat, adil, dan makmur.",
        "Manajemen waktu yang efektif adalah keterampilan krusial yang memungkinkan seseorang untuk memprioritaskan tugas dan meningkatkan produktivitas secara signifikan.",
        "Sejarah mencatat bahwa pandemi besar seringkali memicu perubahan sosial, ekonomi, dan teknologi yang mendalam dalam peradaban manusia.",
        "Memahami algoritma pencarian dan struktur data fundamental adalah persyaratan inti bagi siapa pun yang ingin berkarir di bidang rekayasa perangkat lunak."
    ];

    // Mengambil elemen-elemen dari HTML (diperbarui)
    const quoteDisplayElement = document.getElementById('quote-display');
    const quoteInputElement = document.getElementById('quote-input');
    const resultsElement = document.getElementById('results');
    const wpmFinalElement = document.getElementById('wpm-final'); // ID diubah
    const restartButton = document.getElementById('restart-btn');
    
    // (BARU) Elemen untuk timer dan WPM live
    const timerValueElement = document.getElementById('timer-value');
    const wpmLiveElement = document.getElementById('wpm-live');

    let startTime;
    let testRunning = false;
    let timerInterval; // (BARU) Variabel untuk menyimpan interval timer

    // Fungsi untuk mengambil kalimat acak
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * KALIMAT_TES.length);
        return KALIMAT_TES[randomIndex];
    }

    // Fungsi untuk merender kalimat baru (diperbarui)
    async function renderNewQuote() {
        const quote = getRandomQuote();
        
        // Reset semua tampilan
        quoteDisplayElement.innerHTML = '';
        quoteInputElement.value = '';
        resultsElement.style.display = 'none';
        restartButton.style.display = 'none';
        quoteInputElement.disabled = false;
        testRunning = false;

        // (BARU) Reset timer dan WPM
        clearInterval(timerInterval); // Hentikan timer sebelumnya
        timerValueElement.innerText = '0';
        wpmLiveElement.innerText = '0';
        wpmFinalElement.innerText = '0';

        // Ubah setiap karakter kalimat menjadi <span>
        quote.split('').forEach((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            if (index === 0) {
                charSpan.classList.add('current');
            }
            quoteDisplayElement.appendChild(charSpan);
        });
        
        quoteInputElement.focus();
    }

    // (BARU) Fungsi untuk memulai dan menjalankan timer
    function startTimer() {
        // Set waktu mulai
        startTime = new Date();
        
        // Hentikan interval lama jika ada (untuk jaga-jaga)
        clearInterval(timerInterval);

        // Mulai interval baru yang berjalan setiap detik
        timerInterval = setInterval(() => {
            // Hitung detik yang telah berlalu
            const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
            timerValueElement.innerText = elapsedSeconds;
        }, 1000);
    }
    
    // (BARU) Fungsi untuk menghitung WPM secara live
    function calculateLiveWPM() {
        const elapsedSeconds = (new Date() - startTime) / 1000;
        
        // Hindari pembagian dengan nol jika tes baru mulai
        if (elapsedSeconds === 0) {
            wpmLiveElement.innerText = 0;
            return;
        }

        const typedChars = quoteInputElement.value.length;
        // Rumus WPM: (Jumlah karakter / 5) / (Waktu dalam menit)
        const wpm = Math.round((typedChars / 5) / (elapsedSeconds / 60));
        
        wpmLiveElement.innerText = wpm;
    }

    // Fungsi utama yang dipanggil setiap kali pengguna mengetik (diperbarui)
    function handleInput() {
        // Mulai timer dan ubah status tes saat ketikan pertama
        if (!testRunning) {
            testRunning = true;
            startTimer(); // Panggil fungsi timer baru
        }

        // (BARU) Hitung WPM live setiap kali ada input
        calculateLiveWPM();

        const arrayQuote = quoteDisplayElement.querySelectorAll('span');
        const arrayValue = quoteInputElement.value.split('');
        let allCorrect = true;

        arrayQuote.forEach((charSpan, index) => {
            const character = arrayValue[index];
            charSpan.classList.remove('current');

            if (character == null) {
                charSpan.classList.remove('correct', 'incorrect');
                allCorrect = false;
                if (index === arrayValue.length) {
                    charSpan.classList.add('current');
                }
            } else if (character === charSpan.innerText) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct');
                allCorrect = false;
            }
        });

        // Cek jika tes sudah selesai
        if (allCorrect) {
            finishTest();
        }
    }

    // Fungsi untuk menghitung WPM dan menampilkan hasil (diperbarui)
    function finishTest() {
        testRunning = false;
        clearInterval(timerInterval); // (BARU) Hentikan timer
        
        // Kalkulasi WPM final (lebih akurat menggunakan waktu dari startTime)
        const endTime = new Date();
        const elapsedSeconds = (endTime - startTime) / 1000;
        
        const quoteLength = quoteDisplayElement.innerText.length;
        const wpm = Math.round((quoteLength / 5) / (elapsedSeconds / 60));

        wpmFinalElement.innerText = wpm; // Tampilkan ke elemen final
        resultsElement.style.display = 'block';
        restartButton.style.display = 'block';
        quoteInputElement.disabled = true;
        
        // (Opsional) Pastikan WPM live sama dengan WPM final di akhir
        wpmLiveElement.innerText = wpm; 
    }

    // Menambahkan event listener
    quoteInputElement.addEventListener('input', handleInput);
    restartButton.addEventListener('click', renderNewQuote);

    // Memulai aplikasi saat halaman dimuat
    renderNewQuote();
});