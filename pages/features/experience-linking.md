---
layout: default
title: Experience Linking
toc: true
permalink: /experience-linking/
order: 31
sample-url: https://app.meadow.space/e/-OYFpqKK9s4cIP3FsrrR
---

# Experience Linking

The Experience Linking system allows you to connect multiple experiences together, enabling your audience to seamlessly jump from one experience to another. This is perfect for creating multi-level games, connected artworks, or building your own exhibition within Meadow. You could even create your own mini-Meadow within Meadow, the meta possibilities are endless...

The system can be used in two different ways:

1. **Object Triggers**: Use GameObjects in your experience to trigger the transition to another experience. For example portals or doors that trigger the transition to another experience. When approaching, the user will see a small popup with the "Enter Experience" button that they can press to enter the next experience. Perfect for creating interactive installations or guided tours.

2. **Visual Scripting Triggers**: Use visual scripting nodes to load another experience user interactions or game events. Perfect for creating multi-leveled games. Each level is a distinct experience on Meadow that you load at specific points in your game logic.

![Experience Linking Overview](../images/experience-linking-example.webp)

<br>

## Components Overview

The Experience Linking system consists of two main components:

### XR Experience Linker
The central manager component that handles detection and triggering of experience links. This component continuously checks if the user is close to any experience link objects.

### Experience Link
Individual components attached to objects that act as portals or triggers to other experiences. Contains a reference to the experience ID of the connected experience.

<br>

## Setting Up Experience Linking with Object Triggers

### 1. Add the XR Experience Linker

1. Add the `XR Experience Linker` component to any GameObject in your experience (typically a manager object).
2. Configure the **Marker Trigger Range** - this determines how close the user needs to be to a link object before it becomes active (e.g., 10 meters).
3. The component will automatically handle detection and user interaction feedback, including haptic vibration when a link becomes active.

![XR Experience Linker Component](../images/xr-experience-linker-component.webp)

### 2. Create Experience Link Objects

1. Create or select a GameObject that will serve as your triggers (like a portal, door, or an artwork).
2. Add the `Experience Link` component to this GameObject.
3. Configure the Experience Link properties:
   - **Type**: Set to `Experience` for linking to other Meadow experiences. You can set it to `Exhibition` to link to a Meadow Exhibition (Enterprise only).
   - **ID**: Enter the unique identifier of the target experience you want to link to. You can find this in the webapp, it's the string of characters in the url. E.g: in `https://app.meadow.space/e/-Nc8E1l1aTknOBEahAin` the ID is `-Nc8E1l1aTknOBEahAin`.
   - **Get Metadata On Awake**: Enable this to automatically fetch experience information when the component starts

![Experience Link Component](../images/experience-link-component.webp)

### 3. Register Links with the Linker

1. In the `XR Experience Linker` component, expand the **Links** list.
2. Add each GameObject that has an `Experience Link` component to this list.
3. Make sure all your link objects are included in this list, or they won't be detected.

<br>

## Setting Up Experience Linking with Visual Scripting Nodes

Coming soon...

<br>

## Best Practices

**Portal Placement**: Position experience links at natural transition points - doorways, paintings, interactive objects, or end-of-level areas.

**Visual Clarity**: Make it obvious to users that an object is interactive. Use glowing effects, animations, or clear visual indicators.

<br>

## Common Use Cases

**Multi-Level Games**: Create a hub world with portals to different game levels or challenges.

**Art Exhibitions**: Link related artworks or create guided tours that flow from one piece to another.

**Storytelling**: Build branching narratives where users can choose different story paths through experience links.

**Educational Content**: Create learning journeys that connect related topics or progressive difficulty levels.

**Virtual Museums**: Build your own curated collection of experiences with thematic connections.

<br>

## Troubleshooting

### Links Not Detected
- Ensure all link GameObjects are added to the Links list in XR Experience Linker
- Check that link objects have colliders for raycast detection
- Verify the trigger range is appropriate for your experience. If the trigger is high up in the air a trigger range of 1m might not be sufficient.

### Metadata Not Loading
- Check that the experience ID is correct and the target experience exists
- Ensure `Get Metadata On Awake` is enabled if you want automatic loading