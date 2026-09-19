import type { Story } from "../../types";

export const creation: Story = {
  id: "creation",
  title: "In the Beginning",
  blurb: "Seven days, and a whole world made out of nothing.",
  reference: "Genesis 1 – 2",
  lesson: {
    little: "God made everything, and God made you.",
    big: "The world is not an accident. God made it on purpose, called it good, and trusted people to take care of it.",
  },
  palette: { from: "#2b1b56", to: "#f0913c", ink: "#fff8ec" },
  cover: "creation/lights",
  scenes: [
    {
      id: "light",
      art: "creation/light",
      text: {
        little:
          "At the very beginning, everything was dark. God said, “Let there be light!” And light shone.",
        big: "Before there was anything at all, there was God. The world had no shape and no light, only deep water and deeper darkness. Then God spoke: “Let there be light.” And there was light, and God saw that the light was good.",
      },
      verse: "Genesis 1:3",
      hotspots: [
        {
          id: "first-light",
          x: 50,
          y: 48,
          size: 26,
          label: "the very first light",
          reward:
            "The first thing God ever made was light. Everything else could be seen because of it.",
          sound: "sparkle",
          sticker: "First Light",
        },
      ],
    },
    {
      id: "sky-water",
      art: "creation/sky-water",
      text: {
        little: "God made a big open sky. Water stayed below it. Clouds floated above it.",
        big: "On the second day God stretched out a great open space and called it “sky.” He set the waters below it and the clouds above it, so the sky arched over the sea like a roof with no walls.",
      },
      verse: "Genesis 1:6–8",
      hotspots: [
        {
          id: "clouds",
          x: 30,
          y: 20,
          size: 22,
          label: "the clouds",
          reward: "Clouds are water too, carried up high and floating over our heads.",
          sound: "chime",
        },
        {
          id: "sea",
          x: 60,
          y: 84,
          size: 24,
          label: "the sea",
          reward: "The sea was here on day two, long before anything swam in it.",
          sound: "splash",
        },
      ],
    },
    {
      id: "land",
      art: "creation/land",
      text: {
        little:
          "God pushed the water back. Dry land came up. Then grass and flowers and trees grew everywhere.",
        big: "God gathered the seas into one place so that dry ground appeared. Then he filled the land with living things that grow: grass, flowers, and trees heavy with fruit, each one carrying seeds so more could grow after it.",
      },
      verse: "Genesis 1:11",
      find: {
        prompt: "Can you find the tree with fruit on it?",
        targets: ["fruit-tree"],
      },
      hotspots: [
        {
          id: "fruit-tree",
          x: 20,
          y: 62,
          size: 24,
          label: "the fruit tree",
          reward:
            "Inside every piece of fruit are seeds, tiny instructions for growing a whole new tree.",
          sound: "chime",
          sticker: "Fruit Tree",
        },
        {
          id: "flowers",
          x: 60,
          y: 90,
          size: 20,
          label: "the flowers",
          reward: "God did not have to make flowers pretty. He did it anyway.",
          sound: "sparkle",
        },
      ],
    },
    {
      id: "lights",
      art: "creation/lights",
      text: {
        little:
          "God made the sun to shine in the day. He made the moon and the stars for the night.",
        big: "God set lights in the sky to separate day from night, and to mark the seasons and the years. The sun rules the daytime, and the moon and countless stars keep watch over the dark.",
      },
      verse: "Genesis 1:16",
      find: {
        prompt: "Tap the sun, then tap the moon.",
        targets: ["sun", "moon"],
      },
      hotspots: [
        {
          id: "sun",
          x: 81,
          y: 28,
          size: 22,
          label: "the sun",
          reward: "The sun is a star. It is the closest one to us, and the reason the day is warm.",
          sound: "sparkle",
          sticker: "The Sun",
        },
        {
          id: "moon",
          x: 18,
          y: 26,
          size: 22,
          label: "the moon",
          reward: "The moon has no light of its own. It shines by catching the light of the sun.",
          sound: "chime",
          sticker: "The Moon",
        },
      ],
    },
    {
      id: "creatures",
      art: "creation/creatures",
      text: {
        little: "God filled the sea with fish. He filled the sky with birds.",
        big: "God filled the waters with darting, swarming life, and told the birds to fly across the face of the sky. Then he blessed them all and told them to fill the seas and multiply on the earth.",
      },
      verse: "Genesis 1:20–22",
      hotspots: [
        {
          id: "fish",
          x: 48,
          y: 82,
          size: 22,
          label: "the fish",
          reward: "There are more kinds of fish than anyone has ever finished counting.",
          sound: "splash",
          sticker: "Sea Full of Fish",
        },
        {
          id: "birds",
          x: 46,
          y: 24,
          size: 24,
          label: "the birds",
          reward: "Birds were the first things ever to fly.",
          sound: "bird",
        },
      ],
    },
    {
      id: "people",
      art: "creation/people",
      text: {
        little:
          "God made animals of every kind. Then God made people. God looked at it all and smiled. Then he rested.",
        big: "God made every kind of animal to walk the land. Last of all he made people in his own image, and gave them the whole world to care for. God looked at everything he had made, and it was very good. On the seventh day, he rested.",
      },
      verse: "Genesis 1:31 – 2:2",
      find: { prompt: "Who did God make last of all?", targets: ["people"] },
      hotspots: [
        {
          id: "lion",
          x: 25,
          y: 88,
          size: 20,
          label: "the lion",
          reward: "Every animal you can think of, and lots you cannot, came from this day.",
          sound: "roar",
        },
        {
          id: "giraffe",
          x: 17,
          y: 62,
          size: 20,
          label: "the giraffe",
          reward:
            "A giraffe has the same number of neck bones as you do. Just much, much longer ones.",
          sound: "chime",
        },
        {
          id: "people",
          x: 52,
          y: 70,
          size: 22,
          label: "the first people",
          reward: "People were made last, and made like God, to look after everything else.",
          sound: "cheer",
          sticker: "Made in His Image",
        },
      ],
    },
  ],
  quiz: [
    {
      question: "What was the very first thing God made?",
      choices: ["Light", "Rain", "Mountains"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "What did God put in the sky for night-time?",
      choices: ["The moon and stars", "A boat", "A rainbow"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "Who did God make last of all?",
      choices: ["People", "Fish", "Trees"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "How many days did God work before he rested?",
      choices: ["Six", "Three", "Ten"],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "On which day did God make the sun, moon and stars?",
      choices: ["The fourth day", "The first day", "The seventh day"],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "What did God say about everything he had made?",
      choices: ["It was very good", "It was finished", "It was quiet"],
      answerIndex: 0,
      level: "big",
    },
  ],
  memoryVerse: {
    text: "In the beginning God created the heavens and the earth.",
    reference: "Genesis 1:1",
  },
  devotional: {
    question: {
      little: "What is your favourite thing that God made?",
      big: "God looked at everything he had made and called it good. What is one good thing God made that you are thankful for today, and why?",
    },
    prayer: {
      little: "Dear God, thank you for making the world. Thank you for making me. Amen.",
      big: "Dear God, thank you for the sky, the sea, the animals and for us. Help us look after the world you made and notice how good it is. Amen.",
    },
    activity:
      "Go outside or look out of a window together. Find five things God made and say thank you for each one out loud.",
  },
};
