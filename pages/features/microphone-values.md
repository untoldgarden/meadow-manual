---
layout: default
title: Microphone Values
toc: true
permalink: /microphone-values/
order: 30
---

# Microphone Values {#microphone-values}

Meadow allows you to access live pitch and decibel (dB) through the **Microphone to Audio Source** feature. This makes it easy to create interactions using real-time audio input from the device's microphone.

<br>

## Set Up

![alt_text](../images/microphone-node-library.webp)

1. Open the **Package Manager** and ensure that **Experience Builder** toolkit is installed in your project (see [How to Install Optional Packages](/optional-packages/)) 
2. Verify that necessary nodes are available in **Visual Scripting**.
- Go to `Edit > Project Settings > Visual Scripting > Node Library`.
- If you don't see `XREF.ExperienceBuilder` listed:
- Click the **+** icon at the bottom right.
- Search for **XREF.ExperienceBuilder**.
- Press **Enter** to add it.
- Then click **Regenerate Nodes**.

<br>

# Components 

![alt_text](../images/microphone-components.webp)

Create a **Manager GameObject** and add the following components:

- **Microphone To Audio Source (Script)**
- **Audio Source Pitch Values (Script)**
- **Audio Source Decibel Values**
- **Audio Source**
- **Script Machine**

<br>

## Nodes

Use the following nodes

- [Audio Source Pitch Values: Get Current Pitch Values]
- [Audio Source Decibel Values: Get Current DB Values]

These nodes provide a float number that you can use to create logic in the **OnUpdate** event.

Depending on your application, you may need mathematical nodes to adjust pitch and dB values for your desired outcome, such as **Clamp**, **Lerp**, **Inverse Lerp**, or basic operations like **Add** and **Multiply**.

<br>

## Example

![alt_text](../images/microphone-example.webp)

In this example:
- The **pitch value** controls the height of an object.
- The **dB value** increases its scale.

After adapting the values, multiply them by a **Sensitivity** variable to fine-tune control.
Use **Lerp** to limit the range (for example, keep height between 0 and 10).

Optional: 
- Create a **BaseScale** variable to store an object's original size. Adjust its `Vector3` values to match proportions (recommended default: x1, y1, z1).
- Define the **Object** variable and assign it to the object you want to interact with in the scene. 

![alt_text](../images/microphone-example-object.webp)

<br>

## Pitch/dB Values - Usage Idea

You can use pitch and decibel inputs in many ways, such as triggering visual or behavioral changes like modifying **textures**, **colors**, or **animations**.

For example, you could make a **bird fly when player whistles** and dynamically change its color based on **decibel variations**.