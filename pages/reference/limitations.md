---
layout: default
title: Limitations
toc: true
permalink: /limitations/
order: 710
---

# Limitations

Meadow runs your experience as an asset bundle inside our app, which means your creator project is not a standalone Unity build. Most of Unity works as you'd expect, but a few things behave differently or aren't supported. This page lists the surprises — feature-specific limits live on the corresponding feature pages.

## No custom C# code

**All experience logic must be written in Visual Scripting.**

When your project is uploaded, only assets and the Visual Scripting graphs ship with it — your custom `MonoBehaviour` scripts are stripped. Anything you'd normally write in C# (state machines, custom math, network calls, custom components) needs to be expressed in Visual Scripting.

If you find yourself wishing for a custom node, [reach out to support](mailto:support@meadow.space) — we may be able to add it to the runtime.

## Tags don't transfer via asset bundle

Unity tags are project-wide settings that are stripped when the project is bundled. **Any custom tag you create in your project will be missing in the Meadow app.**

You have two options:

1. **Use one of the built-in tags** — Meadow includes a fixed set of ~50 standard Unity tags that are guaranteed to exist in the app. If your tag is in this set, it will work as expected.
2. **Use layers instead** *(recommended)* — Layers behave very similarly to tags for most use cases (filtering raycasts, grouping objects), and they *do* transfer via the asset bundle. Layers from index 10 upward are available for your use.

For most filtering / grouping problems, layers are the safer choice. Tags only make sense when you're specifically interfacing with a Unity API that requires a tag string and you know your tag is in the supported set.

## Project Settings don't transfer

Anything under **Edit → Project Settings** is part of your local Unity project, not the asset bundle. That includes:

- Graphics quality tiers
- Physics settings (gravity, collision matrix, default contact offset, etc.)
- Layer collision matrix
- Time settings (fixed timestep, max delta)
- Tags & Layers project-level config (see also the Tags section above)

When your experience runs in the Meadow app, it uses the **app's** project settings, not yours. If your experience depends on a tweaked physics gravity or a custom collision matrix, it won't behave the same on device as it does in your editor.

If you need to override one of these at runtime, do it in Visual Scripting on `On Experience Initialized` (e.g. set `Physics.gravity` via an Invoke Member node).

## Editor scripts are excluded

Only **Runtime** assembly definitions are included in the asset bundle. Anything in an `Editor` folder, or in an asmdef that targets `Editor` only, is stripped before upload.

This means custom inspectors, property drawers, build-time validators, and editor-only utilities won't run inside Meadow — they're for your authoring workflow only. That's fine for tooling but means you can't rely on editor-only behaviour to "fix up" data at runtime.

## No Resources folder loading

`Resources.Load(...)` won't find anything inside the Meadow runtime. The Resources folder is a Unity-build-time concept; in an asset bundle context it's empty.

Reference assets directly via:
- Serialized fields on your components (drag-and-drop assignments in the inspector)
- Asset bundle paths if you've set the asset bundle name on a specific asset

## One AudioListener per scene

Unity allows only one `AudioListener` per scene. The main app's camera already has one — if your experience adds another (often by including a Camera prefab as a child of your experience), you'll see warnings in the console and audio panning may behave incorrectly.

Strip any `AudioListener` component from your experience hierarchy before uploading.

## You don't own the camera

Meadow's app provides the camera — your experience does **not** ship a camera, and any camera you add inside your prefab is removed / disabled when the experience loads. The same applies to the AudioListener (above) and the main directional light.

If you need to attach something to the camera at runtime — a collider, a billboard, an audio reverb zone, a child object that follows the user — do it in Visual Scripting:

1. Get the active camera with **Camera.main** (an Invoke Member on `UnityEngine.Camera` static `main` property).
2. Use **Add Component** to attach the component you need, or **Set Parent** to make a GameObject follow the camera.

This way the runtime camera (whichever camera Meadow has currently active) gets your modification, and you don't end up with a duplicate camera fighting the app's camera for control.
