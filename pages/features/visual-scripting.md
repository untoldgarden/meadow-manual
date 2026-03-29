---
layout: default
title: Visual Scripting
toc: true
permalink: /visual-scripting/
order: 24
---

# Visual Scripting {#visual-scripting}

In Meadow you need to use visual scripting for your experience logic. There are plenty of great tutorials online to give you an introduction to visual scripting. Here are two to get you started:
* [Unity Visual Scripting – Getting Started](https://www.youtube.com/watch?v=JYkFm1Sc3v8)
* [How to do Visual Scripting in Unity!](https://www.youtube.com/watch?v=hcrHmGil_rM)

> **<font color="red">Attention:</font>** In Meadow, you upload a **prefab** — not a scene. This means **Scene Variables** and **App Variables** will not work, as they are tied to the scene or application context which doesn't exist at runtime. Use **Object Variables** or **Graph Variables** instead, as these travel with the prefab.

<br>
## Meadow specific visual scripting events

Meadow has a few specific events related to functions in the app that you can make use of in your experiences. Many are related to specific features covered in other parts of the manual, but here are a few general ones:

<br>
### OnContentInitialized // OnExperienceInitialized

This event is triggered when the experience is initialized and ready for use. It is recommended to initiate your experience in this event rather than `OnStart` to avoid conflicts with the initialization processes of Meadow and the AR subsystems, which occur during `OnStart`.

**Parameters:**
- `bool`: Indicates whether the initialization was successful (`true`) or not (`false`).

<br>
### ToggleARUI

This event is triggered when the user toggles the AR user interface. It can be utilized to pause the experience or display a message to the user.

**Parameters:**
- `bool`: Represents the state of the AR UI; `true` if the UI is open, `false` otherwise.

<br>
### UserCaptureCreated

This event is triggered following a user action of taking a picture or recording a video using Meadow's integrated capture functionality. It provides information about the type of capture performed by the user, allowing for appropriate handling of the captured media.

**Parameters:**
- `CaptureType`: Specifies the capture type, which can be `CaptureType.Photo` for photographs or `CaptureType.Video` for videos, enabling tailored responses to different capture actions.

<br>
### RepositionStart and RepositionEnd

These event is triggered when the positioning system has new information and repositions your experience accordingly. In most cases this is imperceptible to the user.

<br>

## Utility Nodes

### Get User Info

Retrieves profile information about a Meadow user. This node fetches data from the Meadow platform and returns the user's public profile details.

If no **User Id** is provided, the node defaults to the currently logged-in user. This is useful for personalising an experience — for example, greeting users by name or displaying their profile picture in the scene.

**Inputs:**
- **User Id** *(optional)*: `string` — The Meadow user ID to look up. Leave empty to use the current user.

**Outputs:**
- **Username**: `string` — The user's @username.
- **Name**: `string` — The user's display name.
- **Bio**: `string` — The user's bio text.
- **Profile Picture**: `Texture2D` — The user's profile image (small resolution).
- **Success**: `bool` — `true` if the data was fetched successfully, `false` otherwise.

This node is found under **XREF → Networking** in the visual scripting fuzzy finder.
