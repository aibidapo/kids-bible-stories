import type { Story } from "../../types";

export const jonah: Story = {
  id: "jonah",
  title: "Jonah and the Big Fish",
  blurb: "A man runs the wrong way, and gets a very damp second chance.",
  reference: "Jonah 1 – 3",
  lesson: {
    little: "You cannot run away from God — and he still wants you back.",
    big: "Jonah ran in the opposite direction and God went after him anyway. Second chances are not a reward for getting it right the first time.",
  },
  palette: { from: "#12557f", to: "#f0913c", ink: "#fff8ec" },
  cover: "jonah/swallowed",
  scenes: [
    {
      id: "running",
      art: "jonah/running",
      text: {
        little:
          "God said, “Jonah, go to the city of Nineveh.” But Jonah did not want to. He got on a boat going the other way.",
        big: "God told Jonah to go east to Nineveh and warn the people there. Jonah did not want to — those were not his people, and he did not think they deserved a warning. So he walked down to the harbour, paid his fare, and boarded a ship sailing as far west as ships went.",
      },
      verse: "Jonah 1:3",
      find: {
        prompt: "Find the ship sailing the wrong way.",
        targets: ["ship"],
      },
      hotspots: [
        {
          id: "ship",
          x: 86,
          y: 68,
          size: 30,
          label: "the ship",
          reward:
            "Nineveh was east. This ship is pointed west. Jonah knew exactly what he was doing.",
          sound: "whoosh",
          sticker: "The Wrong Way",
        },
        {
          id: "jonah",
          x: 32,
          y: 46,
          size: 20,
          label: "Jonah",
          reward:
            "Jonah was a prophet. He had heard God clearly. He just did not like the message.",
          sound: "chime",
        },
      ],
    },
    {
      id: "storm",
      art: "jonah/storm",
      text: {
        little:
          "A huge storm shook the boat! The sailors were frightened. Jonah said, “It is my fault. Put me in the sea.”",
        big: "God sent a wind so violent the ship began to break apart. The sailors threw the cargo overboard and prayed to every god they knew. Then Jonah told them the truth: the storm was his. “Throw me into the sea,” he said, “and it will go calm.” They did not want to. In the end, they did.",
      },
      verse: "Jonah 1:12",
      hotspots: [
        {
          id: "sailors",
          x: 47,
          y: 42,
          size: 22,
          label: "the frightened sailors",
          reward:
            "The sailors tried everything else first. They really did not want to throw him in.",
          sound: "thunder",
        },
        {
          id: "lightning",
          x: 62,
          y: 22,
          size: 22,
          label: "the storm",
          reward:
            "The sea went completely still the moment Jonah hit the water.",
          sound: "thunder",
          sticker: "The Great Storm",
        },
      ],
    },
    {
      id: "swallowed",
      art: "jonah/swallowed",
      text: {
        little:
          "Down, down, down went Jonah. Then a very big fish came along — and swallowed him whole!",
        big: "Jonah sank into the dark green water, and that should have been the end of the story. But God had prepared a great fish, and it swallowed Jonah whole. He was alive, in the dark, inside a fish, for three days and three nights.",
      },
      verse: "Jonah 1:17",
      find: { prompt: "Can you find the big fish?", targets: ["bigfish"] },
      hotspots: [
        {
          id: "bigfish",
          x: 70,
          y: 78,
          size: 28,
          label: "the great fish",
          reward:
            "The Bible calls it a “great fish”. Whatever it was, it was big enough to be a rescue.",
          sound: "splash",
          sticker: "The Great Fish",
        },
        {
          id: "bubbles",
          x: 20,
          y: 30,
          size: 18,
          label: "the bubbles",
          reward: "Jonah had already given up. God had not.",
          sound: "splash",
        },
      ],
    },
    {
      id: "prayer",
      art: "jonah/prayer",
      text: {
        little:
          "It was dark inside the fish. Jonah said sorry to God and asked for help. God heard him.",
        big: "Inside the fish, in the dark, Jonah prayed — and it is one of the most honest prayers in the Bible. “I called out of my distress, and you answered me.” He was not rescued from the trouble. He was met inside it. On the third day, the fish put him back on dry land.",
      },
      verse: "Jonah 2:2",
      find: {
        prompt: "Tap the light coming through the dark.",
        targets: ["light"],
      },
      hotspots: [
        {
          id: "light",
          x: 50,
          y: 12,
          size: 22,
          label: "the light",
          reward:
            "Even here, in the strangest place anybody has ever prayed, God was listening.",
          sound: "sparkle",
          sticker: "Prayer in the Dark",
        },
        {
          id: "jonah-praying",
          x: 50,
          y: 74,
          size: 22,
          label: "Jonah praying",
          reward:
            "Three days and three nights. Then the fish set him down on the shore.",
          sound: "chime",
        },
      ],
    },
    {
      id: "nineveh",
      art: "jonah/nineveh",
      text: {
        little:
          "This time Jonah went to Nineveh. He told everyone about God — and they listened!",
        big: "Jonah walked into Nineveh at last and delivered his message. And to his complete astonishment, the whole city listened — from the king on his throne down to the smallest child. God forgave them. Jonah, honestly, sulked about it. God was kind to him too.",
      },
      verse: "Jonah 3:5",
      hotspots: [
        {
          id: "city",
          x: 62,
          y: 32,
          size: 28,
          label: "the city of Nineveh",
          reward:
            "Nineveh was huge — it took three days just to walk across it.",
          sound: "cheer",
          sticker: "Nineveh Listens",
        },
        {
          id: "people",
          x: 66,
          y: 68,
          size: 26,
          label: "the people listening",
          reward:
            "Jonah did not think they deserved a second chance. He had just had one himself.",
          sound: "cheer",
        },
      ],
    },
  ],
  quiz: [
    {
      question: "Where did God tell Jonah to go?",
      choices: ["Nineveh", "The beach", "Up a mountain"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "What swallowed Jonah?",
      choices: ["A big fish", "A whale-shaped cloud", "A cave"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "What did Jonah do inside the fish?",
      choices: ["He prayed to God", "He went to sleep", "He built a raft"],
      answerIndex: 0,
      level: "little",
    },
    {
      question: "How long was Jonah inside the great fish?",
      choices: ["Three days and three nights", "One night", "A whole week"],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "Why did Jonah run away in the first place?",
      choices: [
        "He did not want Nineveh to be forgiven",
        "He was afraid of ships",
        "He had lost the map",
      ],
      answerIndex: 0,
      level: "big",
    },
    {
      question: "What happened when Jonah finally preached in Nineveh?",
      choices: [
        "The whole city listened and turned back to God",
        "Nobody came out to hear him",
        "The king had him arrested",
      ],
      answerIndex: 0,
      level: "big",
    },
  ],
  memoryVerse: {
    text: "In my distress I called to the Lord, and he answered me.",
    reference: "Jonah 2:2",
  },
};
