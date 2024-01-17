/**
 * The built-in training planner.
 *
 * This is pure domain logic: a profile in, a structured plan out, no I/O and no
 * randomness. It is what the app falls back to when no remote model is configured
 * or when the remote call fails, which is why it has to produce something a coach
 * would actually be willing to hand to a client.
 */

export const GOALS = [
  { id: "strength", label: "Build strength" },
  { id: "fat-loss", label: "Lose body fat" },
  { id: "endurance", label: "Improve endurance" },
  { id: "mobility", label: "Move better" },
];

export const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner (under 1 year)" },
  { id: "intermediate", label: "Intermediate (1-3 years)" },
  { id: "advanced", label: "Advanced (3+ years)" },
];

const GOAL_TEMPLATES = {
  strength: {
    focusAreas: ["Lower-body strength", "Horizontal press", "Posterior chain"],
    intensity: "Moderate-high",
    blocks: [
      {
        name: "Back squat",
        prescription: "5 x 5 @ RPE 7",
        note: "Add 2.5kg once all five sets feel clean.",
      },
      {
        name: "Romanian deadlift",
        prescription: "3 x 8 @ RPE 7",
        note: "Stop the rep when the hamstrings stop lengthening.",
      },
      {
        name: "Bench press",
        prescription: "4 x 6 @ RPE 7",
        note: "Pause the bar on the chest for a full second.",
      },
      {
        name: "Chin-up",
        prescription: "4 x max-2",
        note: "Leave two reps in the tank on every set.",
      },
      {
        name: "Farmer carry",
        prescription: "4 x 40m",
        note: "Heavy enough that the last ten metres are the hard ones.",
      },
    ],
  },
  "fat-loss": {
    focusAreas: ["Full-body circuits", "Zone 2 conditioning", "Daily step count"],
    intensity: "Moderate",
    blocks: [
      {
        name: "Goblet squat",
        prescription: "4 x 12",
        note: "Keep 60 seconds between rounds, no longer.",
      },
      {
        name: "Dumbbell row",
        prescription: "4 x 12 each side",
        note: "Drive the elbow past the ribs.",
      },
      {
        name: "Push-up",
        prescription: "4 x 12-15",
        note: "Elevate the hands if the hips start to sag.",
      },
      {
        name: "Kettlebell swing",
        prescription: "6 x 20s on / 40s off",
        note: "Hips, not arms - the bell floats.",
      },
      {
        name: "Zone 2 walk or bike",
        prescription: "25 min conversational pace",
        note: "You should be able to hold a sentence.",
      },
    ],
  },
  endurance: {
    focusAreas: ["Aerobic base", "Threshold work", "Running economy"],
    intensity: "Moderate",
    blocks: [
      {
        name: "Easy run",
        prescription: "35 min @ conversational pace",
        note: "80% of weekly volume lives here.",
      },
      {
        name: "Cruise intervals",
        prescription: "5 x 4 min @ threshold, 90s float",
        note: "Comfortably hard, never a sprint.",
      },
      {
        name: "Strides",
        prescription: "6 x 20s relaxed and fast",
        note: "Form work, not a workout.",
      },
      {
        name: "Single-leg RDL",
        prescription: "3 x 8 each side",
        note: "Cheap insurance against hamstring niggles.",
      },
      { name: "Calf raise", prescription: "3 x 15", note: "Slow three-count on the way down." },
    ],
  },
  mobility: {
    focusAreas: ["Hip and ankle range", "Thoracic rotation", "Shoulder control"],
    intensity: "Low-moderate",
    blocks: [
      {
        name: "90/90 hip switch",
        prescription: "3 x 8 each side",
        note: "Move slowly, no hands once it feels easy.",
      },
      {
        name: "Couch stretch",
        prescription: "3 x 45s each side",
        note: "Ribs down, squeeze the glute.",
      },
      {
        name: "Thoracic open book",
        prescription: "3 x 8 each side",
        note: "Exhale at the end of every rotation.",
      },
      {
        name: "Wall slide",
        prescription: "3 x 10",
        note: "Lower back stays flat against the wall.",
      },
      {
        name: "Deep squat hold",
        prescription: "3 x 45s",
        note: "Heels down; hold a plate as a counterweight if needed.",
      },
    ],
  },
};

const BLOCKS_PER_SESSION = 4;

/** Rotate a list so each session in the week opens on a different movement. */
const rotate = (items, offset) =>
  items.map((_, index) => items[(index + offset) % items.length]);

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Spread N training days as evenly as possible across a 7-day week. */
export const distributeTrainingDays = (daysPerWeek) => {
  const count = Math.min(Math.max(Number(daysPerWeek) || 3, 1), 7);
  const step = 7 / count;
  const indexes = [];
  for (let i = 0; i < count; i += 1) {
    const index = Math.round(i * step) % 7;
    indexes.push(indexes.includes(index) ? (index + 1) % 7 : index);
  }
  return indexes.sort((a, b) => a - b).map((index) => DAY_NAMES[index]);
};

const SESSION_TITLES = {
  strength: ["Lower strength", "Upper strength", "Full-body power", "Accessory and carries"],
  "fat-loss": ["Metabolic circuit", "Strength and steady state", "Intervals", "Full-body pump"],
  endurance: ["Easy aerobic", "Threshold", "Long easy", "Strength for runners"],
  mobility: ["Hips and ankles", "Spine and shoulders", "Full-body flow", "Loaded stretching"],
};

const experienceAdjustment = (experience) => {
  switch (experience) {
    case "beginner":
      return {
        setDelta: -1,
        minutes: 45,
        note: "Technique before load: film one working set a week and review it.",
      };
    case "advanced":
      return {
        setDelta: 1,
        minutes: 75,
        note: "Run this for four weeks, then take a deload at 60% of the volume.",
      };
    default:
      return {
        setDelta: 0,
        minutes: 60,
        note: "Add load only when every prescribed rep is clean.",
      };
  }
};

const ageNotes = (age) => {
  const years = Number(age);
  if (!Number.isFinite(years)) return [];
  if (years < 18)
    return ["Under 18: keep loads submaximal and prioritise movement quality over numbers."];
  if (years >= 50)
    return [
      "Over 50: extend the warm-up to ten minutes and keep one extra rep in reserve on every top set.",
    ];
  if (years >= 35)
    return [
      "Sleep is the limiter for most athletes in their late thirties - protect seven hours.",
    ];
  return [];
};

const heightNotes = (heightFt) => {
  const feet = Number(heightFt);
  if (!Number.isFinite(feet)) return [];
  if (feet >= 6.2)
    return [
      "Long levers: pull from a slightly raised bar and expect a shallower comfortable squat depth.",
    ];
  if (feet <= 5.3)
    return [
      "Shorter levers favour you on pulls - bias the accessory work towards pressing range of motion.",
    ];
  return [];
};

const titleCase = (value) =>
  String(value).replace(/(^|[\s-])\w/g, (match) => match.toUpperCase());

/**
 * Build a structured weekly plan from a coaching profile.
 * @param {{age:number|string, height:number|string, goal:string, experience:string, daysPerWeek:number|string}} profile
 */
export const buildPlan = (profile = {}) => {
  const goal = GOAL_TEMPLATES[profile.goal] ? profile.goal : "strength";
  const template = GOAL_TEMPLATES[goal];
  const experience = EXPERIENCE_LEVELS.some((level) => level.id === profile.experience)
    ? profile.experience
    : "intermediate";
  const adjustment = experienceAdjustment(experience);
  const days = distributeTrainingDays(profile.daysPerWeek ?? 4);
  const titles = SESSION_TITLES[goal];

  const sessions = days.map((day, index) => {
    const blocks = rotate(template.blocks, index)
      .slice(0, BLOCKS_PER_SESSION)
      .map((block) => ({ ...block }));

    return {
      day,
      title: titles[index % titles.length],
      durationMin: adjustment.minutes,
      focus: template.focusAreas[index % template.focusAreas.length],
      blocks,
    };
  });

  const goalLabel = GOALS.find((entry) => entry.id === goal)?.label ?? titleCase(goal);
  const experienceLabel =
    EXPERIENCE_LEVELS.find((entry) => entry.id === experience)?.label ?? titleCase(experience);

  return {
    goal,
    experience,
    headline: `${sessions.length}-day block: ${goalLabel.toLowerCase()}`,
    summary: `A ${sessions.length}-session week built around ${template.focusAreas[0].toLowerCase()}, scaled for ${experienceLabel.toLowerCase()}. Repeat it for four weeks, keeping the same movements and adding a little load each week.`,
    focusAreas: template.focusAreas,
    weeklyLoad: {
      sessions: sessions.length,
      estimatedMinutes: sessions.length * adjustment.minutes,
      intensity: template.intensity,
    },
    sessions,
    coachingNotes: [adjustment.note, ...ageNotes(profile.age), ...heightNotes(profile.height)],
  };
};
