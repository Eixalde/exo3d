# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.1] - 2022-04-19

## Hotfixed

- Slapped the HTML form and stole its lunch money

## [2.1.0] - 2022-04-19

### Added

- Basic WebXR mode
- Wrote observations about WebXR mode
- Made a module for the XR stuff

### Changed

- Transition to HTTPS for the local server
- Fixed the position of the XR Camera
- Renamed the GravitationalSystemManager into EngineManager

## [2.0.0] - 2022-03-10

### Added

- Basic system generation form
- Created default parameters for each exotype
- Created a JSON to dictionary converter
- Made an algorithm to explore the dictionary

### Changed

- Refactored the system builder
- Transferred system parameters into JSONs
- Unified all JSONs into one
- Scaled the camera far sight relative to the skybox size
- Adapted the size of the skybox to the system

### Fixed

- Correction of small errors after release

## [1.0.0] - 2022-01-14

### Added

- Wrote the detailed documentation
- Added EUPL 1.2 licence to the project
- Implemented jsdoc2md for generated documentation in markdown
- Implemented ecliptic inclination for planets
- Implemented self-inclination for planets
- Created informative messages for the user
- Added relative speed controls
- Made the color of the stars change according to their temperature
- Calculated appropriate didactic scales for all objects
- Implemented a realistic/didactic view button
- Made smooth transitions when scaling objects
- Made new controls for the debug UI
- Added an HTML UI for the controls
- Implemented bootstrap icons and custom icons
- Made a camera for transitioning between other cameras
- Improved the transition camera to make it work when switching planets
- Added all planets to the solar system
- Added planetary disc support with Saturn rings
- Made a trajectory class

### Changed

- Minor changes in informative messages
- Moved any trajectory-related function to trajectory.mjs
- Added short interpolation for static trajectories
- Rewrote the documentation of the code
- Modified the movement animations' object of reference
- Used Bootstrap cards to regroup UI controls
- Made the planet camera controls able to select any planet
- Refactored the creation of a system with a builder
- Used the right distance, size, and duration scales for all objects
- Made misc changes (camera, satellites) adapted to the new scales
- Used a controllable camera to follow the planet
- Replaced all textures by lowres jpg files
- Made animation system intern to the spatial object class
- Made the animation manager affect all animations
- Changed the calculation of the trajectory to make it scientifically accurate

### Removed

- Deleted the transition animation between cameras
- Removed the Babylon UI for the controls
- Removed Bob

### Fixed

- Added normalized spin period for the satellites
- Fixed rendering issues with trajectories and planets
- Applied a lock on the buttons during transitions
- Applied a lock on the zoom for cameras
- Fixed the upside down textures problem

### Dead

- Went to hell in CSS

## [POC] - 2021-10-06

### Added

- Added a clean .gitignore file
- Added pre-commit and its plugins to the project
- Added and applied formatting tools to the project
- Made a Milky Way-textured skybox
- Created a satellite that follows the planet
- Applied Moon texture on the satellite
- Made the satellite rotate around the planet
- Added texture of the Earth to directory
- Applied texture on the planet
- Made the planet rotate on itself
- Added a button menu generator
- Made the camera eventually follow the planet
- Added a free camera
- Added a small interface for emulation speed
- Made the buttons of the interface work
- Added basic texture for the star
- Moved the light source to the center of the star
- Added a glow effect to the star
- Added color settings for the star
- Created a file "objectVisuals" for the project
- Showed the list of the generated meshes
- Added buttons to show/hide meshes
- Added changelog
- Created "star" and "planet" objects
- Added a visible round trajectory
- Made the planet rotate around the star
- Created a generic main and isolated the file "planets_revolving"
- Added a true README

### Changed

- Changed the project to OOP
- Switched to the correct semantic versioning
- Changed the project's framework into a module-based one
- Renamed the .js files as .mjs files
- Made the planet an object with properties
- Considered the collisions for the cameras
- Modified the animation system
- Colored the star texture with shades of gray
- Added the to-do list to the changelog

### Fixed

- Replaced the online texture by a local one
