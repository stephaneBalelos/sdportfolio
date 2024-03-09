import gsap from "gsap";

const letters = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";


const Section = {

  load: (section) => {
    let interval = null;

    const headerTitle = document.querySelector('[hero-header]')
    if (headerTitle) {
      // headerTitle.innerHTML = headerTitle.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
      const tl = gsap.timeline({})
      // tl.to(headerTitle.querySelectorAll('.letter'), {
      //   opacity: 1, ease: "expo.out",
      //   duration: .6,
      //   stagger: .034
      // })
      let iteration = 0;
  
      clearInterval(interval);
      
      interval = setInterval(() => {
        headerTitle.innerText = headerTitle.innerText
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return headerTitle.dataset.value[index];
            }
          
            return letters[Math.floor(Math.random() * 52)]
          })
          .join("");
        
        if(iteration >= headerTitle.dataset.value.length){ 
          clearInterval(interval);
        }
        
        iteration += 1 ;
      }, 30);
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
