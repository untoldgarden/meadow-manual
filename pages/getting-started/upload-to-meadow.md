---
layout: default
title: Upload to Meadow
toc: true
permalink: /upload-to-meadow/
order: 7
---

<div style="padding:56.25% 0 0 0;position:relative;margin-bottom:2em;">
    <iframe 
        src="https://player.vimeo.com/video/1027857430?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
        style="position:absolute;top:0;left:0;width:100%;height:100%;" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        title="Install Unity"
        allowfullscreen>
    </iframe>
</div>
<script src="https://player.vimeo.com/api/player.js"></script>

# Upload to Meadow {#upload-to-meadow}

To upload your experience to Meadow you will use the Meadow plugin for Unity. If you are using the template project this is already installed, but if you are using your own project you will need to [install Meadow Studio](https://manual.meadow.space/install-meadow-studio/).

Before you get started with Meadow Studio you need to create an account on Meadow and create an experience.

## Create an account on Meadow 

Meadow is still in a closed beta, so your email need to be whitelisted by us before you can create an account. Contact support to get your email whitelisted.

1. Go to: [https://app.meadow.space/](https://app.meadow.space/).
![alt_text](../images/webapp-homepage.webp "Meadow Homepage")
2. Press "Login" at the top right corner. 
![alt_text](../images/webapp-login.webp "Login")
3. Sign up with an email you have access to. 

>**<font color="red">Important:</font>** The verification email sometimes ends up in the trash. Certain non-standard email providers and government accounts blocks our verification email, use a standard gmail or outlook address instead. 

>**<font color="red">Important:</font>** Currently it's not possible to use spaces in your name. We are working on fixing this bug, until that's done, use a name without spaces.


## Create your experience on Meadow

1. Press your profile image, and then "Dashboard."
![alt_text](../images/webapp-logged-in.webp "Logged in")
2. In the dashboard, go to the "Experiences" tab. Here you can and manage all your experiences.
![alt_text](../images/webapp-experiences.webp "Experiences")
2. On the top right, click "+ New Experience."
![alt_text](../images/webapp-new-experience.webp "Details")
3. Fill in the Title, add an image, and add a description. You don't need to add anything apart from the title now, and can always edit these later.
4. Skip past the Deploy section for now as we will handle this from Unity.
5. In the "Distribution" section you can place your experience. You **do not** need to do this to test the experience, if you keep the toggle "Available anywhere" the experience can be opened at any location. If you want to place it somewhere and make it show up on the in-app map, search for a location and double click anywhere on the map. 
![alt_text](../images/webapp-distribution-step.webp "Map")
6. Placement Type decides how your experience will be positioned in the world. 
- **In Front Of Camera**: The experience will be placed in front of the camera when the user opens it, at the `Placement Distance` specified in the Experience component. 
- **Geospatial**: The experience will be placed at a physical location in the world using Google's Visual Positioning System, which uses Google Streetview to place it. Accuracy varies depending on location, but can be below 1 meter in ideal conditions.
7. Save the experience as a draft for now. You can publish it later. 

<br>

## Upload your experience using Meadow Studio

Now it's time to upload your experience to Meadow. 

<br>

### Login to Meadow Studio

1. Find the Meadow tab in Unity and open the Meadow Studio window. 
2. Log in with the details you used when first making your Meadow account. 
![alt_text](../images/meadow-studio.webp "Meadow Studio Experiences")
3. Here you will see all your experiences listed. Click refresh if something is not up to date. 

<br>

### Upload to Meadow

1. Open the experience you would like to upload to.
2. In the drop down `Asset Bundle`, select the bundle you would like to upload. This is the bundle that you assigned to your project folder. [See instructions here.](https://manual.meadow.space/upload-to-meadow.html#add-your-files-to-an-asset-bundle)
3. Specify if this is the Experience Bundle or the Map Marker Bundle. [See Map Marker instructions here.](https://manual.meadow.space/map-marker.html)
4. Select the platforms for which you would like to upload the experience.
5. Click <b style="color: #559859;">Upload to Meadow</b>.
6. The process takes a while the first time it's done as Unity has some caching to do. Subsequent uploads will be faster.
7. If you have more updates to publish later on, simply repeat this process to update again.

![alt_text](../images/meadow-studio-upload.webp "Meadow Studio Upload")


> **Important:** Make sure to choose the correct asset bundle and bundle type. 
>
><br>
>
>Example: choose Asset bundle `myexperience` and Bundle type `Experience` to upload the experience for the asset bundle `myexperience` to Meadow.

<br>

## Test your experience in the Meadow app

You are now ready to test your experience in the Meadow app! 

1. Open the app on your device. 
2. Press the profile icon in the bottom right corner. 
3. Log into your Meadow account. 
> **Note:** There is currently a bug with pasting in your password, so you need to type it in manually. We apologize for the inconvenience, and are working on a fix for this.
4. You will now see the experience listed on your profile. 
5. Press the experience to open it.
6. Press "Enter Experience" to open it in AR.

<br>

## Add cocreators to your experience

You can add collaborators to your experience to work on it together. This is great to be able to share it with team members or clients.

1. When editing an experience in the web app, go to the tab "Permissions."
2. Add the email address of the people you would like to invite to be able to edit the experience. There are two roles for collaborators:
- **Viewer:** Viewers can see the experience but not edit or upload. They need to log in to their Meadow account in the app.
- **Editor:** Editors can upload asset bundles, change texts, images, and place the experience. 

![alt_text](../images/webapp-permissions.webp "Permissions")

<br>

## Publish

So, you have tested your experience and it works great! Now it's time to publish it to the world. 

1. Go to the experience in the web app.
2. On the top right, click Publish.
3. For an experience to be published it needs to have an image and a description.

> **Note:** It is currently not possible to unpublish an experience. If you need to unpublish, contact support.