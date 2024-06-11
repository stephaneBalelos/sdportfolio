import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)

const Section = {

  load: (section) => {
    const title = section.querySelector('.contact-title')
    title.innerHTML = title.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: title,
        start: 'top 80%',
        end: 'center center',
        scrub: 3,
        toggleActions: "play pause resume reset"
      },
      
    })

    tl.to(title.querySelectorAll('.letter'), {
      backgroundPosition: '0% 0%', ease: 'expo.out', stagger: .5,
    })

    // Form
    const form = document.getElementById('contactRequestForm')
    const submitButton = form.querySelector('button[type=submit]')
    const submitBtnText = submitButton.querySelector('[btn-text]')
    form.addEventListener('submit', ($e) => {
      $e.preventDefault()
      submitButton.disabled = true
      submitBtnText.textContent = submitButton.dataset.loading
      const formData = new FormData(form)
      console.log(formData.get('name'))

      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      }

      fetch(form.getAttribute("action"), {
        method: 'POST',
        body: new URLSearchParams(formData),
      }).then((response) => {
        return response.json()
      }).then((data) => {
        if (data.errors) {
          showSuccessMessage(true)
        } else {
          window.FLOWFIELD_MODE = "random-noise"
          form.reset()
          showSuccessMessage()
        }
      }).catch((error) => {
        showSuccessMessage(true)
      }).finally(() => {
        submitButton.disabled = false
        submitBtnText.textContent = submitButton.dataset.initial
      })  
    })

    function showSuccessMessage(error = false) {
      const successMessage = section.querySelector("#contactFormSuccessMsg")
      const errorMessage = section.querySelector("#contactFormErrorMsg")

      if (error) {
        if (successMessage && !successMessage.classList.contains('d-none')) {
          successMessage.classList.add('d-none')
        } 
        if (errorMessage && errorMessage.classList.contains('d-none')) {
          errorMessage.classList.remove('d-none')
        }
      } else {
        if (errorMessage && !errorMessage.classList.contains('d-none')) {
          errorMessage.classList.add('d-none')
        } 
        if (successMessage && successMessage.classList.contains('d-none')) {
          successMessage.classList.remove('d-none')
        }
      
      }
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
