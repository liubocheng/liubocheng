const timeDisplay = document.getElementById("timeDisplay");
const comboDisplay = document.getElementById("comboDisplay");
const critDisplay = document.getElementById("critDisplay");
const moneyDisplay = document.getElementById("moneyDisplay");
const streakHint = document.getElementById("streakHint");
const timeFill = document.getElementById("timeFill");
const tapButton = document.getElementById("tapButton");
const phaseText = document.getElementById("phaseText");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const playCopy = document.querySelector(".play-copy");
const resultCard = document.getElementById("resultCard");
const titleDisplay = document.getElementById("titleDisplay");
const resultMoney = document.getElementById("resultMoney");
const resultDescription = document.getElementById("resultDescription");
const clickCountDisplay = document.getElementById("clickCountDisplay");
const maxComboDisplay = document.getElementById("maxComboDisplay");
const critCountDisplay = document.getElementById("critCountDisplay");
const effectsLayer = document.getElementById("effectsLayer");
const gameCard = document.getElementById("gameCard");

const GAME_DURATION = 10_000;
const COMBO_WINDOW = 700;

const state = {
  phase: "idle",
  startAt: 0,
  endAt: 0,
  rafId: 0,
  total: 0,
  clicks: 0,
  combo: 0,
  maxCombo: 0,
  crits: 0,
  lastTapAt: 0,
};

function formatMoney(amount) {
  return `¥${Math.round(amount).toLocaleString("zh-CN")}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function comboLabel() {
  return `x${Math.max(1, state.combo)}`;
}

function currentCritChance() {
  return clamp(0.18 + Math.max(0, state.combo - 1) * 0.018, 0.18, 0.42);
}

function calculateTapReward() {
  const comboMultiplier = 1 + Math.max(0, state.combo - 1) * 0.16;
  const baseReward = randomBetween(9_800, 36_000);
  const critChance = currentCritChance();
  const isCrit = Math.random() < critChance;
  const critMultiplier = isCrit ? randomBetween(2.6, 6.8) : 1;
  const reward = Math.round(baseReward * comboMultiplier * critMultiplier);

  return {
    reward,
    isCrit,
    comboMultiplier,
    critMultiplier,
    critChance,
  };
}

function resetState() {
  cancelAnimationFrame(state.rafId);
  state.phase = "idle";
  state.startAt = 0;
  state.endAt = 0;
  state.rafId = 0;
  state.total = 0;
  state.clicks = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.crits = 0;
  state.lastTapAt = 0;

  updateHUD();
  streakHint.textContent = "准备开赚";
  phaseText.textContent = "点击按钮，开始你的 10 秒暴富挑战";
  startButton.disabled = false;
  startButton.textContent = "开始挑战";
  playCopy.classList.remove("is-hidden");
  resultCard.hidden = true;
  clearEffects();
}

function updateHUD() {
  moneyDisplay.textContent = formatMoney(state.total);
  comboDisplay.textContent = comboLabel();
  critDisplay.textContent = `${Math.round(currentCritChance() * 100)}%`;

  if (state.phase === "running") {
    const remaining = Math.max(0, state.endAt - performance.now());
    timeDisplay.textContent = `${(remaining / 1000).toFixed(1)}s`;
    timeFill.style.transform = `scaleX(${remaining / GAME_DURATION})`;
  } else if (state.phase === "finished") {
    timeDisplay.textContent = "0.0s";
    timeFill.style.transform = "scaleX(0)";
  } else {
    timeDisplay.textContent = "10.0s";
    timeFill.style.transform = "scaleX(1)";
  }
}

function startGame() {
  cancelAnimationFrame(state.rafId);
  clearEffects();

  state.phase = "running";
  state.startAt = performance.now();
  state.endAt = state.startAt + GAME_DURATION;
  state.total = 0;
  state.clicks = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.crits = 0;
  state.lastTapAt = 0;

  phaseText.textContent = "时间已经开始，快点到手指冒烟。";
  streakHint.textContent = "保持连击，暴击率会越打越高";
  startButton.disabled = true;
  playCopy.classList.add("is-hidden");
  resultCard.hidden = true;

  updateHUD();
  tick();
}

function endGame() {
  state.phase = "finished";
  cancelAnimationFrame(state.rafId);
  state.rafId = 0;

  const result = resolveRank(state.total);
  titleDisplay.textContent = result.title;
  resultMoney.textContent = formatMoney(state.total);
  resultDescription.textContent = result.description;
  clickCountDisplay.textContent = `${state.clicks}`;
  maxComboDisplay.textContent = `x${Math.max(1, state.maxCombo)}`;
  critCountDisplay.textContent = `${state.crits}`;
  resultCard.hidden = false;

  streakHint.textContent = `${result.title}已到账`;
  phaseText.textContent = "10 秒结束，看看你现在属于哪个层级。";
  playCopy.classList.remove("is-hidden");
  startButton.disabled = false;
  startButton.textContent = "重新挑战";

  state.combo = 0;
  updateHUD();
  burstCelebration();
}

function resolveRank(total) {
  if (total < 800_000) {
    return {
      title: "打工人",
      description: "10 秒里你已经够拼了，主打一个靠手速换工资，下次再冲高点。",
    };
  }

  if (total < 5_000_000) {
    return {
      title: "小老板",
      description: "你的生意已经转起来了，连击稳、暴击狠，气质像个会数现金的人。",
    };
  }

  return {
    title: "亿万富翁",
    description: "这波点击像开了印钞机，财富自由来得太快，建议立刻安排私人飞机。",
  };
}

function tick() {
  if (state.phase !== "running") {
    return;
  }

  const now = performance.now();
  const remaining = state.endAt - now;

  if (state.combo > 1 && now - state.lastTapAt > COMBO_WINDOW) {
    state.combo = 0;
    comboDisplay.textContent = comboLabel();
    streakHint.textContent = "连击断了，继续狂点把节奏找回来";
  }

  if (remaining <= 0) {
    endGame();
    return;
  }

  timeDisplay.textContent = `${(remaining / 1000).toFixed(1)}s`;
  timeFill.style.transform = `scaleX(${remaining / GAME_DURATION})`;
  state.rafId = requestAnimationFrame(tick);
}

function handleTap(event) {
  if (state.phase === "idle" || state.phase === "finished") {
    startGame();
  }

  if (state.phase !== "running") {
    return;
  }

  const now = performance.now();
  if (state.lastTapAt && now - state.lastTapAt <= COMBO_WINDOW) {
    state.combo += 1;
  } else {
    state.combo = 1;
  }

  state.lastTapAt = now;
  state.clicks += 1;
  state.maxCombo = Math.max(state.maxCombo, state.combo);

  const result = calculateTapReward();
  state.total += result.reward;

  if (result.isCrit) {
    state.crits += 1;
  }

  moneyDisplay.textContent = formatMoney(state.total);
  comboDisplay.textContent = comboLabel();
  critDisplay.textContent = `${Math.round(currentCritChance() * 100)}%`;
  streakHint.textContent = result.isCrit
    ? `暴击 x${result.critMultiplier.toFixed(1)}，这一笔直接起飞`
    : `连击 x${state.combo}，收益倍率 ${result.comboMultiplier.toFixed(2)}`;

  triggerTapFeedback();
  spawnCoin(event, result.isCrit);
  spawnMoneyFlash(event, result.reward, result.isCrit);
  spawnBurst(event, result.isCrit);

  if (result.isCrit) {
    shakeCard();
  }
}

function getEffectPosition(event) {
  const zoneRect = effectsLayer.getBoundingClientRect();
  const buttonRect = tapButton.getBoundingClientRect();

  const clientX = event?.clientX ?? buttonRect.left + buttonRect.width / 2;
  const clientY = event?.clientY ?? buttonRect.top + buttonRect.height / 2;

  return {
    x: clientX - zoneRect.left,
    y: clientY - zoneRect.top,
  };
}

function spawnCoin(event, isCrit) {
  const coin = document.createElement("div");
  const { x, y } = getEffectPosition(event);
  const angle = randomBetween(-1.2, 1.2);
  const distanceX = Math.cos(angle) * randomBetween(-70, 90);
  const distanceY = -randomBetween(90, 180);

  coin.className = "flying-coin";
  coin.textContent = "¥";
  coin.style.left = `${x - 21}px`;
  coin.style.top = `${y - 21}px`;
  coin.style.setProperty("--coin-x", `${distanceX}px`);
  coin.style.setProperty("--coin-y", `${distanceY}px`);

  if (isCrit) {
    coin.style.filter = "drop-shadow(0 0 22px rgba(255, 120, 78, 0.72))";
    coin.style.transform = "scale(1.15)";
  }

  effectsLayer.appendChild(coin);
  window.setTimeout(() => coin.remove(), 920);
}

function spawnMoneyFlash(event, reward, isCrit) {
  const flash = document.createElement("div");
  const { x, y } = getEffectPosition(event);

  flash.className = `money-flash${isCrit ? " is-crit" : ""}`;
  flash.textContent = `${isCrit ? "暴击 " : "+"}${formatMoney(reward)}`;
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;

  effectsLayer.appendChild(flash);
  window.setTimeout(() => flash.remove(), 880);
}

function spawnBurst(event, isCrit) {
  const { x, y } = getEffectPosition(event);
  const particleCount = isCrit ? 16 : 10;
  const ring = document.createElement("div");

  ring.className = "impact-ring";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.width = `${isCrit ? 180 : 120}px`;
  ring.style.height = `${isCrit ? 180 : 120}px`;
  effectsLayer.appendChild(ring);
  window.setTimeout(() => ring.remove(), 540);

  for (let index = 0; index < particleCount; index += 1) {
    const spark = document.createElement("div");
    const angle = (Math.PI * 2 * index) / particleCount + randomBetween(-0.25, 0.25);
    const distance = randomBetween(isCrit ? 60 : 32, isCrit ? 140 : 88);
    const size = randomBetween(6, isCrit ? 16 : 11);
    const translateX = Math.cos(angle) * distance;
    const translateY = Math.sin(angle) * distance;

    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.width = `${size}px`;
    spark.style.height = `${Math.max(4, size * 0.72)}px`;
    effectsLayer.appendChild(spark);

    spark.animate(
      [
        {
          opacity: 1,
          transform: "translate(-50%, -50%) scale(0.8)",
        },
        {
          opacity: 0,
          transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${isCrit ? 1.5 : 1.1})`,
        },
      ],
      {
        duration: isCrit ? 640 : 460,
        easing: "cubic-bezier(0.17, 0.67, 0.21, 1)",
        fill: "forwards",
      }
    );

    window.setTimeout(() => spark.remove(), isCrit ? 660 : 480);
  }
}

function burstCelebration() {
  const rect = tapButton.getBoundingClientRect();
  const centerEvent = {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
  };

  for (let index = 0; index < 3; index += 1) {
    window.setTimeout(() => spawnBurst(centerEvent, true), index * 150);
  }
}

function triggerTapFeedback() {
  tapButton.classList.remove("is-smashing");
  void tapButton.offsetWidth;
  tapButton.classList.add("is-smashing");
}

function shakeCard() {
  gameCard.classList.remove("is-shaking");
  void gameCard.offsetWidth;
  gameCard.classList.add("is-shaking");
}

function clearEffects() {
  effectsLayer.innerHTML = "";
}

tapButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  handleTap(event);
});

startButton.addEventListener("click", () => {
  startGame();
});

restartButton.addEventListener("click", () => {
  startGame();
});

gameCard.addEventListener("animationend", (event) => {
  if (event.animationName === "screen-shake") {
    gameCard.classList.remove("is-shaking");
  }
});

tapButton.addEventListener("animationend", () => {
  tapButton.classList.remove("is-smashing");
});

resetState();
