import gsap from "gsap";
import utils from "../utils";

const letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";


const Section = {

  load: (section) => {
    let interval = null;

    const headerTitle = document.querySelector('[hero-header]')
    if (headerTitle) {

      headerTitle.innerHTML = headerTitle.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter' data-initial='$&'>$&</span>");
      const tl = gsap.timeline({})
      const chars = [...headerTitle.querySelectorAll('.letter')];
      shuffleChars(chars);
    }

    function shuffleChars(arr) {
      arr.forEach((char, position) => {
        let iterations = 0;
          gsap.killTweensOf(char);
          gsap.fromTo(char, {
              opacity: 1
          }, {
              duration: 0.03,
              innerHTML: () => {
                // iterations++;
                if(position < iterations) {
                  return char.dataset.initial;
                } else {
                  return utils.lettersAndSymbols[Math.floor(Math.random() * utils.lettersAndSymbols.length)];
                }
              },
              repeat: arr.length,
              repeatRefresh: true,
              opacity: 1,
              onRepeat: () => iterations++,
              onComplete: () => gsap.set(char, {innerHTML: char.dataset.initial, delay: 0.03}),
          })
      });
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
