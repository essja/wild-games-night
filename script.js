/* ==========================================================================
   WILD GAMES NIGHT - MAGICAL ACCEPTANCE LETTER SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GUEST NAME & ADMIN PARSER ---
    const getGuestName = () => {
        const urlParams = new URLSearchParams(window.location.search);
        let name = urlParams.get('name') || urlParams.get('guest');
        if (!name || !name.trim()) {
            return 'Guest';
        }
        name = name.trim().replace(/\b\w/g, l => l.toUpperCase());
        return name;
    };

    const getGuestGender = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('gender') || 'boy';
    };

    const guestName = getGuestName();
    const guestGender = getGuestGender();

    const guestNameDisplay = document.getElementById('guestNameDisplay');
    const passGuestName = document.getElementById('passGuestName');
    
    if (guestNameDisplay) guestNameDisplay.textContent = guestName;
    if (passGuestName) passGuestName.textContent = guestName;

    const genderSpecNote = document.getElementById('genderSpecNote');
    if (genderSpecNote) {
        genderSpecNote.classList.remove('hidden-note', 'note-boy', 'note-girl');
        if (guestGender === 'girl') {
            genderSpecNote.classList.add('note-girl');
            genderSpecNote.innerHTML = `✨ <strong>Note for the Ladies:</strong> Bring 1 bottle or female friend(s). Get ready to have a blast! 💃`;
        } else {
            genderSpecNote.classList.add('note-boy');
            genderSpecNote.innerHTML = `⚠️ <strong>BYOB Notice for Guys:</strong> Every guy attending is expected to bring his own bottle. No bottle, no entrance! 🍾`;
        }
    }

    // Check if host admin mode is enabled via URL (?admin=true or ?host=true)
    const organizerBtn = document.getElementById('organizerBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminUrl = urlParams.get('admin') === 'true' || urlParams.get('host') === 'true' || urlParams.get('organizer') === 'true';

    if (isAdminUrl && organizerBtn) {
        organizerBtn.classList.remove('hidden-admin-btn');
    }

    // Secret Triple-Tap on WGN Crest to reveal Host Admin Panel
    const crestLogo = document.getElementById('crestLogo');
    let crestClickCount = 0;
    let crestClickTimer = null;

    if (crestLogo && organizerBtn) {
        crestLogo.addEventListener('click', () => {
            crestClickCount++;
            clearTimeout(crestClickTimer);
            crestClickTimer = setTimeout(() => { crestClickCount = 0; }, 1500);

            if (crestClickCount >= 3) {
                organizerBtn.classList.remove('hidden-admin-btn');
                organizerModal.classList.remove('hidden-modal');
                renderAcceptedGuestsLog();
                crestClickCount = 0;
            }
        });
    }


    // --- 2. ENCHANTED VOICE & WEB AUDIO SYNTHESIZER ---
    class MagicAudioEngine {
        constructor() {
            this.ctx = null;
            this.isMuted = false;
            this.isPlayingAmbient = false;
            this.ambientOscillators = [];
            this.masterGain = null;
            this.synthVoice = null;

            if ('speechSynthesis' in window) {
                window.speechSynthesis.onvoiceschanged = () => {
                    this.loadVoice();
                };
                this.loadVoice();
            }
        }

        loadVoice() {
            if (!('speechSynthesis' in window)) return;
            const voices = window.speechSynthesis.getVoices();
            this.synthVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Serena')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        }

        speak(text) {
            if (this.isMuted || !('speechSynthesis' in window)) return;
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                if (this.synthVoice) utterance.voice = this.synthVoice;
                utterance.pitch = 1.05;
                utterance.rate = 0.92;
                utterance.volume = 1.0;
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                console.log('Voice synthesis error:', e);
            }
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                    this.masterGain = this.ctx.createGain();
                    this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
                    this.masterGain.connect(this.ctx.destination);
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggleMute() {
            this.isMuted = !this.isMuted;
            if (this.isMuted && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            if (this.masterGain) {
                this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx ? this.ctx.currentTime : 0);
            }
            return this.isMuted;
        }

        playAmbientSoundscape() {
            if (!this.ctx || this.isPlayingAmbient || this.isMuted) return;
            this.isPlayingAmbient = true;

            const freqs = [174.61, 220.00, 261.63, 329.63, 392.00, 523.25];
            
            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
                lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
                lfo.connect(lfoGain);

                gain.gain.setValueAtTime(0.02 / (idx + 1), this.ctx.currentTime);
                lfoGain.connect(gain.gain);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start();
                lfo.start();

                this.ambientOscillators.push({ osc, lfo });
            });
        }

        playSealCrack() {
            if (!this.ctx || this.isMuted) return;
            const now = this.ctx.currentTime;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 0.15);

            const bufferSize = this.ctx.sampleRate * 0.1;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.3, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            noise.connect(noiseGain);
            noiseGain.connect(this.masterGain);
            noise.start(now);
        }

        playMagicalChime() {
            if (!this.ctx || this.isMuted) return;
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            
            notes.forEach((note, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(note, now + i * 0.08);

                gain.gain.setValueAtTime(0, now + i * 0.08);
                gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.8);

                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start(now + i * 0.08);
                osc.stop(now + i * 0.08 + 0.8);
            });
        }

        playAcceptHarps() {
            if (!this.ctx || this.isMuted) return;
            const now = this.ctx.currentTime;
            const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99, 987.77, 1046.50];
            
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.06);

                gain.gain.setValueAtTime(0, now + i * 0.06);
                gain.gain.linearRampToValueAtTime(0.25, now + i * 0.06 + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 1.2);

                osc.connect(gain);
                gain.connect(this.masterGain);
                osc.start(now + i * 0.06);
                osc.stop(now + i * 0.06 + 1.2);
            });
        }
    }

    const audioSystem = new MagicAudioEngine();

    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const audioIcon = document.getElementById('audioIcon');
    const audioLabel = document.getElementById('audioLabel');

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            audioSystem.init();
            const muted = audioSystem.toggleMute();
            audioIcon.textContent = muted ? '🔇' : '🔊';
            audioLabel.textContent = muted ? 'Sound Off' : 'Sound On';
            if (!muted && !audioSystem.isPlayingAmbient) {
                audioSystem.playAmbientSoundscape();
            }
        });
    }

    const initAudioOnUserInteraction = () => {
        audioSystem.init();
        audioSystem.playAmbientSoundscape();
        document.removeEventListener('click', initAudioOnUserInteraction);
        document.removeEventListener('touchstart', initAudioOnUserInteraction);
    };
    document.addEventListener('click', initAudioOnUserInteraction);
    document.addEventListener('touchstart', initAudioOnUserInteraction);


    // --- 3. CANVAS PARTICLE & CONFETTI ENGINE ---
    const canvas = document.getElementById('magicCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const stars = [];

    for (let i = 0; i < 60; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.005
        });
    }

    class Particle {
        constructor(x, y, type = 'dust') {
            this.x = x !== undefined ? x : Math.random() * width;
            this.y = y !== undefined ? y : Math.random() * height;
            this.type = type;

            if (type === 'confetti') {
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = Math.random() * 1.5 + 0.8;
                this.size = Math.random() * 5 + 3;
                this.alpha = Math.random() * 0.8 + 0.2;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.1;
                this.color = ['#ff007f', '#ffd700', '#00f3ff', '#9d4edd', '#ffffff'][Math.floor(Math.random() * 5)];
                this.life = Math.random() * 300 + 150;
            } else if (type === 'burst') {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.radius = Math.random() * 3 + 1.2;
                this.alpha = 1;
                this.life = Math.random() * 80 + 40;
                this.color = ['#ffd700', '#ff007f', '#00f3ff', '#ffffff'][Math.floor(Math.random() * 4)];
            } else {
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -Math.random() * 0.6 - 0.2;
                this.radius = Math.random() * 1.6 + 0.5;
                this.alpha = Math.random() * 0.7 + 0.3;
                this.life = Math.random() * 200 + 100;
                this.color = Math.random() > 0.5 ? '#ffd700' : '#ff007f';
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.type === 'confetti') {
                this.rotation += this.rotationSpeed;
                this.life--;
                if (this.y > height || this.life <= 0) {
                    this.y = -10;
                    this.x = Math.random() * width;
                    this.life = Math.random() * 300 + 150;
                }
            } else if (this.type === 'burst') {
                this.life--;
                this.alpha = this.life / 100;
                this.vy += 0.06;
            } else {
                this.life--;
                if (this.y < 0 || this.life <= 0) {
                    this.y = height + 10;
                    this.x = Math.random() * width;
                    this.life = Math.random() * 200 + 100;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);

            if (this.type === 'confetti') {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 1.5);
            } else {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();

                if (this.type === 'burst') {
                    ctx.shadowColor = this.color;
                    ctx.shadowBlur = 10;
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < 25; i++) particles.push(new Particle(undefined, undefined, 'dust'));
    for (let i = 0; i < 20; i++) particles.push(new Particle(undefined, undefined, 'confetti'));

    function createSparkleBurst(x, y, count = 35) {
        for (let i = 0; i < count; i++) {
            particles.push(new Particle(x, y, 'burst'));
            particles.push(new Particle(x, y, 'confetti'));
        }
    }

    function renderCanvas() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            star.alpha += star.twinkleSpeed;
            if (star.alpha > 1 || star.alpha < 0.2) star.twinkleSpeed *= -1;
            ctx.save();
            ctx.globalAlpha = star.alpha;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();
            if (p.type === 'burst' && p.life <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(renderCanvas);
    }

    renderCanvas();

    window.addEventListener('pointerdown', (e) => {
        createSparkleBurst(e.clientX, e.clientY, 10);
    });


    // --- 4. SCENE TRANSITION & VOICE ANNOUNCEMENT ---
    const scene1 = document.getElementById('scene1');
    const scene3 = document.getElementById('scene3');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const waxSeal = document.getElementById('waxSeal');
    
    let isEnvelopeOpened = false;

    if (envelopeContainer) {
        envelopeContainer.addEventListener('click', (e) => {
            if (isEnvelopeOpened) return;
            isEnvelopeOpened = true;

            audioSystem.init();
            audioSystem.playSealCrack();
            if (waxSeal) waxSeal.classList.add('cracked');

            const rect = waxSeal.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 50);

            setTimeout(() => {
                envelopeContainer.classList.add('opening');
                audioSystem.playMagicalChime();
            }, 300);

            setTimeout(() => {
                scene1.style.opacity = '0';
                scene1.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    scene1.classList.remove('active-scene');
                    scene1.classList.add('hidden-scene');

                    scene3.classList.remove('hidden-scene');
                    scene3.classList.add('active-scene');

                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    createSparkleBurst(window.innerWidth / 2, 200, 60);

                    if (guestGender === 'girl') {
                        audioSystem.speak(`Congratulations ${guestName}! We are so excited to invite you to Wild Games Night! Get ready for a wonderful evening.`);
                    } else {
                        audioSystem.speak(`Congratulations ${guestName}! You have been selected for Wild Games Night. Remember, bring your bottle! No bottle, no entry.`);
                    }
                }, 800);
            }, 1200);
        });
    }


    // --- 5. COUNTDOWN TIMER (Friday, 31 July 2026 @ 9:00 PM) ---
    const targetDate = new Date('2026-07-31T21:00:00').getTime();

    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMinutes = document.getElementById('cdMinutes');
    const cdSeconds = document.getElementById('cdSeconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            if (cdDays) cdDays.textContent = '00';
            if (cdHours) cdHours.textContent = '00';
            if (cdMinutes) cdMinutes.textContent = '00';
            if (cdSeconds) cdSeconds.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
        if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
        if (cdMinutes) cdMinutes.textContent = String(minutes).padStart(2, '0');
        if (cdSeconds) cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // --- 6. INSTANT NOTIFICATION & ACCEPTANCE SYSTEM ---
    const acceptBtn = document.getElementById('acceptBtn');
    const acceptBtnText = document.getElementById('acceptBtnText');
    const parchmentLetter = document.getElementById('parchmentLetter');
    const confirmationBox = document.getElementById('confirmationBox');
    const rulesCheckbox = document.getElementById('rulesCheckbox');
    const agreementWarning = document.getElementById('agreementWarning');
    const agreementWrapper = document.getElementById('agreementWrapper');
    const confStatusMsg = document.getElementById('confStatusMsg');

    const waConfirmBtn1 = document.getElementById('waConfirmBtn1');
    const waConfirmBtn2 = document.getElementById('waConfirmBtn2');

    const getCustomRsvpMessage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        let template = urlParams.get('rsvp');
        if (template) {
            try {
                template = decodeURIComponent(template);
            } catch (e) {
                console.log('Error decoding custom rsvp template:', e);
            }
        }
        
        if (!template) {
            if (guestGender === 'girl') {
                template = "🎉 INVITATION ACCEPTED! 🎉\n\nHi! I, [Name], officially ACCEPT the invitation for Wild Games Night on Friday, 31 July at 9 PM and agree to all 7 Game Night Rules! (Excited for the night! 💃)";
            } else {
                template = "🎉 INVITATION ACCEPTED! 🎉\n\nHi! I, [Name], officially ACCEPT the invitation for Wild Games Night on Friday, 31 July at 9 PM and agree to all 7 Game Night Rules! (I'll bring my bottle! 🍾)";
            }
        }
        
        return template.replace(/\[Name\]/gi, guestName).replace(/\[guest\]/gi, guestName);
    };

    const buildWaUrl = (phone) => {
        const msg = encodeURIComponent(getCustomRsvpMessage());
        return `https://wa.me/${phone}?text=${msg}`;
    };

    if (waConfirmBtn1) waConfirmBtn1.href = buildWaUrl('23288098340');
    if (waConfirmBtn2) waConfirmBtn2.href = buildWaUrl('23275119627');

    const sendInstantHostNotification = async (guestName) => {
        const hostEmail = localStorage.getItem('wgn_host_email');
        if (!hostEmail) {
            console.log('No host email configured yet in Admin panel.');
            return;
        }

        try {
            if (confStatusMsg) confStatusMsg.textContent = '⚡ Sending instant alert to host email...';
            
            const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(hostEmail)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `🎉 Wild Games Night RSVP: ${guestName} ACCEPTED!`,
                    Guest_Name: guestName,
                    Event: 'Wild Games Night',
                    Date: 'Friday, 31 July 2026 @ 9:00 PM',
                    Venue: 'Number 9 Manga Drive, Lumley',
                    Agreement: 'Accepted & Agreed to all 7 Game Night Rules',
                    Time_Confirmed: new Date().toLocaleString()
                })
            });

            if (response.ok) {
                if (confStatusMsg) confStatusMsg.textContent = '✅ Host email alert sent instantly!';
            } else {
                if (confStatusMsg) confStatusMsg.textContent = '⚡ RSVP confirmed! Tap WhatsApp below to notify host directly.';
            }
        } catch (err) {
            console.log('Background notification error:', err);
            if (confStatusMsg) confStatusMsg.textContent = '⚡ RSVP confirmed! Tap WhatsApp below to notify host directly.';
        }
    };

    if (rulesCheckbox) {
        rulesCheckbox.addEventListener('change', () => {
            if (rulesCheckbox.checked && agreementWarning) {
                agreementWarning.classList.add('hidden-warning');
            }
        });
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            if (rulesCheckbox && !rulesCheckbox.checked) {
                if (agreementWarning) agreementWarning.classList.remove('hidden-warning');
                if (agreementWrapper) {
                    agreementWrapper.classList.remove('shakeWarning');
                    void agreementWrapper.offsetWidth;
                    agreementWrapper.classList.add('shakeWarning');
                }
                return;
            }

            audioSystem.playAcceptHarps();
            if (guestGender === 'girl') {
                audioSystem.speak(`Attendance confirmed! We eagerly await your arrival, ${guestName}. Get ready to have a blast!`);
            } else {
                audioSystem.speak(`Attendance confirmed! We'll see you there, ${guestName}. Bring your bottle!`);
            }
            
            if (parchmentLetter) parchmentLetter.classList.add('glowing-accept');
            
            const rect = acceptBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);

            acceptBtn.classList.add('accepted');
            if (acceptBtnText) acceptBtnText.textContent = '✓ Invitation Accepted!';

            if (confirmationBox) {
                confirmationBox.classList.remove('hidden-confirmation');
                confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            sendInstantHostNotification(guestName);

            try {
                let acceptedList = JSON.parse(localStorage.getItem('wgn_accepted_guests') || '[]');
                if (!acceptedList.includes(guestName)) {
                    acceptedList.push(guestName);
                    localStorage.setItem('wgn_accepted_guests', JSON.stringify(acceptedList));
                }
            } catch (e) {
                console.log(e);
            }

            setTimeout(() => {
                window.open(buildWaUrl('23288098340'), '_blank');
            }, 2000);
        });
    }


    // --- 7. MODALS (LOCATION, CALENDAR, SHARE PASS) ---
    const locationBtn = document.getElementById('locationBtn');
    const locationModal = document.getElementById('locationModal');
    const closeLocModal = document.getElementById('closeLocModal');

    if (locationBtn && locationModal) {
        locationBtn.addEventListener('click', () => {
            locationModal.classList.remove('hidden-modal');
        });
    }
    if (closeLocModal && locationModal) {
        closeLocModal.addEventListener('click', () => {
            locationModal.classList.add('hidden-modal');
        });
    }

    const calendarBtn = document.getElementById('calendarBtn');
    const calendarModal = document.getElementById('calendarModal');
    const closeCalModal = document.getElementById('closeCalModal');

    if (calendarBtn && calendarModal) {
        calendarBtn.addEventListener('click', () => {
            calendarModal.classList.remove('hidden-modal');
        });
    }
    if (closeCalModal && calendarModal) {
        closeCalModal.addEventListener('click', () => {
            calendarModal.classList.add('hidden-modal');
        });
    }

    const googleCalBtn = document.getElementById('googleCalBtn');
    if (googleCalBtn) {
        googleCalBtn.addEventListener('click', () => {
            const title = encodeURIComponent('Wild Games Night');
            const details = encodeURIComponent('You are cordially invited to Wild Games Night. BYOB strictly enforced!');
            const location = encodeURIComponent('Number 9 Manga Drive, Lumley, Freetown');
            const dates = '20260731T210000Z/20260801T040000Z';

            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
            window.open(gCalUrl, '_blank');
        });
    }

    const icsCalBtn = document.getElementById('icsCalBtn');
    if (icsCalBtn) {
        icsCalBtn.addEventListener('click', () => {
            const icsData = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Wild Games Night//Acceptance Letter//EN',
                'BEGIN:VEVENT',
                'SUMMARY:Wild Games Night',
                'DESCRIPTION:You are cordially invited to Wild Games Night. Bring Your Own Bottle (BYOB)!',
                'LOCATION:Number 9 Manga Drive, Lumley, Freetown',
                'DTSTART:20260731T210000Z',
                'DTEND:20260801T040000Z',
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'Wild_Games_Night_Invitation.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    const sharePassBtn = document.getElementById('sharePassBtn');
    const passModal = document.getElementById('passModal');
    const closePassModal = document.getElementById('closePassModal');
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    if (sharePassBtn && passModal) {
        sharePassBtn.addEventListener('click', () => {
            passModal.classList.remove('hidden-modal');
        });
    }
    if (closePassModal && passModal) {
        closePassModal.addEventListener('click', () => {
            passModal.classList.add('hidden-modal');
        });
    }

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl).then(() => {
                copyLinkBtn.textContent = '✓ Link Copied!';
                setTimeout(() => {
                    copyLinkBtn.textContent = '🔗 Copy Invitation Link';
                }, 3000);
            }).catch(() => {
                alert('Invitation URL: ' + currentUrl);
            });
        });
    }


    // --- 8. ORGANIZER ADMIN PANEL & NOTIFICATION CONFIGURATION ---
    const organizerModal = document.getElementById('organizerModal');
    const closeOrgModal = document.getElementById('closeOrgModal');

    const notificationEmailInput = document.getElementById('notificationEmailInput');
    const invitationGuestName = document.getElementById('invitationGuestName');
    const generatedLinkBox = document.getElementById('generatedLinkBox');
    const generatedUrlInput = document.getElementById('generatedUrlInput');
    const copyGenLinkBtn = document.getElementById('copyGenLinkBtn');
    const shareWaLinkBtn = document.getElementById('shareWaLinkBtn');
    const acceptedGuestsList = document.getElementById('acceptedGuestsList');

    if (notificationEmailInput) {
        const savedEmail = localStorage.getItem('wgn_host_email') || '';
        notificationEmailInput.value = savedEmail;

        notificationEmailInput.addEventListener('input', () => {
            localStorage.setItem('wgn_host_email', notificationEmailInput.value.trim());
        });
    }

    const renderAcceptedGuestsLog = () => {
        if (!acceptedGuestsList) return;
        try {
            const acceptedList = JSON.parse(localStorage.getItem('wgn_accepted_guests') || '[]');
            if (acceptedList.length === 0) {
                acceptedGuestsList.innerHTML = '<li class="empty-log">No local acceptances logged yet on this device.</li>';
            } else {
                acceptedGuestsList.innerHTML = acceptedList.map(name => `<li>✨ <strong>${name}</strong> (Accepted & Agreed to Rules)</li>`).join('');
            }
        } catch (e) {
            console.log(e);
        }
    };

    if (organizerBtn && organizerModal) {
        organizerBtn.addEventListener('click', () => {
            organizerModal.classList.remove('hidden-modal');
            renderAcceptedGuestsLog();
        });
    }

    if (closeOrgModal && organizerModal) {
        closeOrgModal.addEventListener('click', () => {
            organizerModal.classList.add('hidden-modal');
        });
    }

    const boyTemplateInput = document.getElementById('boyTemplateInput');
    const girlTemplateInput = document.getElementById('girlTemplateInput');
    const guestGenderRadios = document.getElementsByName('guestGender');

    if (boyTemplateInput) {
        const savedBoy = localStorage.getItem('wgn_boy_template');
        if (savedBoy) boyTemplateInput.value = savedBoy;
        boyTemplateInput.addEventListener('input', () => {
            localStorage.setItem('wgn_boy_template', boyTemplateInput.value);
            updateGeneratedLink();
        });
    }

    if (girlTemplateInput) {
        const savedGirl = localStorage.getItem('wgn_girl_template');
        if (savedGirl) girlTemplateInput.value = savedGirl;
        girlTemplateInput.addEventListener('input', () => {
            localStorage.setItem('wgn_girl_template', girlTemplateInput.value);
            updateGeneratedLink();
        });
    }

    guestGenderRadios.forEach(radio => {
        radio.addEventListener('change', updateGeneratedLink);
    });

    function updateGeneratedLink() {
        if (!invitationGuestName) return;
        const val = invitationGuestName.value.trim();
        if (!val) {
            if (generatedLinkBox) generatedLinkBox.classList.add('hidden-box');
            return;
        }

        let gender = 'boy';
        guestGenderRadios.forEach(radio => {
            if (radio.checked) gender = radio.value;
        });

        let template = '';
        if (gender === 'girl' && girlTemplateInput) {
            template = girlTemplateInput.value.trim();
        } else if (boyTemplateInput) {
            template = boyTemplateInput.value.trim();
        }

        const baseUrl = window.location.origin + window.location.pathname;
        let fullUrl = `${baseUrl}?name=${encodeURIComponent(val)}&gender=${gender}`;
        if (template) {
            fullUrl += `&rsvp=${encodeURIComponent(template)}`;
        }

        if (generatedUrlInput) generatedUrlInput.value = fullUrl;
        if (generatedLinkBox) generatedLinkBox.classList.remove('hidden-box');

        if (shareWaLinkBtn) {
            const waText = encodeURIComponent(`Hey ${val}! 🎉 Your Games night letter of approval has arrived for Wild Games Night on Friday, 31 July at 9:00 PM!\n\nOpen your letter here: ${fullUrl}`);
            shareWaLinkBtn.href = `https://wa.me/?text=${waText}`;
        }
    }

    if (invitationGuestName) {
        invitationGuestName.addEventListener('input', updateGeneratedLink);
    }

    if (copyGenLinkBtn && generatedUrlInput) {
        copyGenLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(generatedUrlInput.value).then(() => {
                copyGenLinkBtn.textContent = '✓ Link Copied!';
                setTimeout(() => {
                    copyGenLinkBtn.textContent = '📋 Copy Link';
                }, 2500);
            });
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === locationModal) locationModal.classList.add('hidden-modal');
        if (e.target === calendarModal) calendarModal.classList.add('hidden-modal');
        if (e.target === passModal) passModal.classList.add('hidden-modal');
        if (e.target === organizerModal) organizerModal.classList.add('hidden-modal');
    });
});
