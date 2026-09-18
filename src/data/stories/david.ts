import type { Story } from "../../types";

export const david: Story = {
  id: "david",
  title: "David and the Giant",
  blurb:
    "The smallest person on the battlefield was the one who was not afraid.",
  reference: "1 Samuel 17",
  lesson: {
    little: "You can be brave, even when you are small.",
    big: "Courage is not the same as being big. David went out with nothing but a sling because he was sure of who was going with him.",
  },
  palette: { from: "#8a5a3b", to: "#e0b35e", ink: "#2a2140" },
  cover: "david/stones",
  scenes: [
    {
      id: "shepherd",
      art: "david/shepherd",
      text: {
        little:
          "David was the youngest boy in his family. He looked after the sheep, and he sang songs to God.",
        big: "David was the youngest of eight brothers, and while they went off to be soldiers, he stayed home with the sheep. Out on the hills he practised with his sling, guarded the flock from lions and bears, and made up songs to God that people still sing today.",
      },
      verse: "1 Samuel 16:11",
      find: { prompt: "How many sheep can you count?", targets: ["sheep"] },
      hotspots: [
        {
          id: "sheep",
          x: 64,
          y: 86,
          size: 22,
          label: "the sheep",
          reward:
            "Looking after sheep is how David learned to be brave — long before anyone was watching.",
          sound: "sheep",
          sticker: "Shepherd Boy",
        },
        {
          id: "staff",
          x: 26,
          y: 66,
          size: 16,
          label: "David's staff",
          reward:
            "A shepherd’s crook: for leaning on, for counting sheep, and for hooking one out of trouble.",
          sound: "chime",
        },
      ],
    },
    {
      id: "taunt",
      art: "david/taunt",
      text: {
        little:
          "A giant called Goliath shouted at God’s people every day. Everyone was scared of him.",
        big: "For forty days a Philistine champion called Goliath came out and roared across the valley: “Send me one man! Let us settle it!” He was over nine feet tall and armoured head to foot. Every soldier in Israel’s army heard him — and every one of them stayed exactly where he was.",
      },
      verse: "1 Samuel 17:11",
      hotspots: [
        {
          id: "goliath",
          x: 74,
          y: 56,
          size: 28,
          label: "Goliath",
          reward:
            "Goliath’s spear alone weighed about as much as a big bag of dog food. He was enormous.",
          sound: "thunder",
          sticker: "The Giant",
        },
        {
          id: "army",
          x: 20,
          y: 78,
          size: 22,
          label: "Israel's army",
          reward: "A whole army, all trained, all armed — and all frightened.",
          sound: "chime",
        },
      ],
    },
    {
      id: "volunteers",
      art: "david/volunteers",
      text: {
        little:
          "David said, “I will go!” The king gave him heavy armour. It was far too big, so David took it off.",
        big: "David came to the camp with bread for his brothers, heard the giant shouting, and said, “I will go.” King Saul tried to dress him in the royal armour, but David could barely walk in it. So he took it off — and went as himself.",
      },
      verse: "1 Samuel 17:39",
      find: {
        prompt: "Find the armour David decided not to wear.",
        targets: ["armour"],
      },
      hotspots: [
        {
          id: "armour",
          x: 31,
          y: 88,
          size: 20,
          label: "the armour on the ground",
          reward:
            "David did not pretend to be a soldier. He went out as a shepherd, with what he knew how to use.",
          sound: "knock",
          sticker: "No Armour",
        },
        {
          id: "saul",
          x: 64,
          y: 66,
          size: 22,
          label: "King Saul",
          reward:
            "Saul was the tallest man in Israel. Even he would not fight Goliath.",
          sound: "chime",
        },
      ],
    },
    {
      id: "stones",
      art: "david/stones",
      text: {
        little:
          "David picked five smooth stones from the stream. He put one in his sling and swung it round and round.",
        big: "David chose five smooth stones from the brook and walked out into the valley. Goliath laughed at him. David answered, “You come with a sword and a spear — I come in the name of the Lord.” Then he ran towards him, and slung the stone.",
      },
      verse: "1 Samuel 17:45",
      find: {
        prompt: "Tap the sling going round and round.",
        targets: ["sling"],
      },
      hotspots: [
        {
          id: "sling",
          x: 30,
          y: 54,
          size: 22,
          label: "the sling",
          reward:
            "A shepherd’s sling was not a toy. In skilled hands it was fast, and accurate, and serious.",
          sound: "whoosh",
          sticker: "Five Smooth Stones",
        },
        {
          id: "stones",
          x: 15,
          y: 93,
          size: 18,
          label: "the four spare stones",
          reward: "He picked five. He only ever needed one.",
          sound: "knock",
        },
      ],
    },
    {
      id: "strike",
      art: "david/strike",
      text: {
        little:
          "David let the stone fly. WHAM! It hit Goliath right on the forehead, and down he went.",
        big: "Goliath laughed at the boy with the stick. David answered that he came in the name of the Lord. Then he ran toward the giant, whirled the sling, and let one stone go. It struck Goliath square on the forehead, and the champion of the Philistines crashed to the ground and lay still.",
      },
      verse: "1 Samuel 17:49",
      hotspots: [
        {
          id: "stone-hit",
          x: 79,
          y: 36,
          size: 20,
          label: "where the stone hit",
          reward:
            "One stone, one shot. The other four stayed in the bag.",
          sound: "knock",
          sticker: "One Stone",
        },
        {
          id: "goliath-down",
          x: 61,
          y: 90,
          size: 26,
          label: "Goliath on the ground",
          reward: "The biggest soldier in the valley, flat on his back.",
          sound: "cheer",
        },
      ],
    },
    {
      id: "victory",
      art: "david/victory",
      text: {
        little:
          "Down went the giant! Everyone cheered for the brave shepherd boy.",
        big: "The stone flew true, and the giant fell. The armies of Israel erupted. The boy nobody had bothered to call in from the sheep field had done what no soldier there dared to do — and he never once claimed the credit for it.",
      },
      verse: "1 Samuel 17:50",
      hotspots: [
        {
          id: "david",
          x: 30,
          y: 74,
          size: 22,
          label: "David",
          reward:
            "David went on to become Israel’s greatest king. It started here, with a sling.",
          sound: "cheer",
          sticker: "Brave Heart",
        },
        {
          id: "crowd",
          x: 64,
          y: 66,
          size: 26,
          label: "the cheering army",
          reward:
            "The same soldiers who were too scared to move are now running down the hill.",
          sound: "cheer",
        },
      ],
    },
  ],
  quiz: [
    {
      question: "What was David’s job before he met the giant?",
      choices: ["Looking after sheep", "Baking bread", "Sailing a boat"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "What did David use to fight Goliath?",
      choices: ["A sling and a stone", "A big sword", "A shield"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "How did David feel about the giant?",
      choices: ["He was not afraid", "He ran away", "He hid behind a rock"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "How many stones did David pick up from the stream?",
      choices: ["Five", "One", "Ten"],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "Why did David refuse to wear King Saul’s armour?",
      choices: [
        "He was not used to it and could barely move",
        "It was the wrong colour",
        "Saul would not let him keep it",
      ],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "What did David say he was coming in the name of?",
      choices: ["The Lord", "The king", "His brothers"],
      answerIndex: 0,
      level: "big",
    },
  ],
  memoryVerse: {
    text: "You come against me with sword and spear, but I come against you in the name of the Lord Almighty.",
    reference: "1 Samuel 17:45",
  },
};
