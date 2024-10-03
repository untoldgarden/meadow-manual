---
layout: default
title: Map Marker
toc: true
permalink: /map-marker/
---

# Map Marker {#map-marker}

Meadow allows you to create site-specific experiences that are placed on a map. To show your experience on the map you can upload a custom map marker, that can be anything from a simple icon to a 3D model.

![](../images/map-markers.webp)

## Create a Map Marker using an image

1. Create a new folder in your project, outside of your main experience folder. 
2. Assign this folder to a new Asset Bundle, call it e.g. yourprojectnamemapmarker or whatever you want. The name does not mater, but avoid dashes or special characters as these are not allowed in the Asset Bundle name.
3. Create an empty GameObject in your scene. 
4. As a child to this GameObject, create a quad facing upwards. 
5. Move it up a bit so it’s not intersecting with the map itself, which is at 0.
6. Import the icon you want to use to your project.
7. Assign this as the texture on a new material.
8. Assign this material to the quad.
9. Drag the empty gameobject to your Map Marker folder in the project view to create a prefab.
10. Use [Meadow Studio](https://manual.meadow.space/meadow-studio.html) to upload your Map Marker to your experience.

## Create a Map Marker using a 3D model

1. Follow step 1-3 in the previous section.
2. Import your 3D model.
3. Drag it to the scene as a child of the empty GameObject.
4. Position and scale it as you want it to appear on the map. Don't make it too big or too small. A good size is between 1 and 2 meters.
5. Get creative and add in any fun animations, reflections, or particle effects you'd like! Bear in mind if you are using a particle effect, the scaling mode must be set to hierarchy to work properly. 
6. Assign the tag `MapMarker` to your empty GameObject. This is for the system to know that this is the prefab that should be used as the marker. 
7. Follow step 9-11 in the previous section.


