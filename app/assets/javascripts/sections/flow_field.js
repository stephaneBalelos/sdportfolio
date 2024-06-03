import p5 from "p5";
import Particle from "../p5/particle";
const Section = {

  load: (section) => {
    const canvas = section.querySelector('canvas')
    let MODE = "random-noise" // "attractor-center" | "random-noise-static"
    let PARTICLES_COUNT = 50
    
    
    
    if (canvas) {
      
      var inc = 0.1;
      var scl = 30;
      var cols, rows;

      var zoff = 0;

      var fr;

      var particles = [];

      var flowfield;

      var canvasEl;

      var WIDTH;
      var HEIGHT;
      

      canvas.addEventListener('click', () => {
        scl = scl == 10 ? 150 : 10
      })

      const getSketchFunction = (el) => {
        canvasEl = el
        WIDTH = canvasEl.getBoundingClientRect().width
        HEIGHT = canvasEl.getBoundingClientRect().height

        return sketchFunction
      }

      const sketchFunction = (sk) => {
        sk.setup = () => {
          sk.createCanvas(WIDTH, HEIGHT, 'WEBGL', canvasEl);
          cols = sk.floor(sk.width / scl);
          rows = sk.floor(sk.height / scl);
          fr = sk.createP('');

          flowfield = new Array(cols * rows);

          for (var i = 0; i < PARTICLES_COUNT; i++) {
            particles[i] = new Particle(sk);
          }
          sk.background(25);

      }

        sk.draw = () => {
          sk.background(25)
          // sk.strokeWeight(50);
          var center = sk.createVector(WIDTH / 2, HEIGHT / 2)
          // sk.point(center);
          if (window.FLOWFIELD_MODE) {
            MODE = window.FLOWFIELD_MODE
          }
          var yoff = 0;
          for (var y = 0; y < rows; y++) {
            var xoff = 0;
            for (var x = 0; x < cols; x++) {
              var index = x + y * cols;
              var count = rows * cols
              var angle;
              var v;
              

              switch (MODE) {
                case "random-noise":
                  angle = sk.noise(xoff, yoff, zoff) * sk.TWO_PI * 4;
                  v = p5.Vector.fromAngle(angle);
                  break;
                case "attractor-center":
                  v = sk.createVector(x * scl, y * scl).sub(center).mult(-1);
                  if(v.mag() < 150) {
                    v = v.mult(0)
                  }
                  break;
                case "random-noise-static":
                  angle = sk.noise(xoff, yoff, zoff) * sk.TWO_PI * 4;
                  if (!flowfield[index]) {
                    v = p5.Vector.fromAngle(angle);
                  } else{
                    v = flowfield[index]
                  }
                  break;
              
                default:
                  angle = sk.noise(sk.random(cols * inc), sk.random(rows * inc), sk.random(0.0003 * cols)) * sk.TWO_PI * 4;
                  v = p5.Vector.fromAngle(angle);
                  break;
              }

              v.setMag(1);
              flowfield[index] = v;
              xoff += inc;
              // sk.stroke(255, 50);
              // sk.push();
              // sk.translate(x * scl, y * scl);
              // sk.rotate(v.heading());
              // sk.strokeWeight(1);
              // sk.line(0, 0, scl, 0);
              // sk.pop();
            }
            yoff += inc;

            zoff += 0.0003;
          }

          for (var i = 0; i < particles.length; i++) {
            particles[i].follow(sk, cols, scl, flowfield);
            particles[i].update();
            particles[i].edges(sk.width, sk.height);

            particles[i].show(sk);
          }

          // if (sk.frameCount % 100 == 0) {
          //   particles.shift();
          //   particles.push(new Particle(sk));
          // }

          fr.html(sk.floor(sk.frameRate()));
        }
      }

      const P5 = new p5(getSketchFunction(canvas));



    }

  },

  // unload: (section) => {
  // },

  // select: (section) => {
  // },

  // deselect: (section) => {
  // },

  // reorder: (section) => {
  // },

  // blockSelect: (section, block) => {
  // },

  // blockDeselect: (section, block) => {
  // }

}

export default Section;
