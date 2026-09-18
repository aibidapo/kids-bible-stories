import type { Story } from "../../types";

export const daniel: Story = {
  id: "daniel",
  title: "Daniel and the Lions",
  blurb: "A window left open, a night in a lions’ den, and a morning nobody expected.",
  reference: "Daniel 6",
  lesson: {
    little: "God looks after us, even in scary places.",
    big: "Daniel could have prayed quietly with the shutters closed and nobody would have known. He kept the window open — and God met him in the den.",
  },
  palette: { from: "#4a2b7a", to: "#e0b35e", ink: "#fff8ec" },
  cover: "daniel/angel",
  scenes: [
    {
      id: "prays",
      art: "daniel/prays",
      text: {
        little: "Daniel loved God. Three times every day he opened his window and prayed.",
        big: "Daniel worked for the king of Persia, and he was so good at his job that the king planned to put him in charge of the whole kingdom. Three times a day, every day, Daniel knelt at his upstairs window — the one that faced Jerusalem — and prayed. Everyone knew it.",
      },
      verse: "Daniel 6:10",
      find: {
        prompt: "Find the window Daniel prays beside.",
        targets: ["window"],
      },
      hotspots: [
        {
          id: "window",
          x: 70,
          y: 38,
          size: 24,
          label: "the open window",
          reward: "The window faced Jerusalem — his home, far away. He never closed it.",
          sound: "sparkle",
          sticker: "The Open Window",
        },
        {
          id: "daniel",
          x: 39,
          y: 74,
          size: 20,
          label: "Daniel praying",
          reward: "Three times a day, for years. Daniel’s bravery was mostly made of habit.",
          sound: "chime",
        },
      ],
    },
    {
      id: "trap",
      art: "daniel/trap",
      text: {
        little:
          "Some men were jealous of Daniel. They tricked the king into making a rule: “Only pray to the king!”",
        big: "The other officials were jealous, and they could not find a single thing wrong with Daniel — so they went after the one thing they knew he would not give up. They flattered the king into signing a law: for thirty days, anyone who prayed to anyone but the king would be thrown to the lions. The king signed it before he understood what he had done.",
      },
      verse: "Daniel 6:7",
      hotspots: [
        {
          id: "scroll",
          x: 32,
          y: 64,
          size: 22,
          label: "the new law",
          reward:
            "In Persia, once a law was signed even the king could not unsign it. That was the whole trick.",
          sound: "knock",
          sticker: "The Unbreakable Law",
        },
        {
          id: "king",
          x: 71,
          y: 42,
          size: 20,
          label: "King Darius",
          reward:
            "The king liked Daniel. He spent the rest of the day trying to find a way out of his own law.",
          sound: "chime",
        },
      ],
    },
    {
      id: "den",
      art: "daniel/den",
      text: {
        little: "Daniel kept on praying. So they put him in the lions’ den. The king was very sad.",
        big: "Daniel heard about the law, went home, opened his window and prayed exactly as he always had. So they came for him. The king could not save him; he had signed the order himself. As they sealed the stone over the den, he called down, “May your God, whom you serve continually, rescue you.” Then he went home and could not eat, or sleep.",
      },
      verse: "Daniel 6:16",
      hotspots: [
        {
          id: "lions-awake",
          x: 25,
          y: 88,
          size: 24,
          label: "the lions",
          reward: "These lions were kept hungry on purpose. This was not meant to be survivable.",
          sound: "roar",
          sticker: "Into the Den",
        },
        {
          id: "king-above",
          x: 50,
          y: 8,
          size: 18,
          label: "the king at the opening",
          reward: "The king stayed up all night. He was the one who could not sleep.",
          sound: "chime",
        },
      ],
    },
    {
      id: "angel",
      art: "daniel/angel",
      text: {
        little:
          "But God sent an angel. The angel shut the lions’ mouths. Daniel was safe all night long.",
        big: "God sent an angel, and the angel shut the lions’ mouths. All night the lions lay down around Daniel like enormous sleeping cats, and Daniel — who had been thrown into a pit to die — slept better than the king did.",
      },
      verse: "Daniel 6:22",
      find: {
        prompt: "Look at the lions. Are they awake?",
        targets: ["lions"],
      },
      hotspots: [
        {
          id: "angel",
          x: 50,
          y: 56,
          size: 26,
          label: "the angel",
          reward:
            "Daniel said afterwards: “My God sent his angel, and he shut the mouths of the lions.”",
          sound: "sparkle",
          sticker: "The Angel",
        },
        {
          id: "lions",
          x: 72,
          y: 86,
          size: 24,
          label: "the sleeping lions",
          reward: "Fast asleep. The most dangerous animals in the kingdom, having a nap.",
          sound: "chime",
          sticker: "Mouths Shut",
        },
      ],
    },
    {
      id: "rejoice",
      art: "daniel/rejoice",
      text: {
        little:
          "In the morning the king ran to the den. “Daniel!” he called. “I am here!” said Daniel. Everybody cheered!",
        big: "At first light the king ran — ran — to the den and shouted down into the dark. And a voice came back up: “O king, live for ever! My God sent his angel. I am not hurt.” They lifted Daniel out without a scratch on him, and the king wrote to every nation in his empire about the God who rescues.",
      },
      verse: "Daniel 6:23",
      hotspots: [
        {
          id: "king",
          x: 23,
          y: 76,
          size: 22,
          label: "the king",
          reward: "A king does not usually run anywhere. This one did.",
          sound: "cheer",
          sticker: "Morning Light",
        },
        {
          id: "daniel-out",
          x: 47,
          y: 72,
          size: 20,
          label: "Daniel, safe",
          reward: "“Not a wound was found on him, because he had trusted in his God.”",
          sound: "cheer",
        },
      ],
    },
  ],
  quiz: [
    {
      question: "How often did Daniel pray?",
      choices: ["Three times every day", "Once a year", "Only when he was scared"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "Where did they put Daniel?",
      choices: ["In the lions’ den", "On a boat", "Up a tree"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "Who kept Daniel safe all night?",
      choices: ["God sent an angel", "The king’s soldiers", "Nobody — he hid"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "Why did the other officials want to trap Daniel?",
      choices: ["They were jealous of him", "He had stolen from the king", "He was rude to them"],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "What did Daniel do when he heard about the new law?",
      choices: [
        "He prayed at his open window, just as always",
        "He prayed in secret",
        "He stopped praying for thirty days",
      ],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "What did King Darius do the night Daniel was in the den?",
      choices: ["He could not eat or sleep", "He held a feast", "He left the city"],
      answerIndex: 0,
      level: "big",
    },
  ],
  memoryVerse: {
    text: "My God sent his angel, and he shut the mouths of the lions.",
    reference: "Daniel 6:22",
  },
};
