/**
 * ROMANTİK AMBİYANS SES MOTORU (Web Audio API Synthesizer)
 * Harici MP3 dosyasına ihtiyaç duymadan, kristal berraklığında 
 * romantik piyano ve müzik kutusu arpejleri çalan prosedürel ses motoru.
 */

class RomanticAudio {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.intervalId = null;
        this.notes = [
            // C Maj / A Min pentatonik ve romantik frekanslar
            261.63, // C4
            293.66, // D4
            329.63, // E4
            392.00, // G4
            440.00, // A4
            523.25, // C5
            587.33, // D5
            659.25, // E5
            783.99  // G5
        ];
        this.chordStep = 0;
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, timeOffset = 0, duration = 2.4) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + timeOffset;

        // Ana Osilatör (Yumuşak Sinüs Dalgası)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // İkincil Harmonik (Kristal/Çan Tınısı)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(freq * 2, now); // 1 oktav tiz harmonik

        // Yumuşak Envelope (Attack & Decay)
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08); // Nazik vuruş
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        subGain.gain.setValueAtTime(0.0001, now);
        subGain.gain.linearRampToValueAtTime(0.04, now + 0.05);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7));

        // Bağlantılar
        osc.connect(gain);
        subOsc.connect(subGain);
        gain.connect(this.ctx.destination);
        subGain.connect(this.ctx.destination);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + duration);
        subOsc.stop(now + duration);
    }

    // Romantik Arpej / Melodi Dizilimi
    playStep() {
        // Yumuşak progresyon adımları
        const patterns = [
            [261.63, 329.63, 392.00, 523.25], // C Major
            [220.00, 261.63, 329.63, 440.00], // A Minor
            [174.61, 261.63, 329.63, 392.00], // F Major7
            [196.00, 246.94, 293.66, 392.00]  // G Major
        ];

        const chord = patterns[this.chordStep % patterns.length];
        this.chordStep++;

        // Akor seslerini küçük gecikmelerle yayma (Arpeggio)
        chord.forEach((freq, idx) => {
            this.playTone(freq, idx * 0.32, 3.2);
        });

        // Ara sıra rastgele parıldayan yüksek nota
        if (Math.random() > 0.4) {
            const highFreq = this.notes[Math.floor(Math.random() * 4) + 4];
            this.playTone(highFreq, 1.4, 2.0);
        }
    }

    toggle() {
        this.initContext();

        if (this.isPlaying) {
            this.stop();
            return false;
        } else {
            this.start();
            return true;
        }
    }

    start() {
        this.isPlaying = true;
        this.playStep();
        this.intervalId = setInterval(() => {
            if (this.isPlaying) {
                this.playStep();
            }
        }, 2200);
    }

    stop() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Global Müzik Örneği
window.romanticAudio = new RomanticAudio();
