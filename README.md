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

## How to use

1. Clone the repository.
1. Install npm on your computer (the equivalent of pip for JavaScript).
1. Use `npm install` in the project's root to get every dependency of the project.
1. Launch a local web server on your computer : `python3 -m http.server`.
1. Open in your browser : <http://localhost:8000/exo3d.html>.
