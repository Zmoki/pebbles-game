interface Color {
  fill: string;
  stroke: string;
}

interface Pebble {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  isPicked: boolean;
  isAnimating: boolean;
  originalRadius: number;
  oscillationPhase: number;
  oscillationAmplitude: number;
}

interface Bowl {
  x: number;
  y: number;
  radius: number;
  color: Color;
  pebbles: Pebble[];
}

interface PebbleGame {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  bowls: Bowl[];
  loosePebbles: Pebble[];
  draggedPebble: Pebble | null;
  animationId: number | null;
}

function getRandomColor(): string {
  const r = Math.floor(Math.random() * 200) + 55;
  const g = Math.floor(Math.random() * 200) + 55;
  const b = Math.floor(Math.random() * 200) + 55;
  return `rgb(${r},${g},${b})`;
}

function createPebble(x: number, y: number, radius: number): Pebble {
  return {
    x,
    y,
    targetX: x,
    targetY: y,
    radius,
    originalRadius: radius,
    color: getRandomColor(),
    isPicked: false,
    isAnimating: false,
    oscillationPhase: 0,
    oscillationAmplitude: 0,
  };
}

function drawPebble(ctx: CanvasRenderingContext2D, pebble: Pebble) {
  const oscillation = Math.sin(pebble.oscillationPhase) * pebble.oscillationAmplitude;
  const currentRadius = pebble.radius + oscillation;

  ctx.beginPath();
  ctx.arc(pebble.x, pebble.y, currentRadius, 0, Math.PI * 2);
  ctx.fillStyle = pebble.color;
  ctx.fill();
  ctx.closePath();
}

function isPointInside(pebble: Pebble, x: number, y: number): boolean {
  const dx = pebble.x - x;
  const dy = pebble.y - y;
  return dx * dx + dy * dy <= pebble.radius * pebble.radius;
}

function createBowl(x: number, y: number, radius: number, color: Color): Bowl {
  return {
    x,
    y,
    radius,
    color,
    pebbles: [],
  };
}

function drawBowl(ctx: CanvasRenderingContext2D, bowl: Bowl) {
  ctx.beginPath();
  ctx.arc(bowl.x, bowl.y, bowl.radius, 0, Math.PI * 2);
  ctx.fillStyle = bowl.color.fill;
  ctx.fill();
  ctx.strokeStyle = bowl.color.stroke;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.closePath();

  bowl.pebbles.forEach(pebble => drawPebble(ctx, pebble));
}

function addPebbleToBowl(bowl: Bowl, pebble: Pebble) {
  bowl.pebbles.push(pebble);
}

function removePebbleFromBowl(bowl: Bowl, pebble: Pebble) {
  const index = bowl.pebbles.indexOf(pebble);
  if (index > -1) {
    bowl.pebbles.splice(index, 1);
  }
}

function containsPebble(bowl: Bowl, pebble: Pebble): boolean {
  const dx = pebble.x - bowl.x;
  const dy = pebble.y - bowl.y;
  return dx * dx + dy * dy < (bowl.radius - pebble.radius) * (bowl.radius - pebble.radius);
}

function onDrag(clientX: number, clientY: number, game: PebbleGame) {
  const rect = game.canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  for (const bowl of game.bowls) {
    for (const pebble of [...bowl.pebbles].reverse()) {
      if (isPointInside(pebble, x, y)) {
        game.draggedPebble = pebble;
        game.draggedPebble.isPicked = true;
        game.draggedPebble.isAnimating = true;
        game.draggedPebble.radius = game.draggedPebble.originalRadius * 1.2; // Increase size by 20%
        game.draggedPebble.oscillationAmplitude = 2; // Start oscillation
        removePebbleFromBowl(bowl, pebble);
        updatePebbleCounts(game);
        return;
      }
    }
  }

  for (let i = game.loosePebbles.length - 1; i >= 0; i--) {
    const pebble = game.loosePebbles[i];
    if (isPointInside(pebble, x, y)) {
      game.draggedPebble = pebble;
      game.draggedPebble.isPicked = true;
      game.loosePebbles.splice(i, 1);
      return;
    }
  }
}

function onDragging(clientX: number, clientY: number, game: PebbleGame) {
  const rect = game.canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  if (game.draggedPebble) {
    game.draggedPebble.targetX = x;
    game.draggedPebble.targetY = y;
  }
}

function onDrop(game: PebbleGame) {
  if (game.draggedPebble) {
    let addedToBowl = false;
    for (const bowl of game.bowls) {
      if (containsPebble(bowl, game.draggedPebble)) {
        addPebbleToBowl(bowl, game.draggedPebble);
        addedToBowl = true;
        game.draggedPebble.isAnimating = true;
        game.draggedPebble.oscillationAmplitude = 4;
        break;
      }
    }
    if (!addedToBowl) {
      game.loosePebbles.push(game.draggedPebble);
    }
    game.draggedPebble.isPicked = false;
    updatePebbleCounts(game);
    game.draggedPebble = null;
  }
}

function initializePebbles(bowls: Bowl[]) {
  const pebbleCount = [
    Math.floor(Math.random() * 10) + 5,
    Math.floor(Math.random() * 10) + 5
  ];

  bowls.forEach((bowl, index) => {
    for (let i = 0; i < pebbleCount[index]; i++) {
      const radius = Math.random() * (15 - 10) + 15;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * (bowl.radius - radius * 2);
      const x = bowl.x + r * Math.cos(angle);
      const y = bowl.y + r * Math.sin(angle);
      addPebbleToBowl(bowl, createPebble(x, y, radius));
    }
  });
}

function addEventListeners(game: PebbleGame) {
  let isDragging = false;

  game.canvas.addEventListener('mousedown', e => {
    isDragging = true;
    onDrag(e.clientX, e.clientY, game);
  });

  game.canvas.addEventListener('touchstart', ev => {
    isDragging = true;
    ev.preventDefault();
    onDrag(ev.touches[0].clientX, ev.touches[0].clientY, game);
  }, { passive: false });

  window.addEventListener('mousemove', e => {
    if (isDragging) {
      onDragging(e.clientX, e.clientY, game);
    }
  });

  window.addEventListener('touchmove', ev => {
    if (isDragging) {
      ev.preventDefault();
      onDragging(ev.touches[0].clientX, ev.touches[0].clientY, game);
    }
  }, { passive: false });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      onDrop(game);
    }
  });

  window.addEventListener('touchend', ev => {
    if (isDragging) {
      isDragging = false;
      ev.preventDefault();
      onDrop(game);
    }
  }, { passive: false });
}

function updatePebbleCounts(game: PebbleGame) {
  const counts = document.querySelectorAll('.pebble-count');
  game.bowls.forEach((bowl, index) => {
    counts[index].textContent = bowl.pebbles.length.toString();
  });
}

function animatePebble(pebble: Pebble) {
  const easing = 0.2;
  const dx = pebble.targetX - pebble.x;
  const dy = pebble.targetY - pebble.y;

  pebble.x += dx * easing;
  pebble.y += dy * easing;

  // Handle size change
  if (!pebble.isPicked) {
    pebble.radius += (pebble.originalRadius - pebble.radius) * easing;
  }

  // Handle oscillation
  pebble.oscillationPhase += 0.3;
  pebble.oscillationAmplitude *= 0.95; // Damping

  if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 &&
    Math.abs(pebble.radius - pebble.originalRadius) < 0.1 &&
    pebble.oscillationAmplitude < 0.1) {
    pebble.x = pebble.targetX;
    pebble.y = pebble.targetY;
    pebble.radius = pebble.originalRadius;
    pebble.oscillationAmplitude = 0;
    pebble.isAnimating = false;
  }
}

function animate(game: PebbleGame) {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

  game.bowls.forEach(bowl => {
    drawBowl(game.ctx, bowl);
    bowl.pebbles.forEach(pebble => {
      if (pebble.isAnimating) {
        animatePebble(pebble);
      }
      drawPebble(game.ctx, pebble);
    });
  });

  game.loosePebbles.forEach(pebble => {
    if (pebble.isAnimating) {
      animatePebble(pebble);
    }
    drawPebble(game.ctx, pebble);
  });

  if (game.draggedPebble) {
    animatePebble(game.draggedPebble);
    drawPebble(game.ctx, game.draggedPebble);
  }

  game.animationId = requestAnimationFrame(() => animate(game));
}

function startGame() {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const bowls: Bowl[] = [
    createBowl(150, 150, 100, {fill: '#FF14A1', stroke: '#d80082'}),
    createBowl(450, 150, 100, {fill: '#FE9923', stroke: '#e57c01'})
  ];
  const loosePebbles: Pebble[] = [];

  const game: PebbleGame = {
    canvas,
    ctx,
    bowls,
    loosePebbles,
    draggedPebble: null,
    animationId: null,
  };

  initializePebbles(game.bowls);
  addEventListeners(game);
  updatePebbleCounts(game);
  animate(game);
}

startGame();
