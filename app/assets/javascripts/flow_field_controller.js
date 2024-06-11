const initController = () => {
    const controllerEl = document.getElementById('flow-field-controller')
    if (!controllerEl) {
        return
    }

    controllerEl.addEventListener('click', (e) => {
        e.stopPropagation()
    })

    const openButton = controllerEl.querySelector('#flow-field-controller-toggler')

    
    openButton.addEventListener('click', toggleController)


    function toggleController () {
        if(document.body.classList.contains('flow-field-controller-open')) {
            closeController()
        } else {
            openController()
        }
    }

    const openController = () => {
        document.body.classList.add('flow-field-controller-open')
        openButton.innerHTML = openButton.dataset.closeText
        if(window.lenis) {
            window.lenis.stop()
        }
    }
    const closeController = () => {
        document.body.classList.remove('flow-field-controller-open')
        openButton.innerHTML = openButton.dataset.openText
        if(window.lenis) {
            window.lenis.start()
        }
    }

    const modeSelect = controllerEl.querySelectorAll('input[type=radio][name=modeSelect]')
    const modePanelContainer = controllerEl.querySelector('.panel-mode-selected')
    const modePanel = modePanelContainer.querySelector('.panel-mode')


    const controllerInputs = controllerEl.querySelectorAll('input[type=range], input[type=number], input[type=checkbox], input[type=radio]')

    function onPropertyChange() {
        let value = this.value
        const valueEl = controllerEl.querySelector(`[data-value-for=${this.name}]`)


        if (this.type === 'range') {
            value = parseFloat(value)
            if (this.dataset.rangeMult) {
                value = value * parseFloat(this.dataset.rangeMult)
                const roundValue = this.dataset.rangeMult ? this.dataset.rangeMult.length : 0
                valueEl.innerHTML = value.toFixed(roundValue)
            } else {
                valueEl.innerHTML = value
            }
        }

        if (this.type === 'checkbox') {
            value = this.checked
        }

        if (this.type === 'radio') {
            value = this.value

            if(this.name === "FLOWFIELD_MODE") {
                handleModeChange(value)
            }
        }
        window[this.name] = value
    }

    [...controllerInputs].forEach(input => {
        input.addEventListener('input', onPropertyChange)
    })

    // init Input values
    controllerInputs.forEach(input => {
        const name = input.name
        let value = window[name]
        if (input.type === 'range') {
            const valueEl = controllerEl.querySelector(`[data-value-for=${name}]`)
            if (input.dataset.rangeMult) {
                const roundValue = input.dataset.rangeMult ? input.dataset.rangeMult.length : 0
                valueEl.innerHTML = value.toFixed(roundValue)
                value = value / parseFloat(input.dataset.rangeMult)
                input.value = value
            } else {
                valueEl.innerHTML = value
            }
            input.value = value
        }
        if (input.type === 'checkbox') {
            input.checked = value
        } 
        if (input.type === 'radio') {
            if (input.value === value) {
                input.checked = true
            } else {
                input.checked = false
            }

            if(name === "FLOWFIELD_MODE") {
                handleModeChange(value)
            }
        }
    })



    function handleModeChange (value) {
        if (modePanelContainer.classList.contains('mode-random-noise')) {
            modePanelContainer.classList.remove('mode-random-noise')
        }
        if (modePanelContainer.classList.contains('mode-attractor')) {
            modePanelContainer.classList.remove('mode-attractor')
        }
        if (modePanelContainer.classList.contains('mode-vortex')) {
            modePanelContainer.classList.remove('mode-vortex')
        }
        modePanelContainer.classList.add(`mode-${value}`)
    }

    const aboutButton = controllerEl.querySelector('[about-flow-field-collapse]')
    const aboutPanel = controllerEl.querySelector("#aboutFlowField")

    aboutButton.addEventListener('click', function() {
        aboutPanel.classList.toggle('open')
        aboutButton.classList.toggle('open')
    })


};

export default initController;