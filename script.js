/* ==========================================================================
   WILD GAMES NIGHT - COMPLETE ACCEPTANCE & GATE MANAGEMENT SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STATE MANAGEMENT & LOCAL STORAGE SEEDING ---
    const DEFAULT_GUESTS = [
        { id: 'g_1', name: 'Ibrahim Kamara', gender: 'boy', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:30', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved' },
        { id: 'g_2', name: 'Alhaji Bah', gender: 'boy', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:32', friendName: '', bottlePayment: 'Paid', checkIn: 'Checked In', checkInTime: '2026-08-13 20:12', approvalStatus: 'Approved' },
        { id: 'g_3', name: 'Mariama Kamara', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:40', friendName: 'Fatmata Conteh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved' },
        { id: 'g_4', name: 'Fatmata Conteh', gender: 'girl', rsvp: 'Guest Added', rsvpTime: '2026-08-13 14:42', friendName: '', isFriendOf: 'Mariama Kamara', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved' },
        { id: 'g_5', name: 'Kadiatu Bangura', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:45', friendName: '', bottlePayment: 'N/A', checkIn: 'Checked In', checkInTime: '2026-08-13 20:15', approvalStatus: 'Approved' },
        { id: 'g_6', name: 'Abdul Touray', gender: 'boy', rsvp: 'Pending', rsvpTime: '', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved' },
        { id: 'g_7', name: 'Mohamed Sesay', gender: 'boy', rsvp: 'Declined', rsvpTime: '2026-08-13 15:00', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved' },
        { id: 'g_8', name: 'Fatima Jalloh', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 15:10', friendName: 'Sarah Conteh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved' },
        { id: 'g_9', name: 'Sarah Conteh', gender: 'girl', rsvp: 'Guest Added', rsvpTime: '2026-08-13 15:10', friendName: '', isFriendOf: 'Fatima Jalloh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved' }
    ];

    const DEFAULT_CONFIG = {
        eventName: 'Games Night',
        eventVenue: 'Signal Inn, Old God Congo Cross',
        eventDate: '2026-07-31',
        eventTime: '20:00',
        eventDeadline: '21:30',
        manualLockdown: false,
        phoneFaisal: '23288098340',
        phoneDija: '23275119627',
        hostEmail: 'faisal-dija-wgn@example.com'
    };

    const DEFAULT_TEMPLATES = {
        boyLetter: `It is with great pleasure that we welcome you as one of the selected guests for Games Night.\n\nYour application has been reviewed, and we are delighted to inform you that you have officially earned your place at this exclusive gathering.\n\nPrepare yourself for an evening filled with exciting games, unforgettable moments, laughter, music, and new friendships.\n\nAll accepted male guests are required to purchase one bottle from the organizers at the gate for Le 150 upon arrival.`,
        girlLetter: `It is with great pleasure that we welcome you as one of the selected guests for Games Night.\n\nYour application has been reviewed, and we are delighted to inform you that you have officially earned your place at this exclusive gathering.\n\nPrepare yourself for an evening filled with exciting games, unforgettable moments, laughter, music, and new friendships.\n\nAs an accepted female guest, you may bring one female friend. Please enter her full name below in advance so we can approve her at the gate.`,
        boyWa: `🎉 INVITATION ACCEPTED! 🎉\n\nHi! I, [Name], officially ACCEPT the invitation for Games Night on Friday, 31 July at 8 PM, agree to the rules and will purchase my bottle for Le 150 at the gate! 🍾`,
        girlWa: `🎉 INVITATION ACCEPTED! 🎉\n\nHi! I, [Name], officially ACCEPT the invitation for Games Night on Friday, 31 July at 8 PM, agree to the rules and have registered my friend [Friend]! 💃`
    };

    // Load state from localStorage or seed defaults
    let guests = JSON.parse(localStorage.getItem('wgn_master_guests'));
    if (!guests || guests.length === 0) {
        guests = DEFAULT_GUESTS;
        localStorage.setItem('wgn_master_guests', JSON.stringify(guests));
    }

    let config = JSON.parse(localStorage.getItem('wgn_event_config'));
    if (!config) {
        config = DEFAULT_CONFIG;
        localStorage.setItem('wgn_event_config', JSON.stringify(config));
    }

    let templates = JSON.parse(localStorage.getItem('wgn_letter_templates'));
    if (!templates) {
        templates = DEFAULT_TEMPLATES;
        localStorage.setItem('wgn_letter_templates', JSON.stringify(templates));
    }

    // Save State Utility
    const saveState = () => {
        localStorage.setItem('wgn_master_guests', JSON.stringify(guests));
        localStorage.setItem('wgn_event_config', JSON.stringify(config));
        localStorage.setItem('wgn_letter_templates', JSON.stringify(templates));
    };

    // Activity Logger
    const logActivity = (message) => {
        let logs = JSON.parse(localStorage.getItem('wgn_activity_logs') || '[]');
        const time = new Date().toLocaleTimeString();
        logs.unshift(`[${time}] ${message}`);
        if (logs.length > 50) logs.pop();
        localStorage.setItem('wgn_activity_logs', JSON.stringify(logs));
        renderActivityLogs();
    };

    const renderActivityLogs = () => {
        const list = document.getElementById('activityLogList');
        if (!list) return;
        const logs = JSON.parse(localStorage.getItem('wgn_activity_logs') || '[]');
        if (logs.length === 0) {
            list.innerHTML = `<li class="log-empty">No activity logs recorded yet.</li>`;
        } else {
            list.innerHTML = logs.map(log => `<li>${log}</li>`).join('');
        }
    };


    // --- 2. GUEST LETTER VIEW PARSING ---
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check url mode transitions
    const isAdminUrl = urlParams.get('admin') === 'true' || urlParams.get('host') === 'true';
    const isGateUrl = urlParams.get('gate') === 'true';
    
    // Check Session Auth
    const isAuthorized = () => {
        return sessionStorage.getItem('wgn_admin_logged') === 'true';
    };

    const getGuestName = () => {
        let name = urlParams.get('name') || urlParams.get('guest');
        if (!name || !name.trim()) return 'Guest';
        return name.trim().replace(/\b\w/g, l => l.toUpperCase());
    };

    const getGuestGender = () => {
        return urlParams.get('gender') || 'boy';
    };

    const guestName = getGuestName();
    const guestGender = getGuestGender();

    // Populate Dynamic Guest Details on Parchment
    const guestNameDisplay = document.getElementById('guestNameDisplay');
    const passGuestName = document.getElementById('passGuestName');
    const dynamicLetterContent = document.getElementById('dynamicLetterContent');
    const genderSpecNote = document.getElementById('genderSpecNote');
    const friendRegistrationBlock = document.getElementById('friendRegistrationBlock');

    if (guestNameDisplay) guestNameDisplay.textContent = guestName;
    if (passGuestName) passGuestName.textContent = guestName;

    // Load custom letters based on gender
    if (dynamicLetterContent) {
        let letterTpl = guestGender === 'girl' ? templates.girlLetter : templates.boyLetter;
        // Replace paragraphs with markup
        const paragraphs = letterTpl.split('\n\n').map(p => `<p class="body-paragraph">${p.replace(/\n/g, '<br>')}</p>`).join('');
        dynamicLetterContent.innerHTML = paragraphs;
    }

    // Set Dynamic Warning/Notice labels on Parchment
    if (genderSpecNote) {
        if (guestGender === 'girl') {
            genderSpecNote.classList.add('note-girl');
            genderSpecNote.innerHTML = `✨ <strong>Ladies Guest Policy:</strong> You are welcome to register one female friend in advance. Her name will be added to the gate checklist.`;
            if (friendRegistrationBlock) friendRegistrationBlock.classList.remove('hidden-note');
        } else {
            genderSpecNote.classList.add('note-boy');
            genderSpecNote.innerHTML = `⚠️ <strong>Bottle Purchase Policy:</strong> All accepted male guests are required to purchase one bottle from the organizers at the gate for Le 150 upon arrival.`;
        }
    }

    // Load Event Details from Config
    const evtDateDisplay = document.getElementById('evtDateDisplay');
    const evtTimeDisplay = document.getElementById('evtTimeDisplay');
    const evtVenueDisplay = document.getElementById('evtVenueDisplay');

    if (evtDateDisplay) evtDateDisplay.textContent = new Date(config.eventDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (evtTimeDisplay) {
        const [hr, min] = config.eventTime.split(':');
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const hr12 = hr % 12 || 12;
        evtTimeDisplay.textContent = `${hr12}:${min} ${ampm} (Arrival Deadline ${config.eventDeadline} sharp)`;
    }
    if (evtVenueDisplay) evtVenueDisplay.textContent = config.eventVenue;


    // --- 3. ENCHANTED VOICE & WEB AUDIO SYNTHESIZER ---
    class MagicAudioEngine {
        constructor() {
            this.ctx = null;
            this.isMuted = false;
            this.isPlayingAmbient = false;
            this.ambientOscillators = [];
            this.masterGain = null;
            this.synthVoice = null;

            if ('speechSynthesis' in window) {
                window.speechSynthesis.onvoiceschanged = () => { this.loadVoice(); };
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
        }

        playMagicalChime() {
            if (!this.ctx || this.isMuted) return;
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
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
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
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


    // --- 4. CANVAS PARTICLE & CONFETTI ENGINE ---
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

    for (let i = 0; i < 50; i++) {
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
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < 20; i++) particles.push(new Particle(undefined, undefined, 'dust'));
    for (let i = 0; i < 15; i++) particles.push(new Particle(undefined, undefined, 'confetti'));

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


    // --- 5. SCENE TRANSITION & ENVELOPE OPENING ---
    const scene1 = document.getElementById('scene1');
    const scene3 = document.getElementById('scene3');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const waxSeal = document.getElementById('waxSeal');
    let isEnvelopeOpened = false;

    if (envelopeContainer) {
        envelopeContainer.addEventListener('click', () => {
            if (isEnvelopeOpened) return;
            isEnvelopeOpened = true;
            audioSystem.init();
            audioSystem.playSealCrack();
            if (waxSeal) waxSeal.classList.add('cracked');

            const rect = waxSeal.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

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
                    createSparkleBurst(window.innerWidth / 2, 200, 50);

                    // Dynamic greeting announcement based on gender
                    if (guestGender === 'girl') {
                        audioSystem.speak(`Congratulations ${guestName}! We are so excited to invite you to Games Night! Get ready for a wonderful evening.`);
                    } else {
                        audioSystem.speak(`Congratulations ${guestName}! You have been selected for Games Night. Remember, bring your bottle! No bottle, no entry.`);
                    }
                }, 800);
            }, 1200);
        });
    }


    // --- 6. EVENT COUNTDOWN CLOCK ---
    function updateCountdown() {
        const targetDate = new Date(`${config.eventDate}T${config.eventTime}:00`).getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;

        const cdDays = document.getElementById('cdDays');
        const cdHours = document.getElementById('cdHours');
        const cdMinutes = document.getElementById('cdMinutes');
        const cdSeconds = document.getElementById('cdSeconds');

        if (distance < 0 || isNaN(targetDate)) {
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
    setInterval(updateCountdown, 1000);


    // --- 7. AUTOMATIC GATE LOCKDOWN TRIGGER ---
    const checkGateLockdown = () => {
        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes();
        const currentTimeString = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        
        // Split deadline
        const [deadHr, deadMin] = config.eventDeadline.split(':');
        const deadlineTime = parseInt(deadHr) * 60 + parseInt(deadMin);
        const currentTime = hours * 60 + mins;

        // Is gate closed? (Clock exceeds 9:30 PM OR forced manually)
        const isClosed = (currentTime >= deadlineTime) || config.manualLockdown;

        const gateBadge = document.getElementById('gateStatusBadge');
        const dashStatus = document.getElementById('dash-gate-status');
        const clockLabel = document.getElementById('gateClock');

        if (clockLabel) {
            clockLabel.textContent = now.toTimeString().split(' ')[0];
        }

        if (isClosed) {
            if (gateBadge) {
                gateBadge.textContent = 'CLOSED 🔴';
                gateBadge.className = 'gate-status-badge closed';
            }
            if (dashStatus) {
                dashStatus.textContent = 'CLOSED';
                dashStatus.className = 'status-closed';
            }
        } else {
            if (gateBadge) {
                gateBadge.textContent = 'OPEN 🟢';
                gateBadge.className = 'gate-status-badge open';
            }
            if (dashStatus) {
                dashStatus.textContent = 'OPEN';
                dashStatus.className = 'status-open';
            }
        }
        return isClosed;
    };
    setInterval(checkGateLockdown, 1000);


    // --- 8. INSTANT EMAIL NOTIFICATION ALERTS (FormSubmit.co) ---
    const sendInstantNotification = async (subject, guestName, gender, details, extra = '') => {
        if (!config.hostEmail) return;
        try {
            await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(config.hostEmail)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: subject,
                    Guest_Name: guestName,
                    Category: gender === 'girl' ? 'Girls' : 'Boys',
                    RSVP_Status: 'Accepted & Confirmed',
                    Details: details,
                    Companion_Friend: extra || 'None',
                    Time_Confirmed: new Date().toLocaleString()
                })
            });
        } catch (e) {
            console.log('Notification delivery background error:', e);
        }
    };


    // --- 9. GUEST RSVP ACCEPTANCE ACTIONS (Parchment View) ---
    const acceptBtn = document.getElementById('acceptBtn');
    const acceptBtnText = document.getElementById('acceptBtnText');
    const parchmentLetter = document.getElementById('parchmentLetter');
    const confirmationBox = document.getElementById('confirmationBox');
    const rulesCheckbox = document.getElementById('rulesCheckbox');
    const agreementWarning = document.getElementById('agreementWarning');
    const agreementWrapper = document.getElementById('agreementWrapper');
    const confStatusMsg = document.getElementById('confStatusMsg');
    const friendNameInput = document.getElementById('friendNameInput');
    const waButtonsContainer = document.getElementById('waButtonsContainer');

    const getCompiledRsvpMessage = (friendName = '') => {
        let tpl = guestGender === 'girl' ? templates.girlWa : templates.boyWa;
        let msg = tpl.replace(/\[Name\]/gi, guestName);
        if (friendName) {
            msg = msg.replace(/\[Friend\]/gi, friendName);
        } else {
            msg = msg.replace(/\[Friend\]/gi, 'Not yet registered');
        }
        return msg;
    };

    const populateWaButtons = (friendName = '') => {
        if (!waButtonsContainer) return;
        const msg = encodeURIComponent(getCompiledRsvpMessage(friendName));
        
        waButtonsContainer.innerHTML = `
            <a class="wa-btn" href="https://wa.me/${config.phoneFaisal}?text=${msg}" target="_blank">
                💬 Send Confirmation to Faisal (${config.phoneFaisal})
            </a>
            <a class="wa-btn secondary-wa" href="https://wa.me/${config.phoneDija}?text=${msg}" target="_blank">
                💬 Send Confirmation to Dija (${config.phoneDija})
            </a>
        `;
    };

    if (friendNameInput) {
        friendNameInput.addEventListener('input', () => {
            populateWaButtons(friendNameInput.value.trim());
        });
    }

    if (acceptBtn) {
        // Init WA buttons on load
        populateWaButtons();

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
            
            // Speak voice confirmation
            if (guestGender === 'girl') {
                audioSystem.speak(`Attendance confirmed! We eagerly await your arrival, ${guestName}. Get ready to have a blast!`);
            } else {
                audioSystem.speak(`Attendance confirmed! We'll see you there, ${guestName}. Bring your bottle!`);
            }

            if (parchmentLetter) parchmentLetter.classList.add('glowing-accept');
            const rect = acceptBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

            acceptBtn.classList.add('accepted');
            if (acceptBtnText) acceptBtnText.textContent = '✓ Invitation Accepted!';

            // Process RSVP update in database
            let existingGuest = guests.find(g => g.name.toLowerCase() === guestName.toLowerCase());
            let friendVal = friendNameInput ? friendNameInput.value.trim() : '';
            
            if (existingGuest) {
                existingGuest.rsvp = 'Accepted';
                existingGuest.rsvpTime = new Date().toLocaleString();
                if (guestGender === 'girl' && friendVal) {
                    existingGuest.friendName = friendVal;
                }
            } else {
                // If not pre-created by host, add to list dynamically
                existingGuest = {
                    id: 'g_' + Math.random().toString(36).substr(2, 9),
                    name: guestName,
                    gender: guestGender,
                    rsvp: 'Accepted',
                    rsvpTime: new Date().toLocaleString(),
                    friendName: friendVal,
                    bottlePayment: guestGender === 'boy' ? 'Pending' : 'N/A',
                    checkIn: 'Not Checked In',
                    checkInTime: '',
                    approvalStatus: 'Approved'
                };
                guests.push(existingGuest);
            }

            // If a girl has registered a friend, create a companion entry for that friend
            if (guestGender === 'girl' && friendVal) {
                // Check if companion already exists
                let friendGuest = guests.find(g => g.isFriendOf === existingGuest.name);
                if (friendGuest) {
                    friendGuest.name = friendVal;
                } else {
                    guests.push({
                        id: 'f_' + Math.random().toString(36).substr(2, 9),
                        name: friendVal,
                        gender: 'girl',
                        rsvp: 'Guest Added',
                        rsvpTime: new Date().toLocaleString(),
                        friendName: '',
                        isFriendOf: existingGuest.name,
                        bottlePayment: 'N/A',
                        checkIn: 'Not Checked In',
                        checkInTime: '',
                        approvalStatus: 'Approved'
                    });
                }
                logActivity(`Girl friend registered: ${friendVal} (invited by ${guestName})`);
                sendInstantNotification(
                    `🎉 NEW GUEST ADDED: ${friendVal}`,
                    existingGuest.name,
                    'girl',
                    `Friend registered: ${friendVal}`,
                    friendVal
                );
            } else {
                logActivity(`Guest RSVP Accepted: ${guestName} (${guestGender === 'boy' ? 'Boy' : 'Girl'})`);
                sendInstantNotification(
                    `🎉 Games Night RSVP: ${guestName} Accepted`,
                    guestName,
                    guestGender,
                    guestGender === 'boy' ? 'Le 150 bottle payment required at gate' : 'Girl invite accepted'
                );
            }

            saveState();

            if (confirmationBox) {
                confirmationBox.classList.remove('hidden-confirmation');
                if (confStatusMsg) confStatusMsg.textContent = '✅ RSVP notification sent successfully!';
                confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Auto-redirect to WhatsApp after 2 seconds
            setTimeout(() => {
                const msg = encodeURIComponent(getCompiledRsvpMessage(friendVal));
                window.open(`https://wa.me/${config.phoneFaisal}?text=${msg}`, '_blank');
            }, 2000);
        });
    }

    if (rulesCheckbox) {
        rulesCheckbox.addEventListener('change', () => {
            if (rulesCheckbox.checked && agreementWarning) {
                agreementWarning.classList.add('hidden-warning');
            }
        });
    }


    // --- 10. ADMIN AUTHENTICATION AND OVERLAY PIN CONTROL ---
    const adminLoginOverlay = document.getElementById('adminLoginOverlay');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const submitPasswordBtn = document.getElementById('submitPasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    const organizerBtn = document.getElementById('organizerBtn');
    const adminScene = document.getElementById('adminScene');
    const gameIconsContainer = document.getElementById('gameIconsContainer');

    // Display Admin Console Button if admin=true
    if (isAdminUrl || isGateUrl) {
        if (organizerBtn) organizerBtn.classList.remove('hidden-admin-btn');
    }

    const showLogin = () => {
        if (adminLoginOverlay) {
            adminLoginOverlay.classList.remove('hidden-login');
            if (adminPasswordInput) adminPasswordInput.focus();
        }
    };

    const hideLogin = () => {
        if (adminLoginOverlay) adminLoginOverlay.classList.add('hidden-login');
        if (adminPasswordInput) adminPasswordInput.value = '';
        if (loginErrorMsg) loginErrorMsg.classList.add('hidden-msg');
    };

    if (organizerBtn) {
        organizerBtn.addEventListener('click', () => {
            if (isAuthorized()) {
                switchToAdminConsole();
            } else {
                showLogin();
            }
        });
    }

    // Secret crest triple-click access
    const crestLogo = document.getElementById('crestLogo');
    let crestClickCount = 0;
    let crestClickTimer = null;
    if (crestLogo) {
        crestLogo.addEventListener('click', () => {
            crestClickCount++;
            clearTimeout(crestClickTimer);
            crestClickTimer = setTimeout(() => { crestClickCount = 0; }, 1500);

            if (crestClickCount >= 3) {
                if (organizerBtn) organizerBtn.classList.remove('hidden-admin-btn');
                if (isAuthorized()) {
                    switchToAdminConsole();
                } else {
                    showLogin();
                }
                crestClickCount = 0;
            }
        });
    }

    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', hideLogin);
    }

    const verifyPIN = () => {
        const pin = adminPasswordInput ? adminPasswordInput.value.trim() : '';
        if (pin === '2026') {
            sessionStorage.setItem('wgn_admin_logged', 'true');
            hideLogin();
            switchToAdminConsole();
        } else {
            if (loginErrorMsg) loginErrorMsg.classList.remove('hidden-msg');
            if (adminPasswordInput) {
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
        }
    };

    if (submitPasswordBtn) {
        submitPasswordBtn.addEventListener('click', verifyPIN);
    }
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyPIN();
        });
    }

    // Switch views to Admin Console
    function switchToAdminConsole() {
        // Hide normal envelope/invitation scenes
        if (scene1) scene1.classList.add('hidden-scene');
        if (scene3) scene3.classList.add('hidden-scene');
        if (gameIconsContainer) gameIconsContainer.style.display = 'none';

        // Reveal Admin scene
        if (adminScene) adminScene.classList.remove('hidden-scene');
        
        // Render Dashboard Stats and lists
        updateDashboardStats();
        renderMasterGuestList();
        renderActivityLogs();
        loadTemplatesToTextareas();
        loadSettingsInputs();
        checkGateLockdown();
    }

    // Logout
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('wgn_admin_logged');
            window.location.reload();
        });
    }

    // Auto-enter console if authorized on load
    if (isAuthorized() && (isAdminUrl || isGateUrl)) {
        switchToAdminConsole();
    }


    // --- 11. ADMIN DASHBOARD STATS CALCULATION ---
    function updateDashboardStats() {
        const totalInvites = guests.length;
        const accepted = guests.filter(g => g.rsvp === 'Accepted').length;
        const boys = guests.filter(g => g.gender === 'boy' && g.rsvp === 'Accepted').length;
        const girls = guests.filter(g => g.gender === 'girl' && g.rsvp === 'Accepted').length;
        const friends = guests.filter(g => g.rsvp === 'Guest Added').length;
        const pending = guests.filter(g => g.rsvp === 'Pending').length;
        const declined = guests.filter(g => g.rsvp === 'Declined').length;
        const checkedIn = guests.filter(g => g.checkIn === 'Checked In').length;

        // Populate elements
        const statTotalInv = document.getElementById('stat-total-invites');
        const statTotalAcc = document.getElementById('stat-total-accepted');
        const statBoysAcc = document.getElementById('stat-boys-accepted');
        const statGirlsAcc = document.getElementById('stat-girls-accepted');
        const statGuestsAdd = document.getElementById('stat-guests-added');
        const statPending = document.getElementById('stat-pending');
        const statChecked = document.getElementById('stat-checked-in');
        const statDeclined = document.getElementById('stat-declined');

        if (statTotalInv) statTotalInv.textContent = totalInvites;
        if (statTotalAcc) statTotalAcc.textContent = accepted;
        if (statBoysAcc) statBoysAcc.textContent = boys;
        if (statGirlsAcc) statGirlsAcc.textContent = girls;
        if (statGuestsAdd) statGuestsAdd.textContent = friends;
        if (statPending) statPending.textContent = pending;
        if (statChecked) statChecked.textContent = checkedIn;
        if (statDeclined) statDeclined.textContent = declined;

        // Set static overview info
        const dashVenue = document.getElementById('dash-venue');
        const dashDate = document.getElementById('dash-date');
        if (dashVenue) dashVenue.textContent = config.eventVenue;
        if (dashDate) dashDate.textContent = config.eventDate;
    }


    // --- 12. TAB STATE SELECTION NAVIGATOR ---
    const tabButtons = document.querySelectorAll('.tab-nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Toggle active nav styling
            tabButtons.forEach(b => b.classList.remove('active-tab'));
            btn.classList.add('active-tab');

            // Toggle active content pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active-pane');
                if (pane.getAttribute('id') === `tab-${targetTab}`) {
                    pane.classList.add('active-pane');
                }
            });

            // Trigger log updates or render
            if (targetTab === 'guestlist') renderMasterGuestList();
            if (targetTab === 'dashboard') updateDashboardStats();
        });
    });


    // --- 13. MASTER GUEST LIST CRUD OPERATIONS & EDIT MODAL ---
    const guestSearchInput = document.getElementById('guestSearchInput');
    const guestFilterGender = document.getElementById('guestFilterGender');
    const guestFilterStatus = document.getElementById('guestFilterStatus');
    const masterGuestTableBody = document.getElementById('masterGuestTableBody');

    const addGuestBtn = document.getElementById('addGuestBtn');
    const guestEditModal = document.getElementById('guestEditModal');
    const closeGuestModal = document.getElementById('closeGuestModal');
    const saveGuestDetailsBtn = document.getElementById('saveGuestDetailsBtn');

    // Input fields inside modal
    const editGuestName = document.getElementById('editGuestName');
    const editGuestRsvp = document.getElementById('editGuestRsvp');
    const editGuestFriend = document.getElementById('editGuestFriend');
    const editGuestBottle = document.getElementById('editGuestBottle');
    const editGuestCheckin = document.getElementById('editGuestCheckin');
    const editFriendNameGroup = document.getElementById('editFriendNameGroup');
    const editBottlePaymentGroup = document.getElementById('editBottlePaymentGroup');
    const modalLinkBox = document.getElementById('modalLinkBox');
    const modalGeneratedUrl = document.getElementById('modalGeneratedUrl');
    const modalCopyLinkBtn = document.getElementById('modalCopyLinkBtn');
    const modalShareWaBtn = document.getElementById('modalShareWaBtn');

    let currentEditingGuestId = null;

    // Helper to toggle groups based on selected gender
    const toggleModalFieldGroups = (gender) => {
        if (gender === 'girl') {
            if (editFriendNameGroup) editFriendNameGroup.style.display = 'block';
            if (editBottlePaymentGroup) editBottlePaymentGroup.style.display = 'none';
        } else {
            if (editFriendNameGroup) editFriendNameGroup.style.display = 'none';
            if (editBottlePaymentGroup) editBottlePaymentGroup.style.display = 'block';
        }
    };

    const getSelectedGenderFromRadio = (radioName) => {
        const radios = document.getElementsByName(radioName);
        let val = 'boy';
        radios.forEach(r => { if (r.checked) val = r.value; });
        return val;
    };

    const setSelectedRadioByValue = (radioName, value) => {
        const radios = document.getElementsByName(radioName);
        radios.forEach(r => { r.checked = (r.value === value); });
    };

    // Radios change listener
    document.getElementsByName('editGuestGender').forEach(radio => {
        radio.addEventListener('change', () => {
            toggleModalFieldGroups(radio.value);
            updateModalGeneratedLink();
        });
    });

    const openGuestModal = (guest = null) => {
        if (guestEditModal) guestEditModal.classList.remove('hidden-modal');
        if (guest) {
            document.getElementById('guestModalTitle').textContent = 'Edit Guest Details';
            currentEditingGuestId = guest.id;
            if (editGuestName) editGuestName.value = guest.name;
            setSelectedRadioByValue('editGuestGender', guest.gender);
            if (editGuestRsvp) editGuestRsvp.value = guest.rsvp;
            if (editGuestFriend) editGuestFriend.value = guest.friendName || '';
            if (editGuestBottle) editGuestBottle.value = guest.bottlePayment || 'Pending';
            if (editGuestCheckin) editGuestCheckin.value = guest.checkIn || 'Not Checked In';
            toggleModalFieldGroups(guest.gender);
            updateModalGeneratedLink();
        } else {
            document.getElementById('guestModalTitle').textContent = 'Add New Guest';
            currentEditingGuestId = null;
            if (editGuestName) editGuestName.value = '';
            setSelectedRadioByValue('editGuestGender', 'boy');
            if (editGuestRsvp) editGuestRsvp.value = 'Pending';
            if (editGuestFriend) editGuestFriend.value = '';
            if (editGuestBottle) editGuestBottle.value = 'Pending';
            if (editGuestCheckin) editGuestCheckin.value = 'Not Checked In';
            toggleModalFieldGroups('boy');
            if (modalLinkBox) modalLinkBox.classList.add('hidden-box');
        }
    };

    const updateModalGeneratedLink = () => {
        if (!editGuestName) return;
        const nameVal = editGuestName.value.trim();
        if (!nameVal) {
            if (modalLinkBox) modalLinkBox.classList.add('hidden-box');
            return;
        }

        const gender = getSelectedGenderFromRadio('editGuestGender');
        const baseUrl = window.location.origin + window.location.pathname;
        let tpl = gender === 'girl' ? templates.girlWa : templates.boyWa;
        let rsvpTpl = gender === 'girl' ? templates.girlLetter : templates.boyLetter;

        let fullUrl = `${baseUrl}?name=${encodeURIComponent(nameVal)}&gender=${gender}`;
        fullUrl += `&rsvp=${encodeURIComponent(tpl)}`;

        if (modalGeneratedUrl) modalGeneratedUrl.value = fullUrl;
        if (modalLinkBox) modalLinkBox.classList.remove('hidden-box');

        if (modalShareWaBtn) {
            const waText = encodeURIComponent(`Hey ${nameVal}! 🎉 Your Games Night letter of approval has arrived!\n\nOpen your letter here: ${fullUrl}`);
            modalShareWaBtn.href = `https://wa.me/?text=${waText}`;
        }
    };

    if (editGuestName) {
        editGuestName.addEventListener('input', updateModalGeneratedLink);
    }

    if (modalCopyLinkBtn && modalGeneratedUrl) {
        modalCopyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(modalGeneratedUrl.value).then(() => {
                modalCopyLinkBtn.textContent = '✓ Copied!';
                setTimeout(() => { modalCopyLinkBtn.textContent = '📋 Copy Link'; }, 2000);
            });
        });
    }

    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', () => openGuestModal());
    }
    if (closeGuestModal) {
        closeGuestModal.addEventListener('click', () => {
            if (guestEditModal) guestEditModal.classList.add('hidden-modal');
        });
    }

    if (saveGuestDetailsBtn) {
        saveGuestDetailsBtn.addEventListener('click', () => {
            const nameVal = editGuestName ? editGuestName.value.trim() : '';
            if (!nameVal) {
                alert('Please enter a valid guest name.');
                return;
            }

            const gender = getSelectedGenderFromRadio('editGuestGender');
            const rsvp = editGuestRsvp ? editGuestRsvp.value : 'Pending';
            const friendName = editGuestFriend ? editGuestFriend.value.trim() : '';
            const bottle = editGuestBottle ? editGuestBottle.value : 'N/A';
            const checkin = editGuestCheckin ? editGuestCheckin.value : 'Not Checked In';

            if (currentEditingGuestId) {
                // Edit mode
                const guest = guests.find(g => g.id === currentEditingGuestId);
                if (guest) {
                    const prevName = guest.name;
                    guest.name = nameVal;
                    guest.gender = gender;
                    guest.rsvp = rsvp;
                    guest.friendName = gender === 'girl' ? friendName : '';
                    guest.bottlePayment = gender === 'boy' ? bottle : 'N/A';
                    guest.checkIn = checkin;
                    if (checkin === 'Checked In' && !guest.checkInTime) {
                        guest.checkInTime = new Date().toLocaleTimeString();
                    }

                    // Sync companion friend record if applicable
                    if (gender === 'girl' && friendName) {
                        let comp = guests.find(g => g.isFriendOf === prevName);
                        if (comp) {
                            comp.name = friendName;
                            comp.isFriendOf = nameVal;
                        } else {
                            guests.push({
                                id: 'f_' + Math.random().toString(36).substr(2, 9),
                                name: friendName,
                                gender: 'girl',
                                rsvp: 'Guest Added',
                                rsvpTime: new Date().toLocaleString(),
                                friendName: '',
                                isFriendOf: nameVal,
                                bottlePayment: 'N/A',
                                checkIn: 'Not Checked In',
                                checkInTime: '',
                                approvalStatus: 'Approved'
                            });
                        }
                    }
                    logActivity(`Edited guest record: ${nameVal}`);
                }
            } else {
                // Add mode
                const newGuest = {
                    id: 'g_' + Math.random().toString(36).substr(2, 9),
                    name: nameVal,
                    gender: gender,
                    rsvp: rsvp,
                    rsvpTime: rsvp !== 'Pending' ? new Date().toLocaleString() : '',
                    friendName: gender === 'girl' ? friendName : '',
                    bottlePayment: gender === 'boy' ? bottle : 'N/A',
                    checkIn: checkin,
                    checkInTime: checkin === 'Checked In' ? new Date().toLocaleTimeString() : '',
                    approvalStatus: 'Approved'
                };
                guests.push(newGuest);

                // Add companion if registered in advance
                if (gender === 'girl' && friendName) {
                    guests.push({
                        id: 'f_' + Math.random().toString(36).substr(2, 9),
                        name: friendName,
                        gender: 'girl',
                        rsvp: 'Guest Added',
                        rsvpTime: new Date().toLocaleString(),
                        friendName: '',
                        isFriendOf: nameVal,
                        bottlePayment: 'N/A',
                        checkIn: 'Not Checked In',
                        checkInTime: '',
                        approvalStatus: 'Approved'
                    });
                }
                logActivity(`Manually added guest: ${nameVal}`);
            }

            saveState();
            if (guestEditModal) guestEditModal.classList.add('hidden-modal');
            renderMasterGuestList();
            updateDashboardStats();
        });
    }

    // Render Master Guest Table
    function renderMasterGuestList() {
        if (!masterGuestTableBody) return;

        const q = guestSearchInput ? guestSearchInput.value.toLowerCase().trim() : '';
        const filterGender = guestFilterGender ? guestFilterGender.value : 'all';
        const filterStatus = guestFilterStatus ? guestFilterStatus.value : 'all';

        // Filter guest data
        const filtered = guests.filter(g => {
            const matchesSearch = g.name.toLowerCase().includes(q) || (g.friendName && g.friendName.toLowerCase().includes(q));
            const matchesGender = filterGender === 'all' || g.gender === filterGender;
            
            let matchesStatus = true;
            if (filterStatus !== 'all') {
                if (filterStatus === 'Guest Added') {
                    matchesStatus = g.rsvp === 'Guest Added';
                } else if (filterStatus === 'Checked In') {
                    matchesStatus = g.checkIn === 'Checked In';
                } else if (filterStatus === 'Not Checked In') {
                    matchesStatus = g.checkIn === 'Not Checked In';
                } else {
                    matchesStatus = g.rsvp === filterStatus;
                }
            }
            return matchesSearch && matchesGender && matchesStatus;
        });

        if (filtered.length === 0) {
            masterGuestTableBody.innerHTML = `<tr><td colspan="7" class="empty-log" style="text-align:center;">No guests match your criteria.</td></tr>`;
            return;
        }

        masterGuestTableBody.innerHTML = filtered.map(g => {
            const bottleLabel = g.gender === 'boy' ? (g.bottlePayment === 'Paid' ? 'Paid Le 150 🟢' : 'Pending Le 150 🟡') : 'N/A';
            const checkinTime = g.checkInTime ? ` (${g.checkInTime})` : '';
            const statusClass = g.rsvp;
            
            return `
                <tr>
                    <td><strong>${g.name}</strong> ${g.isFriendOf ? `<span style="font-size:0.75rem; color:#888;">(Friend of ${g.isFriendOf})</span>` : ''}</td>
                    <td>${g.gender === 'girl' ? 'Girl 💃' : 'Boy 🍾'}</td>
                    <td><span class="status-badge ${statusClass}">${g.rsvp}</span></td>
                    <td>${g.gender === 'girl' ? (g.friendName || 'None') : 'N/A'}</td>
                    <td>${bottleLabel}</td>
                    <td><span class="gate-badge ${g.checkIn === 'Checked In' ? 'checked-in' : (g.checkIn === 'Rejected at Gate' ? 'rejected' : 'pending')}">${g.checkIn}${checkinTime}</span></td>
                    <td>
                        <button class="action-icon-btn edit-guest" data-id="${g.id}" title="Edit Guest Details">✏️</button>
                        <button class="action-icon-btn delete-guest" data-id="${g.id}" title="Delete Record">🗑️</button>
                        <button class="action-icon-btn copy-link" data-id="${g.id}" title="Copy Invite Link">🔗</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Wire Action buttons in table
        document.querySelectorAll('.edit-guest').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const guest = guests.find(g => g.id === id);
                if (guest) openGuestModal(guest);
            });
        });

        document.querySelectorAll('.delete-guest').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const guest = guests.find(g => g.id === id);
                if (guest && confirm(`Are you sure you want to delete ${guest.name}?`)) {
                    // If girl, also delete registered companion
                    if (guest.gender === 'girl' && guest.friendName) {
                        guests = guests.filter(g => g.isFriendOf !== guest.name);
                    }
                    guests = guests.filter(g => g.id !== id);
                    saveState();
                    renderMasterGuestList();
                    updateDashboardStats();
                    logActivity(`Deleted guest record: ${guest.name}`);
                }
            });
        });

        document.querySelectorAll('.copy-link').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const guest = guests.find(g => g.id === id);
                if (guest) {
                    const baseUrl = window.location.origin + window.location.pathname;
                    let tpl = guest.gender === 'girl' ? templates.girlWa : templates.boyWa;
                    let fullUrl = `${baseUrl}?name=${encodeURIComponent(guest.name)}&gender=${guest.gender}`;
                    fullUrl += `&rsvp=${encodeURIComponent(tpl)}`;
                    
                    navigator.clipboard.writeText(fullUrl).then(() => {
                        alert(`Invitation link copied for ${guest.name}!`);
                    });
                }
            });
        });
    }

    if (guestSearchInput) guestSearchInput.addEventListener('input', renderMasterGuestList);
    if (guestFilterGender) guestFilterGender.addEventListener('change', renderMasterGuestList);
    if (guestFilterStatus) guestFilterStatus.addEventListener('change', renderMasterGuestList);


    // --- 14. GATE MANAGER CHECK-IN SCREEN LOGIC ---
    const gateSearchBox = document.getElementById('gateSearchBox');
    const gateResultsContainer = document.getElementById('gateResultsContainer');

    function renderGateCheckin() {
        if (!gateResultsContainer) return;
        const q = gateSearchBox ? gateSearchBox.value.toLowerCase().trim() : '';

        if (!q) {
            gateResultsContainer.innerHTML = `<div class="gate-no-results">Enter guest name above to verify entry approval.</div>`;
            return;
        }

        // Search in master guests (matching names or companion friend names)
        const found = guests.filter(g => g.name.toLowerCase().includes(q) || (g.friendName && g.friendName.toLowerCase().includes(q)));

        if (found.length === 0) {
            gateResultsContainer.innerHTML = `
                <div class="gate-checkin-card" style="border-color:#e53e3e; text-align:center;">
                    <span style="font-size:2.5rem;">🚨</span>
                    <h3 style="color:#f56565; margin:10px 0;">NOT APPROVED</h3>
                    <p>This name is not on the approved Games Night guest list.</p>
                    <p style="font-size:0.85rem; color:#a0aec0; margin-top:10px;">Entry is forbidden. Contact an administrator to manually authorize access.</p>
                </div>
            `;
            return;
        }

        const isGateClosed = checkGateLockdown();

        gateResultsContainer.innerHTML = found.map(g => {
            const checkInDisabled = (g.gender === 'boy' && g.bottlePayment !== 'Paid') || g.checkIn === 'Checked In';
            const showClosedNotice = isGateClosed && g.checkIn !== 'Checked In';
            const roleLabel = g.gender === 'boy' ? 'Boy (Male)' : (g.isFriendOf ? `Friend of ${g.isFriendOf}` : 'Girl (Female)');
            const statusLabel = g.checkIn === 'Checked In' ? 'Checked In' : (g.rsvp === 'Declined' ? 'Declined' : 'Approved');
            
            return `
                <div class="gate-checkin-card" style="${g.checkIn === 'Checked In' ? 'border-color:#319795;' : ''}">
                    <div class="gate-card-header">
                        <div>
                            <h4 class="gate-guest-name">${g.name}</h4>
                            <span class="gate-guest-role">${roleLabel}</span>
                        </div>
                        <span class="gate-badge ${g.checkIn === 'Checked In' ? 'checked-in' : (g.rsvp === 'Declined' ? 'rejected' : 'approved')}">${statusLabel}</span>
                    </div>
                    
                    <div class="gate-card-body">
                        <p><strong>RSVP Response:</strong> ${g.rsvp}</p>
                        ${g.gender === 'girl' ? `<p><strong>Registered Companion Friend:</strong> ${g.friendName || 'None'}</p>` : ''}
                        ${g.isFriendOf ? `<p><strong>Invited As Guest Of:</strong> ${g.isFriendOf}</p>` : ''}
                        ${g.gender === 'boy' ? `<p><strong>Bottle Requirement:</strong> Le 150 bottle purchased at gate</p>` : ''}
                        ${g.gender === 'boy' ? `<p><strong>Bottle Payment Status:</strong> <span style="font-weight:bold; color:${g.bottlePayment === 'Paid' ? '#48bb78' : '#ecc94b'}">${g.bottlePayment.toUpperCase()}</span></p>` : ''}
                        <p><strong>Check-in status:</strong> ${g.checkIn} ${g.checkInTime ? `at ${g.checkInTime}` : ''}</p>
                    </div>

                    ${showClosedNotice ? `
                        <div class="gate-closed-warning">
                            THE GATE IS NOW CLOSED. NO MORE ENTRIES PERMITTED.
                        </div>
                    ` : ''}

                    <div class="gate-actions-row">
                        <!-- Bottle payment action (Boys only) -->
                        ${g.gender === 'boy' && g.bottlePayment !== 'Paid' ? `
                            <button class="gate-action-btn pay-btn mark-paid-btn" data-id="${g.id}">
                                💰 COLLECT Le 150 & MARK BOTTLE PAID
                            </button>
                        ` : ''}

                        <!-- Check-in actions -->
                        ${g.checkIn === 'Checked In' ? `
                            <button class="gate-action-btn disabled-btn" disabled>
                                🟢 ALREADY CHECKED IN (at ${g.checkInTime})
                            </button>
                        ` : (showClosedNotice ? `
                            <button class="gate-action-btn override-btn admin-override-btn" data-id="${g.id}">
                                ⚠️ ADMIN OVERRIDE CHECK-IN
                            </button>
                        ` : `
                            <button class="gate-action-btn checkin checkin-btn" data-id="${g.id}" ${checkInDisabled ? 'disabled' : ''}>
                                🚪 CONFIRM ENTRY & CHECK IN
                            </button>
                        `)}
                    </div>
                </div>
            `;
        }).join('');

        // Wire checking buttons
        document.querySelectorAll('.mark-paid-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const guest = guests.find(g => g.id === id);
                if (guest) {
                    guest.bottlePayment = 'Paid';
                    saveState();
                    renderGateCheckin();
                    logActivity(`Collected Le 150 from ${guest.name}. Bottle payment marked completed.`);
                }
            });
        });

        document.querySelectorAll('.checkin-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const guest = guests.find(g => g.id === id);
                if (guest) {
                    guest.checkIn = 'Checked In';
                    guest.checkInTime = new Date().toLocaleTimeString();
                    saveState();
                    renderGateCheckin();
                    updateDashboardStats();
                    logActivity(`Checked in guest: ${guest.name} at gate`);
                }
            });
        });

        document.querySelectorAll('.admin-override-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const guest = guests.find(g => g.id === id);
                if (guest && confirm(`ADMIN ACCESS OVERRIDE: Allow checked-in access to ${guest.name} after gate deadline?`)) {
                    guest.checkIn = 'Checked In';
                    guest.checkInTime = new Date().toLocaleTimeString();
                    saveState();
                    renderGateCheckin();
                    updateDashboardStats();
                    logActivity(`ADMIN OVERRIDE: Checked in guest: ${guest.name} after lockdown`);
                }
            });
        });
    }

    if (gateSearchBox) gateSearchBox.addEventListener('input', renderGateCheckin);


    // --- 15. LETTER TEMPLATES CONFIG EDITOR ---
    const tplBoyLetter = document.getElementById('tplBoyLetter');
    const tplBoyWa = document.getElementById('tplBoyWa');
    const tplGirlLetter = document.getElementById('tplGirlLetter');
    const tplGirlWa = document.getElementById('tplGirlWa');
    const saveTemplatesBtn = document.getElementById('saveTemplatesBtn');

    function loadTemplatesToTextareas() {
        if (tplBoyLetter) tplBoyLetter.value = templates.boyLetter;
        if (tplBoyWa) tplBoyWa.value = templates.boyWa;
        if (tplGirlLetter) tplGirlLetter.value = templates.girlLetter;
        if (tplGirlWa) tplGirlWa.value = templates.girlWa;
    }

    if (saveTemplatesBtn) {
        saveTemplatesBtn.addEventListener('click', () => {
            templates.boyLetter = tplBoyLetter.value;
            templates.boyWa = tplBoyWa.value;
            templates.girlLetter = tplGirlLetter.value;
            templates.girlWa = tplGirlWa.value;
            saveState();
            alert('Acceptance and WhatsApp message templates updated successfully!');
            logActivity('Organizer modified invitation templates.');
        });
    }


    // --- 16. EVENT CONTROL SETTINGS ---
    const cfgPhoneFaisal = document.getElementById('cfgPhoneFaisal');
    const cfgPhoneDija = document.getElementById('cfgPhoneDija');
    const cfgHostEmail = document.getElementById('cfgHostEmail');
    const cfgEvtDate = document.getElementById('cfgEvtDate');
    const cfgEvtTime = document.getElementById('cfgEvtTime');
    const cfgEvtDeadline = document.getElementById('cfgEvtDeadline');
    const cfgManualLockdown = document.getElementById('cfgManualLockdown');

    function loadSettingsInputs() {
        if (cfgPhoneFaisal) cfgPhoneFaisal.value = config.phoneFaisal;
        if (cfgPhoneDija) cfgPhoneDija.value = config.phoneDija;
        if (cfgHostEmail) cfgHostEmail.value = config.hostEmail;
        if (cfgEvtDate) cfgEvtDate.value = config.eventDate;
        if (cfgEvtTime) cfgEvtTime.value = config.eventTime;
        if (cfgEvtDeadline) cfgEvtDeadline.value = config.eventDeadline;
        if (cfgManualLockdown) cfgManualLockdown.checked = config.manualLockdown;
    }

    const saveSettings = () => {
        if (cfgPhoneFaisal) config.phoneFaisal = cfgPhoneFaisal.value.trim();
        if (cfgPhoneDija) config.phoneDija = cfgPhoneDija.value.trim();
        if (cfgHostEmail) config.hostEmail = cfgHostEmail.value.trim();
        if (cfgEvtDate) config.eventDate = cfgEvtDate.value;
        if (cfgEvtTime) config.eventTime = cfgEvtTime.value;
        if (cfgEvtDeadline) config.eventDeadline = cfgEvtDeadline.value;
        if (cfgManualLockdown) config.manualLockdown = cfgManualLockdown.checked;
        saveState();
    };

    [cfgPhoneFaisal, cfgPhoneDija, cfgHostEmail, cfgEvtDate, cfgEvtTime, cfgEvtDeadline].forEach(el => {
        if (el) el.addEventListener('change', saveSettings);
    });
    if (cfgManualLockdown) {
        cfgManualLockdown.addEventListener('change', () => {
            saveSettings();
            checkGateLockdown();
            logActivity(`Organizer manually set Gate lockdown: ${config.manualLockdown ? 'CLOSED' : 'OPEN'}`);
        });
    }

    // Seed Data Controls
    const btnSeedDemoData = document.getElementById('btnSeedDemoData');
    if (btnSeedDemoData) {
        btnSeedDemoData.addEventListener('click', () => {
            if (confirm('This will wipe all existing guests and reset to the 9 demo registrations. Continue?')) {
                guests = DEFAULT_GUESTS;
                config = DEFAULT_CONFIG;
                templates = DEFAULT_TEMPLATES;
                localStorage.setItem('wgn_activity_logs', '[]');
                saveState();
                logActivity('Database initialized and seeded with demo data.');
                switchToAdminConsole();
                alert('Database reset completed!');
            }
        });
    }

    const btnClearDatabase = document.getElementById('btnClearDatabase');
    if (btnClearDatabase) {
        btnClearDatabase.addEventListener('click', () => {
            if (confirm('🚨 CRITICAL WARNING: You are about to erase the ENTIRE guest registry! This cannot be undone. Clear?')) {
                guests = [];
                localStorage.setItem('wgn_activity_logs', '[]');
                saveState();
                logActivity('Cleared guest records.');
                switchToAdminConsole();
                alert('All guest records deleted.');
            }
        });
    }


    // --- 17. REMINDER MESSAGES INTERACTION ---
    const reminderMsgTpl = document.getElementById('reminderMsgTpl');
    document.querySelectorAll('.send-rem-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const recipientGroup = btn.getAttribute('data-recipient');
            const reminderText = reminderMsgTpl ? reminderMsgTpl.value.trim() : '';

            let targets = [];
            if (recipientGroup === 'all') {
                targets = guests.filter(g => g.rsvp === 'Accepted');
            } else if (recipientGroup === 'boys') {
                targets = guests.filter(g => g.gender === 'boy' && g.rsvp === 'Accepted');
            } else if (recipientGroup === 'girls') {
                targets = guests.filter(g => g.gender === 'girl' && g.rsvp === 'Accepted');
            } else if (recipientGroup === 'not-checked-in') {
                targets = guests.filter(g => g.rsvp === 'Accepted' && g.checkIn !== 'Checked In');
            }

            if (targets.length === 0) {
                alert('No accepted guests match the selected filter to send reminders.');
                return;
            }

            // In a production app, this iterates and fires API alerts. Let's simulate.
            const names = targets.map(t => t.name).join(', ');
            alert(`📢 REMINDERS DISPATCHED!\n\nTarget Group: ${recipientGroup.toUpperCase()}\nTotal Recipients: ${targets.length}\nRecipients: ${names}\n\nMessage: "${reminderText}"`);
            logActivity(`Dispatched bulk reminders to ${targets.length} guests (${recipientGroup} category).`);
        });
    });


    // --- 18. MODALS (LOCATION, CALENDAR, SHARE PASS) ---
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
            const title = encodeURIComponent(config.eventName);
            const details = encodeURIComponent(`You are cordially invited to ${config.eventName}. Verification at gate strictly enforced!`);
            const locStr = encodeURIComponent(config.eventVenue);
            const dates = '20260731T200000Z/20260801T040000Z';
            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${locStr}&dates=${dates}`;
            window.open(gCalUrl, '_blank');
        });
    }

    const icsCalBtn = document.getElementById('icsCalBtn');
    if (icsCalBtn) {
        icsCalBtn.addEventListener('click', () => {
            const icsData = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                `SUMMARY:${config.eventName}`,
                `DESCRIPTION:Wild Games Night. Gates close at 9:30 PM sharp!`,
                `LOCATION:${config.eventVenue}`,
                'DTSTART:20260731T200000Z',
                'DTEND:20260801T040000Z',
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'Games_Night_Invitation.ics');
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
                setTimeout(() => { copyLinkBtn.textContent = '🔗 Copy Invitation Link'; }, 3000);
            }).catch(() => {
                alert('Invitation URL: ' + currentUrl);
            });
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === locationModal) locationModal.classList.add('hidden-modal');
        if (e.target === calendarModal) calendarModal.classList.add('hidden-modal');
        if (e.target === passModal) passModal.classList.add('hidden-modal');
        if (e.target === guestEditModal) guestEditModal.classList.add('hidden-modal');
    });

});
