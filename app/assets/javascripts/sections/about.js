import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

const Section = {

  load: (section) => {
    const title = section.querySelector('.about-title')
    title.innerHTML = title.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 3,
        toggleActions: "play pause resume reset"
      },
      
    })

    tl.to(title.querySelectorAll('.letter'), {
      backgroundPosition: '0% 0%', ease: 'expo.out', stagger: .5,
    })
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
