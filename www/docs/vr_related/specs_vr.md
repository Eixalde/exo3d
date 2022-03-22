# Project specifications

The Exo3D project has been developed for six months now, and is still aiming to become a reference for the visualization of exoplanets in 3D. As the current application was quite successful at doing such, a new step has been established : we want to make Exo3D a VR-compatible application. This part of the project implies a lot of new features and modifications that need to be well thought before starting the development.

## Main goals of the ExoVR update

As the simulation was already quite finished and works still well, we will want to focus as much as possible on the look and feel of the application. This is especially important in virtual reality, where the immersion is the key of the experience. Watching and manipulating the simulation is already really interesting in the normal version, we think it will be highly valuable to do so in a virtual world : the user will be able to interact even more accurately with the simulation while being _inside_ of it.

The main concern for this part of the development will be the user interface. Our current interface is exclusively made for a Web experience and will not be suitable for the VR mode. Not only shall we make new buttons and bars, it will be crucial to place the user in a comfortable environment where they can move and interact in the most natural way possible.

This update will also focus on other visual aspects that were already planned for future versions, such as the different kinds of information about the spatial objects.

## Proof of Concept : transitioning to VR

Before getting into that update, it is necessary to establish its feasibility. The first step has to be a Proof of Concept, where Exo3D will switch from Web only to VR-compatible. We want to make the transition as light as possible by changing very few features, and then observe what is still working and what isn't. 

This PoC shall also include a basic interface with one button, and we will do some size and scaling tests before going on.

## New interface : the "spaceship"

The simulation is a 100% in the void of space. Placing the user floating around like some sort of almighty god doesn't seem a good idea for immersion, so we had to come up with a suitable environment. This is how the idea of a spaceship was born : a room or a capsule which the user can move in, and which contains every panel needed for controls and information. 

Depending on which view the user wants to look at, they can move in the "spaceship" freely and watch the simulation from any angle. Two rooms would be available : one for the complete system view, and one for a planet-focused view : this replaces the previous system/planet camera we implemented from the very beginning. A replacement for the free camera has not been imagined yet, but it may come up in the future.

## Visual tweaks originally planned for the previous version

As we had to close the version 2.0 earlier than expected, a lot of features related to the visualization of information have been left undone. Once the spaceship will be advanced enough, we will implement those features in both VR first and then in non-VR. This includes (but not limited to) a panel containing a list of the information about the spatial objects, displaying angles and distances, and comparing planets' size.