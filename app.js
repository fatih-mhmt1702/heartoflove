/**
 * ROMANTİK ETKİLEŞİM VE ARKA PLAN SİSTEMİ
 */

// 1. AŞK SÖZLERİ KOLEKSİYONU
const LOVE_WHISPERS = [
    "Sen benim bu dünyada karşılaştığım en güzel mucizesin.",
    "Bütün diller bir araya gelse, kalbimin sana her atışındaki heyecanı anlatamaz.",
    "Gözlerinin içine her baktığımda, ömrümün en huzurlu anına sığınıyorum.",
    "Seninle geçen her saniye, ömrüme eklenmiş en parlak yıldız gibi.",
    "Dünyadaki tüm güzellikler bir yana, senin tek bir tatlı tebessümün bir yana.",
    "Bana aşkın ne olduğunu sadece kelimelerle değil, varlığınla öğrettin.",
    "Ellerini tuttuğum an dünya duruyor; geriye sadece biz ve sevgimiz kalıyor.",
    "Kalbimdeki en güzel şarkı senin sesinle başlıyor, senin adınla bitiyor."
];

let currentWhisperIdx = 0;

// 2. ARKA PLAN PARÇACIK VE ATEŞ BÖCEĞİ SİSTEMİ
class BackgroundParticles {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 55;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(this.createParticle());
        }

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticle() {
        const colors = [
            'rgba(255, 51, 85, ',
            'rgba(255, 159, 28, ',
            'rgba(255, 117, 143, ',
            'rgba(255, 195, 0, '
        ];

        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 2.8 + 0.8,
            colorBase: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.6 + 0.2,
            targetAlpha: Math.random() * 0.7 + 0.2,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.3 - Math.random() * 0.5, // Yavaşça yukarı süzülüş
            pulseSpeed: 0.015 + Math.random() * 0.02
        };
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;

            // Nabız gibi parlama
            p.alpha += (p.targetAlpha - p.alpha) * 0.05;
            if (Math.abs(p.targetAlpha - p.alpha) < 0.05) {
                p.targetAlpha = Math.random() * 0.7 + 0.15;
            }

            // Ekrandan çıkarsa alt taraftan yeniden doğur
            if (p.y < -10) {
                p.y = this.height + 10;
                p.x = Math.random() * this.width;
            }
            if (p.x < -10) p.x = this.width + 10;
            if (p.x > this.width + 10) p.x = -10;

            // Çizim
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${p.colorBase}${p.alpha})`;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `${p.colorBase}0.8)`;
            this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;
    }
}

// 3. FARE TAKİP EDEN KÜÇÜK KALP IŞILTILARI (Cursor Sparkle)
function initCursorSparkle() {
    let lastTime = 0;
    const body = document.body;

    window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime < 45) return; // Performans optimizasyonu
        lastTime = now;

        const spark = document.createElement('div');
        spark.className = 'cursor-sparkle';
        spark.innerHTML = Math.random() > 0.5 ? '✨' : '💖';
        spark.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            pointer-events: none;
            font-size: ${Math.random() * 10 + 10}px;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(1);
            transition: all 0.75s ease-out;
            opacity: 0.9;
        `;

        body.appendChild(spark);

        requestAnimationFrame(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 25;
            spark.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance + 15}px)) scale(0.3)`;
            spark.style.opacity = '0';
        });

        setTimeout(() => {
            spark.remove();
        }, 800);
    });
}

// 4. SAYFA YÜKLENİNCE BAŞLATILACAK ETKİLEŞİMLER
document.addEventListener('DOMContentLoaded', () => {
    // Parçacık arkaplanı
    new BackgroundParticles('bg-canvas');
    initCursorSparkle();

    // Müzik Butonu
    const musicBtn = document.getElementById('music-toggle');
    const musicLabel = musicBtn.querySelector('.music-label');

    musicBtn.addEventListener('click', () => {
        if (!window.romanticAudio) return;
        const isPlaying = window.romanticAudio.toggle();

        if (isPlaying) {
            musicBtn.classList.add('playing');
            musicLabel.textContent = 'Melodiyi Durdur';
        } else {
            musicBtn.classList.remove('playing');
            musicLabel.textContent = 'Melodiyi Başlat';
        }
    });

    // İnteraktif Zarf Açma/Kapama
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('wax-seal');

    if (envelope) {
        envelope.addEventListener('click', () => {
            envelope.classList.toggle('open');
            if (envelope.classList.contains('open') && window.heartVisualizer) {
                // Zarf açıldığında küçük bir kıvılcım patlaması
                const rect = envelope.getBoundingClientRect();
                window.heartVisualizer.createBurst(
                    rect.left + rect.width / 2,
                    rect.top + 80,
                    20
                );
            }
        });
    }

    // Sevgi Fısıltısı Değiştirme
    const whisperText = document.getElementById('whisper-text');
    const nextWhisperBtn = document.getElementById('btn-next-whisper');

    if (nextWhisperBtn && whisperText) {
        nextWhisperBtn.addEventListener('click', () => {
            whisperText.style.opacity = '0';
            whisperText.style.transform = 'translateY(10px)';

            setTimeout(() => {
                currentWhisperIdx = (currentWhisperIdx + 1) % LOVE_WHISPERS.length;
                whisperText.textContent = LOVE_WHISPERS[currentWhisperIdx];
                whisperText.style.opacity = '1';
                whisperText.style.transform = 'translateY(0)';
            }, 300);
        });
    }
});
