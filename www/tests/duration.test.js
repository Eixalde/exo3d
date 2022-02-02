/* global describe, it, expect */

import { daysToDuration } from '../exo3d.mjs'

describe('Duration', () => {
  // prettier-ignore
  it.each`
  daysTotal | years   | months | days
  ${0}      | ${0}    | ${0}   | ${0}
  ${30}     | ${0}    | ${0}   | ${30}
  ${31}     | ${0}    | ${1}   | ${0}
  ${61}     | ${0}    | ${2}   | ${0}
  ${62}     | ${0}    | ${2}   | ${1}
  ${365}    | ${0}    | ${11}  | ${30}
  ${365.25} | ${1}    | ${0}   | ${0}
  ${366}    | ${1}    | ${0}   | ${0}
  ${731}    | ${2}    | ${0}   | ${0}
  ${1460}   | ${3}    | ${11}  | ${29}
  ${365250} | ${1000} | ${0}   | ${0}

  `('should be converted correctly to days months and years', ({ daysTotal, years, months, days }) => {
    const DURATION = daysToDuration(daysTotal)

    expect(DURATION.years).toBeCloseTo(years)
    expect(DURATION.months).toBeCloseTo(months)
    expect(DURATION.days).toBeCloseTo(days)
  })
})
