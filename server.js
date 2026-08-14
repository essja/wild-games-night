const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Seeding Default Data definitions
const DEFAULT_GUESTS = [
    { id: 'g_1', guest_id: 'G-001', name: 'Ibrahim Kamara', phone_number: '076123456', email: 'ibrahim@example.com', gender: 'boy', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:30', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:30', registered_at: '2026-08-13 14:30', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:31' },
    { id: 'g_2', guest_id: 'G-002', name: 'Alhaji Bah', phone_number: '077987654', email: 'alhaj@example.com', gender: 'boy', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:32', friendName: '', bottlePayment: 'Paid', checkIn: 'Checked In', checkInTime: '2026-08-13 20:12', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:32', registered_at: '2026-08-13 14:32', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:33' },
    { id: 'g_3', guest_id: 'G-003', name: 'Mariama Kamara', phone_number: '078555444', email: 'mariama@example.com', gender: 'girl', rsvp: 'Pending', rsvpTime: '', friendName: '', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'No', terms_version: '', terms_accepted_at: '', registered_at: '2026-08-13 14:40', sms_status: 'Pending', sms_sent_at: '' },
    { id: 'g_5', guest_id: 'G-005', name: 'Kadiatu Bangura', phone_number: '075333222', email: 'kadiatu@example.com', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 14:45', friendName: '', bottlePayment: 'N/A', checkIn: 'Checked In', checkInTime: '2026-08-13 20:15', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 14:45', registered_at: '2026-08-13 14:45', sms_status: 'Sent', sms_sent_at: '2026-08-13 14:46' },
    { id: 'g_6', guest_id: 'G-006', name: 'Abdul Touray', phone_number: '076444888', email: 'abdul@example.com', gender: 'boy', rsvp: 'Pending', rsvpTime: '', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'No', terms_version: '', terms_accepted_at: '', registered_at: '', sms_status: 'Pending', sms_sent_at: '' },
    { id: 'g_7', guest_id: 'G-007', name: 'Mohamed Sesay', phone_number: '077222111', email: 'mohamed@example.com', gender: 'boy', rsvp: 'Declined', rsvpTime: '2026-08-13 15:00', friendName: '', bottlePayment: 'Pending', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'No', terms_version: '', terms_accepted_at: '', registered_at: '', sms_status: 'Failed', sms_sent_at: '' },
    { id: 'g_8', guest_id: 'G-008', name: 'Fatima Jalloh', phone_number: '078111999', email: 'fatima@example.com', gender: 'girl', rsvp: 'Accepted', rsvpTime: '2026-08-13 15:10', friendName: 'Sarah Conteh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 15:10', registered_at: '2026-08-13 15:10', sms_status: 'Sent', sms_sent_at: '2026-08-13 15:11' },
    { id: 'g_9', guest_id: 'G-009', name: 'Sarah Conteh', phone_number: '-', email: '-', gender: 'girl', rsvp: 'Guest Added', rsvpTime: '2026-08-13 15:10', friendName: '', isFriendOf: 'Fatima Jalloh', bottlePayment: 'N/A', checkIn: 'Not Checked In', checkInTime: '', approvalStatus: 'Approved', terms_accepted: 'Yes', terms_version: 'v1.0', terms_accepted_at: '2026-08-13 15:10', registered_at: '2026-08-13 15:10', sms_status: 'N/A', sms_sent_at: '' }
];

const DEFAULT_INVITATIONS = [
    { id: 'i_1', guest_id: 'G-001', guest_name: 'Ibrahim Kamara', invitation_type: 'boy', secure_token: 'ibrahim123', status: 'Accepted', created_at: '2026-08-13 14:00', sent_at: '2026-08-13 14:02', opened_at: '2026-08-13 14:28', responded_at: '2026-08-13 14:30', response: 'Accepted', accepted_at: '2026-08-13 14:30' },
    { id: 'i_2', guest_id: 'G-002', guest_name: 'Alhaji Bah', invitation_type: 'boy', secure_token: 'alhaji123', status: 'Accepted', created_at: '2026-08-13 14:05', sent_at: '2026-08-13 14:06', opened_at: '2026-08-13 14:30', responded_at: '2026-08-13 14:32', response: 'Accepted', accepted_at: '2026-08-13 14:32' },
    { id: 'i_3', guest_id: 'G-003', guest_name: 'Mariama Kamara', invitation_type: 'girl', secure_token: 'mariama123', status: 'Sent', created_at: '2026-08-13 14:10', sent_at: '2026-08-13 14:12', opened_at: '', responded_at: '', response: 'Pending', accepted_at: '' },
    { id: 'i_5', guest_id: 'G-005', guest_name: 'Kadiatu Bangura', invitation_type: 'girl', secure_token: 'kadiatu123', status: 'Accepted', created_at: '2026-08-13 14:15', sent_at: '2026-08-13 14:16', opened_at: '2026-08-13 14:42', responded_at: '2026-08-13 14:45', response: 'Accepted', accepted_at: '2026-08-13 14:45' },
    { id: 'i_6', guest_id: 'G-006', guest_name: 'Abdul Touray', invitation_type: 'boy', secure_token: 'abdul123', status: 'Sent', created_at: '2026-08-13 14:20', sent_at: '2026-08-13 14:21', opened_at: '2026-08-13 18:42', responded_at: '', response: 'Pending', accepted_at: '' },
    { id: 'i_7', guest_id: 'G-007', guest_name: 'Mohamed Sesay', invitation_type: 'boy', secure_token: 'mohamed123', status: 'Declined', created_at: '2026-08-13 14:22', sent_at: '2026-08-13 14:23', opened_at: '2026-08-13 14:58', responded_at: '2026-08-13 15:00', response: 'Declined', accepted_at: '' },
    { id: 'i_8', guest_id: 'G-008', guest_name: 'Fatima Jalloh', invitation_type: 'girl', secure_token: 'fatima123', status: 'Accepted', created_at: '2026-08-13 14:25', sent_at: '2026-08-13 14:26', opened_at: '2026-08-13 15:08', responded_at: '2026-08-13 15:10', response: 'Accepted', accepted_at: '2026-08-13 15:10' }
];

const DEFAULT_CONFIG = {
    eventName: 'Games Night',
    eventVenue: 'Signal Hill Old Road, Congo Cross',
    eventDate: '2026-08-14',
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
    boyWa: `🎉 INVITATION ACCEPTED! 🎉\n\nHi! I, [Name], officially ACCEPT the invitation for Games Night on Friday, 14 August at 8 PM, agree to the rules and will purchase my bottle for Le 150 at the gate! 🍾`,
    girlWa: `🎉 INVITATION ACCEPTED! 🎉\n\nHi! I, [Name], officially ACCEPT the invitation for Games Night on Friday, 14 August at 8 PM, agree to the rules and have registered my friend [Friend]! 💃`
};

// Database Initialization (with Memory Fallback if DATABASE_URL is missing)
let pool = null;
let useMemoryDb = false;
let memoryDb = {
    guests: [...DEFAULT_GUESTS],
    invitations: [...DEFAULT_INVITATIONS],
    config: { ...DEFAULT_CONFIG },
    templates: { ...DEFAULT_TEMPLATES }
};

if (process.env.DATABASE_URL) {
    console.log('Connecting to PostgreSQL using connection URL...');
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
} else {
    console.warn('⚠️ WARNING: No DATABASE_URL found. Running server in MEMORY-ONLY fallback mode.');
    useMemoryDb = true;
}

// SQL query helper
async function query(text, params) {
    if (useMemoryDb) return null;
    const client = await pool.connect();
    try {
        return await client.query(text, params);
    } finally {
        client.release();
    }
}

// Database schema initialization
async function initDb() {
    if (useMemoryDb) return;
    try {
        console.log('Initializing database tables...');
        
        await query(`
            CREATE TABLE IF NOT EXISTS guests (
                id TEXT PRIMARY KEY,
                guest_id TEXT UNIQUE,
                name TEXT,
                phone_number TEXT,
                email TEXT,
                gender TEXT,
                rsvp TEXT,
                rsvp_time TEXT,
                friend_name TEXT,
                bottle_payment TEXT,
                check_in TEXT,
                check_in_time TEXT,
                approval_status TEXT,
                terms_accepted TEXT,
                terms_version TEXT,
                terms_accepted_at TEXT,
                registered_at TEXT,
                sms_status TEXT,
                sms_sent_at TEXT,
                is_friend_of TEXT
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS invitations (
                id TEXT PRIMARY KEY,
                guest_id TEXT,
                guest_name TEXT,
                invitation_type TEXT,
                secure_token TEXT UNIQUE,
                status TEXT,
                created_at TEXT,
                sent_at TEXT,
                opened_at TEXT,
                responded_at TEXT,
                response TEXT,
                accepted_at TEXT
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS event_config (
                id INT PRIMARY KEY DEFAULT 1,
                data JSONB
            );
        `);

        await query(`
            CREATE TABLE IF NOT EXISTS letter_templates (
                id INT PRIMARY KEY DEFAULT 1,
                data JSONB
            );
        `);

        // Check if database needs seeding
        const guestCheck = await query('SELECT count(*) FROM guests');
        if (parseInt(guestCheck.rows[0].count) === 0) {
            console.log('Seeding initial guests...');
            for (let g of DEFAULT_GUESTS) {
                await query(`
                    INSERT INTO guests (id, guest_id, name, phone_number, email, gender, rsvp, rsvp_time, friend_name, bottle_payment, check_in, check_in_time, approval_status, terms_accepted, terms_version, terms_accepted_at, registered_at, sms_status, sms_sent_at, is_friend_of)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                `, [g.id, g.guest_id, g.name, g.phone_number, g.email, g.gender, g.rsvp, g.rsvpTime, g.friendName, g.bottlePayment, g.checkIn, g.checkInTime, g.approvalStatus, g.terms_accepted, g.terms_version, g.terms_accepted_at, g.registered_at, g.sms_status, g.sms_sent_at, g.isFriendOf || '']);
            }
        }

        const inviteCheck = await query('SELECT count(*) FROM invitations');
        if (parseInt(inviteCheck.rows[0].count) === 0) {
            console.log('Seeding initial invitations...');
            for (let i of DEFAULT_INVITATIONS) {
                await query(`
                    INSERT INTO invitations (id, guest_id, guest_name, invitation_type, secure_token, status, created_at, sent_at, opened_at, responded_at, response, accepted_at)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                `, [i.id, i.guest_id, i.guest_name, i.invitation_type, i.secure_token, i.status, i.created_at, i.sent_at, i.opened_at, i.responded_at, i.response, i.accepted_at]);
            }
        }

        const configCheck = await query('SELECT count(*) FROM event_config');
        if (parseInt(configCheck.rows[0].count) === 0) {
            console.log('Seeding initial configuration...');
            await query('INSERT INTO event_config (id, data) VALUES (1, $1)', [JSON.stringify(DEFAULT_CONFIG)]);
        }

        const templatesCheck = await query('SELECT count(*) FROM letter_templates');
        if (parseInt(templatesCheck.rows[0].count) === 0) {
            console.log('Seeding initial templates...');
            await query('INSERT INTO letter_templates (id, data) VALUES (1, $1)', [JSON.stringify(DEFAULT_TEMPLATES)]);
        }

        console.log('PostgreSQL database is ready!');
    } catch (e) {
        console.error('Failed to initialize database tables, running with memory fallback:', e);
        useMemoryDb = true;
    }
}

// REST API routes

// GET full state
app.get('/api/state', async (req, res) => {
    try {
        if (useMemoryDb) {
            return res.json(memoryDb);
        }
        
        const guestsResult = await query('SELECT * FROM guests');
        const invitesResult = await query('SELECT * FROM invitations');
        const configResult = await query('SELECT data FROM event_config WHERE id = 1');
        const templatesResult = await query('SELECT data FROM letter_templates WHERE id = 1');

        // Map column snake_case back to frontend expected camelCase
        const mappedGuests = guestsResult.rows.map(g => ({
            id: g.id,
            guest_id: g.guest_id,
            name: g.name,
            phone_number: g.phone_number,
            email: g.email,
            gender: g.gender,
            rsvp: g.rsvp,
            rsvpTime: g.rsvp_time,
            friendName: g.friend_name,
            bottlePayment: g.bottle_payment,
            checkIn: g.check_in,
            checkInTime: g.check_in_time,
            approvalStatus: g.approval_status,
            terms_accepted: g.terms_accepted,
            terms_version: g.terms_version,
            terms_accepted_at: g.terms_accepted_at,
            registered_at: g.registered_at,
            sms_status: g.sms_status,
            sms_sent_at: g.sms_sent_at,
            isFriendOf: g.is_friend_of
        }));

        res.json({
            guests: mappedGuests,
            invitations: invitesResult.rows,
            config: configResult.rows[0]?.data || DEFAULT_CONFIG,
            templates: templatesResult.rows[0]?.data || DEFAULT_TEMPLATES
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST upsert guest
app.post('/api/guests/upsert', async (req, res) => {
    try {
        const g = req.body;
        if (!g.guest_id || !g.name) {
            return res.status(400).json({ error: 'Missing guest_id or name' });
        }

        if (useMemoryDb) {
            const idx = memoryDb.guests.findIndex(item => item.guest_id === g.guest_id);
            if (idx >= 0) memoryDb.guests[idx] = g;
            else memoryDb.guests.push(g);
            return res.json({ success: true, guest: g });
        }

        await query(`
            INSERT INTO guests (id, guest_id, name, phone_number, email, gender, rsvp, rsvp_time, friend_name, bottle_payment, check_in, check_in_time, approval_status, terms_accepted, terms_version, terms_accepted_at, registered_at, sms_status, sms_sent_at, is_friend_of)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (guest_id) DO UPDATE SET
                name = EXCLUDED.name,
                phone_number = EXCLUDED.phone_number,
                email = EXCLUDED.email,
                gender = EXCLUDED.gender,
                rsvp = EXCLUDED.rsvp,
                rsvp_time = EXCLUDED.rsvp_time,
                friend_name = EXCLUDED.friend_name,
                bottle_payment = EXCLUDED.bottle_payment,
                check_in = EXCLUDED.check_in,
                check_in_time = EXCLUDED.check_in_time,
                approval_status = EXCLUDED.approval_status,
                terms_accepted = EXCLUDED.terms_accepted,
                terms_version = EXCLUDED.terms_version,
                terms_accepted_at = EXCLUDED.terms_accepted_at,
                registered_at = EXCLUDED.registered_at,
                sms_status = EXCLUDED.sms_status,
                sms_sent_at = EXCLUDED.sms_sent_at,
                is_friend_of = EXCLUDED.is_friend_of
        `, [
            g.id || `g_${Date.now()}`,
            g.guest_id,
            g.name,
            g.phone_number || '',
            g.email || '',
            g.gender || 'boy',
            g.rsvp || 'Pending',
            g.rsvpTime || '',
            g.friendName || '',
            g.bottlePayment || 'Pending',
            g.checkIn || 'Not Checked In',
            g.checkInTime || '',
            g.approvalStatus || 'Approved',
            g.terms_accepted || 'No',
            g.terms_version || '',
            g.terms_accepted_at || '',
            g.registered_at || '',
            g.sms_status || 'Pending',
            g.sms_sent_at || '',
            g.isFriendOf || ''
        ]);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST upsert invitation
app.post('/api/invitations/upsert', async (req, res) => {
    try {
        const i = req.body;
        if (!i.secure_token) {
            return res.status(400).json({ error: 'Missing secure_token' });
        }

        if (useMemoryDb) {
            const idx = memoryDb.invitations.findIndex(item => item.secure_token === i.secure_token);
            if (idx >= 0) memoryDb.invitations[idx] = i;
            else memoryDb.invitations.push(i);
            return res.json({ success: true, invitation: i });
        }

        await query(`
            INSERT INTO invitations (id, guest_id, guest_name, invitation_type, secure_token, status, created_at, sent_at, opened_at, responded_at, response, accepted_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (secure_token) DO UPDATE SET
                guest_id = EXCLUDED.guest_id,
                guest_name = EXCLUDED.guest_name,
                invitation_type = EXCLUDED.invitation_type,
                status = EXCLUDED.status,
                created_at = EXCLUDED.created_at,
                sent_at = EXCLUDED.sent_at,
                opened_at = EXCLUDED.opened_at,
                responded_at = EXCLUDED.responded_at,
                response = EXCLUDED.response,
                accepted_at = EXCLUDED.accepted_at
        `, [
            i.id || `i_${Date.now()}`,
            i.guest_id,
            i.guest_name,
            i.invitation_type,
            i.secure_token,
            i.status,
            i.created_at,
            i.sent_at || '',
            i.opened_at || '',
            i.responded_at || '',
            i.response || 'Pending',
            i.accepted_at || ''
        ]);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST update config
app.post('/api/config', async (req, res) => {
    try {
        const c = req.body;
        if (useMemoryDb) {
            memoryDb.config = c;
            return res.json({ success: true });
        }

        await query(`
            INSERT INTO event_config (id, data) VALUES (1, $1)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `, [JSON.stringify(c)]);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST update templates
app.post('/api/templates', async (req, res) => {
    try {
        const t = req.body;
        if (useMemoryDb) {
            memoryDb.templates = t;
            return res.json({ success: true });
        }

        await query(`
            INSERT INTO letter_templates (id, data) VALUES (1, $1)
            ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `, [JSON.stringify(t)]);

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST sync whole database (Export/Import)
app.post('/api/sync', async (req, res) => {
    try {
        const { guests: newGuests, invitations: newInv } = req.body;
        if (!newGuests || !newInv) {
            return res.status(400).json({ error: 'Missing guests or invitations list' });
        }

        if (useMemoryDb) {
            memoryDb.guests = newGuests;
            memoryDb.invitations = newInv;
            return res.json({ success: true });
        }

        // Destructive overwrite
        await query('DELETE FROM guests');
        await query('DELETE FROM invitations');

        for (let g of newGuests) {
            await query(`
                INSERT INTO guests (id, guest_id, name, phone_number, email, gender, rsvp, rsvp_time, friend_name, bottle_payment, check_in, check_in_time, approval_status, terms_accepted, terms_version, terms_accepted_at, registered_at, sms_status, sms_sent_at, is_friend_of)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            `, [g.id, g.guest_id, g.name, g.phone_number, g.email, g.gender, g.rsvp, g.rsvpTime, g.friendName, g.bottlePayment, g.checkIn, g.checkInTime, g.approvalStatus, g.terms_accepted, g.terms_version, g.terms_accepted_at, g.registered_at, g.sms_status, g.sms_sent_at, g.isFriendOf || '']);
        }

        for (let i of newInv) {
            await query(`
                INSERT INTO invitations (id, guest_id, guest_name, invitation_type, secure_token, status, created_at, sent_at, opened_at, responded_at, response, accepted_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `, [i.id, i.guest_id, i.guest_name, i.invitation_type, i.secure_token, i.status, i.created_at, i.sent_at, i.opened_at, i.responded_at, i.response, i.accepted_at]);
        }

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Serve static frontend assets
app.use(express.static(__dirname));

// Send SPA entry point index.html for undefined routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize database tables and start the server
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
