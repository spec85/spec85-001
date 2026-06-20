class WeatherCardApp {
    constructor() {
        this.audioContext = null;
        this.soundEnabled = false;
        this.animationEnabled = true;
        this.activeOscillators = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.startAmbientAnimations();
    }

    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    bindEvents() {
        const cards = document.querySelectorAll('.card');
        const weatherIcons = document.querySelectorAll('.weather-icon');
        const soundToggle = document.getElementById('sound-toggle');
        const animationToggle = document.getElementById('animation-toggle');

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const season = card.dataset.season;
                this.triggerSeasonEffect(season, card);
            });
        });

        weatherIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = icon.closest('.card');
                const season = card.dataset.season;
                const weather = icon.dataset.weather;
                this.triggerWeatherEffect(weather, season, card, icon);
            });
        });

        soundToggle.addEventListener('click', () => {
            this.soundEnabled = !this.soundEnabled;
            soundToggle.classList.toggle('active', this.soundEnabled);
            soundToggle.querySelector('span').textContent = this.soundEnabled ? '音效开启' : '音效关闭';
            if (this.soundEnabled) {
                this.initAudio();
            }
        });

        animationToggle.addEventListener('click', () => {
            this.animationEnabled = !this.animationEnabled;
            animationToggle.classList.toggle('active', this.animationEnabled);
            animationToggle.querySelector('span').textContent = this.animationEnabled ? '动画开启' : '动画关闭';
        });
    }

    triggerSeasonEffect(season, card) {
        if (this.animationEnabled) {
            card.classList.add('active');
            setTimeout(() => card.classList.remove('active'), 600);
            this.createParticleEffect(season, card);
        }
        if (this.soundEnabled) {
            this.playSeasonSound(season);
        }
    }

    triggerWeatherEffect(weather, season, card, icon) {
        if (this.animationEnabled) {
            icon.classList.add('active');
            setTimeout(() => icon.classList.remove('active'), 500);
            this.createParticleEffect(season, card, true);
        }
        if (this.soundEnabled) {
            this.playWeatherSound(weather, season);
        }
    }

    createParticleEffect(season, card, intense = false) {
        const container = this.getContainer(season, card);
        if (!container) return;

        const count = intense ? 30 : 15;
        const particleClass = this.getParticleClass(season);
        const durationBase = this.getDurationBase(season);

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (this.animationEnabled) {
                    const particle = document.createElement('div');
                    particle.className = particleClass;
                    
                    const left = Math.random() * 100;
                    const duration = durationBase + Math.random() * 2;
                    const delay = Math.random() * 0.5;
                    const size = season === 'summer' ? 1 : (8 + Math.random() * 8);
                    
                    particle.style.left = `${left}%`;
                    particle.style.animationDuration = `${duration}s`;
                    particle.style.animationDelay = `${delay}s`;
                    
                    if (season !== 'summer') {
                        particle.style.width = `${size}px`;
                        particle.style.height = `${size}px`;
                    }

                    if (season === 'autumn') {
                        const colors = ['#FF6B35', '#FF8C42', '#FFD93D', '#D4541E'];
                        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                    }

                    container.appendChild(particle);

                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.remove();
                        }
                    }, (duration + delay) * 1000);
                }
            }, i * (intense ? 50 : 100));
        }
    }

    getContainer(season, card) {
        const containers = {
            spring: card.querySelector('.petals-container'),
            summer: card.querySelector('.rain-container'),
            autumn: card.querySelector('.leaves-container'),
            winter: card.querySelector('.snow-container')
        };
        return containers[season];
    }

    getParticleClass(season) {
        const classes = {
            spring: 'petal',
            summer: 'raindrop',
            autumn: 'falling-leaf',
            winter: 'snowflake'
        };
        return classes[season];
    }

    getDurationBase(season) {
        const durations = {
            spring: 3,
            summer: 0.8,
            autumn: 4,
            winter: 5
        };
        return durations[season];
    }

    startAmbientAnimations() {
        setInterval(() => {
            if (this.animationEnabled) {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    const season = card.dataset.season;
                    if (Math.random() > 0.7) {
                        this.createSubtleEffect(season, card);
                    }
                });
            }
        }, 2000);
    }

    createSubtleEffect(season, card) {
        const container = this.getContainer(season, card);
        if (!container) return;

        const particle = document.createElement('div');
        particle.className = this.getParticleClass(season);
        
        const left = Math.random() * 100;
        const duration = this.getDurationBase(season) + 2;
        
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = '0.6';
        
        if (season === 'autumn') {
            const colors = ['#FF6B35', '#FF8C42', '#FFD93D'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        }

        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    }

    playSeasonSound(season) {
        if (!this.soundEnabled || !this.audioContext) return;

        const sounds = {
            spring: () => this.playWindChime(),
            summer: () => this.playThunderstorm(),
            autumn: () => this.playLeaves(),
            winter: () => this.playSnow()
        };

        if (sounds[season]) {
            sounds[season]();
        }
    }

    playWeatherSound(weather, season) {
        if (!this.soundEnabled || !this.audioContext) return;

        if (weather === 'thunderstorm') {
            this.playThunderclap();
        } else {
            this.playSeasonSound(season);
        }
    }

    playWindChime() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        
        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gain.gain.setValueAtTime(0, now + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 2);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 2);
            
            this.activeOscillators.push(osc);
        });

        setTimeout(() => {
            this.clearOscillators();
        }, 2500);
    }

    playThunderstorm() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const rainDuration = 3;
        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.08, now);
        rainGain.connect(ctx.destination);
        
        const rainBuffer = ctx.createBuffer(1, ctx.sampleRate * rainDuration, ctx.sampleRate);
        const rainData = rainBuffer.getChannelData(0);
        for (let i = 0; i < rainData.length; i++) {
            rainData[i] = (Math.random() * 2 - 1) * 0.3;
        }
        
        const rainSource = ctx.createBufferSource();
        rainSource.buffer = rainBuffer;
        rainSource.loop = false;
        
        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'highpass';
        rainFilter.frequency.value = 1000;
        
        rainSource.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainSource.start(now);
        
        this.playThunderclap(0.5);
        
        setTimeout(() => {
            this.playThunderclap(1);
        }, 1500);
    }

    playThunderclap(delay = 0) {
        const ctx = this.audioContext;
        const now = ctx.currentTime + delay;
        
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 1.5);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        source.start(now);
        source.stop(now + 1.5);
    }

    playLeaves() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const duration = 2.5;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const envelope = Math.sin(Math.PI * i / bufferSize);
            const highFreq = (Math.random() * 2 - 1) * 0.2;
            const lowFreq = Math.sin(i * 0.01) * 0.1;
            data[i] = (highFreq + lowFreq) * envelope;
        }
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 0.5;
        
        const gain = ctx.createGain();
        gain.gain.value = 0.25;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        source.start(now);
        source.stop(now + duration);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (this.soundEnabled && this.audioContext) {
                    this.playLeafCrackle(i * 0.4);
                }
            }, i * 400);
        }
    }

    playLeafCrackle(delay = 0) {
        const ctx = this.audioContext;
        const now = ctx.currentTime + delay;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    playSnow() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const duration = 4;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const envelope = Math.sin(Math.PI * i / bufferSize);
            data[i] = (Math.random() * 2 - 1) * 0.15 * envelope;
        }
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        
        const gain = ctx.createGain();
        gain.gain.value = 0.2;
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        source.start(now);
        source.stop(now + duration);

        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                if (this.soundEnabled && this.audioContext) {
                    this.playSnowCrunch(i * 0.8);
                }
            }, i * 800);
        }
    }

    playSnowCrunch(delay = 0) {
        const ctx = this.audioContext;
        const now = ctx.currentTime + delay;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150 + Math.random() * 100, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }

    clearOscillators() {
        this.activeOscillators = this.activeOscillators.filter(osc => {
            try {
                osc.stop();
            } catch (e) {}
            return false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherCardApp();
});
