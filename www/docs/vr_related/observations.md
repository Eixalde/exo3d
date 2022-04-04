# Observations made in the first shot of the VR mode

Upon launching the VR mode for the first time, it was absolutely successful. I could see the scene immediately and from a fixed viewpoint. I noted several things while testing all of that.

## Size and scales

This was not the very first thing I saw, but it is indeed really important. Of course, I didn't see anything in the realistic view. But when I switched to the didactic view, something went off. Planets and star are sure scaled up correctly, but not quite as much as I expected. As a pure coincidence, my VR view was exactly on the trajectory of the Earth, so I got to see it right in front of me. Compared to me (1.75m tall), the Earth seemed to have a size between 5 and 10 meters. But my base hypothesis was that the Babylon unit was equal to 1 meter. The Earth should have been 1550 meters wide in didactic mode then, but it turns out I was wrong. Either the Babylon unit isn't equal to 1 meter, or else the player does not necessarily spawn at their real size.

This matters a lot, because we are already thinking of size/scale issues around the player. We will have to watch really carefully how the scales must be handled.

## Positionning...

Actually, the very first thing I saw was the placement of the camera. I supposed, quite out of nowhere, that I would spawn on the ground I purposely defined at 10 000 meters high, right above the sun. This wasn't the case at all, instead I spawned almost at 0 meters high, and thousands of meters away from the sun - but not 10 000. So this isn't a case of "misreading the axis", no, something else happened while placing the player. I didn't figured out immediately what was happening, but I made an hypothesis about the height.

The height shown by the inspector was always around 1.6 meters, and barely above that. No matter how I tried to place the camera, it always places itself at 1.6 meters. This isn't my height - as I said, I am 1.75 meters - but I already noticed some wrong measurement of my own height by my headset, between 1.6 and 1.65 meters. What I think happens here, is that the VR camera is not allowed to take anything but the real height of the player, by default. Trying to place the camera manually without getting around that is therefore impossible. This will be my first concern once the PoC will be done.

## ... and cameras

And yet I didn't talk about the other position issue : the XZ plane. The height was my only concern for a moment, but I only saw the other coordinates after the second session of testing. It seemed that the VR-camera took the position and target of the active camera in _non-VR_, in the last frame before entering VR mode. Yes, this is exactly what happens : the VR camera is, in reality, a fixed copy of the non-VR cameras. If I was looking at the sun from quite close, getting into the VR will place me exactly _there_, at the exact position I left my non-VR camera. This works as well for the planet camera, which is moving. The VR camera just copies the last position and that's it. 

This interaction also allowed me to verify the previous hypothesis about the height : no matter which object I was following before, the VR camera stays around 1.6 meters. Very good news though : the camera has no limit of placement in the XZ plane. I went up to Neptune and the camera was fine.

But this is a real problem, I know what is happening : the VR experience enabler has to use the active camera of the scene. The ACTIVE camera. Which means it can only be the System cam, the Planet cam, or the Free cam. Not only do we have to introduce a new camera for the VR mode, but we also have to tell the app to force going into that camera when entering VR. It seems that it will cause some issues, so I hope I am wrong...

## We could not afford more than three pixels

Honestly, I will just put that on the low quality of my headset. Everything looks a bit blurry and more than anything else, the red lines for the trajectories are extremely ugly to look at, especially when they all overlap : this is awful for the eyes. I really hope this is only related to the poor quality of my headset, which can be improved with some ADB commands.