# Exo3D

Library handling the 3D display of exoplanets for the exoplanet.eu website

## Description

Display an exoplanet or an exoplanetary system while showing graphically their
main characteristics. It is design to work with the exoplanet.eu website and
database. It is then possible to see a representation - either scientifically
accurate or didactic - of a chosen exoplanet among the thousands listed on the
website. The exoplanet can be shown alone, or in its system. Thus, we can look
the star(s) it is dependent of, and if it is in the habitability zone.

## Goals

- Have many users smoothly navigating on the application
  (regardless of the support or browser)
- Keep a realistic representation of every element of each system
- Adapt the application to the database as much as possible, while anticipating
  future additions and prospective changes

## Current features

The 1.0.0 version displays the Solar System as an exemple. Here are some things featured :

- The Su
- All eight planets following their trajectory
- The Moon and Saturn Rings
- Management of the speed fo the simulator
- Free movement across the system
- Didactic view : oversized objects for a better sight of all planets.

Unfortunately this version does not include Bob. Wait for a future release for even more features !

## How to use

1. Clone the repository.
1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your computer (the equivalent of pip for JavaScript).
1. Use `npm install` in the project's root to get every dependency of the project.
1. Launch a local web server on your computer : `python3 -m http.server`.
1. Open in your browser : <http://localhost:8000/exo3d.html>.
