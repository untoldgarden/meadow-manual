---
layout: default
title: Create your first experience
toc: true
permalink: /create-your-first-experience/
---

# Create your first experience {#create-your-first-experience}

To get a grasp of how the Unity editor works we will create a simple experience with a flying creature emitting a sound. 



## Find your model 

Unity is _not_ a modelling tool, you need to import models from elsewhere. However, that doesn't mean you need to create all models yourself.  \
 \
There are tons of good sites for finding 3D models, both free and paid.  

 
### Good 3D model marketplaces

Turbosquid, the Marks & Spencer of 3D models. High quality but often expensive. [https://www.turbosquid.com/](https://www.turbosquid.com/)
![alt_text](../images/turbosquid.webp "image_tooltip")

CGTrader, the Lidl of 3D models. Affordable and with a great selection, but there’s a lot of crap as well. [https://www.cgtrader.com/](https://www.cgtrader.com/)
![alt_text](../images/cgtrader.webp "image_tooltip")

GrabCAD Library, the thrift shop of 3D models. Here you can find anything from ugly vases to accurate egnineering models of the ISS. [https://grabcad.com/library](https://grabcad.com/library)
![alt_text](../images/grabcad.webp "image_tooltip")

### Fileformats

Standard 3D model formats for Unity is OBJ and FBX, while certain others can be used as well.  \
 \
**OBJ:** a great format for static models. 

**FBX:** can contain animations, and is the most common format for game development. 

In most 3D market places you can toggle search results by file format. 

Let’s find a model

1. Go to [https://www.cgtrader.com/](https://www.cgtrader.com/).
2. Create an account (unfortunately required on all 3D libraries.)
3. Search for something, like dragon, butterfly or tuna.
4. Toggle "Free" and set Formats to Autodesk FBX.
5. Press "Download."
6. You need to wait 20 seconds for some stupid reason.
7. Unzip it.

[Here is a link to a free Tuna model](https://www.cgtrader.com/free-3d-models/animals/fish/tuna-fish-9f41924a-83d4-478e-a8e9-370946f141b3)


## Import your model into Unity

1. Create a new folder in your Project Window by right clicking in the empty area of the window, choosing **Create** > **Folder**.
![alt_text](../images/create-folder.webp "image_tooltip")
2. Give it the name of your project, or what ever makes sense in your context.
![alt_text](../images/name-folder.webp "image_tooltip")
3. Double click the folder to enter it.
4. Drag and drop it from Finder (or Explorer) into your empty folder in Unity. 
![alt_text](../images/add-download-to-unity.webp "image_tooltip")
5. You should now see your downloaded model inside the project window. 
![alt_text](../images/download-in-project-window.webp "image_tooltip")

## Add the object to your scene.


1. Drag and drop it from your folder in the project window to the hierarchy to place it in the scene. 
![alt_text](../images/add-object-to-hierarchy.webp "image_tooltip")
2. You should now see the 3D model in your scene. 
![alt_text](../images/object-in-scene.webp "image_tooltip")
3. Check the size of the model. Sometimes 3D models imported into Unity have very different scale. Unity’s default unit is meters, so if the object is modelled in millimeters it will be larger than it should. 
    1. An easy way to check the size is to create a default cube in the scene. Those are always 1x1x1 meters. 
    2. Right click in the Hierarchy and select 3D Object > Cube to create a cube.
    ![alt_text](../images/create-cube.webp "image_tooltip")
    3. You can see that the Tuna is a realistic scale. However, it might be a bit large to see in AR. Let’s make it half the size for clarity.
    ![alt_text](../images/measurement-cube.webp "image_tooltip")
    4. Select the model in the Hierarchy and find the Transform component in the Inspector. 
    ![alt_text](../images/scale-model.webp "image_tooltip")
    5. Change the scale to 0.5 on all axises. (Tip: toggle the little chain icon to the left of the scale to keep the proportions.)
    6. Delete the Cube, as we don’t need it anymore. Select it and press cmd + delete (ctrl + delete on Windows.)

## Add an audioclip

Unity works with most common audio formats, like WAV and MP3. Unity will compress all audio when building an experience. For experiences where audio is essential you want to avoid double-compression, so then a lossless format like WAV is preferable.

1. Find an audioclip you would like to use, and import it to your project folder in the same way as you did with the 3D model. 
![alt_text](../images/add-audio-clip.webp "image_tooltip")
2. Create an Audio Source. An Audio Source is a virtual speaker in space. 
    1. In your Hiearchy, right click and select ‘Create Empty’. This creates an empty gameobject, which is a type of entity that doesn’t exist in the real world; an object with nothing but a position, rotation, and scale. 
    ![alt_text](../images/create-empty.webp "image_tooltip")
    2. Name it ‘AudioSource’ or something similar, so that you can keep track of it. 
    3. Select the ‘AudioSource’ object.
    4. In the Inspector, press Add Component.
    ![alt_text](../images/add-component.webp "image_tooltip")
    5. Search for Audio Source and press it.
    6. Now you have added an AudioSource component to your empty object. 
    7. In the little slot for AudioClip, press the circle to the left. 
    ![alt_text](../images/assign-audio-clip.webp "image_tooltip")
    8. Double click the audio clip you imported to Unity earlier to the audio source. 
    ![alt_text](../images/select-audio-clip.webp "image_tooltip")
    9. Change the Spatial Blend of the AudioSource to 3D to turn it into 3D sound, ie sound that gets lower the further you go from it. 
    10. In 3D Sound Settings, change the Max Distance to e.g 3 meters, so it will be easier to perceive the difference. 
    11. Your AudioSource should now look like this. 
    ![alt_text](../images/audiosource-settings.webp "image_tooltip")

## Play your scene to test it. 

1. Press the big play button in the top. Unity will load for a while. 
![alt_text](../images/play-scene.webp "image_tooltip")
2. Select the Camera. 
![alt_text](../images/move-camera-in-playing-scene.webp "image_tooltip")
3. Move the Camera around with the arrows. You should hear the sound get louder as you approach your 3D model, and lower as you go away from it. 
> **<font color="red">DON’T FORGET TO UNPLAY!</font>** When in Play Mode, no changes to your scene are saved. It is *very* easy to forget this. 

## Add an animation to your model. 

If you want a model with animations, add the search parameter ‘Animated’ on any of the 3D market places. The Tuna fish used above has an animation in the model. 

1. You can see if the model has imported animations correctly by selecting the model in the Project window, and then looking in the animation tab in the inspector. If there are animations you can play them there to see how they look.
2. _Continuing soon…_

## Save your scene

Remember to save your scene when you are done, so you don’t loose your work. Most things you do in Unity is saved automatically as you are working directly towards the project folder. However, the scene is not saved automatically. Any arrangement of objects, audiosources and tuna fishes that you have made in your scene need to be saved. 

<br>

*Models: [Snail by Rafael Rodrigues](https://skfb.ly/owonN), [Grass by MauroGonzalezA](https://skfb.ly/onVxA), [Flowers by Vish4More](https://skfb.ly/6DYxK)*

[CC License](https://creativecommons.org/licenses/by/4.0/)