import gsap from "gsap";

const Section = {

  load: (section) => {
    const headerTitle = document.querySelector('[hero-header]')
    if (headerTitle) {
      headerTitle.innerHTML = headerTitle.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
      const tl = gsap.timeline({})
      tl.to(headerTitle.querySelectorAll('.letter'), {
        opacity: 1, ease: "expo.out",
        duration: .6,
        stagger: .034
      })
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
