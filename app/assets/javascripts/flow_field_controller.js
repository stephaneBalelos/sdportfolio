const initController = () => {
    const controllerEl = document.getElementById('flow-field-controller')
    if (!controllerEl) {
        return
    }

    const openButton = controllerEl.querySelector('#flow-field-controller-toggler')

    
    openButton.addEventListener('click', toggleController)
    console.log(openButton)


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
    }
    const closeController = () => {
        document.body.classList.remove('flow-field-controller-open')
        openButton.innerHTML = openButton.dataset.openText
    }

    const modeSelect = controllerEl.querySelectorAll('input[type=radio][name=modeSelect]')
    const modePanelContainer = controllerEl.querySelector('.panel-mode-selected')
    const modePanel = modePanelContainer.querySelector('.panel-mode')

    function onModeChange() {
        window.FLOWFIELD_MODE = this.value
        if (modePanelContainer.classList.contains('mode-random-noise')) {
            modePanelContainer.classList.remove('mode-random-noise')
        }
        if (modePanelContainer.classList.contains('mode-attractor')) {
            modePanelContainer.classList.remove('mode-attractor')
        }
        if (modePanelContainer.classList.contains('mode-vortex')) {
            modePanelContainer.classList.remove('mode-vortex')
        }
        modePanelContainer.classList.add(`mode-${this.value}`)
    }

    [...modeSelect].forEach(radio => {
        radio.addEventListener('change', onModeChange)
    })

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
        }
        
        console.log(this.name, value)
        window[this.name] = value
    }

    [...controllerInputs].forEach(input => {
        input.addEventListener('input', onPropertyChange)
    })






};

export default initController;