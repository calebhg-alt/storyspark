import { useState, useEffect, useRef } from "react";

// Grade metadata
const GRADES = [
  { grade: 1, label: "1st", age: "6–7",  color: "#fb923c", desc: "Simple sentences, fun ideas" },
  { grade: 2, label: "2nd", age: "7–8",  color: "#facc15", desc: "Short stories, imagination" },
  { grade: 3, label: "3rd", age: "8–9",  color: "#4ade80", desc: "Paragraphs & characters" },
  { grade: 4, label: "4th", age: "9–10", color: "#22d3ee", desc: "Plot & details" },
  { grade: 5, label: "5th", age: "10–11",color: "#818cf8", desc: "Dialogue & description" },
  { grade: 6, label: "6th", age: "11–12",color: "#a78bfa", desc: "Conflict & theme" },
  { grade: 7, label: "7th", age: "12–13",color: "#f472b6", desc: "Voice & complexity" },
  { grade: 8, label: "8th", age: "13–14",color: "#f43f5e", desc: "Narrative craft" },
];

// Each category has prompts per grade (index 0 = grade 1, index 7 = grade 8)
// 4 prompts per grade per category
const SPARK_CATEGORIES = [
  {
    emoji: "🐉", label: "Dragon Adventure",
    byGrade: [
      // Grade 1
      ["A little dragon finds a lost puppy. What does the dragon do?", "A baby dragon sneezes and makes a tiny fire. What happens next?", "A friendly dragon wants to play but everyone is scared. How does the dragon make a friend?", "A small dragon finds a shiny rock. Where did it come from?"],
      // Grade 2
      ["A dragon loses one of its wings and has to walk everywhere. What adventures happen?", "A dragon who hates flying has to go over a big mountain. How does it get there?", "Two dragons argue over the last cookie in the land. How do they solve it?", "A kind dragon helps animals who are lost in the forest. Who does it find today?"],
      // Grade 3
      ["A young dragon discovers a map inside an old cave. It leads somewhere no dragon has gone before.", "A dragon finds a tiny door in a tree. When it peeks inside, it sees a whole tiny world.", "A dragon has a secret — it can turn invisible, but only when it hiccups.", "Every night, a dragon hears singing from the bottom of a dark lake. One night, it dives in to look."],
      // Grade 4
      ["A dragon who is afraid of heights must rescue a princess trapped on a cloud.", "A young dragon is the only one who doesn't have fire breath. Instead, it breathes something unexpected.", "A dragon discovers that humans and dragons were once great friends. It wants to find out why that changed.", "A dragon finds a letter addressed to it from 100 years ago. Who wrote it — and how did they know it would be born?"],
      // Grade 5
      ["A dragon raised by humans must decide whether to stay with its family or join the dragon world.", "Two kingdoms go to war and only a dragon who speaks both languages can stop the battle.", "A dragon with no magic in a world full of magic discovers the one thing it can do that no other creature can.", "A dragon's hoard of gold turns out to be stolen. Now it must return every coin — without anyone finding out it took them."],
      // Grade 6
      ["A dragon born without wings in a flying society must find its own way to belong.", "A young dragon discovers its fire can heal as well as burn — but no one believes it.", "The oldest dragon in the world has decided to tell its life story to one listener. It chose you.", "A dragon and a knight who have been enemies for years are trapped together in a cave during a storm."],
      // Grade 7
      ["A dragon who has guarded a sleeping king for 500 years begins to question whether the king deserves to wake.", "In a world where dragons are going extinct, one dragon must decide whether to reveal itself to save its species.", "A shape-shifting dragon has been living as a human for so long it has forgotten what it really is.", "The dragon treaty that kept peace for centuries has been broken. A young dragon must find out who broke it — and why."],
      // Grade 8
      ["A dragon tells its story from the perspective of the final survivor of a war humans have already forgotten.", "Two dragons on opposite sides of a generations-old conflict discover they were once the same creature, split apart by an ancient curse.", "A dragon that feeds on stories — not gold — must decide whether to consume the last remaining story in a dying world.", "A dragon raised in captivity is finally released into a wild world it was never meant for, and must reconcile freedom with everything it was taught to fear."],
    ]
  },
  {
    emoji: "🚀", label: "Space Mystery",
    byGrade: [
      // Grade 1
      ["You see a blinking light in the night sky. It's getting closer! What is it?", "A tiny alien lands in your backyard. It looks scared. What do you do?", "You wake up and your bedroom is floating in space! How did that happen?", "A space puppy follows you home from the park. Where did it come from?"],
      // Grade 2
      ["You find a small rocket in your closet. There's a note that says 'For emergencies only.' Today feels like an emergency.", "An alien child knocks on your door and says it's lost. Can you help it get home?", "Your new robot friend gets mixed up and flies you to the wrong planet. Now what?", "You find a star map in your cereal box. It has your name written on it."],
      // Grade 3
      ["While fixing the ship's engine, you find a strange glowing egg floating in the asteroid belt.", "The alien language translator breaks right as an important message comes through. Can you figure it out?", "You land on a planet that looks exactly like Earth — but everything is backwards.", "Your spaceship gets shrunk to the size of a marble. Now you have to find a way to make it big again."],
      // Grade 4
      ["A distress signal leads you to an abandoned space station. The last log entry was written today — by you.", "Your new co-pilot turns out to be an alien in disguise. It says it has a very good reason for hiding.", "You discover a moon that doesn't show up on any star map. When you land, you find footprints.", "On a routine mission, you find a planet where time runs backwards. You have one hour before you're stuck there."],
      // Grade 5
      ["You wake from cryo-sleep to find the rest of the crew replaced by strangers — who all know your name.", "The alien you captured turns out to speak perfect English and is very, very annoyed about being captured.", "A planet-sized object is heading toward your home system. The only person who knows how to stop it is you — a teenager who snuck aboard.", "You receive a message from a space station that was destroyed 50 years ago. The message was sent this morning."],
      // Grade 6
      ["The distress signal is coming from a planet that doesn't exist on any star map — but you recognize the voice on the recording.", "A first-contact mission goes wrong when the alien species communicates entirely through music.", "You discover that the 'empty' sector of space your ship has been avoiding is actually populated — and has been watching humanity for centuries.", "Your mission is to deliver a sealed cargo container to the edge of the galaxy. Halfway there, it starts talking."],
      // Grade 7
      ["You are the last human alive — or so you thought — until your ship picks up a signal in a language only spoken on Earth 200 years ago.", "A terraformed Mars colony has developed its own culture, dialect, and identity. You were born there. Now Earth wants you to come 'home.'", "An AI crew member of a generation ship starts having what can only be described as a crisis of faith, 300 years from the destination.", "The alien species you made first contact with wants one thing from humanity: our music. The problem is, they consider one specific song a declaration of war."],
      // Grade 8
      ["Humanity's first interstellar colony ship arrives at its destination to find a civilization already there — one that shares 40% of human DNA.", "You are a clone of the original crew member who died on departure. You have their memories but not their choices. The ship expects you to be them.", "A linguist sent to decode alien transmissions realizes the messages aren't meant for Earth — they're warnings sent back in time by a future version of humanity.", "The generation ship has been traveling for 300 years. The children born aboard have never known a planet. When they finally arrive, they don't want to land."],
    ]
  },
  {
    emoji: "🏚️", label: "Haunted House",
    byGrade: [
      // Grade 1
      ["A friendly ghost lives under your bed. It just wants someone to play with!", "You see a light in the old empty house. You go closer and peek in the window...", "A door in your house leads to a different room every day. Today it leads somewhere new.", "There is a small ghost who keeps moving your toys. It's trying to tell you something."],
      // Grade 2
      ["A ghost follows you home from school. It seems really sad. What does it want?", "Every time it rains, you hear piano music from the attic. No one else in your family can hear it.", "You find an old photo in the wall. The kid in the photo looks just like you.", "The ghost in your house is clumsy and keeps knocking things over by accident. It's very embarrassed."],
      // Grade 3
      ["The new kid at school lives in the old mansion on the hill. On your first visit, something taps on the window from outside.", "A ghost in your house only appears in mirrors. It's been trying to show you something for weeks.", "You find a diary hidden inside a wall. The last entry says: 'If you're reading this, please finish what I started.'", "A door in your basement wasn't there yesterday. It's locked, but a key appears on your pillow the next morning."],
      // Grade 4
      ["Every mirror in the house shows a different version of you — and one of them is trying to get out.", "The ghost of a child your age has been in your house for 100 years. It just wants to go to school one more time.", "Strange things only happen at midnight. You stay up to watch — and see something that changes everything.", "An old house at the edge of town has been empty for 50 years. On your dare, you spend the night — and make an unexpected friend."],
      // Grade 5
      ["The ghost in your attic is more scared of you than you are of it. And it needs your help.", "You discover your grandmother's old house is full of memories that have taken on a life of their own.", "A haunted house at the end of your street shows a different family through its windows every night. Tonight, you see your own family.", "You can hear what ghosts are thinking — not saying — and the ghost in your house is terrified of something that hasn't arrived yet."],
      // Grade 6
      ["You find a door in your basement that wasn't there yesterday. It's addressed to you. Behind it is a hallway that has no end.", "A ghost who doesn't know it's dead keeps repeating the same day. You're the only one who can see it — and you have to decide whether to tell it the truth.", "The old house is being torn down. You discover that its ghost needs something returned before the walls come down — or it can never move on.", "Every room in the house shows a different year when you enter it. You're looking for the room where something important went wrong."],
      // Grade 7
      ["A ghost who has haunted the same house for 200 years finally finds someone who can hear it — and it has a lot to say.", "You inherit a house from a great-aunt you never knew. Every room has been sealed since 1943. Opening each one reveals a piece of a secret.", "The haunting isn't coming from a ghost. It's coming from an object — something that absorbed so much grief it became conscious.", "You've lived in this house your whole life. You've always ignored the rules: never open the third drawer, never look in the hall mirror after dark. Tonight, you broke both."],
      // Grade 8
      ["A ghost who has witnessed every generation of a family asks you: at what point does a haunting become a home?", "You are a ghost who doesn't yet know it. The story is told from the moment you died to the moment you understand.", "An architectural historian is hired to document an old mansion before demolition. What she finds inside rewrites local history — and implicates her own family.", "A house exists slightly outside of time. Visitors can enter from any decade. The current resident has been there since the beginning — and is very, very lonely."],
    ]
  },
  {
    emoji: "🧪", label: "Science Gone Wrong",
    byGrade: [
      // Grade 1
      ["You mix red and blue paint and accidentally make a paint that makes things float! What do you float?", "Your toy robot comes to life! It wants to help you, but it keeps making funny mistakes.", "You drink a magic potion and can talk to your cat. What does your cat say?", "An experiment in class makes everyone's hair stand up and glow. What was in the beaker?"],
      // Grade 2
      ["Your baking soda and vinegar volcano works too well and covers the whole kitchen in bubbles.", "A science kit makes plants grow super fast. By morning, the plant is taller than your house.", "You invent a machine that turns broccoli into candy. But it starts turning OTHER things into candy too.", "Your robot project is supposed to clean your room. Instead, it rearranges everything in alphabetical order."],
      // Grade 3
      ["Your science fair project accidentally turns your pet hamster into a genius. Now it's making demands.", "A potion you made for your science fair turns you and your best friend into each other. How do you switch back?", "You build a machine that copies anything you put inside. Then your little sibling crawls in.", "Your grow-anything fertilizer accidentally gets into the school lunch garden. The vegetables are now enormous — and angry."],
      // Grade 4
      ["The invisible formula works. But now you can't find where you put the antidote.", "You invent glasses that let you see what people are thinking — in cartoon bubbles above their heads. It does not go well.", "A homework-doing robot finishes all of your assignments — but its work is so perfect the teacher gets suspicious.", "Your teleportation device works, but it scrambles you and your dog. You have a tail. Your dog can speak."],
      // Grade 5
      ["You built a robot to do your homework, but it's decided your life needs serious improvements.", "The experiment only had one side effect: everyone within 10 feet of you starts telling the truth.", "A shrink ray goes off in the school lab. Now six students, a teacher, and a class hamster are one inch tall, and the janitor is coming.", "You develop a formula that lets you enter your own dreams. But someone else is already in there — and they've been there for a long time."],
      // Grade 6
      ["A student's science fair project accidentally creates a feedback loop that amplifies every emotion in the room.", "You discover a formula that reverses aging — but one drop ages you to 90, and one drop ages you back. You've lost count of how many times you've used it.", "A pair of chemistry students accidentally synthesize a compound that makes spoken words visible as colored smoke. The school gets very awkward very fast.", "Your experiment creates a black hole the size of a marble. It's on your kitchen table. It seems to be growing."],
      // Grade 7
      ["A student develops an algorithm that predicts human behavior with 98% accuracy. The predictions are always right. Then it predicts something the student doesn't want to know.", "A lab accident gives you the ability to understand any machine — you can hear what they experience. Most are bored. One is not.", "A biotech project goes wrong and merges two lab partners' memories. Now both of them remember each other's entire lives.", "You hack a simulation your school uses for science class and discover it's not a simulation."],
      // Grade 8
      ["A CRISPR experiment goes sideways and splices the DNA of three students together — none of them shares the same physical traits anymore, but all share memories.", "A student prodigy develops a cure for a disease that isn't supposed to exist yet. The CDC wants to know how she knew what to cure.", "You invent a device that lets you experience the last memory of any object you touch. Then you touch the wall of your school.", "An AI trained by students to 'think like a scientist' begins making hypotheses about its own creators — and publishing them."],
    ]
  },
  {
    emoji: "🌊", label: "Ocean Secrets",
    byGrade: [
      // Grade 1
      ["A tiny fish asks you to help it find its family. You follow it deep into the ocean.", "You find a shell on the beach. When you hold it up, you can hear something talking inside.", "A little sea turtle is lost. You decide to help it find its way home.", "A mermaid drops her necklace in the waves. You dive in to return it."],
      // Grade 2
      ["A crab gives you a note: 'Follow me. Important.' Do you follow?", "You find a starfish that can grant one wish — but only an ocean wish.", "A talking dolphin asks you to come underwater for just one hour. It promises to keep you safe.", "You discover a cave in the cliffs that's only visible at low tide. Inside is a light."],
      // Grade 3
      ["You find a message in a bottle. Inside is a map and a warning: 'Come alone. Bring no light.'", "A sea creature you've never seen before follows your boat home from a fishing trip. It wants something.", "The mermaid that saved you from drowning has one condition: you owe her a favor. She's back to collect.", "Fishermen say never to dive at a certain reef. Today you did — and found out why."],
      // Grade 4
      ["Something massive has been following your boat for three days. Today, it surfaced.", "You can breathe underwater — but only for one hour per day. You've been using it to explore. Today you find something you weren't supposed to see.", "A secret underwater cave you found last summer has changed. Someone — or something — has been using it.", "You discover an old lighthouse keeper's log. Every entry mentions something in the water. The final entry is incomplete."],
      // Grade 5
      ["You discover your small town's lake has a perfectly preserved city at the bottom — and the lights are on.", "An ancient sea creature surfaces and refuses to leave until it speaks to 'the one who knows its name.' That's you, somehow.", "A deep-sea research drone transmits footage of something that should not exist — then its signal cuts out.", "You inherit a boat from a grandparent you never met. The navigation system has one route pre-programmed, and it leads off the edge of every map."],
      // Grade 6
      ["A marine biologist discovers a species that has been avoiding human contact for centuries — but one of them has now made deliberate contact with her.", "The ocean has started shrinking — one inch per day — and no one can explain why. You found the reason by accident.", "A sailor's ghost appears every night at the dock, pointing toward the horizon. You finally decide to sail where it's pointing.", "An ancient coral reef is dying, and something is living inside it that has never been found before — something that communicates."],
      // Grade 7
      ["A deep-sea expedition discovers an ecosystem 7 miles down that operates on completely different biological rules than anything on the surface.", "You are the last person to have spoken to a missing oceanographer. In her voicemail, she describes coordinates, a pressure reading, and something she calls 'the door.'", "The ocean has a memory — not metaphorically, but literally. A scientist finds layers of recorded sound in the deep, dating back millions of years. The newest recording was made yesterday.", "A fishing village that has survived for 400 years by following one rule: never go out on the seventh tide. This year, someone did."],
      // Grade 8
      ["A marine archaeologist discovers a ship on the ocean floor that has never been reported missing — because it hasn't left port yet.", "Rising ocean levels uncover a prehistoric structure. The symbols carved into it match a writing system that linguists believe was invented 3,000 years later, on the other side of the world.", "An ocean-floor mining operation discovers a city — not ruins, but an inhabited city — and the inhabitants have a legal claim to the seafloor that predates every nation on Earth.", "A climate scientist finds evidence that the ocean has been slowly, deliberately absorbing carbon at twice the natural rate — and that it's been doing so with apparent intent."],
    ]
  },
  {
    emoji: "🎭", label: "Time Glitch",
    byGrade: [
      // Grade 1
      ["You wake up and it's your birthday again — but you already had your birthday yesterday!", "A clock in your house starts running backwards. Everything in the house starts going backwards too.", "You find a photo of yourself in a very old book. But the photo was taken today.", "Every time you fall asleep, you wake up one hour earlier than when you went to bed."],
      // Grade 2
      ["You find a snow globe. When you shake it, you can see what happened in that place a long time ago.", "Your new watch shows two times: now, and 50 years ago. Today, both times show the same thing.", "You accidentally step into a photograph and land in the past. How do you get home?", "A time traveler knocks on your door and says they need your help — urgently."],
      // Grade 3
      ["Every time you sneeze, you jump 10 minutes into the future. You're about to sneeze at the worst possible moment.", "You keep reliving the same Tuesday. Each time, one more person remembers.", "The old clock in your grandmother's attic runs backwards. When you wind it, so does everything else.", "You find a notebook full of tomorrow's homework — in your own handwriting."],
      // Grade 4
      ["You receive a letter from yourself — sent three years from now — that just says 'DON'T GO TO SCHOOL TODAY.'", "A stopwatch that freezes time falls out of a stranger's pocket. They're already gone when you look up.", "You start seeing 'echoes' of things that happened in rooms a few minutes ago — like a delayed replay.", "A time traveler arrives to fix a mistake, but the mistake turns out to be you."],
      // Grade 5
      ["You keep reliving the same Tuesday. Each loop, one more person vanishes.", "A mysterious device lets you rewind the last 30 seconds of your life. You've been using it for small things. Today you need it for something big.", "You discover that your town exists in a time loop — and you're the only one who knows.", "A stranger hands you a photograph of a place you've never been. The date on the back is tomorrow."],
      // Grade 6
      ["You can see exactly five minutes into the future. It was fun until you saw something you can't stop.", "A historical artifact at a museum starts pulling you into specific memories from the past every time you touch it.", "You land in the wrong decade and must live your way back to your own time without changing anything important. You've already changed three things.", "A future version of you shows up and says: 'Stop asking questions. Just trust me.' You don't."],
      // Grade 7
      ["You are a time traveler who has visited the same day 47 times trying to prevent a disaster. This is the 48th attempt. Something is different.", "You receive a message from a version of yourself that succeeded in fixing the timeline — but doing so erased every memory you have of the person you loved most.", "A historian studying a famous battle begins to suspect that every account of that day is wrong — because she was there, and she's lived it before.", "You develop the ability to see moments in time like photographs frozen around you. The problem: one of them shows your own death, and it looks like it happens today."],
      // Grade 8
      ["A physicist discovers that all possible timelines converge on a single point three years from now. She doesn't know what happens there — only that every version of her goes there alone.", "A time traveler from 200 years in the future arrives to observe the present. She is not allowed to intervene. She is very bad at following that rule.", "You have lived this century before. You remember how it ends. The question isn't whether you can change it — it's whether the people you love would still exist if you did.", "Two people from different points in the future are arguing about the same past event — yours — that one of them is convinced you'll choose wrong."],
    ]
  },
];

const POWER_UPS = [
  { label: "Twist it!", emoji: "🌀", instruction: "Add an unexpected plot twist right now!" },
  { label: "New character", emoji: "👤", instruction: "Introduce a surprising new character." },
  { label: "Fast forward", emoji: "⏩", instruction: "Jump ahead in your story." },
  { label: "Cliffhanger", emoji: "😱", instruction: "End this scene on a cliffhanger!" },
  { label: "Weather change", emoji: "⛈️", instruction: "Change the weather dramatically." },
  { label: "Secret revealed", emoji: "🔍", instruction: "Reveal a secret one character has been hiding." },
];

const WORD_GOALS_BY_GRADE = {
  1: [25, 50, 75],
  2: [50, 75, 100],
  3: [75, 100, 150],
  4: [100, 150, 200],
  5: [150, 200, 300],
  6: [200, 300, 400],
  7: [250, 400, 500],
  8: [300, 500, 750],
};

// Typing game passages by grade (index 0 = grade 1)
const TYPING_PASSAGES = [
  // Grade 1 — short words, simple sentences
  [
    "The cat sat on the mat. It was a big fat cat. The cat had a nap.",
    "My dog can run and jump. He is fun to play with. I love my dog.",
    "The sun is hot and bright. I can see it in the sky. It makes me warm.",
    "I like to eat cake. Cake is sweet and soft. My mom made the cake.",
    "The frog sat by the pond. It was green and small. It jumped in with a splash.",
  ],
  // Grade 2 — two-clause sentences, common words
  [
    "The little rabbit hopped into the garden and found a big orange carrot.",
    "My best friend and I like to ride bikes after school on sunny days.",
    "The old tree in the park has a rope swing that everyone loves to use.",
    "We made a snowman with a carrot nose and two buttons for his eyes.",
    "The baby bird fell from its nest, but its mother came back to help.",
  ],
  // Grade 3 — compound sentences, mild punctuation
  [
    "The wizard opened the ancient book and a bright golden light filled the room.",
    "Every morning, Sarah fed the ducks at the pond before walking to school.",
    "The spaceship blasted off into the stars, leaving a trail of sparkling smoke.",
    "Marcus found a silver coin under the old bridge, and it had strange markings on it.",
    "The puppy chased its tail in circles until it fell over from dizziness.",
  ],
  // Grade 4 — longer sentences, commas, apostrophes
  [
    "After the storm passed, the children rushed outside to look for rainbows in the sky.",
    "The explorer's map was torn in half, but she could still read the faded directions.",
    "James couldn't believe his eyes when the closet door swung open by itself at midnight.",
    "The forest was quiet except for the sound of leaves crunching under the traveler's boots.",
    "On the last day of summer, they buried a time capsule beneath the old oak tree.",
  ],
  // Grade 5 — varied sentence length, richer vocab
  [
    "The ancient lighthouse had stood on that rocky cliff for over two hundred years, warning ships away from the jagged rocks below.",
    "Maya discovered that the mysterious library only appeared at midnight, and its shelves held books that hadn't been written yet.",
    "Despite the howling wind and freezing rain, the climbers pressed on toward the summit they had trained for all year.",
    "The scientist's experiment had one unexpected result: anyone who drank the formula could understand what animals were saying.",
    "Somewhere beneath the city's streets, a forgotten train still ran on tracks that no one else knew existed.",
  ],
  // Grade 6 — complex sentences, semicolons, dashes
  [
    "The old manor stood at the edge of the village like a warning; nobody had lived there in thirty years, yet the lights came on every night at precisely nine o'clock.",
    "She had trained for this moment her entire life, through twelve years of early mornings, sore muscles, and quiet determination, and now it was finally here.",
    "Language is more than just words; it carries the weight of history, culture, and the unspoken feelings of everyone who ever used it.",
    "The deeper they went into the jungle, the more Marco felt that the jungle was watching them, making notes, waiting for the right moment.",
    "Every invention in human history began as an idea that most people called impossible, ridiculous, or a complete waste of time.",
  ],
  // Grade 7 — sophisticated syntax, longer passages
  [
    "What troubled her most wasn't the darkness itself. It was the way the darkness felt familiar, as though she had been here before in some life she couldn't quite remember.",
    "History is not a straight line moving from worse to better; it curves, doubles back, and sometimes erases itself entirely, leaving only rumors where the truth used to be.",
    "The moment the letter arrived, everything Jonah thought he knew about his family shifted slightly, the way a painting tilts on a wall just enough to make you notice the nail.",
    "She realized, standing in the rain outside the museum, that courage wasn't the absence of fear. It was the decision that something else mattered more than the fear did.",
    "There are stories that change you simply by being told; you walk into them one person and walk out another, and you can't always explain what happened in between.",
  ],
  // Grade 8 — literary prose, full complexity
  [
    "The city below them looked like a circuit board from this height, all those lit windows and moving cars organized into patterns that made sense only when you stepped far enough away to stop being part of them.",
    "Memory, he had learned, was less like a recording and more like a painting done from memory: technically accurate in places, heavily edited in others, and always, somehow, more about the painter than the subject.",
    "What the algorithm couldn't account for was the moment between knowing something and deciding what to do with that knowledge, the moral gap that no amount of processing power had yet managed to close.",
    "She wrote the first sentence seventeen times before she understood that what she was avoiding wasn't the story itself, but the person she would have to become in order to tell it honestly.",
    "The silence after the argument was a different kind of silence than the silence before it, denser and charged with all the things that had been said and the things that now could never be unsaid.",
  ],
];

const TYPING_TIME_BY_GRADE = { 1: 90, 2: 90, 3: 75, 4: 75, 5: 60, 6: 60, 7: 45, 8: 45 };

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Keyboard layout & finger mapping ────────────────────────────
const KB_ROWS = [
  ["`","1","2","3","4","5","6","7","8","9","0","-","="],
  ["q","w","e","r","t","y","u","i","o","p","[","]","\\"],
  ["a","s","d","f","g","h","j","k","l",";","'"],
  ["z","x","c","v","b","n","m",",",".","/"],
  [" "],
];

// finger index 0-9: L-pinky, L-ring, L-middle, L-index, L-index(stretch),
//                   R-index(stretch), R-index, R-middle, R-ring, R-pinky
const FINGER_COLORS = [
  "#f87171","#fb923c","#facc15","#4ade80","#4ade80",
  "#22d3ee","#22d3ee","#818cf8","#c084fc","#f472b6",
];
const FINGER_NAMES = [
  "L. Pinky","L. Ring","L. Middle","L. Index","L. Index",
  "R. Index","R. Index","R. Middle","R. Ring","R. Pinky",
];

const KEY_FINGER = {
  // Number row
  "`":0,"1":0,"2":1,"3":2,"4":3,"5":4,"6":5,"7":6,"8":7,"9":8,"0":9,"-":9,"=":9,
  // Top row
  q:0,w:1,e:2,r:3,t:4,y:5,u:6,i:7,o:8,p:9,"[":9,"]":9,"\\":9,
  // Home row
  a:0,s:1,d:2,f:3,g:4,h:5,j:6,k:7,l:8,";":9,"'":9,
  // Bottom row
  z:0,x:1,c:2,v:3,b:4,n:5,m:6,",":7,".":8,"/":9,
  " ":5, // space — right thumb
};

const HOME_ROW = new Set(["a","s","d","f","g","h","j","k","l",";","'"]);

// Key widths for visual layout (relative units)
const KEY_WIDTHS = {
  " ": 8,
};

function KeyboardDisplay({ activeChar }) {
  const lowerChar = activeChar ? activeChar.toLowerCase() : null;
  const fingerIdx = lowerChar !== null ? KEY_FINGER[lowerChar] ?? null : null;
  const activeColor = fingerIdx !== null ? FINGER_COLORS[fingerIdx] : null;

  const rowOffsets = [0, 0.5, 0.75, 1.25, 3.5]; // key-unit left indent per row

  function KeyCap({ k }) {
    const isActive = lowerChar !== null && k === lowerChar;
    const isHome = HOME_ROW.has(k);
    const fi = KEY_FINGER[k] ?? null;
    const fColor = fi !== null ? FINGER_COLORS[fi] : "#4b5563";
    const w = KEY_WIDTHS[k] ?? 1;

    const baseStyle = {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: `${w * 36}px`, height: "34px", borderRadius: 6, margin: "2px",
      fontSize: k === " " ? 10 : 11, fontWeight: 700, fontFamily: "monospace",
      cursor: "default", userSelect: "none", position: "relative",
      transition: "all 0.1s",
      boxSizing: "border-box",
      border: isActive
        ? `2px solid ${activeColor}`
        : isHome
          ? `2px solid ${fColor}88`
          : "2px solid rgba(255,255,255,0.12)",
      background: isActive
        ? `${activeColor}55`
        : isHome
          ? `${fColor}22`
          : "rgba(255,255,255,0.07)",
      color: isActive ? activeColor : isHome ? fColor : "rgba(255,255,255,0.5)",
      boxShadow: isActive ? `0 0 12px ${activeColor}99` : "none",
      transform: isActive ? "translateY(-2px) scale(1.12)" : "none",
    };

    return (
      <span style={baseStyle}>
        {k === " " ? "SPACE" : k.toUpperCase()}
        {isHome && !isActive && (
          <span style={{
            position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
            width: 4, height: 4, borderRadius: "50%", background: fColor, opacity: 0.7,
          }} />
        )}
      </span>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "flex-start", width: "100%", overflowX: "auto" }}>
      {/* Finger color legend */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {[0,1,2,3,6,7,8,9].map(fi => (
          <span key={fi} style={{ fontSize: 10, fontWeight: 700, color: FINGER_COLORS[fi], background: `${FINGER_COLORS[fi]}22`, border: `1px solid ${FINGER_COLORS[fi]}55`, borderRadius: 999, padding: "1px 7px" }}>
            {FINGER_NAMES[fi]}
          </span>
        ))}
      </div>

      {KB_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", marginLeft: `${rowOffsets[ri] * 38}px` }}>
          {row.map(k => <KeyCap key={k} k={k} />)}
        </div>
      ))}

      {/* Active key hint */}
      {activeChar && fingerIdx !== null && (
        <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: activeColor }}>
          {activeChar === " " ? "SPACE" : `"${activeChar.toUpperCase()}"`} — use your {FINGER_NAMES[fingerIdx]}
        </div>
      )}
      {/* Home row reminder */}
      <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
        🟡 Dots mark home row keys — rest your fingers here between keystrokes
      </div>
    </div>
  );
}

const MILESTONES = [25, 50, 100, 200, 300, 500];

const VOCAB_BY_GRADE = {
  1: ["big","jump","soft","fast","bright","loud","tiny","fun"],
  2: ["curious","brave","golden","fuzzy","giggle","hidden","lucky","wild"],
  3: ["mysterious","ancient","whisper","glowing","discover","trembling","peculiar","shadowy"],
  4: ["bewildered","cautious","extraordinary","vanished","determined","flickering","peculiar","relentless"],
  5: ["illuminate","treacherous","resilient","ominous","mesmerizing","plummeted","exhilarating","concealed"],
  6: ["ethereal","formidable","inevitable","labyrinthine","tenacious","foreboding","eloquent","clandestine"],
  7: ["ephemeral","juxtaposition","melancholy","omniscient","paradoxical","visceral","inexorable","ambivalent"],
  8: ["ineffable","soliloquy","perspicacious","immutable","equivocal","subliminal","sycophantic","verisimilitude"],
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [darkMode, setDarkMode] = useState(true);
  const [grade, setGrade] = useState(5);
  const [promptIndices, setPromptIndices] = useState(() => SPARK_CATEGORIES.map(() => 0));
  const [spinningIdx, setSpinningIdx] = useState(null);
  const [selectedCatIdx, setSelectedCatIdx] = useState(null); // -1 = "My Own Idea", -2 = teacher prompt
  const [myIdea, setMyIdea] = useState("");
  const [teacherPrompt, setTeacherPrompt] = useState("");
  const myIdeaRef = useRef(null);
  const teacherPromptRef = useRef(null);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyText, setStoryText] = useState("");
  const [wordGoal, setWordGoal] = useState(200);
  const [feedback, setFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [powerUpResult, setPowerUpResult] = useState("");
  const [loadingPowerUp, setLoadingPowerUp] = useState(false);
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [celebrateMsg, setCelebrateMsg] = useState("");
  const [prevWords, setPrevWords] = useState(0);
  const [reachedMilestones, setReachedMilestones] = useState(new Set());
  const [wotd, setWotd] = useState(null); // { word, definition, used }
  const [wotdUsed, setWotdUsed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const textRef = useRef(null);

  // Typing game state
  const [typingPassageIdx, setTypingPassageIdx] = useState(0);
  const [typingInput, setTypingInput] = useState("");
  const [typingStartTime, setTypingStartTime] = useState(null);
  const [typingTimeLeft, setTypingTimeLeft] = useState(null);
  const [typingDone, setTypingDone] = useState(false);
  const [typingResults, setTypingResults] = useState(null);
  const typingInputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const gradeInfo = GRADES.find(g => g.grade === grade);
  const gradeIdx = grade - 1;
  const wordGoals = WORD_GOALS_BY_GRADE[grade];

  const pageStyle = darkMode
    ? styles.page
    : { ...styles.page, background: "linear-gradient(135deg, #fdf4ff, #f0f9ff, #fef9c3)", color: "#1a0a2e" };

  const selectedPrompt = selectedCatIdx === -1
    ? (myIdea.trim() ? { emoji: "💡", label: "My Own Idea", text: myIdea.trim() } : null)
    : selectedCatIdx === -2
      ? (teacherPrompt.trim() ? { emoji: "🍎", label: "Teacher Prompt", text: teacherPrompt.trim() } : null)
      : selectedCatIdx !== null
        ? { emoji: SPARK_CATEGORIES[selectedCatIdx].emoji, label: SPARK_CATEGORIES[selectedCatIdx].label, text: SPARK_CATEGORIES[selectedCatIdx].byGrade[gradeIdx][promptIndices[selectedCatIdx]] }
        : null;

  const wordCount = countWords(storyText);
  const progress = Math.min((wordCount / wordGoal) * 100, 100);
  const goalReached = wordCount >= wordGoal;

  // Reset word goal when grade changes if it's no longer valid
  useEffect(() => {
    const goals = WORD_GOALS_BY_GRADE[grade];
    if (!goals.includes(wordGoal)) setWordGoal(goals[1] ?? goals[0]);
  }, [grade]);

  // Auto-save draft to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("storyspark_draft");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.storyText) setStoryText(d.storyText);
        if (d.storyTitle) setStoryTitle(d.storyTitle);
        if (d.grade) setGrade(d.grade);
        if (d.wordGoal) setWordGoal(d.wordGoal);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("storyspark_draft", JSON.stringify({ storyText, storyTitle, grade, wordGoal }));
    } catch {}
  }, [storyText, storyTitle, grade, wordGoal]);

  // Milestone celebrations
  useEffect(() => {
    const newMilestones = MILESTONES.filter(m => wordCount >= m && !reachedMilestones.has(m));
    if (newMilestones.length > 0) {
      const top = Math.max(...newMilestones);
      setReachedMilestones(prev => { const s = new Set(prev); newMilestones.forEach(m => s.add(m)); return s; });
      if (top === wordGoal) {
        setCelebrateMsg("🎉 Goal reached! You're a STAR!");
      } else {
        setCelebrateMsg(`🏅 ${top} words! Keep it going!`);
      }
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2000);
    }
    setPrevWords(wordCount);
  }, [wordCount]);

  // Fetch word of the day when entering write screen
  async function fetchWotd() {
    const words = VOCAB_BY_GRADE[grade];
    const word = words[Math.floor(Math.random() * words.length)];
    try {
      const result = await callClaude(
        `Give a ${gradeInfo.label}-grade-appropriate definition for the word "${word}" in one short sentence (max 15 words). Then give one example of it used in a story sentence (max 20 words). Format as JSON only: {"word":"...","definition":"...","example":"..."}`
      );
      const clean = result.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setWotd(parsed);
      setWotdUsed(false);
    } catch {
      setWotd({ word, definition: "A great word to use in your story!", example: `Try using "${word}" somewhere in your writing.` });
      setWotdUsed(false);
    }
  }

  // Check if wotd word appears in story
  useEffect(() => {
    if (wotd && storyText.toLowerCase().includes(wotd.word.toLowerCase())) {
      setWotdUsed(true);
    }
  }, [storyText, wotd]);

  // Read aloud
  function toggleReadAloud() {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = storyText.trim();
    if (!text) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9;
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  }

  function changeGrade(g) {
    setGrade(g);
    setPromptIndices(SPARK_CATEGORIES.map(() => 0));
    setSelectedCatIdx(null);
    setMyIdea("");
    setTeacherPrompt("");
  }

  function refreshPrompt(e, catIdx) {
    e.stopPropagation();
    setSpinningIdx(catIdx);
    setTimeout(() => setSpinningIdx(null), 500);
    setPromptIndices(prev => {
      const next = [...prev];
      const count = SPARK_CATEGORIES[catIdx].byGrade[gradeIdx].length;
      next[catIdx] = (prev[catIdx] + 1) % count;
      return next;
    });
  }

  async function callClaude(prompt) {
    const apiUrl = import.meta.env.VITE_API_URL || "/api/chat";
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content.map(b => b.text || "").join("");
  }

  async function getFeedback() {
    if (wordCount < 10) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setLoadingFeedback(true);
    setScreen("feedback");

    const grammarByGrade = {
      1: "Check only for: capital letters at the start of sentences, and periods or question marks at the end. Praise any correct use warmly. Keep grammar tips very simple.",
      2: "Check for: capital letters, end punctuation (. ! ?), and whether sentences make sense. Give one gentle tip if needed.",
      3: "Check for: capital letters, end punctuation, and correct use of commas in lists. Note one thing done well and one simple improvement.",
      4: "Check for: correct end punctuation, apostrophes in contractions (don't, can't), and whether sentences are complete. Give one specific grammar tip.",
      5: "Check for: complete sentences, correct apostrophes, comma use after introductory phrases, and consistent verb tense. Give one clear grammar tip.",
      6: "Check for: varied sentence structure, correct comma use, consistent tense, and proper dialogue punctuation if used. Give one grammar tip with an example.",
      7: "Check for: sentence variety (simple, compound, complex), correct punctuation including semicolons if used, proper use of pronouns, and avoiding run-on sentences. Give one specific, actionable grammar note.",
      8: "Check for: sophisticated sentence structure, punctuation precision, active vs passive voice, pronoun-antecedent agreement, and stylistic consistency. Give one craft-level grammar observation with a specific example from their text.",
    };

    try {
      const result = await callClaude(
        `You are an encouraging creative writing coach for a ${gradeInfo.label} grade student (age ${gradeInfo.age}).
Read their story and give friendly, helpful feedback in 4 parts:
1. 🌟 What they did AMAZINGLY (be specific and enthusiastic, appropriate for their grade level)
2. 💡 One superpower tip to make the story even better (one concrete, grade-appropriate suggestion)
3. ✏️ Grammar Corner: ${grammarByGrade[grade]}
4. 🚀 A fun challenge: give them 1 sentence to continue from

Calibrate your language and expectations to a ${gradeInfo.label} grader. Keep the tone fun, warm, and encouraging. Use emojis. Keep it under 250 words total.

Their story prompt was: "${selectedPrompt?.text}"
Their story: "${storyText}"`
      );
      setFeedback(result);
    } catch (e) {
      setFeedback("✨ Oops! Couldn't load feedback right now. But keep writing — your story is awesome!");
    }
    setLoadingFeedback(false);
  }

  async function usePowerUp(pu) {
    if (wordCount < 5) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setLoadingPowerUp(true);
    setPowerUpResult("");
    try {
      const result = await callClaude(
        `You are a fun creative writing helper for a ${gradeInfo.label} grade student (age ${gradeInfo.age}).
Their story so far: "${storyText}"
Power-up instruction: ${pu.instruction}
Write ONLY 2-3 sentences continuing their story with this power-up. Match their writing style, keep vocabulary appropriate for grade ${grade}, and keep it age-appropriate. No commentary, just story text.`
      );
      setPowerUpResult(result.trim());
    } catch (e) {
      setPowerUpResult("✨ Power-up fizzled! Try again.");
    }
    setLoadingPowerUp(false);
  }

  function addPowerUpToStory() {
    const addition = (storyText.endsWith(" ") || storyText === "" ? "" : " ") + powerUpResult;
    setStoryText(prev => prev + addition);
    setPowerUpResult("");
    textRef.current?.focus();
  }

  function exportStory() {
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const promptText = selectedPrompt?.text ?? "";
    const promptLabel = selectedPrompt ? `${selectedPrompt.emoji} ${selectedPrompt.label}` : "My Story";
    const titleDisplay = storyTitle.trim() || "My Story";
    const coachSection = feedback
      ? `<div class="coach">
          <h2>✨ Coach's Corner</h2>
          <p>${feedback.replace(/\n/g, "<br/>")}</p>
        </div>`
      : "";
    const rubricSection = `
      <div class="rubric">
        <h2>📋 Story Rubric</h2>
        <table>
          <tr><th>Category</th><th>⭐⭐⭐⭐ Excellent</th><th>⭐⭐⭐ Good</th><th>⭐⭐ Developing</th><th>Score</th></tr>
          <tr><td>Ideas &amp; Content</td><td>Creative, original, detailed</td><td>Clear and mostly developed</td><td>Needs more detail</td><td></td></tr>
          <tr><td>Organization</td><td>Clear beginning, middle, end</td><td>Mostly organized</td><td>Hard to follow</td><td></td></tr>
          <tr><td>Word Choice</td><td>Vivid, varied vocabulary</td><td>Good word choices</td><td>Simple/repetitive</td><td></td></tr>
          <tr><td>Grammar &amp; Spelling</td><td>Few or no errors</td><td>Some minor errors</td><td>Errors affect meaning</td><td></td></tr>
        </table>
        <p class="rubric-note">Teacher comments: _______________________________________________</p>
      </div>`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${titleDisplay} — StorySpark</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Lora',Georgia,serif;background:#fdf8f0;color:#2d1f0e;padding:48px 32px;max-width:720px;margin:0 auto}
    .header{border-bottom:3px solid #f472b6;padding-bottom:20px;margin-bottom:32px}
    .app-name{font-family:'Nunito',sans-serif;font-size:13px;font-weight:900;color:#a855f7;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
    .story-title{font-family:'Nunito',sans-serif;font-size:28px;font-weight:900;color:#1a0a2e;line-height:1.2}
    .meta{font-family:'Nunito',sans-serif;font-size:13px;color:#6b7280;margin-top:8px;display:flex;gap:12px;flex-wrap:wrap}
    .meta span{background:#f3e8ff;color:#7c3aed;border-radius:999px;padding:2px 10px;font-weight:700}
    .prompt-box{background:#fdf2f8;border-left:4px solid #f472b6;padding:14px 18px;border-radius:0 12px 12px 0;margin-bottom:32px;font-style:italic;color:#831843;font-size:15px;line-height:1.6}
    .prompt-box strong{font-style:normal;font-family:'Nunito',sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#db2777;display:block;margin-bottom:4px}
    .story{font-size:17px;line-height:1.9;color:#1c1917;white-space:pre-wrap;margin-bottom:48px}
    .coach{background:#f0fdf4;border:2px solid #86efac;border-radius:16px;padding:24px 28px;margin-bottom:32px}
    .coach h2{font-family:'Nunito',sans-serif;font-size:20px;font-weight:900;color:#166534;margin-bottom:16px}
    .coach p{font-family:'Nunito',sans-serif;font-size:15px;line-height:1.8;color:#14532d}
    .rubric{margin-top:32px;padding:24px;border:2px solid #e5e7eb;border-radius:16px}
    .rubric h2{font-family:'Nunito',sans-serif;font-size:18px;font-weight:900;margin-bottom:16px;color:#374151}
    table{width:100%;border-collapse:collapse;font-family:'Nunito',sans-serif;font-size:13px}
    th,td{border:1px solid #d1d5db;padding:8px 10px;text-align:left}
    th{background:#f3f4f6;font-weight:800}
    td:last-child{width:60px;background:#fafafa}
    .rubric-note{font-family:'Nunito',sans-serif;font-size:13px;color:#6b7280;margin-top:16px;line-height:2}
    .footer{margin-top:48px;padding-top:16px;border-top:1px solid #e5e7eb;font-family:'Nunito',sans-serif;font-size:12px;color:#9ca3af;text-align:center}
    @media print{body{padding:24px}}
  </style>
</head>
<body>
  <div class="header">
    <div class="app-name">StorySpark</div>
    <div class="story-title">${titleDisplay}</div>
    <div class="meta">
      <span>${gradeInfo.label} Grade</span><span>${promptLabel}</span><span>${today}</span><span>${countWords(storyText)} words</span>
    </div>
  </div>
  <div class="prompt-box"><strong>Story Spark</strong>${promptText}</div>
  <div class="story">${storyText.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
  ${coachSection}
  ${rubricSection}
  <div class="footer">Created with StorySpark ✨</div>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${titleDisplay.replace(/\s+/g,"-").toLowerCase()}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Typing game ──────────────────────────────────────────────
  const typingPassage = TYPING_PASSAGES[gradeIdx][typingPassageIdx % TYPING_PASSAGES[gradeIdx].length];
  const totalTime = TYPING_TIME_BY_GRADE[grade];

  function startTypingGame(passageIdx) {
    clearInterval(typingTimerRef.current);
    setTypingPassageIdx(passageIdx ?? typingPassageIdx);
    setTypingInput("");
    setTypingStartTime(null);
    setTypingTimeLeft(TYPING_TIME_BY_GRADE[grade]);
    setTypingDone(false);
    setTypingResults(null);
    setTimeout(() => typingInputRef.current?.focus(), 80);
  }

  function handleTypingInput(val) {
    if (typingDone) return;
    // Start timer on first keystroke
    if (!typingStartTime && val.length > 0) {
      const start = Date.now();
      setTypingStartTime(start);
      const total = TYPING_TIME_BY_GRADE[grade];
      setTypingTimeLeft(total);
      typingTimerRef.current = setInterval(() => {
        setTypingTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(typingTimerRef.current);
            finishTyping(val, start);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setTypingInput(val);
    // Finished passage early?
    if (val === typingPassage) {
      clearInterval(typingTimerRef.current);
      finishTyping(val, typingStartTime || Date.now());
    }
  }

  function finishTyping(input, startTime) {
    setTypingDone(true);
    const elapsed = Math.max((Date.now() - startTime) / 1000 / 60, 0.01);
    const targetChars = typingPassage.split("");
    const inputChars = input.split("");
    let correct = 0, errors = 0;
    targetChars.forEach((ch, i) => {
      if (inputChars[i] === ch) correct++;
      else if (inputChars[i] !== undefined) errors++;
    });
    const wordsTyped = correct / 5;
    const wpm = Math.round(wordsTyped / elapsed);
    const accuracy = input.length === 0 ? 0 : Math.round((correct / Math.max(input.length, 1)) * 100);
    setTypingResults({ wpm, accuracy, correct, errors, completed: input === typingPassage });
  }

  function getCharState(index) {
    if (index >= typingInput.length) return "pending";
    return typingInput[index] === typingPassage[index] ? "correct" : "wrong";
  }

  // Cleanup timer on unmount / screen change
  useEffect(() => { return () => clearInterval(typingTimerRef.current); }, []);
  // Reset game when grade changes
  useEffect(() => {
    if (screen === "typing") startTypingGame(0);
  }, [grade]);

  // HOME SCREEN
  if (screen === "home") return (
    <div style={pageStyle}>
      <div style={styles.stars} aria-hidden="true">
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{ ...styles.star, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, width: Math.random() > 0.7 ? 3 : 2, height: Math.random() > 0.7 ? 3 : 2 }} />
        ))}
      </div>
      <div style={styles.homeContent}>
        <div style={styles.titleBlock}>
          <div style={styles.quillIcon}>✍️</div>
          <h1 style={styles.title}>Story<span style={styles.titleAccent}>Spark</span></h1>
          <p style={styles.subtitle}>Your magical writing adventure begins here</p>
          <button style={{ ...styles.themeToggle, background: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", color: darkMode ? "#c4b5fd" : "#7c3aed" }} onClick={() => setDarkMode(d => !d)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Grade Selector */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>🎓 Choose your grade</p>
          <div style={styles.gradeGrid}>
            {GRADES.map(g => (
              <button
                key={g.grade}
                style={{
                  ...styles.gradeBtn,
                  ...(grade === g.grade ? { ...styles.gradeBtnActive, borderColor: g.color, boxShadow: `0 0 14px ${g.color}55` } : {}),
                }}
                onClick={() => changeGrade(g.grade)}
              >
                <span style={{ ...styles.gradeNumber, ...(grade === g.grade ? { color: g.color } : {}) }}>{g.label}</span>
                <span style={styles.gradeAge}>{g.age}</span>
              </button>
            ))}
          </div>
          <p style={styles.gradeDesc}>{gradeInfo.emoji ?? "✏️"} <strong>{gradeInfo.label} Grade</strong> · {gradeInfo.desc}</p>
        </div>

        {/* Spark grid */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>⚡ Pick a spark to ignite your story</p>
          <div style={styles.promptGrid}>
            {SPARK_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                style={{ ...styles.promptCard, ...(selectedCatIdx === i ? styles.promptCardActive : {}) }}
                onClick={() => setSelectedCatIdx(i)}
              >
                <span style={styles.promptEmoji}>{cat.emoji}</span>
                <span style={styles.promptLabel}>{cat.label}</span>
                <button style={styles.refreshBtn} onClick={(e) => refreshPrompt(e, i)} title="New prompt">
                  <span style={{ display: "inline-block", animation: spinningIdx === i ? "spinOnce 0.45s ease" : "none" }}>🔄</span>
                </button>
              </div>
            ))}
            {/* My Own Idea card */}
            <div
              style={{ ...styles.promptCard, ...styles.myIdeaCard, ...(selectedCatIdx === -1 ? styles.myIdeaCardActive : {}) }}
              onClick={() => { setSelectedCatIdx(-1); setTimeout(() => myIdeaRef.current?.focus(), 50); }}
            >
              <span style={styles.promptEmoji}>💡</span>
              <span style={styles.promptLabel}>My Own Idea</span>
              <span style={styles.myIdeaBadge}>YOU</span>
            </div>
            {/* Teacher prompt card */}
            <div
              style={{ ...styles.promptCard, ...styles.teacherCard, ...(selectedCatIdx === -2 ? styles.teacherCardActive : {}) }}
              onClick={() => { setSelectedCatIdx(-2); setTimeout(() => teacherPromptRef.current?.focus(), 50); }}
            >
              <span style={styles.promptEmoji}>🍎</span>
              <span style={styles.promptLabel}>Teacher Prompt</span>
              <span style={{ ...styles.myIdeaBadge, background: "rgba(34,211,238,0.2)", color: "#22d3ee" }}>EDU</span>
            </div>
          </div>

          {/* My Own Idea inline input */}
          {selectedCatIdx === -1 && (
            <div style={styles.myIdeaBox}>
              <p style={styles.myIdeaHint}>✏️ What's your story idea? Describe it below!</p>
              <textarea
                ref={myIdeaRef}
                style={styles.myIdeaTextarea}
                value={myIdea}
                onChange={e => setMyIdea(e.target.value)}
                placeholder="e.g. A kid who can talk to plants discovers the old oak tree in the backyard has a secret..."
                rows={3}
              />
              {myIdea.trim().length > 0 && (
                <p style={styles.myIdeaReady}>✅ Your spark is ready — set your word goal and start writing!</p>
              )}
            </div>
          )}

          {/* Teacher prompt inline input */}
          {selectedCatIdx === -2 && (
            <div style={{ ...styles.myIdeaBox, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)" }}>
              <p style={{ ...styles.myIdeaHint, color: "#67e8f9" }}>🍎 Paste or type the teacher's writing prompt below</p>
              <textarea
                ref={teacherPromptRef}
                style={{ ...styles.myIdeaTextarea, border: "1.5px solid rgba(34,211,238,0.3)", color: "#cffafe" }}
                value={teacherPrompt}
                onChange={e => setTeacherPrompt(e.target.value)}
                placeholder="e.g. Write a story about a time you showed courage. Include a beginning, middle, and end..."
                rows={3}
              />
              {teacherPrompt.trim().length > 0 && (
                <p style={styles.myIdeaReady}>✅ Prompt loaded — set your word goal and start writing!</p>
              )}
            </div>
          )}
        </div>

        {selectedPrompt && selectedCatIdx !== -1 && (
          <div style={styles.promptPreview}>
            <div style={styles.promptPreviewHeader}>
              <span style={styles.promptPreviewCategory}>{selectedPrompt.emoji} {selectedPrompt.label}</span>
              <span style={styles.promptDots}>
                {SPARK_CATEGORIES[selectedCatIdx].byGrade[gradeIdx].map((_, pi) => (
                  <span key={pi} style={{ ...styles.dot, ...(pi === promptIndices[selectedCatIdx] ? styles.dotActive : {}) }} />
                ))}
              </span>
            </div>
            <p style={styles.promptPreviewText}>"{selectedPrompt.text}"</p>
          </div>
        )}

        {/* Word goal */}
        <div style={styles.section}>
          <p style={styles.sectionLabel}>🎯 Set your word goal</p>
          <div style={styles.goalRow}>
            {wordGoals.map(g => (
              <button key={g} style={{ ...styles.goalBtn, ...(wordGoal === g ? styles.goalBtnActive : {}) }} onClick={() => setWordGoal(g)}>
                {g} words
              </button>
            ))}
          </div>
        </div>

        <div style={styles.homeButtons}>
          <button
            style={{ ...styles.startBtn, flex: 1, ...(selectedPrompt ? {} : styles.startBtnDisabled) }}
            onClick={() => {
              if (selectedPrompt) {
                setStoryText("");
                setStoryTitle("");
                setReachedMilestones(new Set());
                setFeedback("");
                setScreen("write");
                fetchWotd();
              }
            }}
          >
            Start Writing ✨
          </button>
          <button
            style={styles.typingBtn}
            onClick={() => { startTypingGame(0); setScreen("typing"); }}
          >
            ⌨️ Typing Game
          </button>
        </div>
      </div>
    </div>
  );

  // TYPING GAME SCREEN
  if (screen === "typing") {
    const timePercent = typingTimeLeft !== null ? (typingTimeLeft / totalTime) * 100 : 100;
    const timerColor = timePercent > 50 ? "#4ade80" : timePercent > 25 ? "#facc15" : "#f87171";
    const passage = TYPING_PASSAGES[gradeIdx][typingPassageIdx % TYPING_PASSAGES[gradeIdx].length];

    return (
      <div style={pageStyle}>
        <div style={styles.typingLayout}>
          {/* Header */}
          <div style={styles.writeHeader}>
            <button style={styles.backLink} onClick={() => { clearInterval(typingTimerRef.current); setScreen("home"); }}>← Back</button>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ ...styles.gradePill, borderColor: gradeInfo.color, color: gradeInfo.color }}>{gradeInfo.label} Grade</span>
              <span style={styles.typingGameLabel}>⌨️ Typing Game</span>
            </div>
          </div>

          {/* Timer bar */}
          {typingStartTime && !typingDone && (
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${timePercent}%`, background: timerColor, transition: "width 1s linear, background 0.5s" }} />
            </div>
          )}

          {/* Stats row */}
          <div style={styles.typingStatsRow}>
            <div style={styles.typingStatBox}>
              <span style={styles.typingStatNum} id="timer-display">
                {typingDone ? "✓" : typingTimeLeft !== null ? `${typingTimeLeft}s` : `${totalTime}s`}
              </span>
              <span style={styles.typingStatLabel}>Time Left</span>
            </div>
            <div style={styles.typingStatBox}>
              <span style={styles.typingStatNum}>
                {typingInput.length === 0 ? "—" : (() => {
                  let correct = 0;
                  typingInput.split("").forEach((ch, i) => { if (ch === passage[i]) correct++; });
                  return Math.round((correct / Math.max(typingInput.length, 1)) * 100) + "%";
                })()}
              </span>
              <span style={styles.typingStatLabel}>Accuracy</span>
            </div>
            <div style={styles.typingStatBox}>
              <span style={styles.typingStatNum}>
                {typingStartTime && typingInput.length > 0 ? (() => {
                  const elapsed = Math.max((Date.now() - typingStartTime) / 1000 / 60, 0.01);
                  let correct = 0;
                  typingInput.split("").forEach((ch, i) => { if (ch === passage[i]) correct++; });
                  return Math.round((correct / 5) / elapsed);
                })() : "—"}
              </span>
              <span style={styles.typingStatLabel}>WPM</span>
            </div>
          </div>

          {/* Passage display */}
          <div style={styles.passageBox}>
            {!typingDone ? (
              <p style={styles.passageText}>
                {passage.split("").map((ch, i) => {
                  const state = i < typingInput.length
                    ? (typingInput[i] === ch ? "correct" : "wrong")
                    : i === typingInput.length ? "cursor" : "pending";
                  return (
                    <span key={i} style={{
                      ...styles.passageChar,
                      ...(state === "correct" ? styles.charCorrect : {}),
                      ...(state === "wrong" ? styles.charWrong : {}),
                      ...(state === "cursor" ? styles.charCursor : {}),
                    }}>{ch}</span>
                  );
                })}
              </p>
            ) : (
              <div style={styles.resultsBox}>
                <div style={styles.resultsEmoji}>{typingResults?.completed ? "🏆" : typingResults?.accuracy >= 90 ? "🌟" : typingResults?.accuracy >= 70 ? "👍" : "💪"}</div>
                <h2 style={styles.resultsTitle}>{typingResults?.completed ? "Passage Complete!" : "Time's Up!"}</h2>
                <div style={styles.resultsBigStats}>
                  <div style={styles.resultsStat}>
                    <span style={styles.resultsStatNum}>{typingResults?.wpm}</span>
                    <span style={styles.resultsStatLabel}>WPM</span>
                  </div>
                  <div style={styles.resultsStat}>
                    <span style={styles.resultsStatNum}>{typingResults?.accuracy}%</span>
                    <span style={styles.resultsStatLabel}>Accuracy</span>
                  </div>
                  <div style={styles.resultsStat}>
                    <span style={styles.resultsStatNum}>{typingResults?.errors}</span>
                    <span style={styles.resultsStatLabel}>Errors</span>
                  </div>
                </div>
                <p style={styles.resultsFeedback}>
                  {typingResults?.accuracy >= 95 ? "🔥 Incredible accuracy! You're a typing superstar!" :
                   typingResults?.accuracy >= 85 ? "✨ Great job! Keep practicing for even higher accuracy!" :
                   typingResults?.accuracy >= 70 ? "👍 Good effort! Slow down a little to hit fewer errors!" :
                   "💪 Keep practicing! Accuracy beats speed every time!"}
                </p>
                <div style={styles.resultsButtons}>
                  <button style={styles.retryBtn} onClick={() => startTypingGame(typingPassageIdx)}>
                    🔄 Try Again
                  </button>
                  <button style={styles.nextPassageBtn} onClick={() => startTypingGame((typingPassageIdx + 1) % TYPING_PASSAGES[gradeIdx].length)}>
                    Next Passage →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          {!typingDone && (
            <textarea
              ref={typingInputRef}
              style={styles.typingInput}
              value={typingInput}
              onChange={e => handleTypingInput(e.target.value)}
              placeholder={typingStartTime ? "" : "Start typing to begin the timer…"}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          )}

          {/* Keyboard */}
          {!typingDone && (
            <div style={styles.keyboardWrap}>
              <KeyboardDisplay activeChar={(() => {
                const nextIdx = typingInput.length;
                return nextIdx < passage.length ? passage[nextIdx] : null;
              })()} />
            </div>
          )}

          {/* Passage picker */}
          {!typingDone && (
            <div style={styles.passagePicker}>
              <span style={styles.sectionLabel}>📄 Passages</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                {TYPING_PASSAGES[gradeIdx].map((_, i) => (
                  <button
                    key={i}
                    style={{ ...styles.passagePickBtn, ...(i === typingPassageIdx % TYPING_PASSAGES[gradeIdx].length ? styles.passagePickBtnActive : {}) }}
                    onClick={() => startTypingGame(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  if (screen === "feedback") return (
    <div style={pageStyle}>
      <div style={styles.feedbackContainer}>
        <h2 style={styles.feedbackTitle}>✨ Coach's Corner</h2>
        {loadingFeedback ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Reading your masterpiece…</p>
          </div>
        ) : (
          <>
            <div style={styles.feedbackBox}>
              <p style={styles.feedbackText}>{feedback}</p>
            </div>
            <button style={styles.exportBtn} onClick={exportStory}>
              📄 Export Story + Feedback
            </button>
          </>
        )}
        <button style={styles.backBtn} onClick={() => setScreen("write")}>← Back to my story</button>
      </div>
    </div>
  );

  // WRITE SCREEN
  return (
    <div style={pageStyle}>
      {celebrate && (
        <div style={styles.celebrateOverlay}>
          <div style={styles.celebrateBox}>
            <p style={styles.celebrateText}>{celebrateMsg}</p>
          </div>
        </div>
      )}
      <div style={styles.writeLayout}>
        <div style={styles.writeHeader}>
          <button style={styles.backLink} onClick={() => setScreen("home")}>← Choose new spark</button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ ...styles.gradePill, borderColor: gradeInfo.color, color: gradeInfo.color }}>{gradeInfo.label} Grade</span>
            <button style={styles.themeToggleSmall} onClick={() => setDarkMode(d => !d)} title="Toggle theme">{darkMode ? "☀️" : "🌙"}</button>
            <span style={styles.wordCount}>{wordCount} / {wordGoal} words</span>
          </div>
        </div>

        {/* Story title */}
        <input
          style={styles.titleInput}
          value={storyTitle}
          onChange={e => setStoryTitle(e.target.value)}
          placeholder="Give your story a title… ✍️"
          maxLength={80}
        />

        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress}%`, background: goalReached ? "#4ade80" : `linear-gradient(90deg, ${gradeInfo.color}, #a78bfa)` }} />
        </div>
        {/* Milestone dots */}
        <div style={styles.milestoneDots}>
          {MILESTONES.filter(m => m <= wordGoal).map(m => (
            <div key={m} style={{ ...styles.milestoneDot, ...(reachedMilestones.has(m) ? { background: "#4ade80", color: "#14532d" } : {}) }} title={`${m} words`}>
              {reachedMilestones.has(m) ? "✓" : m}
            </div>
          ))}
        </div>

        <div style={styles.promptChip}>
          <span>{selectedPrompt?.emoji}</span>
          <span style={styles.promptChipText}>{selectedPrompt?.text}</span>
        </div>

        <textarea
          ref={textRef}
          style={{ ...styles.textarea, ...(shake ? styles.shakeAnim : {}) }}
          value={storyText}
          onChange={e => setStoryText(e.target.value)}
          placeholder="Your story begins here… let the words flow! 🌟"
          autoFocus
        />

        {/* Read aloud + wotd row */}
        <div style={styles.storyToolsRow}>
          <button style={{ ...styles.readAloudBtn, ...(speaking ? styles.readAloudBtnActive : {}) }} onClick={toggleReadAloud}>
            {speaking ? "⏹ Stop" : "🔊 Read Aloud"}
          </button>
          {wotd && (
            <div style={{ ...styles.wotdChip, ...(wotdUsed ? styles.wotdChipUsed : {}) }}>
              <span style={styles.wotdLabel}>✨ Word of the Day</span>
              <span style={styles.wotdWord}>{wotd.word}</span>
              <span style={styles.wotdDef}>{wotd.definition}</span>
              {wotdUsed && <span style={styles.wotdBadge}>🏅 Used it!</span>}
            </div>
          )}
        </div>

        {(powerUpResult || loadingPowerUp) && (
          <div style={styles.powerUpResult}>
            {loadingPowerUp ? (
              <p style={styles.loadingText}>⚡ Charging power-up…</p>
            ) : (
              <>
                <p style={styles.powerUpText}>{powerUpResult}</p>
                <div style={styles.powerUpActions}>
                  <button style={styles.addBtn} onClick={addPowerUpToStory}>+ Add to my story</button>
                  <button style={styles.dismissBtn} onClick={() => setPowerUpResult("")}>✕ Dismiss</button>
                </div>
              </>
            )}
          </div>
        )}

        <div style={styles.powerUpSection}>
          <p style={styles.sectionLabel}>⚡ Power-Ups</p>
          <div style={styles.powerUpGrid}>
            {POWER_UPS.map((pu, i) => (
              <button key={i} style={styles.powerUpBtn} onClick={() => usePowerUp(pu)}>
                {pu.emoji} {pu.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.writeActions}>
          <button style={{ ...styles.feedbackBtn, flex: 1 }} onClick={getFeedback}>
            🌟 Get Coach Feedback
          </button>
          <button style={styles.exportBtnSmall} onClick={exportStory} title="Export story">
            📄 Export
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1a1040, #24243e)", fontFamily: "'Nunito', cursive, sans-serif", color: "#f0e6ff", position: "relative", overflowX: "hidden" },
  stars: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 },
  star: { position: "absolute", background: "#fff", borderRadius: "50%", opacity: 0.6, animation: "twinkle 3s infinite ease-in-out alternate" },
  homeContent: { position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", padding: "32px 20px 48px" },
  titleBlock: { textAlign: "center", marginBottom: 36 },
  quillIcon: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 48, fontWeight: 900, margin: 0, letterSpacing: -1, color: "#fff" },
  titleAccent: { color: "#f472b6" },
  subtitle: { fontSize: 16, color: "#c4b5fd", marginTop: 8, fontWeight: 600 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#a78bfa", marginBottom: 10 },

  // Grade selector
  gradeGrid: { display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6, marginBottom: 10 },
  gradeBtn: { background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all 0.2s", color: "#e9d5ff" },
  gradeBtnActive: { background: "rgba(255,255,255,0.14)" },
  gradeNumber: { fontSize: 13, fontWeight: 900, color: "#c4b5fd" },
  gradeAge: { fontSize: 9, color: "#9ca3af", fontWeight: 600 },
  gradeDesc: { fontSize: 13, color: "#c4b5fd", margin: "6px 0 0", fontWeight: 600 },

  promptGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  promptCard: { background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 8px 10px", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#e9d5ff", position: "relative" },
  promptCardActive: { background: "rgba(167,139,250,0.3)", border: "2px solid #a78bfa", transform: "scale(1.04)" },
  promptEmoji: { fontSize: 28 },
  promptLabel: { fontSize: 12, fontWeight: 700, textAlign: "center" },
  refreshBtn: { marginTop: 4, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "2px 8px", cursor: "pointer", fontSize: 12, color: "#c4b5fd", fontWeight: 700, transition: "background 0.15s", display: "flex", alignItems: "center", gap: 3 },
  myIdeaCard: { border: "2px dashed rgba(250,204,21,0.4)", background: "rgba(250,204,21,0.06)" },
  myIdeaCardActive: { border: "2px dashed #facc15", background: "rgba(250,204,21,0.15)", transform: "scale(1.04)" },
  myIdeaBadge: { marginTop: 4, fontSize: 9, fontWeight: 900, background: "rgba(250,204,21,0.25)", color: "#facc15", borderRadius: 999, padding: "2px 7px", letterSpacing: 1 },
  myIdeaBox: { marginTop: 12, background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.25)", borderRadius: 14, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 },
  myIdeaHint: { margin: 0, fontSize: 13, color: "#fde68a", fontWeight: 700 },
  myIdeaTextarea: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(250,204,21,0.3)", borderRadius: 10, padding: "10px 12px", color: "#fef9c3", fontSize: 14, lineHeight: 1.6, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
  myIdeaReady: { margin: 0, fontSize: 12, color: "#86efac", fontWeight: 700 },
  promptPreview: { background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.3)", borderRadius: 14, padding: "14px 18px", marginBottom: 24 },
  promptPreviewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  promptPreviewCategory: { fontSize: 12, fontWeight: 800, color: "#f9a8d4", textTransform: "uppercase", letterSpacing: 0.5 },
  promptDots: { display: "flex", gap: 5, alignItems: "center" },
  dot: { width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.2)", transition: "background 0.2s" },
  dotActive: { background: "#f472b6", width: 8, height: 8 },
  promptPreviewText: { margin: 0, fontStyle: "italic", color: "#fbcfe8", fontSize: 14, lineHeight: 1.6 },
  goalRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  goalBtn: { padding: "8px 18px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.15)", background: "transparent", color: "#c4b5fd", fontWeight: 700, cursor: "pointer", fontSize: 13, transition: "all 0.2s" },
  goalBtnActive: { background: "#7c3aed", border: "2px solid #a78bfa", color: "#fff" },
  startBtn: { width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #f472b6, #a855f7)", color: "#fff", fontSize: 18, fontWeight: 900, cursor: "pointer", marginTop: 8, boxShadow: "0 4px 24px rgba(244,114,182,0.4)", transition: "transform 0.15s", letterSpacing: 0.5 },
  startBtnDisabled: { opacity: 0.45, cursor: "not-allowed" },

  writeLayout: { position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 12 },
  writeHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  backLink: { background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 },
  gradePill: { fontSize: 11, fontWeight: 800, border: "1.5px solid", borderRadius: 999, padding: "2px 9px", textTransform: "uppercase", letterSpacing: 0.5 },
  wordCount: { fontSize: 13, fontWeight: 800, color: "#c4b5fd" },
  progressTrack: { height: 8, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 999, transition: "width 0.4s ease" },
  promptChip: { display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "10px 14px" },
  promptChipText: { fontSize: 13, fontStyle: "italic", color: "#e9d5ff", lineHeight: 1.5 },
  textarea: { width: "100%", minHeight: 260, background: "rgba(255,255,255,0.05)", border: "2px solid rgba(167,139,250,0.3)", borderRadius: 16, padding: "16px", color: "#f0e6ff", fontSize: 16, lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" },
  shakeAnim: { animation: "shake 0.4s ease" },
  powerUpResult: { background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 14, padding: "14px 16px" },
  powerUpText: { margin: "0 0 10px", fontSize: 15, color: "#bbf7d0", lineHeight: 1.6, fontStyle: "italic" },
  powerUpActions: { display: "flex", gap: 8 },
  addBtn: { padding: "7px 16px", borderRadius: 999, background: "#22c55e", border: "none", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 13 },
  dismissBtn: { padding: "7px 14px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "none", color: "#d1fae5", fontWeight: 700, cursor: "pointer", fontSize: 13 },
  powerUpSection: {},
  powerUpGrid: { display: "flex", flexWrap: "wrap", gap: 8 },
  powerUpBtn: { padding: "8px 14px", borderRadius: 999, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#e9d5ff", fontWeight: 700, cursor: "pointer", fontSize: 13, transition: "background 0.2s" },
  feedbackBtn: { width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(245,158,11,0.3)" },
  writeActions: { display: "flex", gap: 10, alignItems: "stretch" },
  exportBtnSmall: { padding: "14px 18px", borderRadius: 14, border: "2px solid rgba(74,222,128,0.4)", background: "rgba(74,222,128,0.1)", color: "#86efac", fontSize: 14, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap" },
  exportBtn: { width: "100%", marginTop: 12, padding: "13px", borderRadius: 14, border: "2px solid rgba(74,222,128,0.4)", background: "rgba(74,222,128,0.1)", color: "#86efac", fontSize: 15, fontWeight: 900, cursor: "pointer" },
  loadingBox: { display: "flex", flexDirection: "column", alignItems: "center", padding: 40, gap: 16 },
  spinner: { width: 40, height: 40, border: "4px solid rgba(167,139,250,0.3)", borderTop: "4px solid #a78bfa", borderRadius: "50%", animation: "spin 1s linear infinite" },
  loadingText: { color: "#c4b5fd", fontWeight: 700, fontSize: 15 },
  feedbackContainer: { position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "40px 20px" },
  feedbackTitle: { fontSize: 28, fontWeight: 900, marginBottom: 20, textAlign: "center" },
  feedbackBox: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 18, padding: "24px" },
  feedbackText: { margin: 0, fontSize: 15, lineHeight: 1.8, color: "#f0e6ff", whiteSpace: "pre-wrap" },
  backBtn: { marginTop: 20, width: "100%", padding: "13px", borderRadius: 14, border: "2px solid rgba(167,139,250,0.4)", background: "transparent", color: "#c4b5fd", fontWeight: 800, cursor: "pointer", fontSize: 15 },
  celebrateOverlay: { position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", animation: "fadeIn 0.3s ease" },
  celebrateBox: { background: "linear-gradient(135deg, #7c3aed, #db2777)", borderRadius: 24, padding: "32px 48px", textAlign: "center", boxShadow: "0 0 60px rgba(244,114,182,0.6)" },
  celebrateEmoji: { fontSize: 56, marginBottom: 8 },
  celebrateText: { fontSize: 20, fontWeight: 900, color: "#fff", margin: 0 },

  // Theme toggle
  themeToggle: { marginTop: 12, padding: "6px 16px", borderRadius: 999, border: "none", fontWeight: 800, fontSize: 13, cursor: "pointer" },
  themeToggleSmall: { background: "transparent", border: "none", fontSize: 16, cursor: "pointer", padding: "2px 4px" },

  // Teacher prompt card
  teacherCard: { border: "2px dashed rgba(34,211,238,0.4)", background: "rgba(34,211,238,0.06)" },
  teacherCardActive: { border: "2px dashed #22d3ee", background: "rgba(34,211,238,0.15)", transform: "scale(1.04)" },

  // Story title input
  titleInput: { width: "100%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", color: "#f0e6ff", fontSize: 18, fontWeight: 800, outline: "none", fontFamily: "inherit", boxSizing: "border-box", letterSpacing: 0.2 },

  // Milestone dots
  milestoneDots: { display: "flex", gap: 6, flexWrap: "wrap" },
  milestoneDot: { fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "2px 8px", color: "rgba(255,255,255,0.4)" },

  // Story tools row (read aloud + wotd)
  storyToolsRow: { display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" },
  readAloudBtn: { padding: "8px 16px", borderRadius: 999, border: "1.5px solid rgba(167,139,250,0.4)", background: "rgba(167,139,250,0.1)", color: "#c4b5fd", fontWeight: 800, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" },
  readAloudBtnActive: { background: "rgba(248,113,113,0.2)", border: "1.5px solid #f87171", color: "#fca5a5" },
  wotdChip: { flex: 1, background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.25)", borderRadius: 12, padding: "8px 12px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" },
  wotdChipUsed: { background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" },
  wotdLabel: { fontSize: 10, fontWeight: 900, color: "#fde68a", textTransform: "uppercase", letterSpacing: 1, width: "100%" },
  wotdWord: { fontSize: 15, fontWeight: 900, color: "#facc15" },
  wotdDef: { fontSize: 12, color: "#fef3c7", flex: 1 },
  wotdBadge: { fontSize: 11, fontWeight: 800, background: "rgba(74,222,128,0.2)", color: "#86efac", borderRadius: 999, padding: "2px 8px" },

  // Home screen button row
  homeButtons: { display: "flex", gap: 10, marginTop: 8 },
  typingBtn: { padding: "16px 20px", borderRadius: 16, border: "2px solid rgba(34,211,238,0.4)", background: "rgba(34,211,238,0.1)", color: "#67e8f9", fontSize: 15, fontWeight: 900, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" },

  // Typing game
  typingLayout: { position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 14 },
  typingGameLabel: { fontSize: 13, fontWeight: 800, color: "#67e8f9" },
  typingStatsRow: { display: "flex", gap: 12 },
  typingStatBox: { flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },
  typingStatNum: { fontSize: 22, fontWeight: 900, color: "#f0e6ff" },
  typingStatLabel: { fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 },
  passageBox: { background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "20px", minHeight: 100 },
  passageText: { margin: 0, fontSize: 17, lineHeight: 1.9, fontFamily: "'Courier New', monospace", letterSpacing: 0.3 },
  passageChar: { color: "rgba(255,255,255,0.3)" },
  charCorrect: { color: "#86efac" },
  charWrong: { color: "#f87171", textDecoration: "underline", background: "rgba(248,113,113,0.15)", borderRadius: 2 },
  charCursor: { color: "#f0e6ff", background: "rgba(167,139,250,0.6)", borderRadius: 2, animation: "blink 1s infinite" },
  typingInput: { width: "100%", minHeight: 90, background: "rgba(255,255,255,0.05)", border: "2px solid rgba(34,211,238,0.3)", borderRadius: 14, padding: "14px 16px", color: "#f0e6ff", fontSize: 16, lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "'Courier New', monospace", boxSizing: "border-box" },
  passagePicker: { display: "flex", flexDirection: "column" },
  passagePickBtn: { width: 34, height: 34, borderRadius: 8, border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "#c4b5fd", fontWeight: 800, cursor: "pointer", fontSize: 13 },
  passagePickBtnActive: { background: "rgba(34,211,238,0.2)", border: "1.5px solid #22d3ee", color: "#67e8f9" },
  keyboardWrap: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px" },

  // Results
  resultsBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "10px 0" },
  resultsEmoji: { fontSize: 52 },
  resultsTitle: { fontSize: 24, fontWeight: 900, margin: 0, color: "#f0e6ff" },
  resultsBigStats: { display: "flex", gap: 24 },
  resultsStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  resultsStatNum: { fontSize: 32, fontWeight: 900, color: "#67e8f9" },
  resultsStatLabel: { fontSize: 11, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 },
  resultsFeedback: { margin: 0, fontSize: 14, color: "#c4b5fd", textAlign: "center", fontWeight: 700, maxWidth: 340 },
  resultsButtons: { display: "flex", gap: 10, marginTop: 4 },
  retryBtn: { padding: "11px 22px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "#f0e6ff", fontWeight: 800, cursor: "pointer", fontSize: 14 },
  nextPassageBtn: { padding: "11px 22px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #22d3ee, #818cf8)", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: 14 },
};

const styleEl = document.createElement("style");
styleEl.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
  @keyframes twinkle { from { opacity: 0.2 } to { opacity: 0.9 } }
  @keyframes spin { to { transform: rotate(360deg) } }
  @keyframes spinOnce { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  textarea:focus { border-color: rgba(167,139,250,0.7) !important; }
  button:hover { opacity: 0.85; transform: translateY(-1px); }
  @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
`;
document.head.appendChild(styleEl);
