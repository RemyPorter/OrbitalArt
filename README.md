# Orbital Art

This is a P5.js sketch inspired by [this](https://www.reddit.com/r/woahdude/comments/3oaw6c/earth_and_venus_orbiting_the_sun/) visualization of the Earth and Venus's orbit. Instead of generating a visualization of a real-world thing, this is a pure art toy.

## Use
You can see a live version [here](http://jetpackshark.com/orbits). The reset button will generate a new setup, and the save button will save a file called "orbits.png". On a mobile device, a shake will *also* generate a new setup, although I've had poor results trying to save the image. That appears to be a P5.js issue that I haven't dug into at all.

## Design
When a new setup is created, between 2 and 16 orbits are created. Each orbit has a random radius, and is offset from the center of the screen by up to 28% of its orbital radius. On each frame, a line is drawn from the smallest orbit to the next orbit out, from the second orbit to the next one further out, and so on. Each orbit ticks according to a period, which is controlled by its radius (larger orbits have larger periods).

## Code
The `World` class is a global settings object. It could have easily been an object literal, but I ported this over from regular Processing, so it gets a constructor instead. Its main function is `periodForOrbit`, which calculates the orbital period for an orbit based on a "unit" orbit- or an orbit that completes one revolution per frame. The unit orbit is currently 1/40th of the widest dimension of the screen.

Each `Orbit` class does some basic frame counting and trig to handle rotations. `OrbitalGroup` is a collection of orbits. It ticks them all in sequence, and with each tick returns an array of vectors listing off all where all the orbits think their "planet" is right now.