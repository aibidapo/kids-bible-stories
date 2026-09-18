import type { Story } from "../../types";

export const noah: Story = {
  id: "noah",
  title: "Noah's Big Boat",
  blurb: "One family, a lot of animals, and a promise painted across the sky.",
  reference: "Genesis 6 – 9",
  lesson: {
    little: "God keeps his promises.",
    big: "Noah did a strange, slow, unpopular thing because God asked him to — and God kept every promise he made in return.",
  },
  palette: { from: "#1f6a9e", to: "#6fc2b0", ink: "#fff8ec" },
  cover: "noah/rainbow",
  scenes: [
    {
      id: "builds",
      art: "noah/builds",
      text: {
        little: "God told Noah to build a great big boat. Noah got his hammer and began.",
        big: "The world had grown cruel, and it grieved God to see it. But there was one man who still walked with him. God told Noah to build an enormous boat — an ark — and gave him the measurements. So Noah began, though there was no sea in sight.",
      },
      verse: "Genesis 6:14",
      hotspots: [
        {
          id: "ark-frame",
          x: 66,
          y: 55,
          size: 26,
          label: "the half-built ark",
          reward:
            "The ark was about as long as one and a half football pitches. It took Noah years.",
          sound: "knock",
          sticker: "The Ark",
        },
        {
          id: "noah",
          x: 25,
          y: 72,
          size: 20,
          label: "Noah",
          reward: "People laughed at Noah for building a boat on dry land. He kept building.",
          sound: "chime",
        },
      ],
    },
    {
      id: "two-by-two",
      art: "noah/two-by-two",
      text: {
        little:
          "The animals came two by two. Big ones, small ones, tall ones, small ones — all the way in!",
        big: "Then the animals came. Two of every kind walked, crawled, slithered and flew up the ramp — lions beside lambs, elephants beside doves — and Noah’s family went in with them. When everyone was aboard, God shut the door.",
      },
      verse: "Genesis 7:9",
      find: { prompt: "Can you find the two doves?", targets: ["doves"] },
      hotspots: [
        {
          id: "doves",
          x: 55,
          y: 43,
          size: 20,
          label: "the two doves",
          reward: "Keep an eye on these two. One of them has an important job later.",
          sound: "bird",
          sticker: "Two by Two",
        },
        {
          id: "elephants",
          x: 32,
          y: 84,
          size: 22,
          label: "the elephants",
          reward: "Two of every kind — which means two of the very largest kind, too.",
          sound: "chime",
        },
      ],
    },
    {
      id: "flood",
      art: "noah/flood",
      text: {
        little:
          "Then it rained and rained and rained. The water lifted the boat up high. Inside, everyone was safe.",
        big: "The rain fell for forty days and forty nights, and the deep waters rose until even the mountains disappeared. The ark did not sink. It floated — lifted higher by the very thing that covered everything else.",
      },
      verse: "Genesis 7:17",
      hotspots: [
        {
          id: "ark-afloat",
          x: 50,
          y: 62,
          size: 26,
          label: "the floating ark",
          reward: "The same water that covered the world is what held the ark up.",
          sound: "thunder",
        },
        {
          id: "rain",
          x: 20,
          y: 30,
          size: 22,
          label: "the rain",
          reward: "Forty days and forty nights. That is nearly six whole weeks of rain.",
          sound: "splash",
        },
      ],
    },
    {
      id: "dove",
      art: "noah/dove",
      text: {
        little: "Noah sent a little dove to look. She came back with a green leaf. Land!",
        big: "When the rain stopped, Noah opened a window and sent out a dove. The first time she found nowhere to land and came home. Seven days later he sent her again — and she returned with a fresh olive leaf in her beak. Somewhere out there, trees were growing again.",
      },
      verse: "Genesis 8:11",
      find: { prompt: "What is the dove carrying?", targets: ["leaf"] },
      hotspots: [
        {
          id: "leaf",
          x: 62,
          y: 53,
          size: 20,
          label: "the olive leaf",
          reward: "A leaf means a tree. A tree means dry ground. Noah knew it was nearly over.",
          sound: "chime",
          sticker: "Olive Leaf",
        },
        {
          id: "hill",
          x: 90,
          y: 55,
          size: 20,
          label: "the first hilltop",
          reward: "Bit by bit, the world came back out of the water.",
          sound: "sparkle",
        },
      ],
    },
    {
      id: "rainbow",
      art: "noah/rainbow",
      text: {
        little:
          "Everyone came out onto the dry ground. God put a rainbow in the sky. It was a promise.",
        big: "Out they all came onto the dry, clean earth. And God made a promise: never again would he flood the whole world. He set a rainbow in the clouds as the sign of it — so that every time the rain clears, the sky itself remembers.",
      },
      verse: "Genesis 9:13",
      find: {
        prompt: "Tap the rainbow — God’s promise.",
        targets: ["rainbow"],
      },
      hotspots: [
        {
          id: "rainbow",
          x: 45,
          y: 30,
          size: 28,
          label: "the rainbow",
          reward: "A rainbow is God’s signature on a promise he has never broken.",
          sound: "cheer",
          sticker: "The Promise",
        },
        {
          id: "family",
          x: 33,
          y: 78,
          size: 22,
          label: "Noah's family",
          reward: "Eight people walked out of that boat, and the world started again with them.",
          sound: "chime",
        },
      ],
    },
  ],
  quiz: [
    {
      question: "What did God ask Noah to build?",
      choices: ["A big boat", "A tall tower", "A stone wall"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "How did the animals go into the ark?",
      choices: ["Two by two", "One at a time", "All in a heap"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "What did God put in the sky as a promise?",
      choices: ["A rainbow", "A star", "A cloud"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "How long did the rain fall?",
      choices: ["Forty days and forty nights", "Seven days", "One long afternoon"],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "What did the dove bring back to Noah?",
      choices: ["A fresh olive leaf", "A fish", "A stone"],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "What exactly did God promise after the flood?",
      choices: [
        "Never to flood the whole earth again",
        "That it would never rain again",
        "That Noah would be a king",
      ],
      answerIndex: 0,
      level: "big",
    },
  ],
  memoryVerse: {
    text: "I have set my rainbow in the clouds, and it will be the sign of the covenant between me and the earth.",
    reference: "Genesis 9:13",
  },
  devotional: {
    question: {
      little: "How did God keep Noah safe?",
      big: "Noah kept building even when it looked strange to everyone else. When is it hard to do what God asks? What helps you keep going?",
    },
    prayer: {
      little: "Dear God, you keep your promises. Thank you for the rainbow. Amen.",
      big: "Dear God, thank you that you keep every promise you make. When we see a rainbow, remind us that you are faithful, and help us to be faithful too. Amen.",
    },
    activity: "Draw a rainbow together. On each colour, write or draw one promise God keeps.",
  },
};
