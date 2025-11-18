class EmotionalClock {
  constructor() {
    this.clockElement = document.getElementById('clock');
    this.timePeriodElement = document.getElementById('timePeriod');

    // Reveal stage cycles every second: 0 → 1 → 2 → 3 → 0 …
    this.stage = 0;
    this.lastSecond = -1;

    // minutes since midnight
    const mm = (hhmm) => {
      const [hh, m = "0"] = hhmm.split(":").map(Number);
      return hh * 60 + m;
    };

    // Daily routine.
    this.routine = [
      { name: "SLEEP",         emojiSet: ["😴","💤","🌙","🌜","🛌","🛏️"], start: mm("00:00"), end: mm("08:00"), colors: ["#0f0c29","#24243e","#302b63"] },
      { name: "BREAKFAST",     emojiSet: ["🍳","🥞","🥐","☕","🥯","🥓","🥚"], start: mm("08:00"), end: mm("09:00"), colors: ["#FFD700","#FFA500","#FF8C00"] },
      { name: "STUDY",         emojiSet: ["📚","📝","💡","🧠","💻","📖","📊"], start: mm("09:00"), end: mm("12:00"), colors: ["#87CEEB","#1E90FF","#4169E1"] },
      { name: "CLASS",         emojiSet: ["🎓","🏫","🧑‍🏫","🗒️","🧑‍💻","✍️","🧪","✏️","🧠"], start: mm("12:00"), end: mm("15:00"), colors: ["#FFB86C","#FF9F1C","#FF7A00"] },
      { name: "LUNCH FRIENDS", emojiSet: ["🍔","🍕","🥗","🥤","🍟"], start: mm("15:00"), end: mm("17:00"), colors: ["#8BC34A","#4CAF50","#2E7D32"] },
      { name: "CLASS",         emojiSet: ["🎓","🏫","🧑‍🏫","🗒️"], start: mm("17:00"), end: mm("19:00"), colors: ["#FFB86C","#FF9F1C","#FF7A00"] },
      { name: "GYM",           emojiSet: ["🏋️","💪","🏃","🤸","🚴","🥊"], start: mm("19:00"), end: mm("20:30"), colors: ["#9C27B0","#673AB7","#3F51B5"] },
      { name: "SHOWER",        emojiSet: ["🚿","🧼","🫧","🧴"], start: mm("20:30"), end: mm("21:00"), colors: ["#4FC3F7","#29B6F6","#039BE5"] },
      { name: "COOK DINNER",   emojiSet: ["🍲","🍜","🍚","🍛","🥗","🍱","🥘"], start: mm("21:00"), end: mm("23:00"), colors: ["#FF7043","#F4511E","#BF360C"] },
      { name: "CHILL",         emojiSet: ["😌","🎮","📺","🎧","🍿","🌌"], start: mm("23:00"), end: mm("24:00"), colors: ["#1a1a2e","#16213e","#0f3460"] },
    ];

    this.init();
  }

  init() {
    this.render();
    this.timer = setInterval(() => this.tick(), 250);
  }

  tick() {
    const now = new Date();
    const sec = now.getSeconds();
    if (this.lastSecond !== sec) {
      this.lastSecond = sec;
      this.stage = (this.stage + 1) % 4; // cycle 0→1→2→3→0
      this.render();
    }
  }

  // Find routine period for current minute of day
  getCurrentRoutine(minutesSinceMidnight) {
    return (
      this.routine.find(p => minutesSinceMidnight >= p.start && minutesSinceMidnight < p.end) ||
      this.routine[0]
    );
  }

  updateBackground(colors) {
    document.body.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
  }

  pad2(n) {
    return n.toString().padStart(2, "0");
  }

  // pick a random item from an array
  pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  render() {
    const now = new Date();
    const h = this.pad2(now.getHours());
    const m = this.pad2(now.getMinutes());
    const s = this.pad2(now.getSeconds());
    const timeString = `${h}${m}${s}`;

    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    const period = this.getCurrentRoutine(minutesSinceMidnight);

    // label and background update 
    this.updateBackground(period.colors);
    this.timePeriodElement.textContent = period.name;

    // Reveal count
    const revealCount = [0, 2, 4, 6][this.stage];

    // HH:MM:SS format
    let out = "";
    for (let i = 0; i < timeString.length; i++) {
      if (i === 2 || i === 4) out += `<span class="colon">:</span>`;
      if (i < revealCount) {
        out += `<span class="digit">${timeString[i]}</span>`;
      } else {
        // Random emoji 
        out += `<span class="emoji">${this.pickRandom(period.emojiSet)}</span>`;
      }
    }

    this.clockElement.innerHTML = out;
  }
}

window.onload = () => {
  new EmotionalClock();
};
