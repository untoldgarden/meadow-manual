---
layout: default
title: Create your first experience
toc: true
---

## Create your first experience {#create-your-first-experience}

To get a grasp of how the Unity editor works we will create a simple experience with a flying creature emitting a sound. 



1. Find your creature 

    Unity is _not _a modelling tool, you need to create your models elsewhere and import them. However, you don’t need to create your model yourself.  \
 \
There are tons of good sites for finding 3D models, both free and paid.  \
 \
**Good 3D model marketplaces:**




![alt_text](images/image20.png "image_tooltip")



        Turbosquid, the Marks & Spencer of 3D models. High quality but sometimes expensive. [https://www.turbosquid.com/](https://www.turbosquid.com/)







![alt_text](images/image21.png "image_tooltip")



        CGTrader, the Lidl of 3D models. Affordable and with a great selection, but there’s a lot of crap as well. [https://www.cgtrader.com/](https://www.cgtrader.com/)






![alt_text](images/image22.png "image_tooltip")



        GrabCAD Library, the thrift shop of 3D models. Here you can find anything from ugly vases to accurate models of the ISS. [https://grabcad.com/library](https://grabcad.com/library)

	


    **Fileformats:**


    Standard 3D model formats for Unity is OBJ and FBX, while certain others can be used as well.  \
 \
**OBJ:** a great format for static models. 


    **FBX:** can contain animations, and is the most common format for game development. 


    In most 3D market places you can toggle search results by file format. 

	Let’s find a model



1. Go to [https://www.cgtrader.com/](https://www.cgtrader.com/)
2. Create an account (unfortunately required.)
3. Search for something, like dragon, butterfly or tuna
4. Toggle ‘Free’ and set Formats to Autodesk FBX
5. Press ‘Download’
6. You need to wait 20 seconds for some stupid reason
7. Unzip it. 






![alt_text](images/image23.png "image_tooltip")


	[Here is a link to a free Tuna model](https://www.cgtrader.com/free-3d-models/animals/fish/tuna-fish-9f41924a-83d4-478e-a8e9-370946f141b3)



1.  Import your model into Unity. 






![alt_text](images/image24.png "image_tooltip")




    1. Create a new folder in your Project Window by right clicking in the empty area of the window, choosing Create -> Folder.  






![alt_text](images/image25.png "image_tooltip")




    2. Name it something sensible like “Tuna”.
    3. Double click the folder to enter it.






![alt_text](images/image26.png "image_tooltip")




    4. Drag and drop it from Finder (or Explorer) into your empty folder in Unity. 






![alt_text](images/image27.png "image_tooltip")




    5. You should now see your model inside Unity’s project window
1. Add the object to your scene.






![alt_text](images/image28.png "image_tooltip")




    6. Drag and drop it from your folder in the project window to the hierarchy to place it in the scene. 






![alt_text](images/image29.png "image_tooltip")




    7. You should now see the 3D model in your scene. 
    8. Check the size of the model. Sometimes 3D models imported into Unity have very different scale. Unity’s default unit is meters, so if the model is modelled in millimeters it will be 1000 times larger than it should. 
        1. An easy way to check the size is to create a default Cube in the scene. Those are always 1x1x1 meters. 






![alt_text](images/image30.png "image_tooltip")




        2. Right click in the Hierarchy and select 3D Object > Cube. 






![alt_text](images/image31.png "image_tooltip")




        3. You can see that the Tuna is a realistic scale. However, it might be a bit large to see in AR. Let’s make it half the size.






![alt_text](images/image32.png "image_tooltip")




        4. Select the model in the Hierarchy, then find the Transform component in the Inspector. 
        5. Change the scale to 0.5 on all axises.
        6. Delete the Cube, as we don’t need it anymore. Select it and press cmd + delete (ctrl + delete on Windows.)
2. Add an audioclip

        Unity works with most common audio formats, like WAV and MP3. Both works, but Unity will compress all audio on building an experience. For experiences where audio is very important you want to avoid double-compression, so then WAV is preferable.







![alt_text](images/image33.png "image_tooltip")




    9. Find an audioclip you would like to use, and import it to your project folder in the same way as you did with the 3D model. 
3. Create an Audio Source

        An Audio Source is a virtual speaker in space. 







![alt_text](images/image34.png "image_tooltip")




    10. In your Hiearchy, right click and select ‘Create Empty’. This creates an empty gameobject, which is a curious entity that doesn’t exist in the real world; an object with nothing but a position, rotation, and scale. 
    11. Name it ‘AudioSource’ or something similar. This is only for you to keep track of it. 
    12. Select the ‘AudioSource’ object.






![alt_text](images/image35.png "image_tooltip")




    13. In the Inspector, press Add Component.
    14. Type in Audio Source.
    15. Press AudioSource.






![alt_text](images/image36.png "image_tooltip")




    16. Now you have added an AudioSource component to your empty object. 






![alt_text](images/image37.png "image_tooltip")




    17. In the little slot for AudioClip, press the circle to the left. 






![alt_text](images/image38.png "image_tooltip")




    18. Select the audio clip you imported to Unity in step 4. Double click it to assign it to the audio source. 
    19. Change the Spatial Blend of the AudioSource to 3D to turn it into 3D sound, ie sound that gets lower the further you go from it. 
    20. In 3D Sound Settings, change the Max Distance to e.g 3 meters, so it will be easier to perceive the difference. 






![alt_text](images/image39.png "image_tooltip")




    21. Your AudioSource should now look like this. 
4. Play your scene to test it. 






![alt_text](images/image40.png "image_tooltip")




    22. Press the big play button in the top. Unity will load for a while. 






![alt_text](images/image41.png "image_tooltip")




    23. Select the Camera. 
    24. Move the Camera around with the arrows to hear the sound get higher as you approach your 3D model, and lower as you go away from it. 
    25. DON’T FORGET TO UNPLAY! When in Play Mode, no changes to your scene are saved. It is very easy to forget this. 
5. Add an animation to your model. 

    If you want a model with animations, add the search parameter ‘Animated’ on any of the 3D market places. The Tuna fish used above has an animation in the model. 

    26. You can see if the model has imported animations correctly by selecting the model in the Project window, and then looking in the animation tab in the inspector. If there are animations you can play them there to see how they look.
    27. _Continuing soon…_
6. Save your scene

    Remember to save your scene when you are done, so you don’t loose your work! 


