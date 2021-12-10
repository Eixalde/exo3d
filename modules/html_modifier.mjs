/**
 * This module contains every function used to add of modify HTML elements that
 * are dependant of variable parameters (such as the number and the name of
 * planets in the system). None of this functions control anything on the
 * features they support, they only provide fixed elements based on the
 * parameters they receive.
 */

/**
 * Creates radio buttons for every planet. Those buttons are controlled in
 * cameraModes to change the focus of the camera to look at a specific planet.
 *
 * @param {Array} planets - All the planets in the system.
 */
function addPlanetRadioButtons(planets) {
  /* By default, those buttons must be inaccessible unless the planet view is
  selected. We have to put them in a 'collapsable' HTML element. */
  const collapsable = document.querySelector('.collapse#collapsePlanetChoice')
  const planetButtonGroup = document.createElement('div')
  planetButtonGroup.classList.add('btn-group')
  planetButtonGroup.setAttribute('role', 'group')
  collapsable.appendChild(planetButtonGroup)

  planets.forEach((planet, index) => {
    const PLANET_BUTTON_ATTRIBUTES = [
      { name: 'type', value: 'radio' },
      { name: 'autocomplete', value: 'off' },
      { name: 'name', value: 'planetChoice' },
      {
        name: 'aria-label',
        value: `Camera centered on the planet ${planet.name}`
      }
    ]
    /* Makes the first planet checked by default. */
    if (index === 0) {
      PLANET_BUTTON_ATTRIBUTES.push({ name: 'checked', value: '' })
    }
    const planetButton = document.createElement('input')
    planetButton.id = planet.name
    planetButton.classList.add('btn-check')
    PLANET_BUTTON_ATTRIBUTES.forEach((attribute) => {
      planetButton.setAttribute(attribute.name, attribute.value)
    })

    const planetButtonLabel = document.createElement('label')
    planetButtonLabel.classList.add('btn', 'btn-outline-primary')
    planetButtonLabel.setAttribute('for', `${planet.name}`)
    planetButtonLabel.innerHTML = `${planet.name}`

    planetButtonGroup.appendChild(planetButton)
    planetButtonGroup.appendChild(planetButtonLabel)
  })
}

/**
 * Modifies the slider for the control of relative speed. It adds tickmarks up
 * to the number of planets in the system and number them in order. The actual
 * interactions with that relative speed is done in animManager.
 *
 * @param {Array} planets - All the planets in the system.
 */
function modifyPlanetSpeedSlider(planets) {
  const speedSlider = document.querySelector('.planet-speed')
  speedSlider.setAttribute('max', `${planets.length - 1}`)
  speedSlider.value = 0

  /* The HTML contains an empty datalist that we will fill with
  tickmarks, one for each planet. */
  const tickmarksValues = document.querySelector('#speed-tickmarks')
  planets.forEach((planet, idx) => {
    const tickmark = document.createElement('option')
    const TICKMARK_ATTRIBUTES = [
      { name: 'value', value: `${idx}` },
      { name: 'title', value: `${planet.name}` },
      {
        name: 'aria-label',
        value: `Sets the speed of animation relative to the revolution of the planet ${planet.name}`
      }
    ]
    TICKMARK_ATTRIBUTES.forEach((attribute) => {
      tickmark.setAttribute(attribute.name, attribute.value)
    })
    tickmark.classList.add('badge', 'bg-primary', 'rounded-pill')
    tickmark.innerHTML = `${idx + 1}`
    tickmarksValues.appendChild(tickmark)
  })
}

export { addPlanetRadioButtons, modifyPlanetSpeedSlider }
