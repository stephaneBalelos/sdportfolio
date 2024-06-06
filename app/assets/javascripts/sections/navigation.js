import gsap from "gsap"

const Section = {

  load: (section) => {
    const brand = section.querySelector('.nav-brand')
    const extraNames = brand.querySelectorAll('[extra-name]')
    const cursor = brand.querySelector('[cursor]')
    const tl = gsap.timeline({
      onComplete: function () {
      },
      onReverseComplete: () => {
        brand.appendChild(cursor)
      }
    })
    Array.from(extraNames).forEach((name, index) => {
      name.innerHTML = name.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
      const letters = name.querySelectorAll('.letter')
      let iteration = 0
      tl.set(letters, {
        display: 'inline-block',
        stagger: .05,
        onUpdate: () => {
          const l = Array.from(letters)[iteration]
          name.insertBefore(cursor, l)
          iteration++
        }
      })
    })
    tl.paused(true)

    brand.addEventListener('mouseenter', () => {
      tl.play()
      window.FLOWFIELD_MODE = "vortex"
    })
    brand.addEventListener('mouseleave', () => {
      tl.reversed(true)
      window.FLOWFIELD_MODE = "random-noise"
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
