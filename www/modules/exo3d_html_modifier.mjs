/**
 * @module Exo3DHTMLModifier
 * @description This module contains every function used to add of modify
 * elements of the Exo3D HTML, that are dependant of variable parameters (such
 * as the number and the name of planets in the system). None of this functions
 * control anything on the features they support, they only provide fixed
 * elements based on the parameters they receive. Most modifications are made on
 * exo3d.html but we recently had to modify the index.html as well so the module
 * contains methods for both.
 */

import { daysToDuration, Planet } from '../exo3d.mjs'

/**
 * Creates radio buttons for every planet. Those buttons are controlled in
 * cameraModes to change the focus of the camera to look at a specific planet.
 * @param {Planet[]} planets - All the planets in the system.
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
 * @param {Planet[]} planets - All the planets in the system.
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

/**
 * Handles the update of the day count in the simulation.
 * @property {Number} daysCount - Number of simulation days since the begining of the similation.
 * @property {AnimManager} animManager - The animation manager of the application.
 * @property {Number} simulationTime - The base time for a given planet to revolve in the simulation (in sec).
 * @property {Number} firstPlanetRevPeriod - The period of the first planet of the system (in days).
 */
class NumberOfDaysUpdater {
  #daysCount
  #animManager
  #simulationTime
  #firstPlanetRevPeriod

  /**
   * @param {AnimManager} animManager - The animation manager of the application.
   * @param {Number} simulationTime - The base time for a given planet to revolve in the simulation (in sec).
   * @param {Number} firstPlanetRevPeriod - The period of the first planet of the system (in days).
   */
  constructor(animManager, simulationTime, firstPlanetRevPeriod) {
    this.#daysCount = 0
    this.#animManager = animManager
    this.#simulationTime = simulationTime
    this.#firstPlanetRevPeriod = firstPlanetRevPeriod
    this.update()
  }

  /**
   * Constantly updates the Number of days simulated through the application and
   * shows it in the dedicated HTML part. It prints months beyond 30 days, and
   * years beyond 12 months (the conversion is made with daysToDuration, see
   * 'celestial_maths').
   */
  update() {
    const SECOND_IN_MS = 1000
    const TIMEOUT_DURATION = 100 // in ms
    setTimeout(() => {
      /* The current speed ratio affects how fast the time passes, thus it is
      important to get back the correct day amount. */
      const currentSpeedRatio =
        this.#animManager.globalSpeedRatio *
        this.#animManager.relativeSpeedRatio

      /* WHITEMAGIC : This formula converts back the seconds in the simulation
      into what they represent in real days. See the detailled documentation for
      further explanation. */
      this.#daysCount +=
        (currentSpeedRatio * this.#firstPlanetRevPeriod) /
        ((this.#simulationTime * SECOND_IN_MS) / TIMEOUT_DURATION)

      /* Converts the day count into a duration of the format 'years, months and
      days'. */
      const duration = daysToDuration(this.#daysCount)
      const formattedYears = duration.years.toString().padStart(4, '0')
      const formattedMonths = duration.months.toString().padStart(2, '0')
      const formattedDays = duration.days.toString().padStart(2, '0')

      /* Updates the HTML part. */
      document.querySelector(
        '#simulation-time'
      ).innerHTML = `Temps écoulé depuis le début de la simulation :\n${formattedYears} années, ${formattedMonths} mois et ${formattedDays} jours.`

      /* Calling the function again to make it timeout recursively. */
      this.update()
    }, TIMEOUT_DURATION)
  }
}

export { addPlanetRadioButtons, modifyPlanetSpeedSlider, NumberOfDaysUpdater }
