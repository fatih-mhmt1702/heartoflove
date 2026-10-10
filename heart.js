/**
 * BİREBİR GÖRSELDEKİ "LOVE HEART" KONSANTRİK KATMAN MOTORU
 * Parametrik kalp denklemi:
 * x = 16 * sin^3(t)
 * y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
 * Dış katmandan içe doğru muntazam ve simetrik dizilim.
 */

const LOVE_LANGUAGES_LIST = [
    "Seni seviyorum",
    "I love you",
    "Ich liebe dich",
    "Ti amo",
    "Te amo",
    "Je t'aime",
    "愛してる",
    "Aku cinta kamu",
    "ฉันรักเธอ",
    "Jag älskar dig",
    "मैं तुमसे प्यार करता हूँ",
    "Я тебя люблю",
    "Σ' αγαπώ",
    "사랑해",
    "我爱你",
    "Eu te amo",
    "Anh yêu em",
    "Kocham cię",
    "Ik hou van jou",
    "Я тебе кохаю",
    "Te quiero",
    "Mahal kita",
    "Szeretlek",
    "Miluji tě",
    "Jeg elsker deg",
    "Rakastan sinua",
    "Volim te",
    "Nakupenda",
    "Obicham te",
    "Te iubesc",
    "Taim i' ngra leat",
    "Aloha wau ia 'oe"
];

class HeartVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.words = [];
        this.sparks = [];
        this.mode = 'fill'; // 'fill', 'outline', 'explode'
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.time = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => {
            this.resize();
            this.buildHeart();
        });

        // Fare ve Dokunmatik Etkileşimi
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            this.createBurst(clickX, clickY, 35);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.touches[0].clientX - rect.left;
                this.mouseY = e.touches[0].clientY - rect.top;
            }
        }, { passive: true });

        this.canvas.addEventListener('touchend', () => {
            this.mouseX = -1000;
            this.mouseY = -1000;
        });

        this.buildHeart();
        this.animate();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    // Parametrik Kalp Formülü
    getHeartCoordinates(t, scale) {
        // x = 16 * sin^3(t)
        // y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return {
            x: x * scale,
            y: y * scale
        };
    }

    buildHeart() {
        this.words = [];
        const centerX = this.width / 2;
        const centerY = this.height / 2 - 15;

        // Ekran boyutuna göre ideal ölçek
        const baseScale = Math.min(this.width / 40, this.height / 40, 16.5);

        // Konsantrik Kalp Katmanları (Dıştan İçe)
        const layers = [
            { scaleRatio: 1.0, count: 42, isOutline: true, fontSize: 13 },
            { scaleRatio: 0.84, count: 34, isOutline: false, fontSize: 12 },
            { scaleRatio: 0.68, count: 26, isOutline: false, fontSize: 11.5 },
            { scaleRatio: 0.52, count: 20, isOutline: false, fontSize: 11 },
            { scaleRatio: 0.36, count: 14, isOutline: false, fontSize: 10.5 },
            { scaleRatio: 0.20, count: 8, isOutline: false, fontSize: 10 }
        ];

        let wordIdx = 0;

        layers.forEach((layer, layerIdx) => {
            const currentScale = baseScale * layer.scaleRatio;

            for (let i = 0; i < layer.count; i++) {
                // t: 0 ile 2*PI arasında eşit adımlarla
                const t = (i / layer.count) * Math.PI * 2;
                const pos = this.getHeartCoordinates(t, currentScale);

                const phrase = LOVE_LANGUAGES_LIST[wordIdx % LOVE_LANGUAGES_LIST.length];
                wordIdx++;

                const posX = centerX + pos.x;
                const posY = centerY + pos.y;

                // Animasyon gecikmesi: Katman katman akıcı doğuş
                const delay = layer.isOutline ? (i * 22) : (400 + layerIdx * 150 + i * 15);

                this.words.push({
                    text: phrase,
                    layerIdx: layerIdx,
                    isOutline: layer.isOutline,
                    baseX: posX,
                    baseY: posY,
                    x: posX + (Math.random() - 0.5) * 40,
                    y: posY + (Math.random() - 0.5) * 40,
                    vx: 0,
                    vy: 0,
                    opacity: 0,
                    targetOpacity: layer.isOutline ? 0.96 : 0.85,
                    delay: delay,
                    fontSize: layer.fontSize,
                    colorIdx: (i + layerIdx) % 4
                });
            }
        });
    }

    setMode(mode) {
        this.mode = mode;
        if (mode === 'explode') {
            this.createBurst(this.width / 2, this.height / 2, 70);
            this.words.forEach(w => {
                const angle = Math.random() * Math.PI * 2;
                const force = 6 + Math.random() * 14;
                w.vx = Math.cos(angle) * force;
                w.vy = Math.sin(angle) * force;
            });
        }
    }

    createBurst(x, y, count = 30) {
        const colors = ['#ff2a5f', '#ff5733', '#ff9f1c', '#ffc300', '#ff758f'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.5 + Math.random() * 7.5;
            this.sparks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5,
                size: 2 + Math.random() * 3.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: 0.015 + Math.random() * 0.025
            });
        }
    }

    getColor(colorIdx, opacity) {
        switch (colorIdx) {
            case 0: return `rgba(255, 42, 85, ${opacity})`;   // Sıcak Aşk Kırmızısı
            case 1: return `rgba(255, 87, 51, ${opacity})`;   // Alev Mercanı
            case 2: return `rgba(255, 159, 28, ${opacity})`;  // Sıcak Kehribar/Amber
            case 3: return `rgba(255, 117, 143, ${opacity})`; // Gül Pembesi
            default: return `rgba(255, 42, 85, ${opacity})`;
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.time += 0.038;

        // Akıcı ve gerçekçi çift vuruşlu kalp atışı (Lub-Dub Nabız Eğrisi)
        const beatCycle = (Math.sin(this.time) + 1) / 2;
        const pulse = 1 + Math.sin(this.time * 2) * 0.018 + Math.pow(beatCycle, 4) * 0.036;

        const centerX = this.width / 2;
        const centerY = this.height / 2 - 15;

        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < this.words.length; i++) {
            const w = this.words[i];

            // Mod: 'outline' ise sadece dış hatlar (layerIdx 0) görünür
            let targetAlpha = w.targetOpacity;
            if (this.mode === 'outline' && !w.isOutline) {
                targetAlpha = 0.06;
            }

            // Gecikme sayacı
            if (w.delay > 0) {
                w.delay -= 16;
                continue;
            }

            // Opaklık akışı
            if (w.opacity < targetAlpha) {
                w.opacity += 0.04;
            } else if (w.opacity > targetAlpha) {
                w.opacity -= 0.04;
            }

            // Nabız koordinatları
            const targetX = centerX + (w.baseX - centerX) * pulse;
            const targetY = centerY + (w.baseY - centerY) * pulse;

            // Fare itme/etkileşimi
            const dx = w.x - this.mouseX;
            const dy = w.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 80;

            if (dist < repelRadius && dist > 0) {
                const force = (1 - dist / repelRadius) * 6;
                w.vx += (dx / dist) * force;
                w.vy += (dy / dist) * force;
            }

            // Yaylanma fiziği
            const spring = 0.08;
            const friction = 0.85;

            w.vx += (targetX - w.x) * spring;
            w.vy += (targetY - w.y) * spring;

            w.vx *= friction;
            w.vy *= friction;

            w.x += w.vx;
            w.y += w.vy;

            // Çizim
            if (w.opacity > 0.02) {
                this.ctx.font = `600 ${w.fontSize}px 'Outfit', 'Segoe UI', sans-serif`;

                if (dist < repelRadius) {
                    this.ctx.shadowColor = '#ff2a5f';
                    this.ctx.shadowBlur = 14;
                    this.ctx.fillStyle = '#ffffff';
                } else {
                    this.ctx.shadowColor = 'rgba(255, 42, 85, 0.45)';
                    this.ctx.shadowBlur = w.isOutline ? 8 : 4;
                    this.ctx.fillStyle = this.getColor(w.colorIdx, w.opacity);
                }

                this.ctx.fillText(w.text, w.x, w.y);
            }
        }

        this.ctx.shadowBlur = 0;

        // Kıvılcımlar
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const s = this.sparks[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.08;
            s.alpha -= s.decay;

            if (s.alpha <= 0) {
                this.sparks.splice(i, 1);
                continue;
            }

            this.ctx.fillStyle = s.color;
            this.ctx.globalAlpha = s.alpha;
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
}

// Global başlatıcı
window.addEventListener('DOMContentLoaded', () => {
    window.heartVisualizer = new HeartVisualizer('heart-canvas');

    const buttons = document.querySelectorAll('.chip-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mode = btn.dataset.mode;
            window.heartVisualizer.setMode(mode);
        });
    });
});
