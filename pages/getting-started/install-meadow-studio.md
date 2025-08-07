---
layout: default
title: Install Meadow Studio
toc: true
permalink: /install-meadow-studio/
order: 3
---

<div style="padding:56.25% 0 0 0;position:relative;margin-bottom:2em;">
    <iframe 
        src="https://player.vimeo.com/video/1027857408?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
        style="position:absolute;top:0;left:0;width:100%;height:100%;" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        title="Install Unity"
        allowfullscreen>
    </iframe>
</div>
<script src="https://player.vimeo.com/api/player.js"></script>

# Use Meadow in an Existing Project

It is easy to use Meadow in an existing Unity project, you just need to install Meadow Studio and import the required packages.

> **<font color="red">Important:</font>** Meadow currently does not support custom C# scripts. This means that any custom C# scripts will need to be converted into Visual Scripting graphs.

## Download Meadow Studio 

1. Go to: [Download Meadow Studio](https://app.meadow.space/dashboard/meadow-studio) [(https://app.meadow.space/dashboard/meadow-studio)](https://app.meadow.space/dashboard/meadow-studio).
2. Click Download (the large white button in the bottom of the page). Once downloaded, drag and drop the package into your project window.
3. You should now see the Meadow tab in the Unity editor. 

![alt_text](../images/meadow-studio.webp "Meadow Studio Tab")

<!-- ## Import XREF packages 

Our packages are available through a scoped registry.

Required packages:

- **XREF**: Extended Reality Experience Framework, providing the core functionality for creating immersive experiences.

Optional packages:

- **XREF.ExperienceBuilder**: Adds advanced features for creating experiences, including audio interaction, dialogue, and character movement tools.
- **XREF.ExperienceBuilder.Networking**: Adds networking capabilities for multiplayer experiences.

<br>

### Add the Scoped Registry

1. In Unity, go to `Edit` > `Project Settings` > `Package Manager`.
2. Enable the option for `Enable Pre-release Packages`.
3. Add the Untold Garden scoped registry to your project:
   - Name: `Untold Garden`
   - URL: `http://35.189.115.164:4873`
   - Scopes: 
        - `com.untoldgarden` 
        - `com.google.ar.core.arfoundation.extensions-lite`
        - `com.google.external-dependency-manager`
        - `com.google.firebase`
![alt_text](../images/ugscopedregistry.webp "Untold Garden Scoped Registry")

4. Add the Game Package Registry by Google scoped registry to your project: (This requirement will be removed in a future release.)
   - Name: `Game Package Registry by Google`
   - URL: `https://unityregistry-pa.googleapis.com`
   - Scopes: `com.google`
![alt_text](../images/googlescopedregistry.webp "Google Scoped Registry")


### Add the Packages

1. In Unity, go to `Window` > `Package Manager` to open the package manager.
2. Click the `+` button in the top-left corner of the Package Manager.
![alt_text](../images/installpackage.webp "Install Package")
3. Select `Install package by name`.
4. Search for and add the following packages to your project:
   - com.untoldgarden.xref
   - com.untoldgarden.xref-experience-builder
5. You should now see the packages in your list
![alt_text](../images/packages.webp "Packages successfully installed") -->

