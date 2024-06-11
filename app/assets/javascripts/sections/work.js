import gsap from "gsap";
import utils from "../utils";

const Section = {

  load: (section) => {
    const titlesToShuffle = [...section.querySelectorAll('[text-shuffle-alternate]')]
    const workItem = [...section.querySelectorAll('.work-item')]
    workItem.forEach(item => {
      const title = item.querySelector('[text-shuffle-alternate]');
      const initialText = title.dataset.initial;
      const alternateText = title.dataset.alternate;

      item.addEventListener('mouseenter', () => {
        shuffleChars(title, alternateText)
      })
      item.addEventListener('mouseleave', () => {
        shuffleChars(title, initialText)
      })
    })

    

    function shuffleChars(title, to) {
      console.log(to)
      title.innerHTML = to
      title.innerHTML = title.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter' data-initial='$&'>$&</span>");
      const chars = [...title.querySelectorAll('.letter')];
      // const repetitions = arr.length > to.length ? arr.length : to.length;
      chars.forEach((char, position) => {
        let iterations = 0;
          gsap.killTweensOf(char);
          gsap.fromTo(char, {
              opacity: 1
          }, {
              duration: 0.03,
              innerHTML: () => {
                // iterations++;
                console.log(char.dataset.initial)
                if(position < iterations) {
                  return char.dataset.initial ? char.dataset.initial : " ";
                } else {
                  return utils.lettersAndSymbols[Math.floor(Math.random() * utils.lettersAndSymbols.length)];
                }
              },
              repeat: to.length,
              repeatRefresh: true,
              opacity: 1,
              onRepeat: () => iterations++,
              onComplete: () => gsap.set(char, {innerHTML: char.dataset.initial ? char.dataset.initial : " ", delay: 0.03}),
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
