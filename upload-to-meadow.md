---
layout: default
title: Upload to Meadow
toc: true
---

## Upload to Meadow {#upload-to-meadow}

Meadow is our platform for simplifying the distribution of XR experiences. Instead of having to build an app and set up all the XR functionalities, you can just upload your experience to our platform to see it. 

To upload your experience to Meadow you need to create what is called an Asset Bundle. This is Unity’s file format for bundling assets. It is like Unity’s own zip file. 



1. Add the objects in your experience as children to one empty object. 
    1. Create a new empty object in your Hierarchy. 






![alt_text](images/image42.png "image_tooltip")




    2. Rename it to the name of your project. 






![alt_text](images/image43.png "image_tooltip")




    3. Select all the objects that you have created for your experience.






![alt_text](images/image44.png "image_tooltip")




    4. Drag them as children to the new empty object.  \
 \
In programming, ‘child’ means an object that is below another object in a hierarchy. Conversely, ‘parent’ is an object that is above another in the hierarchy. And, ‘sibling’ is an object that is on the same level in the hierarchy. A ‘root’ object is the object that is at the top of a hierarchy, that has no further parents. \
 \
In the example above you see that both the tuna 3D model and the Audio Source are children to MyTunaProject. 
2. Add a Content component to your empty object. 
    5. Select the empty object (the “root” object of your experience.)






![alt_text](images/image45.png "image_tooltip")




    6. Press ‘Add Component’ and search for Content. 
    7. Select the Content component to add it.  \
 \
This is a little script that tells the Meadow platform that this is a piece of content that should be displayed in the app.  \
 \
It contains a bunch of fields, but you only need to use the Settings field.






![alt_text](images/image46.png "image_tooltip")




3. Create your content settings. 

    Every experience in Meadow is a type of content.  \
 \
The Content settings tells the Meadow app how your experience should be presented in the app, and contains a bunch of useful features that you can use. 







![alt_text](images/image47.png "image_tooltip")




    8. In the folder for your experience in the Project Window, right click and select Create -> XREF -> Content Settings
    9. Select the newly created content settings. 






![alt_text](images/image48.png "image_tooltip")




    10. There are a bunch of settings in here that you can use. For this example the default settings work well. 






![alt_text](images/image49.png "image_tooltip")




    11. Now reference your newly created content settings in the content component of your experience. 
        1. Select your experience root object. 
        2. Drag the content settings into the Settings slot of the Content component. 






![alt_text](images/image50.png "image_tooltip")




4. Add your experience to the project folder

    Now we need to add the experience you have created to your folder in the Project Window. 







![alt_text](images/image51.png "image_tooltip")




    12. Select the root object of your experience (the one with the Content component.)






![alt_text](images/image52.png "image_tooltip")




    13. Drag it into the empty area of your folder in the Project Window.  \
 \
This turns the experience you have built in the hierarchy into a prefab. A prefab is a type of object that can be reused in different scenes, and also built as an asset bundle. Unity shows you that it is a prefab by changing the icon in the Hierarchy to a blue cube. 






![alt_text](images/image53.png "image_tooltip")




    14. **IMPORTANT: **When you change something in your prefab in the scene, it is not automatically applied to the prefab in your project folder. You need to manually apply any changes by selecting the prefab in the scene, finding the little toggle called ‘Overrides’ in the inspector, and then press ‘Apply all’. 
5. Add your files to an asset bundle 

    Now we need to tell Unity that everything in this folder should be built into an asset bundle. Unity’s UX for this is rather stupid, so bear with me. 







![alt_text](images/image54.png "image_tooltip")




    15. Navigate to your Assets folder in the Project Window.






![alt_text](images/image55.png "image_tooltip")




    16. Select your folder.
    17. In the bottom right corner, you see a small text saying “Asset Labels”. 






![alt_text](images/image56.png "image_tooltip")




    18. Press this text to see the asset bundle menu. (Why they placed it in such a strange location, no one knows.)






![alt_text](images/image57.png "image_tooltip")




    19. Press the foldout that currently says “None”.
    20. Press new. 






![alt_text](images/image58.png "image_tooltip")




    21. Give your asset bundle a sensible name so you can easily recognize it later. This tells Unity that every file in this folder should be built into this asset bundle. This is what you will upload to our platform. 
6. Build your asset bundle






![alt_text](images/image59.png "image_tooltip")




    22. In the menu in the top, go to Window -> AssetBundle Browser to open the asset bundle builder. (Not XREF AssetBundle Builder, that one is not working at the moment)






![alt_text](images/image60.png "image_tooltip")




    23. In the window, select the name of your asset bundle to check that everything is included in it. If not, go through step 5 again. 






![alt_text](images/image61.png "image_tooltip")




    24. Press the ‘Build’ tab.






![alt_text](images/image62.png "image_tooltip")




    25. Select the platform you want to build for. iOS for iPhone, or Android for Android.
    26. Press build. The first time you do it it will take a few minutes, after that it will be much faster since Unity caches it.
    27. Check the console, if there are no errors it means your build have been successful. 






![alt_text](images/image63.png "image_tooltip")




    28. The newly created asset bundle ends up in a folder called AssetBundles in the root folder of your project. 






![alt_text](images/image64.png "image_tooltip")




    29. **KNOWN ERROR: **For iOS users on Mac, the project sometimes tries to install something called ‘CocoaPods’. You will see two new windows appear that are called something like “Installing Cocoapods”. You will get tons of errors in the log and the build will fail. This is due to a bug in our libraries that will be resolved soon. \
**Resolution: **Restart the Unity editor (no need to restart Unity Hub or the computer). The errors will be gone and the build should work. The ‘Installing Cocapods’ windows might still appear, just close them. You only need to do this step once, the error will not return. 
7. Create an account on Meadow 






![alt_text](images/image65.png "image_tooltip")




    30. Go to the Meadow portal at: [https://xref-client.web.app/](https://xref-client.web.app/)
    31. Press ‘Don't have an account? Sign Up’ in bottom right corner. 
    32. Sign up with an email you have access to.  \
 \
The verification email sometimes end up in the trash. \
 \
Certain non-standard email providers and government accounts blocks our verification email, use a standard gmail or outlook address instead. 
8. Create an experience on Meadow






![alt_text](images/image66.png "image_tooltip")




    33. Press ‘Create new artwork’. An experience is still called an ‘artwork’ on Meadow.






![alt_text](images/image67.png "image_tooltip")




    34. Press the little edit button to the right to edit the artwork and upload the asset bundle.






![alt_text](images/image68.png "image_tooltip")




    35. In this page you can add all the information about your experience, and an image that will be used in the app. 






![alt_text](images/image69.png "image_tooltip")




    36. The only thing you need to change now is placement type. This is by default set to “Geospatial”, which uses Google streetview to place the artwork. However, this doesn’t work indoors, since there is no streetview there. To test it at home, change placement type to ‘In Front of Camera’.






![alt_text](images/image70.png "image_tooltip")




    37. Scroll down to the asset bundle section
        3. Choose your platform
        4. Press “Upload iOS Bundle” (or “Upload Android Bundle”)
        5. Navigate to where your bundle was saved (usually ProjectFolder/AssetBundles/iOS or ProjectFolder/AssetBundles/Android)
        6. Upload it.
    38. If you have built bundles for both platforms, repeat the process for the next platform.
9. Place the experience 






![alt_text](images/image71.png "image_tooltip")




    39. Go to the ‘Map’ tab in the Meadow portal. 
    40. Search for the location where you are currently at. 






![alt_text](images/image72.png "image_tooltip")




    41. Double click on the map to place the artwork there. 






![alt_text](images/image73.png "image_tooltip")




    42. The experience is represented with a red marker on the map.
    43. Open the Meadow app to see it. If it doesn’t appear it might be because it is not made public yet. Contact me if you cannot see it in the app even if you have followed every step in this tutorial.
10. Add cocreators to your artwork. 






![alt_text](images/image74.png "image_tooltip")




    44. Go to the tab ‘Collaborators’
    45. Add the email address of the people you would like to invite to be able to edit the experience. These people can upload asset bundles, change texts, images, and place the experience. 