# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.22.0] - 2022-01-12

### Added

- Wrote the detailled documentation

## [0.21.4] - 2022-01-07

### Fixed

- Added normalized spin period for the satellites

## [0.21.3] - 2022-01-07

### Fixed

- Fixed rendering issues with trajectories and planets

## [0.21.2] - 2022-01-06

### Fixed

- Applied a lock on the buttons during transitions
- Applied a lock on the zoom for cameras

## [0.21.1] - 2022-01-05

### Changed

- Minor changes in informative messages

## [0.21.0] - 2022-01-05

### Changed

- Moved any trajectory-related function to trajectory.mjs
- Added short interpolation for static trajectories

## [0.20.2] - 2021-12-17

### Added

- Added EUPL 1.2 licence to the project

## [0.20.1] - 2021-12-17

### Added

- Implemented jsdoc2md for generated documentation in markdown

### Changed

- Rewrote the documentation of the code

## [0.20.0] - 2021-12-16

### Added

- Implemented ecliptic inclination for planets
- Implemented self-inclination for planets

### Changed

- Modified the movement animations' object of reference

### Removed

- Deleted the transition animation between cameras

## [0.19.0] - 2021-12-13

### Added

- Created informative messages for the user

## [0.18.0] - 2021-12-10

### Added

- Added relative speed controls

### Changed

- Used Bootstrap cards to regroup UI controls
- Made the planet camera controls able to select any planet
- Refactored the creation of a system with a builder

## [0.17.0] - 2021-12-02

### Added

- Made the color of the stars change according to their temperature

## [0.16.0] - 2021-11-30

### Added

- Calculated appropriate didactic scales for all objects
- Implemented a realistic/didactic view button
- Made smooth transitions when scaling objects

### Changed

- Used the right distance, size, and duration scales for all objects
- Made misc changes (camera, satellites) adapted to the new scales

## [0.15.0] - 2021-11-15

### Added

- Made new controls for the debug UI

## [0.14.0] - 2021-11-10

### Added

- Added an HTML UI for the controls
- Implemented bootstrap icons and custom icons

### Removed

- Removed the Babylon UI for the controls

### Dead

- Went to hell in CSS

## [0.13.0] - 2021-11-08

### Added

- Made a camera for transitioning between other cameras
- Improved the transition camera to make it work when switching planets

### Changed

- Used a controllable camera to follow the planet

## [0.12.0] - 2021-10-29

### Added

- Added all planets to the solar system

### Changed

- Replaced all textures by lowres jpg files

### Fixed

- Fixed the upside down textures problem

## [0.11.0] - 2021-10-21

### Changed

- Made animation system intern to the spatial object class
- Made the animation manager affect all animations

### Removed

- Removed Bob

## [0.10.0] - 2021-11-08

### Added

- Added planetary disc support with Saturn rings

## [0.9.0] - 2021-10-13

### Added

- Made a trajectory class

### Changed

- Changed the calculation of the trajectory to make it scientifically accurate

## [0.8.4] - 2021-10-06

### Changed

- Changed the project to OOP

## [0.8.3] - 2021-09-27

### Added

- Added a clean .gitignore file
- Added pre-commit and its plugins to the project
- Added and applied formatting tools to the project

## [0.8.2] - 2021-09-24

### Changed

- Switched to the correct semantic versioning

## [0.8.1] - 2021-09-24

### Changed

- Changed the project's framework into a module-based one
- Renamed the .js files as .mjs files

## [0.8.0] - 2021-09-22

### Added

- Made a Milky Way-textured skybox

## [0.7.0] - 2021-09-22

### Added

- Created a satellite that follows the planet
- Applied Moon texture on the satellite
- Made the satellite rotate around the planet

## [0.6.0] - 2021-09-22

### Added

- Added texture of the Earth to directory
- Applied texture on the planet
- Made the planet rotate on itself

### Changed

- Made the planet an object with properties

## [0.5.0] - 2021-09-20

### Added

- Added a button menu generator
- Made the camera eventually follow the planet
- Added a free camera

### Changed

- Considered the collisions for the cameras

## [0.4.1] - 2021-09-16

### Fixed

- Replaced the online texture by a local one

## [0.4.0] - 2021-09-16

### Added

- Added a small interface for emulation speed
- Made the buttons of the interface work

### Changed

- Modified the animation system

## [0.3.0] - 2021-09-15

### Added

- Added basic texture for the star
- Moved the light source to the center of the star
- Added a glow effect to the star
- Added color settings for the star
- Created a file "objectVisuals" for the project

### Changed

- Colored the star texture with shades of grey

## [0.2.1] - 2021-09-13

### Changed

- Added the to-do list to the changelog

## [0.2.0] - 2021-09-10

### Added

- Showed the list of the generated meshes
- Added buttons to show/hide meshes
- Added changelog

## [0.1.0] - 2021-09-09

### Added

- Created "star" and "planet" objects
- Added a visible round trajectory
- Made the planet rotate around the star
- Created a generic main and isolated the file "planets_revolving"

## [0.0.1] - 2021-09-08

### Added

- Added a true README
