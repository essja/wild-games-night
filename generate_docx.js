const fs = require('fs');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, PageBreak } = docx;

// Color Palette
const PURPLE = "6A0D91";
const GOLD = "D4AF37";
const LIGHT_BG = "F7F0FA";
const TEXT_DARK = "222222";
const MAGENTA = "B80058";
const CYAN = "008080";
const GREEN = "276738";
const RED_WINE = "8B0000";
const DEEP_BLUE = "1B3B6F";
const HOT_PINK = "E60073";
const DEEP_VIOLET = "4A0E4E";
const RUBY_RED = "990033";

const createHeader = (title, subtitle) => {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [
            new TextRun({ text: title, bold: true, size: 36, color: MAGENTA, font: "Calibri" }),
            new TextRun({ text: `\n${subtitle}`, italic: true, size: 22, color: PURPLE, font: "Calibri" })
        ]
    });
};

const createCardTable = (items, categoryColor) => {
    const rows = items.map((item, index) => {
        return new TableRow({
            children: [
                new TableCell({
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    shading: { fill: categoryColor },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                        right: { style: BorderStyle.NONE }
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({ text: `#${index + 1}`, bold: true, size: 22, color: "FFFFFF", font: "Calibri" })
                            ]
                        })
                    ]
                }),
                new TableCell({
                    width: { size: 90, type: WidthType.PERCENTAGE },
                    shading: { fill: index % 2 === 0 ? LIGHT_BG : "FFFFFF" },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
                    },
                    children: [
                        new Paragraph({
                            spacing: { before: 80, after: 80 },
                            children: [
                                new TextRun({ text: item, size: 22, color: TEXT_DARK, font: "Calibri" })
                            ]
                        })
                    ]
                })
            ]
        });
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows
    });
};

// PAGE 1: 25 Spicy Truth Questions
const page1Questions = [
    "What is your biggest romantic or sensual turn-on that most people don't know about?",
    "Have you ever had a crush on someone currently in this room? If yes, who?",
    "What is the wilder fantasy you've had that you have never carried out?",
    "What was your most unforgettable romantic or sensual experience?",
    "What is one physical attribute in a partner that instantly attracts you?",
    "Have you ever sent or received a risky text by mistake? What happened?",
    "What is your secret guilty pleasure when you are home alone?",
    "What is the most adventurous place you've ever had a romantic moment?",
    "What song instantly puts you in a seductive or romantic mood?",
    "If you could whisper anything into the ear of the person on your left, what would it be?",
    "Have you ever pretended to like something during intimacy just to be polite?",
    "What is your opinion on public displays of affection (PDA)? How far would you go?",
    "What is the boldest move someone has ever made on you?",
    "What is your favorite part of your own body that you feel most confident about?",
    "Have you ever had a dream about someone in this group?",
    "What is a major romantic turn-off for you that instantly ruins the mood?",
    "What is the longest period you've gone without any romantic contact?",
    "Describe your ideal wild date night in three descriptive words.",
    "Have you ever used a pick-up line that actually worked?",
    "What is one romantic rule you love to break when you're with someone special?",
    "If you had to pick one person in this room to take on a secret midnight getaway, who is it?",
    "What is the most daring text message currently saved on your phone?",
    "Have you ever caught someone checking you out in public?",
    "What is your favorite outfit to wear when you want to feel attractive?",
    "What is one thing you've always wanted to try with a partner but were too shy to ask?"
];

// PAGE 2: 25 Spicy Dares
const page2Dares = [
    "Give a 15-second sensual lap dance or slow dance to the person sitting across from you.",
    "Whisper your best seductive line into the ear of the person to your right.",
    "Let the group choose a 30-second romantic playlist song and dance to it center stage.",
    "Demonstrate your best seductive walk across the room while keeping eye contact.",
    "Slowly feed a piece of fruit or snack to the person on your left.",
    "Give the person sitting next to you a 30-second neck or shoulder massage.",
    "Strike 3 different seductive poses for the room while taking pretend photo shoots.",
    "Gently bite your lip while looking into the eyes of the person to your left for 10 seconds.",
    "Let another player rewrite your WhatsApp or Instagram bio for the rest of the night.",
    "Do your best impression of a romance movie confession to the player on your right.",
    "Let someone in the group whisper a secret dare into your ear that you must execute.",
    "Show the last photo in your phone camera roll or take a bold selfie right now.",
    "Serenade someone in the group with a snippet of a romantic song.",
    "Let the person on your left draw a tiny heart on your collarbone or wrist with a pen.",
    "Maintain unbroken eye contact with the person across from you for 20 seconds without laughing.",
    "Give a compliment to everyone in the room focusing on their most attractive feature.",
    "Unbutton or adjust one item of clothing in a dramatic, slow-motion manner.",
    "Allow the group to check your recent search history for 15 seconds.",
    "Re-enact a romantic scene from a famous movie with a partner chosen by the group.",
    "Whisper a spicy secret to the host of the party.",
    "Give the person on your right a 10-second hand massage while speaking softly.",
    "Do 10 push-ups or squats while maintaining eye contact with someone in the room.",
    "Let the group pick a nickname for you that everyone must call you for the next hour.",
    "Post a mysterious caption on your social media story right now.",
    "Take a shot or drink your beverage in the most dramatic, seductive way possible."
];

// PAGE 3: 25 WILD CARDS - DO THIS OR DRINK / TAKE A HIT
const page3WildCards = [
    "Take a selfie and post it with the caption \"High AF\" or take three hits.",
    "Without using your hands, remove a piece of clothing from the player next to you or drink three times.",
    "Feed the person to your left a snack without using your hands or take a hit.",
    "Text your ex with your top three emojis, no explanation. Do this or drink four times.",
    "Act out your favorite sex position with the person across from you. Do this or drink two times.",
    "Let the person to your right send a text message of their choice to anyone in your contacts or drink three times.",
    "Give a 30-second sensual lap dance to the player of your choice or take two hits.",
    "Call a random contact and sing 15 seconds of a romance song or drink three times.",
    "Let the group look through your photos for 20 seconds or drink four times.",
    "Whisper a wild secret into the ear of the person to your left or take two hits.",
    "Give a 20-second shoulder massage to the player across from you or drink two times.",
    "Show the room your last searched item on your phone browser or take three hits.",
    "Let another player rewrite your social media bio for the rest of the night or drink four times.",
    "Do 10 push-ups while someone sits lightly on your back or drink three times.",
    "Swap an item of clothing with the player to your right or take two hits.",
    "Unbutton three buttons of your shirt/blouse for the rest of the game or drink three times.",
    "Let the person across from you draw on your arm or face with a marker or take three hits.",
    "Give a genuine romantic compliment to every person in the room or drink two times.",
    "Allow the group to pick a funny nickname for you for the rest of the night or take a hit.",
    "Hold hands with the person to your left until your next turn or drink two times.",
    "Let someone in the room whisper a secret dare into your ear and complete it or drink three times.",
    "Take a shot of your drink using no hands or take two hits.",
    "Post a mysterious 5-second video on your social media story right now or drink four times.",
    "Make eye contact with the person across from you for 30 seconds without smiling or drink two times.",
    "Re-enact a romantic movie scene with the person to your right or drink three times."
];

// PAGE 4: 25 EXTREME VIP WILD CARDS
const page4WildCards = [
    "Kiss the neck of the person to your left for 5 seconds.",
    "Let the group choose two players to slow dance closely together for 30 seconds.",
    "Take a sip of your drink directly from another player's glass without using your hands.",
    "Whisper the most adventurous fantasy you've never told anyone to the person on your right.",
    "Allow the player on your left to give you a light 10-second waist hold or hug from behind.",
    "Let someone in the group trace an imaginary line down your spine with their finger.",
    "Choose a partner to do a 15-second seductive couple photo pose with you for the group.",
    "Say the most sensual compliment you can think of to the host of the party.",
    "Let another player gently feed you a drink or treat while your eyes are closed.",
    "Demonstrate your absolute best flirtatious smile and wink to everyone around the table.",
    "Allow a player chosen by the group to whisper a secret command that you must perform.",
    "Hold hands tightly with the person to your left for the next two rounds of the game.",
    "Describe what you find most attractive about the person sitting directly opposite you.",
    "Do a 10-second seductive runway walk towards the person of your choice.",
    "Let another player gently brush your hair back while looking into your eyes.",
    "Give a 5-second gentle kiss on the cheek or hand of every player in the circle.",
    "Re-create your favorite romantic movie kiss scene in slow motion (air kiss allowed!).",
    "Let the group look through your phone gallery for 10 seconds while you hold it.",
    "Whisper a naughty secret or guilty pleasure into the ear of the person on your left.",
    "Sit on the lap of the person to your right for the next full turn.",
    "Allow someone to write a 1-word romantic tattoo on your forearm with an eye marker/pen.",
    "Swap one small item of jewelry or accessory with the player sitting across from you.",
    "Take a 5-second romantic selfie with the person to your right.",
    "Let the group vote on who in the room has the best seductive voice.",
    "Toast to the wildest moment of the night and take a victory drink with the room!"
];

// PAGE 5: 25 DRINK IF... & EXTREME DARES (PART 1)
const page5DrinkAndDares = [
    "Drink: If you've had a one-night stand.",
    "Drink: If you've sent a nude today.",
    "Drink: If you've had sex in public.",
    "Drink: If you've watched porn this week.",
    "Drink: If you've hooked up with someone in this room before.",
    "Drink: If you've fantasized about someone here.",
    "Drink: 2 sips for every toy you own.",
    "Drink: If you've done it in a car.",
    "Drink: If you've done it in a bathroom.",
    "Drink: If you've lied about an orgasm.",
    "Drink: If you've been caught.",
    "Drink: If you've used a dating app for hookups.",
    "Drink: Finish your drink if you've done anal.",
    "Drink: If you've had a threesome.",
    "Drink: If you've sexted at work.",
    "Drink: If you've hooked up with an ex.",
    "Dare: Let someone choose a sex position and act it out for 30 sec on the bed.",
    "Dare: Edge yourself for 2 minutes while someone watches.",
    "Dare: Let someone use ice on your body while you're blindfolded.",
    "Dare: Dirty talk into someone's ear for 1 minute straight.",
    "Dare: Let someone pick 3 places and touch you there for 20 sec each.",
    "Dare: Have sex with lights on while someone stays in the room.",
    "Dare: Use a toy on your partner for one round.",
    "Dare: Let someone control your pleasure for 5 minutes.",
    "Dare: Kiss down someone's body until you hit their waist."
];

// PAGE 6: 25 EXTREME DARES & ACTION CARDS (PART 2)
const page6DaresAndActions = [
    "Dare: Finger someone through underwear for 1 minute.",
    "Dare: Give someone oral until they tell you to stop.",
    "Card: Suck someone else's nipples.",
    "Card: Give someone a passionate kiss.",
    "Card: Anyone with a lighter in their pocket, take a hit.",
    "Drink: If you've ever had a secret relationship or fling.",
    "Drink: If you've ever flirted with someone to get a free drink or entry.",
    "Drink: If you've ever taken a sensual photo in front of a mirror.",
    "Drink: 3 sips if you're currently wearing black or lace underwear.",
    "Drink: If you've ever been kissed under the stars.",
    "Dare: Let the person to your left trace your lips with their finger while looking into your eyes.",
    "Dare: Give a 20-second neck kiss to the player sitting to your right.",
    "Dare: Whisper your most daring fantasy to the person sitting across from you.",
    "Dare: Let someone unbutton your shirt or top by one notch.",
    "Dare: Do 5 sensual hip sways to the music in front of the group.",
    "Dare: Allow another player to feed you a sip of your drink while holding your waist.",
    "Dare: Strike a seductive pose with the person on your left for a 5-second group photo.",
    "Dare: Gently bite the earlobe of the person next to you for 3 seconds.",
    "Drink: Take 2 sips if you've ever sent a risky message late at night.",
    "Drink: Finish your drink if you've ever kissed more than one person in a single night.",
    "Dare: Let the host of the party choose a secret dare for you to execute immediately.",
    "Dare: Whisper a naughty compliment into the ear of every person in the circle.",
    "Drink: If you've ever kissed someone on a first date.",
    "Dare: Let the group vote on who is the wildest player in the room and give them a toast!",
    "Cheers! Everyone takes a victory drink together for completing Wild Games Night!"
];

// PAGE 7: 25 EXCLUSIVE "DRINK IF..." CARDS
const page7DrinkIfCards = [
    "Drink: 3 sips if you've done it with the lights off.",
    "Drink: If you've used handcuffs.",
    "Drink: If you've done it in under 5 minutes.",
    "Drink: If you've gone home with someone from a bar.",
    "Drink: If you've done it in water.",
    "Drink: If you've filmed it.",
    "Drink: If you've done it with someone 5+ years older/younger.",
    "Drink: If you've done it on the first date.",
    "Drink: If you've had a hookup in the last 30 days.",
    "Drink: 2 sips if you've sexted today.",
    "Drink: If you've had sex in a car.",
    "Drink: If you've had sex in a public place.",
    "Drink: If you've done it with someone's ex.",
    "Drink: If you've had a one-night stand.",
    "Drink: 3 sips if you've had a friends-with-benefits.",
    "Drink: If you've been ghosted after sex.",
    "Drink: If you've done it with lights on.",
    "Drink: Finish your drink if you've done anal.",
    "Drink: If you've used a sex toy.",
    "Drink: 2 sips for every toy you own.",
    "Drink: If you've watched porn this week.",
    "Drink: If you've done it in a bathroom.",
    "Drink: If you've done it in water - pool, shower, etc.",
    "Drink: If you've faked it.",
    "Drink: Chug if you've had a threesome."
];

// PAGE 8: 25 SPICY & SENSUAL ADULT PARTY DARES
const page8SensualDares = [
    "Dare: Demonstrate your favorite sex position using a pillow or cushion as your partner.",
    "Dare: Give the person sitting to your left a 30-second slow massage on their inner thigh.",
    "Dare: Blindfold yourself and let 3 different players kiss your cheek — guess who is who!",
    "Dare: Slowly remove one accessory or item of clothing using only your teeth or mouth.",
    "Dare: Trace a line with an ice cube from the neck of the person across from you down to their waist.",
    "Dare: Whisper your dirtiest bedroom confession into the ear of the player sitting to your right.",
    "Dare: Give a 20-second seductive lap dance to the player chosen by the rest of the group.",
    "Dare: Sit on the lap of the person across from you while they whisper 3 seductive prompts to you.",
    "Dare: Gently bite the neck or collarbone of the player sitting to your left for 5 seconds.",
    "Dare: Let the player to your right place their hand on your chest and feel your heartbeat while looking into your eyes.",
    "Dare: Unbutton 2 buttons of your shirt/blouse using only one hand while making eye contact.",
    "Dare: Allow another player to blindfold you and slowly feed you a piece of fruit or chocolate.",
    "Dare: Re-enact your most memorable bedroom experience in slow motion without using words (charades style!).",
    "Dare: Kiss the neck of the person on your right 3 times, each time a little softer.",
    "Dare: Let the group vote on a pair of players to kiss passionately for 5 seconds.",
    "Dare: Let the person to your left trace your collarbone with a feather, finger, or ice cube for 15 seconds.",
    "Dare: Do 5 slow, seductive hip circles while standing center stage in front of the room.",
    "Dare: Allow the player across from you to run their fingers through your hair while holding your chin.",
    "Dare: Give a 15-second gentle waist or lower-back massage to the person sitting to your left.",
    "Dare: Let another player write a secret naughty word on your skin with an eyeliner/marker.",
    "Dare: Lie flat on your back and let someone slowly drop 3 drops of water on your stomach.",
    "Dare: Take a sip of your drink while holding hands tightly with the player sitting opposite you.",
    "Dare: Give a seductive compliment about the body of the person sitting to your right.",
    "Dare: Allow someone in the room to whisper their wildest fantasy in your ear — you must keep it a secret!",
    "Dare: Toast to the spiciest night ever and take a double shot with your chosen partner!"
];

// PAGE 9: 25 AFTER-DARK VIP COUPLES & GROUP SEX DARES (NEW 18+ UNLIMITED EDITION)
const page9AfterDarkDares = [
    "Dare: Let someone trace a warm line down your belly with their lips for 10 seconds.",
    "Dare: Give the player of your choice a 20-second seductive shoulder and back massage while blindfolded.",
    "Dare: Hold the person sitting across from you closely by the waist and whisper your favorite bedroom position.",
    "Dare: Allow another player to gently untie or adjust one strap/button of your outfit.",
    "Dare: Demonstrate 3 different intimate physical touch techniques on a pillow in front of the group.",
    "Dare: Let the player on your left trace your lips with a piece of ice or a warm finger for 10 seconds.",
    "Dare: Give a passionate 5-second kiss on the collarbone of the person sitting to your right.",
    "Dare: Sit back-to-back with a partner chosen by the group and describe your wildest dream encounter.",
    "Dare: Allow someone in the circle to lightly run their fingers along your inner arm up to your neck.",
    "Dare: Whisper a bold proposal into the ear of the person to your left and let them react out loud.",
    "Dare: Let another player slowly feed you a sip of your drink while holding unbroken eye contact.",
    "Dare: Re-enact a 15-second romantic movie scene on the couch with a partner of your choice.",
    "Dare: Strike a seductive double pose with the player across from you for a group screenshot/photo.",
    "Dare: Allow the person to your right to write a secret initials tattoo on your hip or shoulder with a pen.",
    "Dare: Let two players hold your hands while you whisper your biggest turn-on to the room.",
    "Dare: Give a 15-second gentle neck massage to the host of the party.",
    "Dare: Slowly undo your belt or loosen your collar in a dramatic slow-motion fashion.",
    "Dare: Let the player on your left choose a romantic song and slow dance with you for 30 seconds.",
    "Dare: Gently blow warm air on the neck or ear of the person sitting to your right.",
    "Dare: Allow someone to place their hand over your heart while you confess one deep romantic secret.",
    "Dare: Do a 10-second seductive strut towards the player of your choice and end with a wink.",
    "Dare: Let another player use a feather or light touch on your lower back for 15 seconds.",
    "Dare: Give a passionate 3-second kiss on the cheek or neck to every player in the circle.",
    "Dare: Let the group assign you a secret bedroom nickname that you must answer to for the rest of the night.",
    "Dare: Toast to the boldest move of the night and take a double victory shot with the whole room!"
];

// PAGE 10: 25 ULTIMATE MIDNIGHT FANTASY DARES (NEW 18+ GRAND FINALE EDITION)
const page10GrandFinaleDares = [
    "Dare: Lie back for 20 seconds while the player to your right gently massages your temples and neck.",
    "Dare: Let another player choose a piece of fruit or candy and feed it to you without using hands.",
    "Dare: Whisper a naughty riddle into the ear of the person sitting across from you.",
    "Dare: Allow the player to your left to trace your jawline down to your throat with a gentle touch.",
    "Dare: Demonstrate your best flirtatious glance across the room to 3 different players.",
    "Dare: Give a 15-second sensual back massage to the player sitting to your right.",
    "Dare: Let someone in the room blindfold you while another player whispers a secret hint to guess who it is.",
    "Dare: Hold a 10-second close embrace with the player of your choice while soft music plays.",
    "Dare: Allow another player to slowly adjust your hair and kiss your forehead or cheek.",
    "Dare: Describe your dream romantic getaway destination in descriptive sensual detail.",
    "Dare: Let the person to your left gently hold your wrists while you reveal your favorite turn-on.",
    "Dare: Give a 10-second playful lap dance to the player sitting directly opposite you.",
    "Dare: Unbutton the top button of your shirt/blouse while maintaining unbroken eye contact with the host.",
    "Dare: Let someone trace an imaginary heart on your stomach or back with their fingertip.",
    "Dare: Re-create a passionate romance scene with a partner chosen by a group vote.",
    "Dare: Whisper your top three favorite physical attributes of the person sitting to your right.",
    "Dare: Allow another player to lightly brush an ice cube against your collarbone for 5 seconds.",
    "Dare: Strike 3 dramatic, romantic poses with your chosen partner while the group counts down.",
    "Dare: Let the player on your left give you a 10-second gentle hand and arm massage.",
    "Dare: Share the most daring location you've ever thought about having a secret rendezvous.",
    "Dare: Allow someone to place a romantic sticker or mark on your shoulder for the rest of the game.",
    "Dare: Give a 5-second passionate kiss on the hand or wrist of every player of the opposite sex.",
    "Dare: Let the group select a romantic playlist track and dance center stage for 45 seconds.",
    "Dare: Whisper a secret vow to the person across from you that you must keep for the night.",
    "GRAND FINALE CHEERS: The entire room stands up, raises their glasses, and takes a final celebration shot for completing 10 full pages of Wild Games Night!"
];

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                createHeader("🔥 WILD GAMES NIGHT 🔥", "PAGE 1: 25 BOLD TRUTH QUESTIONS (18+ EDITION)"),
                createCardTable(page1Questions, MAGENTA),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("💋 WILD GAMES NIGHT 💋", "PAGE 2: 25 EXCITING DARES (18+ EDITION)"),
                createCardTable(page2Dares, PURPLE),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("🍸 WILD GAMES NIGHT 🍸", "PAGE 3: 25 WILD CARDS - DO THIS OR DRINK / TAKE A HIT"),
                createCardTable(page3WildCards, GREEN),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("👑 WILD GAMES NIGHT 👑", "PAGE 4: 25 EXTREME VIP WILD CARDS (18+ EDITION)"),
                createCardTable(page4WildCards, CYAN),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("🍹 WILD GAMES NIGHT 🍹", "PAGE 5: 25 DRINK IF... & EXTREME DARES (PART 1)"),
                createCardTable(page5DrinkAndDares, RED_WINE),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("🔥 WILD GAMES NIGHT 🔥", "PAGE 6: 25 EXTREME DARES & ACTION CARDS (PART 2)"),
                createCardTable(page6DaresAndActions, PURPLE),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("🍺 WILD GAMES NIGHT 🍺", "PAGE 7: 25 EXCLUSIVE DRINK IF... CARDS (18+ EDITION)"),
                createCardTable(page7DrinkIfCards, DEEP_BLUE),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("💋 WILD GAMES NIGHT 💋", "PAGE 8: 25 SPICY & SENSUAL ADULT PARTY DARES (18+ EDITION)"),
                createCardTable(page8SensualDares, HOT_PINK),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("🌙 WILD GAMES NIGHT 🌙", "PAGE 9: 25 AFTER-DARK VIP COUPLES & GROUP SEX DARES"),
                createCardTable(page9AfterDarkDares, DEEP_VIOLET),
                new Paragraph({ children: [new PageBreak()] }),
                createHeader("✨ WILD GAMES NIGHT ✨", "PAGE 10: 25 ULTIMATE MIDNIGHT FANTASY DARES (GRAND FINALE)"),
                createCardTable(page10GrandFinaleDares, RUBY_RED)
            ]
        }
    ]
});

Packer.toBuffer(doc).then((buffer) => {
    const filename = "Wild_Games_Night_Complete_10_Pages.docx";
    fs.writeFileSync(filename, buffer);
    console.log(`Document generated successfully as ${filename}!`);
});
