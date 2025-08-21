---
layout: default
title: Prepare your experience
toc: true
permalink: /prepare-your-experience/
order: 6
---

# Prepare Your Experience

To upload your experience to Meadow you need to do a few things in Unity:
* Add all your GameObjects as children to one root GameObject.
* Add an Experience component to the root GameObject. 
* Turn the root GameObject into a prefab in your project folder.
* Add the folder to an asset bundle.

Here's a detailed breakdown:

## Add your experience as children to an empty GameObject

1. In Unity, create a new empty object in your Hierarchy. This is the root object of your experience, that will contain all the other objects. 

><b><font color="red">Important:</font></b> Make sure that the root object is at position X = 0, Y = 0, Z = 0. Otherwise your experience will be placed in the wrong location in Meadow.

![alt_text](../images/create-prefab-root.webp "image_tooltip")

2. Select all the objects that you have created for your experience.

![alt_text](../images/select-experience-objects.webp "image_tooltip")

3. Drag them on top of the new empty object. This turns them into children to that object.

![alt_text](../images/child-to-prefab-root.webp "image_tooltip")

> **<font color="red">Important:</font>** Make sure to not include any cameras in your prefab. The camera is automatically created by Meadow when your experience is opened.

> In programming, ‘child’ means an object that is below another object in a hierarchy. Conversely, ‘parent’ is an object that is above another in the hierarchy. And, ‘sibling’ is an object that is on the same level in the hierarchy. A ‘root’ object is the object that is at the top of a hierarchy, that has no further parents. 
>
><br>
>
>In the example above you see that both the tuna 3D model and the Audio Source are children to the newly created GameObject named MyExperience. 

<br>

## Add the Experience component to your root object

Experience.cs is a script that tells the Meadow platform that this is an experience that should be displayed in the app. 

1. Select the empty object you just created.
2. Press "Add Component", search for Experience, and add it. The component is located in the namespace `XREF`.

![alt_text](../images/add-content-component.webp "image_tooltip")


## Set your experience settings 

The Experience component includes a number of settings which tells the Meadow app how your experience should be presented in the app. For a full list of settings, see the [Experience component documentation](/experience-component/).

![alt_text](../images/experience-component.webp "Experience component")

>Here are the most important settings:
>
>- **Facing Direction**: 
>    - User: Experience will open facing the user (non-geospatial only.)
>    - North: Experience will face north (geospatial only.)
>
>- **Placement Distance**: 
>  Distance from the user at which the experience will be placed (non-geospatial only.)
>
>- **Reposition Type**: 
>  Determines how the experience should be repositioned when positioning improves.
>  (applies to geospatial or VerticalPositioning.Floor only.)
>
>- **Vertical Positioning**: 
>   - Floor: Experience is placed on the floor.
>   - Altitude: Experience is placed based on GPS altitude (often inaccurate, use with caution.)

<br>

## Add your experience to the project folder

Now you need to add the experience you have created to your folder in the Project Window. When you do this, you create what is called a [prefab](https://docs.unity3d.com/Manual/Prefabs.html). A prefab is a type of object that can be reused in different scenes, and also built as an asset bundle. Unity shows you that it is a prefab by changing the icon in the Hierarchy to a blue cube.

1. Select the root object of your experience (the one with the Content component.)
2. Drag it into the empty area of your folder in the Project Window. 

![alt_text](../images/create-prefab.webp "image_tooltip")

3. You should now see a blue cube in your folder. This is a prefab of your experience and is what will be played in Meadow.

> **Important:** Changes to the prefab in your scene is not automatically applied to the prefab in your project folder. You need to manually apply any changes by selecting the prefab in the scene, finding the little toggle called "Overrides" in the inspector, and then press "Apply all". This is so that you can have different settings for your prefab in different scenes, but it's not really useful for our purposes. If you have changed things in your experience but the changes are not showing in Meadow, then forgetting to apply overrides is most likely the reason.
>
><br>
>
> To apply all overrides, use the following keyboard shortcuts:
>
>- **On macOS**: Press **Cmd + Alt + A**.
>- **On Windows**: Press **Ctrl + Alt + A**.

![alt_text](../images/apply-overrides.webp "image_tooltip")

## Add your files to an asset bundle 

Now we need to tell Unity that everything in this folder should be built into an asset bundle. Unity’s UX for this is a bit cumbersome, but you only need to do this once.

1. Navigate to your Assets folder in the Project Window.
![alt_text](../images/asset-folder.webp "image_tooltip")
2. Select your folder, but do not enter it.
3. In the bottom right corner, you see a teeny tiny text saying “Asset Labels.”
![alt_text](../images/asset-labels.webp "image_tooltip")
4. Press this text to see the asset bundle menu. 
![alt_text](../images/asset-menu.webp "image_tooltip")
5. Press the foldout menu that currently says “None”.
6. Press new. 
![alt_text](../images/asset-menu-open.webp "image_tooltip")
7. Give your asset bundle a sensible name so you can easily recognize it later. This tells Unity that every file in this folder should be built into this asset bundle. This is what you will upload to our platform. 

> **<font color="red">Important: </font>** Do not use spaces, special characters or capital letters in the name of your asset bundle. This will cause errors when loading it in Meadow. Name it something like “myexperience”, “mrsnail” or "thesquarelevelone".

<br>

## Upload your experience using Meadow Studio

Your experience is now ready to upload to Meadow! Follow the instruction [**here**](https://manual.meadow.space/upload-to-meadow/).