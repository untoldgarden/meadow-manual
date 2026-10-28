---
hidden: true
layout: default
title: In-Experience Map
toc: true
permalink: /in-experience-map/
order: 145
---

# In-Experience Map

The **Experience Map** component lets you show a map *inside* an experience — a treasure hunt clue showing where to walk next, a world-selector for a multi-location piece, or a mini-map of markers nearby. This is different from the [Map Marker](/map-marker/) feature, which uses the main app's map to launch your experience.

The map is powered by the same OnlineMaps integration the main app uses, so it respects the user's current map style and marker set.

## When to use it

Use the in-experience map when you want to:
- **Show a full-screen or panel map** inside a running experience (not just an AR view).
- **Place and read map pins from Visual Scripting**, driven by your experience logic.
- **Let the user click map locations** to trigger behaviour.

## Setup

1. Add the **Experience Map** component to a GameObject in your prefab. It can live on its own root GameObject — the component spawns its own camera, tile mesh, and render pipeline on demand.
2. (Optional) Add a `UIDocument` with a `<ui:VisualElement>` into which the map should render. If left empty, the map renders full-screen.
3. Call **Show Map** from Visual Scripting when you want the map to appear. Call **Hide Map** to dismiss it.

![Experience Map component inspector](../images/experience-map-inspector.webp "Experience Map component in the Unity inspector with its render target and camera settings")

## Visual Scripting nodes

All nodes live under `XREF/Map` in the VS fuzzy finder.

**Show Map** — brings up the map panel at an initial latitude/longitude and zoom.
- `Initial Latitude`: `double` — starting map centre latitude
- `Initial Longitude`: `double` — starting map centre longitude
- `Zoom`: `float` — initial zoom level (1–20, higher is closer)
- Exit value: the `ExperienceMap` reference (feed to other map nodes if needed)

**Hide Map** — dismisses the map panel.

**Set Map Position** — re-centres the map without closing it.
- `Latitude` / `Longitude`: `double`

**Add Map Pin** — places a 3D marker prefab on the map at a coordinate.
- `Prefab`: `GameObject` — the marker to instantiate (any 3D prefab, scaled by the map)
- `Latitude` / `Longitude`: `double`
- `Scale`: `float` — marker scale multiplier (default 1)
- Output: the instantiated pin reference (use it with Remove Map Pin)

**Remove Map Pin** — removes a placed marker.

**Place On Map** — convenience node: takes a `GameObject` already in your scene and places it at a coordinate with the correct scale for the map.

![In-experience map Visual Scripting](../images/in-experience-map-visual-scripting.webp "Visual Scripting graph showing Show Map followed by Add Map Pin to drop markers at given lat/lng coordinates")

![In-experience map on device](../images/in-experience-map-device.webp "The map rendered inside a running experience with custom 3D markers placed at real-world coordinates")

## Latitude / Longitude precision

Meadow's maps use **double** precision for coordinates — single-precision floats lose ~1–10 metres of accuracy near the poles and equator respectively. Always use `double` variables for lat/lng. The map nodes all accept doubles; convert from a float at your peril.

## Sizing & layout

The map renders to a render texture that drives a quad in world space. It auto-sizes to the screen by default. If you want the map to fill only part of the screen (e.g., a mini-map in the corner), wrap the Experience Map inspector's `targetUIElement` reference around a sized `<ui:VisualElement>` — the map fills that element's rect.

## Common issues

### Map is transparent / shows through to the AR background

The experience's main camera is competing with the map camera for the render target. The Experience Map handles this automatically in most cases by hijacking the tile-set control's camera and forcing its renderers on, but if your experience also disables the MapCamera GameObject (uncommon), re-enable it after your code runs.

### Markers are invisible or huge

Markers in OnlineMaps use "real-world metres" sizing by default, which makes them invisible at city-level zoom and enormous at street-level zoom. The `Add Map Pin` node applies a `MapWorldScaleFactor` multiplier to convert to the map's scene-space scale — if you're instantiating markers directly via OnlineMaps APIs, you'll need to scale by ~100× to match.

### Map doesn't update position when I change `latitude` / `longitude`

`Set Map Position` only re-centres the camera — it doesn't reload markers or rebuild tiles at a different zoom. Call it from a single point in your graph (e.g., on a button press) rather than every frame.
