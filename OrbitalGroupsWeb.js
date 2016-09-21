function randomScaling(n, min, max) {
  var res = [];
  for (var i = 0; i < n; i++) {
    res[i] = randomGaussian() * (max - min) + min;
  }
  return res;
}

function positionJiggle(driftRatio, radius) {
  return createVector(driftRatio * radius * randomGaussian(),
    driftRatio * radius * randomGaussian());
}

function World(unitRadius, maxRadius, maxOrbits, driftRatio) {
  this.unitRadius = unitRadius;
  this.maxRadius = maxRadius;
  this.maxOrbits = maxOrbits;
  this.driftRatio = driftRatio;
  this.periodForOrbit = function(radius) {
    return radius / unitRadius;
  }
}

function Orbit(world, radius) {
  this.w = world;
  this.radius = radius;
  this.center = positionJiggle(world.driftRatio, radius);
  this.period = world.periodForOrbit(radius);
  this.currentTick = 0;
  var self = this;
  this.tick = function() {
    self.currentTick++;
    var theta = self.currentTick / self.period;
    var res = createVector(radius/2 * sin(theta), radius/2 * cos(theta));
    res.add(self.center);
    return res;
  }
}

function OrbitalGroup(world, numOrbits) {
  this.w = world;
  this.orbits = [];
  var scaled = randomScaling(numOrbits, w.unitRadius, w.maxRadius);
  var self = this;
  for (var i = 0; i < numOrbits; i++) {
    this.orbits[i] = new Orbit(this.w, scaled[i]);
  }
  this.orbits.sort(function(a,b) {
    if (b < a) return -1;
    if (a == b) return 0;
    return 1;
  });
  this.tick = function() {
    var res = [];
    self.orbits.forEach(function(o) {
      res.push(o.tick());
    });
    return res;
  }
}


function safeRand() { return abs(randomGaussian()); }
var og;
var w;
function randomize() {
  og = new OrbitalGroup(w, safeRand() * w.maxOrbits + 1);
}

var offset;
function setup() {
  if (windowHeight == 0) {
    createCanvas(windowWidth, 900);
  } else {
    createCanvas(windowWidth, windowHeight);
  }
  var maxSize = width > height?width:height;
  w = new World(maxSize / 40, maxSize, 15, 0.28);
  noFill();
  ellipseMode(CENTER);
  background(0);
  randomize();
  offset = createVector(width/2, height/2);

  document.getElementById("resetit").onclick = function() {
    clear();
    background(0);
    randomize();
  }

  document.getElementById("saveit").onclick = function() {
    saveCanvas("orbit","png");
  }
}

function draw() {
  stroke(255,255,255,25);
  push();
  translate(offset.x, offset.y);
  var points = og.tick();
  for (var i = 1;i < points.length; i++) {
    var a = points[i - 1];
    var b = points[i];
    line(a.x, a.y, b.x, b.y);
  }
  pop();
}

function keyPressed() {
  if (key == " ") {
    clear();
    background(0);
    randomize();
  } else if (key == "s" || key == "S") {
    saveCanvas("orbits","png");
  }
}

function deviceShaken() {
  clear();
  background(0);
  randomize();
}