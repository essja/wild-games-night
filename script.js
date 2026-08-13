/* ==========================================================================
   WILD GAMES NIGHT - COMPLETE ACCEPTANCE & GATE MANAGEMENT SYSTEM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STATE MANAGEMENT & LOCAL STORAGE SEEDING ---
    const DEFAULT_GUESTS = [
        { id: 'g_1', guest_id: 'G-001', name: 'Ibrahim Kamara', phone_number: '076123456', email: 'ibrahim@example.com', gender: 'boy', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:30', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:30', registered_at: '2026-08-13 14:30', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:31' },
        { id: 'g_2', guest_id: 'G-002', name: 'Alhaji Bah', phone_number: '077987654', email: 'alhaj@example.com', gender: 'boy', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:32', friendName: '', bottlePayment: 'Paid', checkIn: 'Checked In', checkInTime: '2026-08-13 20:12', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:32', registered_at: '2026-08-13 14:32', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:33' },
        { id: 'g_3', guest_id: 'G-003', name: 'Mariama Kamara', phone_number: '078555444', email: 'mariama@example.com', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:40', friendName: 'Fatmata Conteh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:40', registered_at: '2026-08-13 14:40', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:41' },
        { id: 'g_4', guest_id: 'G-004', name: 'Fatmata Conteh', phone_number: '079666777', email: 'fatmata@example.com', gender: 'girl', rsvp: 'Guest Added', rsvpTime: '2026-08-13 14:42', friendName: '', isFriendOf: 'Mariama Kamara', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:42', registered_at: '2026-08-13 14:42', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:43' },
        { id: 'g_5', guest_id: 'G-005', name: 'Kadiatu Bangura', phone_number: '075333222', email: 'kadiatu@example.com', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:45', friendName: '', bottlePayment: 'N/A', checkIn: 'Checked In', checkInTime: '2026-08-13 20:15', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:45', registered_at: '2026-08-13 14:45', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:46' },
        { id: 'g_6', guest_id: 'G-006', name: 'Abdul Touray', phone_number: '076444888', email: 'abdul@example.com', gender: 'boy', rsvp: 'Pending', rsvpTime: '', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'No', terms_version: '', terms_accepted_at: '', registered_at: '', sms_status: 'Pending', sms_sent_at: '' },
        { id: 'g_7', guest_id: 'G-007', name: 'Mohamed Sesay', phone_number: '077222111', email: 'mohamed@example.com', gender: 'boy', rsvp: 'Declined', rsvpTime: '2026-08-13 15:00', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'No', terms_version: '', terms_accepted_at: '', registered_at: '', sms_status: 'Failed', sms_sent_at: '' },
        { id: 'g_8', guest_id: 'G-008', name: 'Fatima Jalloh', phone_number: '078111999', email: 'fatima@example.com', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 15:10', friendName: 'Sarah Conteh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 15:10', registered_at: '2026-08-13 15:10', sms_status: 'Sent', sms_sent_at: '2026-08-13 15:11' },
        { id: 'g_9', guest_id: 'G-009', name: 'Sarah Conteh', phone_number: '079222888', email: 'sarah.c@example.com', gender: 'girl', rsvp: 'Guest Added', rsvpTime: '2026-08-13 15:10', friendName: '', isFriendOf: 'Fatima Jalloh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 15:10', registered_at: '2026-08-13 15:10', sms_status: 'Sent', sms_sent_at: '2026-08-13 15:11' }
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


    // --- 2. MOCK BACKEND / DATABASE API LAYER (With duplicate checks & SMS routing) ---
    const mockBackend = {
        // POST /api/guests/register
        registerGuest: (data) => {
            // Validation
            if (!data.name || !data.phone || !data.email) {
                return { success: false, error: 'Please complete all required fields.' };
            }
            
            // Validating phone format (must be numeric and between 8 to 15 digits)
            const phoneClean = data.phone.replace(/[^0-9]/g, '');
            if (phoneClean.length < 8) {
                return { success: false, error: 'Please provide a valid phone number (at least 8 digits).' };
            }
            
            // Validating email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                return { success: false, error: 'Please enter a valid email address.' };
            }

            if (!data.termsAccepted) {
                return { success: false, error: 'You must accept the Rules and Terms & Conditions before registering.' };
            }

            // Duplicate Prevention (Backend check on Phone & Email)
            const isDuplicate = guests.some(g => 
                (g.phone_number && g.phone_number.replace(/[^0-9]/g, '') === phoneClean) || 
                (g.email && g.email.toLowerCase() === data.email.toLowerCase())
            );
            if (isDuplicate) {
                return { success: false, error: 'This guest is already registered.' };
            }

            // Generate Unique Guest ID (Sequence padded, G-010)
            let maxNum = 0;
            guests.forEach(g => {
                if (g.guest_id && g.guest_id.startsWith('G-')) {
                    const num = parseInt(g.guest_id.split('-')[1]);
                    if (!isNaN(num) && num > maxNum) maxNum = num;
                }
            });
            const nextId = `G-${String(maxNum + 1).padStart(3, '0')}`;

            const nameParts = data.name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '-';
            const timestamp = new Date().toLocaleString();

            const newGuest = {
                id: 'g_' + Math.random().toString(36).substr(2, 9),
                guest_id: nextId,
                first_name: firstName,
                last_name: lastName,
                name: data.name,
                phone_number: data.phone,
                email: data.email,
                gender: data.gender,
                rsvp: 'Accepted',
                friendName: data.gender === 'girl' ? data.friendName : '',
                bottlePayment: data.gender === 'boy' ? 'Pending' : 'N/A',
                checkIn: 'Not Checked In',
                checkInTime: '',
                approvalStatus: 'Approved',
                terms_accepted: 'Yes',
                terms_version: 'v1.0',
                terms_accepted_at: timestamp,
                registered_at: timestamp,
                updated_at: timestamp,
                sms_status: 'Pending',
                sms_sent_at: ''
            };

            // Insert Guest record into database
            guests.push(newGuest);

            // Create dynamic companion friend record if a girl registered one
            if (data.gender === 'girl' && data.friendName) {
                const isFriendDuplicate = guests.some(g => g.name.toLowerCase() === data.friendName.toLowerCase());
                if (!isFriendDuplicate) {
                    let maxFriendNum = 0;
                    guests.forEach(g => {
                        if (g.guest_id && g.guest_id.startsWith('G-')) {
                            const num = parseInt(g.guest_id.split('-')[1]);
                            if (!isNaN(num) && num > maxFriendNum) maxFriendNum = num;
                        }
                    });
                    const friendNextId = `G-${String(maxFriendNum + 1).padStart(3, '0')}`;
                    const friendNameParts = data.friendName.trim().split(' ');
                    const friendFirst = friendNameParts[0];
                    const friendLast = friendNameParts.slice(1).join(' ') || '-';

                    guests.push({
                        id: 'f_' + Math.random().toString(36).substr(2, 9),
                        guest_id: friendNextId,
                        first_name: friendFirst,
                        last_name: friendLast,
                        name: data.friendName,
                        phone_number: '-',
                        email: '-',
                        gender: 'girl',
                        rsvp: 'Guest Added',
                        rsvpTime: timestamp,
                        friendName: '',
                        isFriendOf: data.name,
                        bottlePayment: 'N/A',
                        checkIn: 'Not Checked In',
                        checkInTime: '',
                        approvalStatus: 'Approved',
                        terms_accepted: 'Yes',
                        terms_version: 'v1.0',
                        terms_accepted_at: timestamp,
                        registered_at: timestamp,
                        updated_at: timestamp,
                        sms_status: 'N/A',
                        sms_sent_at: ''
                    });
                }
            }

            saveState();

            // Trigger SMS Confirmation dispatch
            mockBackend.sendSmsNotification(newGuest);

            return { success: true, guest: newGuest };
        },

        // SMS notification dispatcher
        sendSmsNotification: (guest) => {
            // Retrieve config values (simulating environment variables secure matching)
            const smsConfig = {
                apiKey: (typeof process !== 'undefined' && process.env && process.env.SMS_API_KEY) || 'MOCK_SMS_API_KEY_XYZ',
                senderId: (typeof process !== 'undefined' && process.env && process.env.SMS_SENDER_ID) || 'WGN_ALERTS'
            };

            const smsText = `Registration Confirmed. Hello ${guest.name}, your acceptance has been successfully recorded and you have been added to the Master Guest List. Your Guest ID is ${guest.guest_id}.`;
            console.log(`[SMS Gateway] Outbox dispatch: To: ${guest.phone_number} | Body: "${smsText}" (Sender ID: ${smsConfig.senderId})`);

            // 90% Simulated dispatch success
            const isSuccess = Math.random() < 0.9;

            setTimeout(() => {
                const matched = guests.find(g => g.id === guest.id);
                if (matched) {
                    matched.sms_status = isSuccess ? 'Sent' : 'Failed';
                    matched.sms_sent_at = new Date().toLocaleString();
                    saveState();
                    logActivity(`SMS alert ${isSuccess ? 'DELIVERED' : 'FAILED'} to ${guest.phone_number} (${guest.guest_id})`);
                }
            }, 1000);
        }
    };


    // --- 3. GUEST VIEW & INPUT POPULATION ---
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminUrl = urlParams.get('admin') === 'true' || urlParams.get('host') === 'true';
    const isGateUrl = urlParams.get('gate') === 'true';
    
    const isAuthorized = () => sessionStorage.getItem('wgn_admin_logged') === 'true';

    const getGuestName = () => {
        let name = urlParams.get('name') || urlParams.get('guest');
        if (!name || !name.trim()) return '';
        return name.trim().replace(/\b\w/g, l => l.toUpperCase());
    };

    const getGuestGender = () => urlParams.get('gender') || 'boy';

    const guestName = getGuestName();
    const guestGender = getGuestGender();

    // Elements
    const guestNameDisplay = document.getElementById('guestNameDisplay');
    const passGuestName = document.getElementById('passGuestName');
    const dynamicLetterContent = document.getElementById('dynamicLetterContent');
    const genderSpecNote = document.getElementById('genderSpecNote');
    const friendRegistrationBlock = document.getElementById('friendRegistrationBlock');

    const regNameInput = document.getElementById('regGuestName');
    const regPhoneInput = document.getElementById('regGuestPhone');
    const regEmailInput = document.getElementById('regGuestEmail');
    const regGenderSelect = document.getElementById('regGuestGender');

    // Populate registration form values on load
    if (regNameInput && guestName) {
        regNameInput.value = guestName;
        regNameInput.setAttribute('readonly', 'true');
    }
    if (regGenderSelect && guestGender) {
        regGenderSelect.value = guestGender;
        regGenderSelect.setAttribute('disabled', 'true');
    }

    if (guestNameDisplay) guestNameDisplay.textContent = guestName || 'Guest';
    if (passGuestName) passGuestName.textContent = guestName || 'Guest';

    // Toggle dynamics
    if (dynamicLetterContent) {
        let letterTpl = guestGender === 'girl' ? templates.girlLetter : templates.boyLetter;
        dynamicLetterContent.innerHTML = letterTpl.split('\n\n').map(p => `<p class="body-paragraph">${p.replace(/\n/g, '<br>')}</p>`).join('');
    }

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

    const evtDateDisplay = document.getElementById('evtDateDisplay');
    const evtTimeDisplay = document.getElementById('evtTimeDisplay');
    const evtVenueDisplay = document.getElementById('evtVenueDisplay');

    if (evtDateDisplay) evtDateDisplay.textContent = new Date(config.eventDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (evtTimeDisplay) {
        const [hr, min] = config.eventTime.split(':');
        evtTimeDisplay.textContent = `${hr % 12 || 12}:${min} ${hr >= 12 ? 'PM' : 'AM'} (Arrival Deadline ${config.eventDeadline} sharp)`;
    }
    if (evtVenueDisplay) evtVenueDisplay.textContent = config.eventVenue;


    // --- 4. AUDIO ENGINE (Text-To-Speech procedural sound) ---
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
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                console.log(e);
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
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
        }

        toggleMute() {
            this.isMuted = !this.isMuted;
            if (this.isMuted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
            if (this.masterGain) this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx ? this.ctx.currentTime : 0);
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


    // --- 5. CANVAS PARTICLE & CONFETTI ENGINE ---
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
            if (p.type === 'burst' && p.life <= 0) particles.splice(i, 1);
        }
        requestAnimationFrame(renderCanvas);
    }
    renderCanvas();


    // --- 6. SCENE TRANSITION & ENVELOPE OPENING ---
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

                    if (guestGender === 'girl') {
                        audioSystem.speak(`Congratulations ${guestName || 'Guest'}! We are so excited to invite you to Games Night! Get ready for a wonderful evening.`);
                    } else {
                        audioSystem.speak(`Congratulations ${guestName || 'Guest'}! You have been selected for Games Night. Remember, bring your bottle! No bottle, no entry.`);
                    }
                }, 800);
            }, 1200);
        });
    }


    // --- 7. EVENT COUNTDOWN CLOCK ---
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


    // --- 8. AUTOMATIC GATE LOCKDOWN TRIGGER ---
    const checkGateLockdown = () => {
        const now = new Date();
        const hours = now.getHours();
        const mins = now.getMinutes();
        
        const [deadHr, deadMin] = config.eventDeadline.split(':');
        const deadlineTime = parseInt(deadHr) * 60 + parseInt(deadMin);
        const currentTime = hours * 60 + mins;

        const isClosed = (currentTime >= deadlineTime) || config.manualLockdown;

        const gateBadge = document.getElementById('gateStatusBadge');
        const dashStatus = document.getElementById('dash-gate-status');
        const clockLabel = document.getElementById('gateClock');

        if (clockLabel) clockLabel.textContent = now.toTimeString().split(' ')[0];

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


    // --- 9. INSTANT EMAIL NOTIFICATION ALERTS (FormSubmit.co) ---
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
                    RSVP_Status: 'Accepted & Registered',
                    Details: details,
                    Companion_Friend: extra || 'None',
                    Time_Confirmed: new Date().toLocaleString()
                })
            });
        } catch (e) {
            console.log('Notification delivery background error:', e);
        }
    };


    // --- 10. GUEST RSVP SELF-REGISTRATION ACTIONS (Parchment Form) ---
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

    const getCompiledRsvpMessage = (name, gender, friendName = '') => {
        let tpl = gender === 'girl' ? templates.girlWa : templates.boyWa;
        let msg = tpl.replace(/\[Name\]/gi, name);
        if (friendName) {
            msg = msg.replace(/\[Friend\]/gi, friendName);
        } else {
            msg = msg.replace(/\[Friend\]/gi, 'Not yet registered');
        }
        return msg;
    };

    const populateWaButtons = (name, gender, friendName = '') => {
        if (!waButtonsContainer) return;
        const msg = encodeURIComponent(getCompiledRsvpMessage(name, gender, friendName));
        waButtonsContainer.innerHTML = `
            <a class="wa-btn" href="https://wa.me/${config.phoneFaisal}?text=${msg}" target="_blank">
                💬 Send Confirmation to Faisal (${config.phoneFaisal})
            </a>
            <a class="wa-btn secondary-wa" href="https://wa.me/${config.phoneDija}?text=${msg}" target="_blank">
                💬 Send Confirmation to Dija (${config.phoneDija})
            </a>
        `;
    };

    // Update buttons dynamically as they type values
    const setupFormLiveTriggers = () => {
        const phoneField = document.getElementById('regGuestPhone');
        const emailField = document.getElementById('regGuestEmail');

        [regNameInput, phoneField, emailField, regGenderSelect, friendNameInput].forEach(el => {
            if (el) {
                el.addEventListener('input', () => {
                    const name = regNameInput ? regNameInput.value.trim() : 'Guest';
                    const gender = regGenderSelect ? regGenderSelect.value : 'boy';
                    const friend = friendNameInput ? friendNameInput.value.trim() : '';
                    populateWaButtons(name, gender, friend);
                });
            }
        });
        
        if (regGenderSelect) {
            regGenderSelect.addEventListener('change', () => {
                const gen = regGenderSelect.value;
                if (gen === 'girl') {
                    if (friendRegistrationBlock) friendRegistrationBlock.classList.remove('hidden-note');
                    if (genderSpecNote) {
                        genderSpecNote.classList.remove('note-boy');
                        genderSpecNote.classList.add('note-girl');
                        genderSpecNote.innerHTML = `✨ <strong>Ladies Guest Policy:</strong> You are welcome to register one female friend in advance. Her name will be added to the gate checklist.`;
                    }
                } else {
                    if (friendRegistrationBlock) friendRegistrationBlock.classList.add('hidden-note');
                    if (genderSpecNote) {
                        genderSpecNote.classList.remove('note-girl');
                        genderSpecNote.classList.add('note-boy');
                        genderSpecNote.innerHTML = `⚠️ <strong>Bottle Purchase Policy:</strong> All accepted male guests are required to purchase one bottle from the organizers at the gate for Le 150 upon arrival.`;
                    }
                }
            });
        }
    };

    setupFormLiveTriggers();

    if (acceptBtn) {
        // Render initial buttons
        populateWaButtons(guestName || 'Guest', guestGender, '');

        acceptBtn.addEventListener('click', () => {
            // Check T&C Checkbox
            if (rulesCheckbox && !rulesCheckbox.checked) {
                if (agreementWarning) {
                    agreementWarning.textContent = 'You must accept the Rules and Terms & Conditions before registering.';
                    agreementWarning.classList.remove('hidden-warning');
                }
                if (agreementWrapper) {
                    agreementWrapper.classList.remove('shakeWarning');
                    void agreementWrapper.offsetWidth;
                    agreementWrapper.classList.add('shakeWarning');
                }
                return;
            }

            const nameVal = regNameInput ? regNameInput.value.trim() : '';
            const phoneVal = regPhoneInput ? regPhoneInput.value.trim() : '';
            const emailVal = regEmailInput ? regEmailInput.value.trim() : '';
            const genderVal = regGenderSelect ? regGenderSelect.value : 'boy';
            const friendVal = friendNameInput ? friendNameInput.value.trim() : '';

            // Execute Backend Registration Request (Validation & Duplicate prevention)
            const response = mockBackend.registerGuest({
                name: nameVal,
                phone: phoneVal,
                email: emailVal,
                gender: genderVal,
                friendName: friendVal,
                termsAccepted: rulesCheckbox.checked,
                termsVersion: 'v1.0'
            });

            if (!response.success) {
                // Display Backend Error Message
                if (agreementWarning) {
                    agreementWarning.innerHTML = `❌ ${response.error}`;
                    agreementWarning.classList.remove('hidden-warning');
                }
                if (agreementWrapper) {
                    agreementWrapper.classList.remove('shakeWarning');
                    void agreementWrapper.offsetWidth;
                    agreementWrapper.classList.add('shakeWarning');
                }
                return;
            }

            // SUCCESS FLOW
            const registeredGuest = response.guest;

            // Clear errors
            if (agreementWarning) agreementWarning.classList.add('hidden-warning');

            audioSystem.playAcceptHarps();
            if (genderVal === 'girl') {
                audioSystem.speak(`Registration confirmed, ${firstNameOf(nameVal)}! Welcome to Games Night.`);
            } else {
                audioSystem.speak(`Registration confirmed, ${firstNameOf(nameVal)}! See you at Signal Inn. Bring Le 150 for your bottle!`);
            }

            if (parchmentLetter) parchmentLetter.classList.add('glowing-accept');
            const rect = acceptBtn.getBoundingClientRect();
            createSparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60);

            acceptBtn.classList.add('accepted');
            acceptBtn.disabled = true;
            if (acceptBtnText) acceptBtnText.textContent = '✓ Registered!';

            // Fill details card in Success Toast
            const confGuestId = document.getElementById('confGuestId');
            const confAcceptTime = document.getElementById('confAcceptTime');
            
            if (confGuestId) confGuestId.textContent = registeredGuest.guest_id;
            if (confAcceptTime) confAcceptTime.textContent = registeredGuest.terms_accepted_at;

            // Update WhatsApp pre-filled links
            populateWaButtons(nameVal, genderVal, friendVal);

            // Send background dispatches
            sendInstantNotification(
                `🎉 AUTOMATIC REGISTRATION: ${nameVal} (${registeredGuest.guest_id})`,
                nameVal,
                genderVal,
                `Added to Master list. Phone: ${phoneVal} | Email: ${emailVal}. SMS confirmation: Pending.`,
                friendVal
            );

            if (confirmationBox) {
                confirmationBox.classList.remove('hidden-confirmation');
                if (confStatusMsg) confStatusMsg.textContent = 'Registration Successful! Confirmation logs submitted.';
                confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Open WhatsApp confirmation auto-trigger
            setTimeout(() => {
                const msg = encodeURIComponent(getCompiledRsvpMessage(nameVal, genderVal, friendVal));
                window.open(`https://wa.me/${config.phoneFaisal}?text=${msg}`, '_blank');
            }, 2000);
        });
    }

    const firstNameOf = (fullName) => fullName.trim().split(' ')[0];


    // --- 11. ADMIN AUTHENTICATION SECURITY ---
    const adminLoginOverlay = document.getElementById('adminLoginOverlay');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const submitPasswordBtn = document.getElementById('submitPasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    const organizerBtn = document.getElementById('organizerBtn');
    const adminScene = document.getElementById('adminScene');
    const gameIconsContainer = document.getElementById('gameIconsContainer');

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

    // Triple click crest access
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

    if (cancelPasswordBtn) cancelPasswordBtn.addEventListener('click', hideLogin);

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

    if (submitPasswordBtn) submitPasswordBtn.addEventListener('click', verifyPIN);
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verifyPIN();
        });
    }

    function switchToAdminConsole() {
        if (scene1) scene1.classList.add('hidden-scene');
        if (scene3) scene3.classList.add('hidden-scene');
        if (gameIconsContainer) gameIconsContainer.style.display = 'none';
        if (adminScene) adminScene.classList.remove('hidden-scene');
        
        updateDashboardStats();
        renderMasterGuestList();
        renderActivityLogs();
        loadTemplatesToTextareas();
        loadSettingsInputs();
        checkGateLockdown();
    }

    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('wgn_admin_logged');
            window.location.reload();
        });
    }

    if (isAuthorized() && (isAdminUrl || isGateUrl)) {
        switchToAdminConsole();
    }


    // --- 12. ADMIN DASHBOARD METRICS CALCULATION (Dynamic stats) ---
    function updateDashboardStats() {
        const totalGuests = guests.length;
        const accepted = guests.filter(g => g.rsvp === 'Accepted' || g.rsvp === 'Registered').length;
        const pending = guests.filter(g => g.rsvp === 'Pending').length;
        const declined = guests.filter(g => g.rsvp === 'Declined').length;

        // Calculate Today's Registrations
        const todayStr = new Date().toLocaleDateString();
        const todaysRegs = guests.filter(g => {
            if (!g.registered_at) return false;
            const regDate = new Date(g.registered_at).toLocaleDateString();
            return regDate === todayStr && g.rsvp !== 'Pending';
        }).length;

        // Populate elements
        const statTotalInv = document.getElementById('stat-total-invites');
        const statTotalAcc = document.getElementById('stat-total-accepted');
        const statPending = document.getElementById('stat-pending');
        const statChecked = document.getElementById('stat-checked-in');
        const statDeclined = document.getElementById('stat-declined');
        const statBoysAcc = document.getElementById('stat-boys-accepted');
        const statGirlsAcc = document.getElementById('stat-girls-accepted');
        const statGuestsAdd = document.getElementById('stat-guests-added');

        if (statTotalInv) statTotalInv.textContent = totalGuests;
        if (statTotalAcc) statTotalAcc.textContent = accepted;
        if (statPending) statPending.textContent = pending;
        if (statDeclined) statDeclined.textContent = declined;
        if (statChecked) statChecked.textContent = todaysRegs; // Re-purposed to Todays Registrations
        
        // Re-label card
        const checkinLabel = document.querySelector('.checkin-card .stat-label');
        if (checkinLabel) checkinLabel.textContent = "Today's Registrations";

        // Count categories
        const boys = guests.filter(g => g.gender === 'boy' && (g.rsvp === 'Accepted' || g.rsvp === 'Registered')).length;
        const girls = guests.filter(g => g.gender === 'girl' && (g.rsvp === 'Accepted' || g.rsvp === 'Registered')).length;
        const friends = guests.filter(g => g.rsvp === 'Guest Added').length;

        if (statBoysAcc) statBoysAcc.textContent = boys;
        if (statGirlsAcc) statGirlsAcc.textContent = girls;
        if (statGuestsAdd) statGuestsAdd.textContent = friends;

        const dashVenue = document.getElementById('dash-venue');
        const dashDate = document.getElementById('dash-date');
        if (dashVenue) dashVenue.textContent = config.eventVenue;
        if (dashDate) dashDate.textContent = config.eventDate;
    }


    // --- 13. TAB SELECTION MANAGEMENT ---
    const tabButtons = document.querySelectorAll('.tab-nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active-tab'));
            btn.classList.add('active-tab');

            tabPanes.forEach(pane => {
                pane.classList.remove('active-pane');
                if (pane.getAttribute('id') === `tab-${targetTab}`) {
                    pane.classList.add('active-pane');
                }
            });

            if (targetTab === 'guestlist') renderMasterGuestList();
            if (targetTab === 'dashboard') updateDashboardStats();
        });
    });


    // --- 14. MASTER GUEST LIST CRUD OPERATIONS ---
    const guestSearchInput = document.getElementById('guestSearchInput');
    const guestFilterGender = document.getElementById('guestFilterGender');
    const guestFilterStatus = document.getElementById('guestFilterStatus');
    const masterGuestTableBody = document.getElementById('masterGuestTableBody');

    const addGuestBtn = document.getElementById('addGuestBtn');
    const guestEditModal = document.getElementById('guestEditModal');
    const closeGuestModal = document.getElementById('closeGuestModal');
    const saveGuestDetailsBtn = document.getElementById('saveGuestDetailsBtn');

    // Input fields edit modal
    const editGuestName = document.getElementById('editGuestName');
    const editGuestPhone = document.getElementById('editGuestPhone');
    const editGuestEmail = document.getElementById('editGuestEmail');
    const editGuestRsvp = document.getElementById('editGuestRsvp');
    const editGuestFriend = document.getElementById('editGuestFriend');
    const editGuestBottle = document.getElementById('editGuestBottle');
    const editGuestCheckin = document.getElementById('editGuestCheckin');
    const editFriendNameGroup = document.getElementById('editFriendNameGroup');
    const editBottlePaymentGroup = document.getElementById('editBottlePaymentGroup');
    
    // Links modal
    const modalLinkBox = document.getElementById('modalLinkBox');
    const modalGeneratedUrl = document.getElementById('modalGeneratedUrl');
    const modalCopyLinkBtn = document.getElementById('modalCopyLinkBtn');
    const modalShareWaBtn = document.getElementById('modalShareWaBtn');

    let currentEditingGuestId = null;

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
            if (editGuestPhone) editGuestPhone.value = guest.phone_number || '';
            if (editGuestEmail) editGuestEmail.value = guest.email || '';
            
            setSelectedRadioByValue('editGuestGender', guest.gender);
            if (editGuestRsvp) editGuestRsvp.value = guest.rsvp;
            if (editGuestFriend) editGuestFriend.value = guest.friendName || '';
            if (editGuestBottle) editGuestBottle.value = guest.bottlePayment || 'Pending';
            if (editGuestCheckin) editGuestCheckin.value = guest.checkIn || 'Not Checked In';
            
            toggleModalFieldGroups(guest.gender);
            
            // Populate Audit Elements
            document.getElementById('auditGuestId').textContent = guest.guest_id || '-';
            document.getElementById('auditTcVersion').textContent = guest.terms_version || 'v1.0';
            document.getElementById('auditTcAccepted').textContent = guest.terms_accepted || 'No';
            document.getElementById('auditTcTime').textContent = guest.terms_accepted_at || '-';

            // Populate SMS Log Elements
            document.getElementById('auditPhone').textContent = guest.phone_number || '-';
            document.getElementById('auditEmail').textContent = guest.email || '-';
            document.getElementById('auditSmsStatus').textContent = guest.sms_status || '-';
            document.getElementById('auditSmsTime').textContent = guest.sms_sent_at || '-';

            updateModalGeneratedLink();
        } else {
            document.getElementById('guestModalTitle').textContent = 'Add New Guest';
            currentEditingGuestId = null;
            
            if (editGuestName) editGuestName.value = '';
            if (editGuestPhone) editGuestPhone.value = '';
            if (editGuestEmail) editGuestEmail.value = '';
            
            setSelectedRadioByValue('editGuestGender', 'boy');
            if (editGuestRsvp) editGuestRsvp.value = 'Pending';
            if (editGuestFriend) editGuestFriend.value = '';
            if (editGuestBottle) editGuestBottle.value = 'Pending';
            if (editGuestCheckin) editGuestCheckin.value = 'Not Checked In';
            
            toggleModalFieldGroups('boy');

            // Reset audit
            document.getElementById('auditGuestId').textContent = '-';
            document.getElementById('auditTcVersion').textContent = 'v1.0';
            document.getElementById('auditTcAccepted').textContent = 'No';
            document.getElementById('auditTcTime').textContent = '-';
            
            document.getElementById('auditPhone').textContent = '-';
            document.getElementById('auditEmail').textContent = '-';
            document.getElementById('auditSmsStatus').textContent = '-';
            document.getElementById('auditSmsTime').textContent = '-';

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

        let fullUrl = `${baseUrl}?name=${encodeURIComponent(nameVal)}&gender=${gender}`;
        fullUrl += `&rsvp=${encodeURIComponent(tpl)}`;

        if (modalGeneratedUrl) modalGeneratedUrl.value = fullUrl;
        if (modalLinkBox) modalLinkBox.classList.remove('hidden-box');

        if (modalShareWaBtn) {
            const waText = encodeURIComponent(`Hey ${nameVal}! 🎉 Your Games Night letter of approval has arrived!\n\nOpen your letter here: ${fullUrl}`);
            modalShareWaBtn.href = `https://wa.me/?text=${waText}`;
        }
    };

    if (editGuestName) editGuestName.addEventListener('input', updateModalGeneratedLink);

    if (modalCopyLinkBtn && modalGeneratedUrl) {
        modalCopyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(modalGeneratedUrl.value).then(() => {
                modalCopyLinkBtn.textContent = '✓ Copied!';
                setTimeout(() => { modalCopyLinkBtn.textContent = '📋 Copy Link'; }, 2000);
            });
        });
    }

    if (addGuestBtn) addGuestBtn.addEventListener('click', () => openGuestModal());
    if (closeGuestModal) {
        closeGuestModal.addEventListener('click', () => {
            if (guestEditModal) guestEditModal.classList.add('hidden-modal');
        });
    }

    if (saveGuestDetailsBtn) {
        saveGuestDetailsBtn.addEventListener('click', () => {
            const nameVal = editGuestName ? editGuestName.value.trim() : '';
            const phoneVal = editGuestPhone ? editGuestPhone.value.trim() : '';
            const emailVal = editGuestEmail ? editGuestEmail.value.trim() : '';
            if (!nameVal) {
                alert('Please enter a valid guest name.');
                return;
            }

            const gender = getSelectedGenderFromRadio('editGuestGender');
            const rsvp = editGuestRsvp ? editGuestRsvp.value : 'Pending';
            const friendName = editGuestFriend ? editGuestFriend.value.trim() : '';
            const bottle = editGuestBottle ? editGuestBottle.value : 'N/A';
            const checkin = editGuestCheckin ? editGuestCheckin.value : 'Not Checked In';
            const timestamp = new Date().toLocaleString();

            if (currentEditingGuestId) {
                const guest = guests.find(g => g.id === currentEditingGuestId);
                if (guest) {
                    const prevName = guest.name;
                    guest.name = nameVal;
                    guest.phone_number = phoneVal;
                    guest.email = emailVal;
                    guest.gender = gender;
                    guest.rsvp = rsvp;
                    guest.friendName = gender === 'girl' ? friendName : '';
                    guest.bottlePayment = gender === 'boy' ? bottle : 'N/A';
                    guest.checkIn = checkin;
                    guest.updated_at = timestamp;

                    if (checkin === 'Checked In' && !guest.checkInTime) {
                        guest.checkInTime = new Date().toLocaleTimeString();
                    }

                    // Sync companion friend
                    if (gender === 'girl' && friendName) {
                        let comp = guests.find(g => g.isFriendOf === prevName);
                        if (comp) {
                            comp.name = friendName;
                            comp.isFriendOf = nameVal;
                        } else {
                            let maxFriendNum = 0;
                            guests.forEach(g => {
                                if (g.guest_id && g.guest_id.startsWith('G-')) {
                                    const num = parseInt(g.guest_id.split('-')[1]);
                                    if (!isNaN(num) && num > maxFriendNum) maxFriendNum = num;
                                }
                            });
                            const friendNextId = `G-${String(maxFriendNum + 1).padStart(3, '0')}`;
                            guests.push({
                                id: 'f_' + Math.random().toString(36).substr(2, 9),
                                guest_id: friendNextId,
                                first_name: friendName.split(' ')[0],
                                last_name: friendName.split(' ').slice(1).join(' ') || '-',
                                name: friendName,
                                phone_number: '-',
                                email: '-',
                                gender: 'girl',
                                rsvp: 'Guest Added',
                                rsvpTime: timestamp,
                                friendName: '',
                                isFriendOf: nameVal,
                                bottlePayment: 'N/A',
                                checkIn: 'Not Checked In',
                                checkInTime: '',
                                approvalStatus: 'Approved',
                                terms_accepted: 'Yes',
                                terms_version: 'v1.0',
                                terms_accepted_at: timestamp,
                                registered_at: timestamp,
                                updated_at: timestamp,
                                sms_status: 'N/A',
                                sms_sent_at: ''
                            });
                        }
                    }
                    logActivity(`Admin updated guest: ${nameVal}`);
                }
            } else {
                // Add Mode sequence-based ID generation
                let maxNum = 0;
                guests.forEach(g => {
                    if (g.guest_id && g.guest_id.startsWith('G-')) {
                        const num = parseInt(g.guest_id.split('-')[1]);
                        if (!isNaN(num) && num > maxNum) maxNum = num;
                    }
                });
                const nextId = `G-${String(maxNum + 1).padStart(3, '0')}`;

                const newGuest = {
                    id: 'g_' + Math.random().toString(36).substr(2, 9),
                    guest_id: nextId,
                    first_name: nameVal.split(' ')[0],
                    last_name: nameVal.split(' ').slice(1).join(' ') || '-',
                    name: nameVal,
                    phone_number: phoneVal,
                    email: emailVal,
                    gender: gender,
                    rsvp: rsvp,
                    rsvpTime: rsvp !== 'Pending' ? timestamp : '',
                    friendName: gender === 'girl' ? friendName : '',
                    bottlePayment: gender === 'boy' ? bottle : 'N/A',
                    checkIn: checkin,
                    checkInTime: checkin === 'Checked In' ? new Date().toLocaleTimeString() : '',
                    approvalStatus: 'Approved',
                    terms_accepted: rsvp !== 'Pending' ? 'Yes' : 'No',
                    terms_version: rsvp !== 'Pending' ? 'v1.0' : '',
                    terms_accepted_at: rsvp !== 'Pending' ? timestamp : '',
                    registered_at: timestamp,
                    updated_at: timestamp,
                    sms_status: 'Pending',
                    sms_sent_at: ''
                };
                guests.push(newGuest);

                if (gender === 'girl' && friendName) {
                    let maxFriendNum = 0;
                    guests.forEach(g => {
                        if (g.guest_id && g.guest_id.startsWith('G-')) {
                            const num = parseInt(g.guest_id.split('-')[1]);
                            if (!isNaN(num) && num > maxFriendNum) maxFriendNum = num;
                        }
                    });
                    const friendNextId = `G-${String(maxFriendNum + 1).padStart(3, '0')}`;
                    guests.push({
                        id: 'f_' + Math.random().toString(36).substr(2, 9),
                        guest_id: friendNextId,
                        first_name: friendName.split(' ')[0],
                        last_name: friendName.split(' ').slice(1).join(' ') || '-',
                        name: friendName,
                        phone_number: '-',
                        email: '-',
                        gender: 'girl',
                        rsvp: 'Guest Added',
                        rsvpTime: timestamp,
                        friendName: '',
                        isFriendOf: nameVal,
                        bottlePayment: 'N/A',
                        checkIn: 'Not Checked In',
                        checkInTime: '',
                        approvalStatus: 'Approved',
                        terms_accepted: 'Yes',
                        terms_version: 'v1.0',
                        terms_accepted_at: timestamp,
                        registered_at: timestamp,
                        updated_at: timestamp,
                        sms_status: 'N/A',
                        sms_sent_at: ''
                    });
                }
                logActivity(`Admin manually added guest: ${nameVal}`);
            }

            saveState();
            if (guestEditModal) guestEditModal.classList.add('hidden-modal');
            renderMasterGuestList();
            updateDashboardStats();
        });
    }

    // Render Master list table rows
    function renderMasterGuestList() {
        if (!masterGuestTableBody) return;

        const q = guestSearchInput ? guestSearchInput.value.toLowerCase().trim() : '';
        const filterGender = guestFilterGender ? guestFilterGender.value : 'all';
        const filterStatus = guestFilterStatus ? guestFilterStatus.value : 'all';

        const filtered = guests.filter(g => {
            const matchesSearch = 
                g.name.toLowerCase().includes(q) || 
                (g.guest_id && g.guest_id.toLowerCase().includes(q)) || 
                (g.phone_number && g.phone_number.includes(q)) || 
                (g.email && g.email.toLowerCase().includes(q)) ||
                (g.friendName && g.friendName.toLowerCase().includes(q));
            
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
            masterGuestTableBody.innerHTML = `<tr><td colspan="9" class="empty-log" style="text-align:center;">No guests match your criteria.</td></tr>`;
            return;
        }

        masterGuestTableBody.innerHTML = filtered.map(g => {
            const dateStr = g.terms_accepted_at ? g.terms_accepted_at.split(' ')[0] : '-';
            const checkinTime = g.checkInTime ? ` (${g.checkInTime})` : '';
            return `
                <tr>
                    <td><strong>${g.guest_id || '-'}</strong></td>
                    <td><strong>${g.name}</strong> ${g.isFriendOf ? `<span style="font-size:0.75rem; color:#888;">(Friend of ${g.isFriendOf})</span>` : ''}</td>
                    <td>${g.phone_number || '-'}</td>
                    <td>${g.email || '-'}</td>
                    <td><span class="status-badge ${g.rsvp}">${g.rsvp}</span></td>
                    <td>${g.terms_accepted === 'Yes' ? 'Yes ✅' : 'No ❌'}</td>
                    <td>${dateStr}</td>
                    <td><span class="gate-badge ${g.checkIn === 'Checked In' ? 'checked-in' : (g.checkIn === 'Rejected at Gate' ? 'rejected' : 'pending')}">${g.checkIn}${checkinTime}</span></td>
                    <td>
                        <button class="action-icon-btn edit-guest" data-id="${g.id}" title="Edit Guest Details">✏️</button>
                        <button class="action-icon-btn delete-guest" data-id="${g.id}" title="Delete Record">🗑️</button>
                        <button class="action-icon-btn copy-link" data-id="${g.id}" title="Copy Invite Link">🔗</button>
                    </td>
                </tr>
            `;
        }).join('');

        // Re-bind actions
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
                    if (guest.gender === 'girl' && guest.friendName) {
                        guests = guests.filter(g => g.isFriendOf !== guest.name);
                    }
                    guests = guests.filter(g => g.id !== id);
                    saveState();
                    renderMasterGuestList();
                    updateDashboardStats();
                    logActivity(`Deleted guest: ${guest.name}`);
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


    // --- 15. GATE CHECK-IN SCREEN LOGIC (Verify arrivals) ---
    const gateSearchBox = document.getElementById('gateSearchBox');
    const gateResultsContainer = document.getElementById('gateResultsContainer');

    function renderGateCheckin() {
        if (!gateResultsContainer) return;
        const q = gateSearchBox ? gateSearchBox.value.toLowerCase().trim() : '';

        if (!q) {
            gateResultsContainer.innerHTML = `<div class="gate-no-results">Enter guest name above to verify entry approval.</div>`;
            return;
        }

        const found = guests.filter(g => 
            g.name.toLowerCase().includes(q) || 
            (g.guest_id && g.guest_id.toLowerCase().includes(q)) ||
            (g.friendName && g.friendName.toLowerCase().includes(q))
        );

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
                            <span class="gate-guest-role">${roleLabel} (${g.guest_id || 'No ID'})</span>
                        </div>
                        <span class="gate-badge ${g.checkIn === 'Checked In' ? 'checked-in' : (g.rsvp === 'Declined' ? 'rejected' : 'approved')}">${statusLabel}</span>
                    </div>
                    
                    <div class="gate-card-body">
                        <p><strong>Phone:</strong> ${g.phone_number || '-'}</p>
                        <p><strong>T&C Accepted:</strong> ${g.terms_accepted === 'Yes' ? 'Yes ✅' : 'No ❌'}</p>
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
                        <!-- Bottle payment (Boys only) -->
                        ${g.gender === 'boy' && g.bottlePayment !== 'Paid' ? `
                            <button class="gate-action-btn pay-btn mark-paid-btn" data-id="${g.id}">
                                💰 COLLECT Le 150 & MARK BOTTLE PAID
                            </button>
                        ` : ''}

                        <!-- Check-in actions -->
                        ${g.checkIn === 'Checked In' ? `
                            <div class="gate-closed-warning" style="background:rgba(49, 151, 149, 0.1); border-color:#319795; color:#319795;">
                                ALREADY CHECKED IN (at ${g.checkInTime})
                            </div>
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

        // Re-bind Checkin buttons
        document.querySelectorAll('.mark-paid-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const guest = guests.find(g => g.id === id);
                if (guest) {
                    guest.bottlePayment = 'Paid';
                    saveState();
                    renderGateCheckin();
                    logActivity(`Collected Le 150 from ${guest.name}. Bottle payment completed.`);
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
                if (guest && confirm(`ADMIN OVERRIDE: Check in ${guest.name} after gate closing?`)) {
                    guest.checkIn = 'Checked In';
                    guest.checkInTime = new Date().toLocaleTimeString();
                    saveState();
                    renderGateCheckin();
                    updateDashboardStats();
                    logActivity(`ADMIN OVERRIDE: Checked in ${guest.name} after gate deadline`);
                }
            });
        });
    }

    if (gateSearchBox) gateSearchBox.addEventListener('input', renderGateCheckin);


    // --- 16. LETTER TEMPLATES DESIGNER ---
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
            alert('Templates saved successfully!');
            logActivity('Organizer updated email/WhatsApp templates.');
        });
    }


    // --- 17. SETTINGS AND ENVIRONMENT CONFIGS ---
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
            logActivity(`Organizer set lockdown override: ${config.manualLockdown}`);
        });
    }

    // Seed Data Controller
    const btnSeedDemoData = document.getElementById('btnSeedDemoData');
    if (btnSeedDemoData) {
        btnSeedDemoData.addEventListener('click', () => {
            if (confirm('Reset database to the pre-seeded guests?')) {
                guests = DEFAULT_GUESTS;
                config = DEFAULT_CONFIG;
                templates = DEFAULT_TEMPLATES;
                localStorage.setItem('wgn_activity_logs', '[]');
                saveState();
                logActivity('Database initialized and seeded with demo data.');
                switchToAdminConsole();
                alert('Database reset completed successfully.');
            }
        });
    }

    const btnClearDatabase = document.getElementById('btnClearDatabase');
    if (btnClearDatabase) {
        btnClearDatabase.addEventListener('click', () => {
            if (confirm('🚨 Erase ENTIRE guest registry? This is destructive!')) {
                guests = [];
                localStorage.setItem('wgn_activity_logs', '[]');
                saveState();
                logActivity('Cleared guest records.');
                switchToAdminConsole();
                alert('All guest records cleared.');
            }
        });
    }


    // --- 18. REMINDERS DISPATCHER ---
    const reminderMsgTpl = document.getElementById('reminderMsgTpl');
    document.querySelectorAll('.send-rem-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const recipientGroup = btn.getAttribute('data-recipient');
            const text = reminderMsgTpl ? reminderMsgTpl.value.trim() : '';

            let targets = [];
            if (recipientGroup === 'all') {
                targets = guests.filter(g => g.rsvp === 'Accepted' || g.rsvp === 'Registered');
            } else if (recipientGroup === 'boys') {
                targets = guests.filter(g => g.gender === 'boy' && (g.rsvp === 'Accepted' || g.rsvp === 'Registered'));
            } else if (recipientGroup === 'girls') {
                targets = guests.filter(g => g.gender === 'girl' && (g.rsvp === 'Accepted' || g.rsvp === 'Registered'));
            } else if (recipientGroup === 'not-checked-in') {
                targets = guests.filter(g => (g.rsvp === 'Accepted' || g.rsvp === 'Registered') && g.checkIn !== 'Checked In');
            }

            if (targets.length === 0) {
                alert('No guests match this filter.');
                return;
            }

            const names = targets.map(t => t.name).join(', ');
            alert(`📢 SMS REMINDERS SENT via Mock API Gateway!\n\nTo Group: ${recipientGroup.toUpperCase()}\nRecipients Count: ${targets.length}\nRecipients: ${names}\n\nMessage: "${text}"`);
            logActivity(`Dispatched reminders to ${targets.length} guests (${recipientGroup})`);
        });
    });


    // --- 19. MODALS CONTROL (Location, Calendar, Pass) ---
    const locationBtn = document.getElementById('locationBtn');
    const locationModal = document.getElementById('locationModal');
    const closeLocModal = document.getElementById('closeLocModal');

    if (locationBtn && locationModal) {
        locationBtn.addEventListener('click', () => locationModal.classList.remove('hidden-modal'));
    }
    if (closeLocModal && locationModal) {
        closeLocModal.addEventListener('click', () => locationModal.classList.add('hidden-modal'));
    }

    const calendarBtn = document.getElementById('calendarBtn');
    const calendarModal = document.getElementById('calendarModal');
    const closeCalModal = document.getElementById('closeCalModal');

    if (calendarBtn && calendarModal) {
        calendarBtn.addEventListener('click', () => calendarModal.classList.remove('hidden-modal'));
    }
    if (closeCalModal && calendarModal) {
        closeCalModal.addEventListener('click', () => calendarModal.classList.add('hidden-modal'));
    }

    const googleCalBtn = document.getElementById('googleCalBtn');
    if (googleCalBtn) {
        googleCalBtn.addEventListener('click', () => {
            const title = encodeURIComponent(config.eventName);
            const details = encodeURIComponent(`Invitation to ${config.eventName}. Verification strictly enforced!`);
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
                `DESCRIPTION:Wild Games Night. Venue checklist open.`,
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
        closePassModal.addEventListener('click', () => passModal.classList.add('hidden-modal'));
    }

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl).then(() => {
                copyLinkBtn.textContent = '✓ Link Copied!';
                setTimeout(() => { copyLinkBtn.textContent = '🔗 Copy Invitation Link'; }, 3000);
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
