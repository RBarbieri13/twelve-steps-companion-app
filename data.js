// The Twelve Steps content and daily reflections.
// Wording follows the classic Twelve Steps, kept fellowship-neutral where possible.

export const STEPS = [
  {
    n: 1,
    title: "Honesty",
    text: "We admitted we were powerless over our addiction — that our lives had become unmanageable.",
    prompts: [
      "In what specific ways has my life become unmanageable?",
      "What am I still trying to control that I cannot control?",
      "What does powerlessness mean to me today?",
    ],
  },
  {
    n: 2,
    title: "Hope",
    text: "Came to believe that a Power greater than ourselves could restore us to sanity.",
    prompts: [
      "What does a 'Power greater than myself' mean to me right now?",
      "Where have I already seen evidence of hope or change?",
      "What would being 'restored' look like in my daily life?",
    ],
  },
  {
    n: 3,
    title: "Faith",
    text: "Made a decision to turn our will and our lives over to the care of a Higher Power as we understood it.",
    prompts: [
      "What am I willing to let go of today?",
      "What makes turning things over feel difficult?",
      "How can I practice 'letting go' in one small situation today?",
    ],
  },
  {
    n: 4,
    title: "Courage",
    text: "Made a searching and fearless moral inventory of ourselves.",
    prompts: [
      "What resentments am I still carrying, and what are they costing me?",
      "Where have my fears driven my behavior?",
      "What are my genuine strengths and assets?",
    ],
  },
  {
    n: 5,
    title: "Integrity",
    text: "Admitted to ourselves, and to another human being, the exact nature of our wrongs.",
    prompts: [
      "What have I been afraid to say out loud?",
      "Who is a safe person I can share my inventory with?",
      "How do I feel after being honest with someone I trust?",
    ],
  },
  {
    n: 6,
    title: "Willingness",
    text: "Were entirely ready to have these defects of character removed.",
    prompts: [
      "Which patterns am I truly ready to release?",
      "Which ones am I still holding onto, and why?",
      "What does 'entirely ready' feel like in my body?",
    ],
  },
  {
    n: 7,
    title: "Humility",
    text: "Humbly asked our Higher Power to remove our shortcomings.",
    prompts: [
      "What does humility mean to me, separate from shame?",
      "Where can I ask for help instead of going it alone?",
      "What shortcoming would I most like relief from today?",
    ],
  },
  {
    n: 8,
    title: "Forgiveness",
    text: "Made a list of all persons we had harmed, and became willing to make amends to them all.",
    prompts: [
      "Who have I harmed, directly or indirectly?",
      "Where does my own name belong on this list?",
      "What is the difference between willingness and action here?",
    ],
  },
  {
    n: 9,
    title: "Action",
    text: "Made direct amends to such people wherever possible, except when to do so would injure them or others.",
    prompts: [
      "What amends can I safely make today?",
      "Where would an amends cause more harm than good?",
      "How can living differently be its own amends?",
    ],
  },
  {
    n: 10,
    title: "Perseverance",
    text: "Continued to take personal inventory and when we were wrong promptly admitted it.",
    prompts: [
      "Where did I fall short today, and where did I show up well?",
      "Is there an amends I need to make from today?",
      "What am I grateful for right now?",
    ],
  },
  {
    n: 11,
    title: "Awareness",
    text: "Sought through prayer and meditation to improve our conscious contact with a Higher Power, praying only for knowledge of its will for us and the power to carry that out.",
    prompts: [
      "How did I make space for stillness today?",
      "What am I seeking guidance about?",
      "What would 'the next right thing' be right now?",
    ],
  },
  {
    n: 12,
    title: "Service",
    text: "Having had a spiritual awakening as the result of these steps, we tried to carry this message to others, and to practice these principles in all our affairs.",
    prompts: [
      "How have I changed since I began this work?",
      "Who could I be of service to today?",
      "Which principle do I most want to carry into my daily life?",
    ],
  },
];

export const SERENITY_PRAYER =
  "God, grant me the serenity to accept the things I cannot change, the courage to change the things I can, and the wisdom to know the difference.";

// A daily reflection is chosen deterministically from the day of the year.
export const REFLECTIONS = [
  "Just for today, I will try to live through this day only.",
  "Progress, not perfection.",
  "One day at a time.",
  "Feelings are not facts, but they deserve to be heard.",
  "I cannot control others; I can only work on myself.",
  "Letting go does not mean giving up — it means making room.",
  "Recovery is not a straight line, and that is okay.",
  "I am not my worst day.",
  "Asking for help is an act of courage, not weakness.",
  "The only way out is through, and I do not go through alone.",
  "Today I will be gentle with myself.",
  "Gratitude turns what I have into enough.",
  "First things first.",
  "This too shall pass.",
  "Easy does it, but do it.",
  "I keep coming back because it works.",
  "My past does not define my future.",
  "A setback is a setup for a comeback.",
  "Serenity is not freedom from the storm, but peace within it.",
  "I make amends best by living differently.",
  "Honesty with myself is where healing begins.",
  "I do not have to be perfect to be worthy of recovery.",
  "Connection is the opposite of addiction.",
  "Small steps, taken daily, become a new way of life.",
  "I trust the process even when I cannot see the path.",
  "Hope is a discipline I can practice today.",
  "I am responsible for the effort, not the outcome.",
  "Rest is part of the work.",
  "I choose recovery again, today.",
  "There is strength in surrender.",
  "Be where your feet are.",
];

export function reflectionForToday(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return REFLECTIONS[dayOfYear % REFLECTIONS.length];
}
