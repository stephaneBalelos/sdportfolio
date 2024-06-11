import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import utils from './utils';
gsap.registerPlugin(ScrollTrigger)


const initLenis = () => {
    const lenis = new Lenis()



    lenis.on('scroll', (e) => {
        let offset = window.scrollY / (document.body.offsetHeight - window.innerHeight)
        if(offset == 0) {
            window.FLOWFIELD_MODE = "random-noise"
        }
        if(offset > 0) {
            window.FLOWFIELD_MODE = "vortex"
        }
        window.VORTEX_ANGLE = utils.lerp(-80, 80, offset)
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time)=>{
    lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // make lenis available globally
    window.lenis = lenis
}

window.addEventListener('load', () => {
    initLenis()
})