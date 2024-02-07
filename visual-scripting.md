---
layout: default
title: Visual Scripting
toc: true
---

# Visual Scripting {#visual-scripting}

In Meadow you need to use visual scripting for your experience logic. There are plenty of great tutorials online to give you an introduction to visual scripting. Here are a few to get you started:
[https://www.youtube.com/watch?v=JYkFm1Sc3v8](https://www.youtube.com/watch?v=JYkFm1Sc3v8)
[https://www.youtube.com/watch?v=hcrHmGil_rM](https://www.youtube.com/watch?v=hcrHmGil_rM)

## Meadow specific visual scripting events

Meadow has a few specific events related to functions in the app that you can make use of in your experiences. Many are related to specific features covered in other parts of the manual, but here are a few general ones:

### OnExperienceInitialized

This event is triggered when the experience is initialized and ready to go. It is good practice to use this instead of OnStart to start your experience. 

Meadow and the AR subsystems does some initialization of their own at OnStart, so you might run into issues if you start your experience too early. 

### ToggleARUI

This event is triggered when the user opens the AR UI. You can use this to pause your experience or show a message to the user.

### UserCaptureCreated 

This event is triggered when the user takes a picture or a records a video using Meadows own recorder. 

### RepositionStart and RepositionEnd

These event is triggered when the positioning system has new information and repositions your experience accordingly. In most cases this is imperceptible to the user.
