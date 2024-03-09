import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";


const initLenis = () => {
    const lenis = new Lenis()

    gsap.registerPlugin(ScrollTrigger)


    lenis.on('scroll', (e) => {
    console.log(e)
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
}

window.addEventListener('load', () => {
    console.log('load')
    initLenis()
})