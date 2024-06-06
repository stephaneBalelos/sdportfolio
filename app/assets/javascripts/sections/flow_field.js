import p5 from "p5";
import Particle from "../p5/particle";
import utils from "../utils";
import initController from "../flow_field_controller";
const Section = {

  load: (section) => {
    const canvas = section.querySelector('canvas')
    let MODE = "random-noise" // "attractor-center" | "random-noise-static"
    let PARTICLES_COUNT = 100

    window.BODY_COLOR = getComputedStyle(document.body).getPropertyValue('--body-color')
    window.BG_COLOR = getComputedStyle(document.body).getPropertyValue('--body-bg')

    window.ParticlesGrowLimit = 196
    window.ParticleLifespan = 200
    window.PARTICLE_MAX_SPEED = 4


    window.FLOWFIELD_MODE = "random-noise"
    window.FLOWFIELD_SCALE = 10
    window.SHOW_FIELD_VECTORS = false

    // Mode Params Random Noise
    window.RANDOM_NOISE_INCREMENT = 0.1
    window.RANDOM_NOISE_ZOFF_INCREMENT = 0.00003

    // Mode Params Attractor
    window.ATTRACTOR_CENTER = "center" // "mouse-follow" | "center" | "mouse-click"
  
    
    
    if (canvas) {
      
      var inc = window.RANDOM_NOISE_INCREMENT ? window.RANDOM_NOISE_INCREMENT : 0.1;
      var scl = window.FLOWFIELD_SCALE ? window.FLOWFIELD_SCALE : 10;
      var cols, rows;

      var zoff = 0;

      var fr;

      var particles = [];

      var flowfield;

      var canvasEl;

      var WIDTH;
      var HEIGHT;

      var lastClickPosition;
      

      const getSketchFunction = (el) => {
        canvasEl = el
        WIDTH = canvasEl.getBoundingClientRect().width
        HEIGHT = canvasEl.getBoundingClientRect().height

        return sketchFunction
      }

      const sketchFunction = (sk) => {
        sk.setup = () => {
          const canvas = sk.createCanvas(WIDTH, HEIGHT, 'WEBGL', canvasEl);

          for (var i = 0; i < PARTICLES_COUNT; i++) {
            particles[i] = new Particle(sk);
          }
          sk.background(window.BG_COLOR);
          lastClickPosition = sk.createVector(WIDTH / 2, HEIGHT / 2)

          document.body.addEventListener('click', (e) => {
            if (window.ATTRACTOR_CENTER === "mouse-click") {
              lastClickPosition = sk.createVector(e.clientX, e.clientY)
            }
          })
        }

        sk.draw = () => {

          // Handle Scale Changes
          scl = window.FLOWFIELD_SCALE ? window.FLOWFIELD_SCALE : 10;
          cols = sk.floor(sk.width / scl);
          rows = sk.floor(sk.height / scl);
          flowfield = new Array(cols * rows);


          
          sk.background(window.BG_COLOR);
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
              var angle;
              var v;
              
              switch (MODE) {
                case "random-noise":
                  angle = sk.noise(xoff, yoff, zoff) * sk.TWO_PI * 4;
                  v = p5.Vector.fromAngle(angle);
                  break;
                case "attractor":
                  let attractorCenter;
                  switch (window.ATTRACTOR_CENTER) {
                    case "center":
                      attractorCenter = center
                      break;
                    case "mouse-follow":
                      attractorCenter = sk.createVector(sk.mouseX, sk.mouseY)
                      break;
                    case "mouse-click":
                      attractorCenter = lastClickPosition
                      break;
                    default:
                      attractorCenter = center
                  }
                  v = sk.createVector(x * scl, y * scl).sub(attractorCenter).mult(-1);
                  if(v.mag() < 150) {
                    v = v.mult(0)
                  }
                  break;
                case "vortex":
                  const mouse = sk.createVector(sk.mouseX, sk.mouseY)
                  v = sk.createVector(x * scl, y * scl).sub(mouse).mult(-1);
                  const xc = sk.lerp(sk.mouseX, sk.width, 0)
                  const yc = sk.lerp(sk.mouseY, sk.height, 0)

                  const a = sk.atan2(sk.width, sk.height)
                  v = v.rotate(a)
                  
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
              xoff += window.RANDOM_NOISE_INCREMENT ? window.RANDOM_NOISE_INCREMENT : 0.1;
              
              if (window.SHOW_FIELD_VECTORS) {
                const offset = scl / 2;
                sk.stroke(255, 50);
                sk.strokeWeight(1);
                sk.push();
                sk.translate(x * scl + offset, y * scl + offset);
                sk.rotate(v.heading());
                sk.line(0, 0, scl, 0);
                sk.pop();
              } 
            }
            yoff += window.RANDOM_NOISE_INCREMENT ? window.RANDOM_NOISE_INCREMENT : 0.1;

            zoff += window.RANDOM_NOISE_ZOFF_INCREMENT ? window.RANDOM_NOISE_ZOFF_INCREMENT : 0.0003;
          }

          if (!window.SHOW_FIELD_VECTORS) {
            for (var i = 0; i < particles.length; i++) {
              particles[i].follow(sk, cols, scl, flowfield);
              particles[i].update();
              particles[i].edges(sk.width, sk.height);
  
              particles[i].show(sk);
            }
          }

          // if (sk.frameCount % 100 == 0) {
          //   particles.shift();
          //   particles.push(new Particle(sk));
          // }

          // fr.html(sk.floor(sk.frameRate()));
        }
      }

      const P5 = new p5(getSketchFunction(canvas));

      initController()
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
