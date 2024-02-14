---
layout: default
title: Download and install the Meadow template project
toc: true
---

# Download and install the template project for Unity {#download-and-install-our-template-project-for-unity}

To create and publish your experiences to meadow you need to install two packages in your project.

 \
**XREF**: XREF stands for Extended Reality Experience Framework, and includes all the basic functionality necessary to create an experience you can upload to our platform. 

**XREF.ExperienceBuilder:** Contains a bunch of useful features that you can use to create your experiences, like simplified audio interaction, dialogue creation, character movements, etc.  \
 \
To make it easier to get started we have created a template project that has our packages already installed. 

<br><br>

## Download the template project from Github

### Via the Github website:

1. Go to [https://github.com/untoldgarden/XREF_ExperienceBuilder](https://github.com/untoldgarden/XREF_ExperienceBuilder)
2. Click the green 'Code' button and press download zip
![alt_text](images/downloadFromGithub.webp "image_tooltip")
3. Unzip it in a sensible location (e.g. Projects/UnityTutorial)

### Via the command line:

1. Navigate to where you want to download the project
2. Run the following command
```bash
git clone https://github.com/untoldgarden/XREF_ExperienceBuilder
```

## Add the template project to Unity Hub

1. Go to Unity Hub
2. Click projects
3. Click on the little arrow to the right of 'Add' and choose 'Add project from disk' ![alt_text](images/addProjectFromDisk.webp "image_tooltip")
4. Navigate to where you located your project template
5. Choose the root folder (e.g. XREF_ExperienceBuilder)
6. Press 'Add Project'
7. If you installed a different version than 2023.2.6f1 you need to tell Unity that you want to use that version instead
    1. Press the drop down under 'Editor version' that has a little warning triangle on it
    ![alt_text](images/hubChangeVersion.webp "image_tooltip")
    2. Select your installed version of Unity
    3. Press 'Open with...'
    4. In the following dialogue, press 'Change version'
    5. It will take some time to open the project, and then show a new dialogue, press 'Continue'.
8. The project should open in Unity and look like this:
![alt_text](images/startingUnity.webp "Starting Unity")