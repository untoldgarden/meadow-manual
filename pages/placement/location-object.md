---
hidden: true
layout: default
title: Location Object
toc: true
permalink: /location-object/
order: 350
---

# Location Object

The **Location Object** component pins a single GameObject in your experience to a specific real-world latitude, longitude, and altitude. Use it when you want multiple independent objects each at their own geographic location — for example, a city-scale treasure hunt with clues at a dozen different addresses, or a public-art walk with sculptures at specific intersections.

This is distinct from [Geospatial](/geospatial/) placement of a whole experience: the experience itself can be placed anywhere (or have no geospatial anchor at all), and individual `LocationObject`s within it are each independently pinned to coordinates via Google's VPS.

## Setup

1. Add the **Location Object** component to the GameObject you want to pin.
2. In the inspector, set:
   - **Latitude**: `double` — decimal degrees (e.g. `55.6050` for central Malmö).
   - **Longitude**: `double` — decimal degrees.
   - **Altitude**: `double` — metres. Interpretation depends on **Altitude Type**.
   - **Altitude Type**:
     - **WGS84** — altitude is absolute metres above the WGS84 ellipsoid (the GPS reference). Use when you know the exact altitude of the placement.
     - **Terrain** — altitude is relative to Google's terrain mesh. Use `0` for "on the ground".
     - **Rooftop** — altitude is relative to building rooftops (Google's buildings mesh). Use `0` to sit on the top of a building.

Save the prefab — the object is now pinned to those coordinates when the experience runs.

![Location Object component inspector](../images/location-object-inspector.webp "Location Object component inspector showing Latitude, Longitude, Altitude, and Altitude Type (WGS84 / Terrain / Rooftop) fields")

## Placement via Visual Scripting

You can also set coordinates at runtime, useful for dynamic pins (e.g., fetching a list of locations from a server and pinning each).

**Instantiate Geospatial Anchor** (`XREF/AR/Positioning`) — spawns a prefab at the supplied lat/lng/altitude, adding a Location Object component if the prefab doesn't already have one.
- `Prefab`: `GameObject` — the prefab to spawn
- `Latitude` / `Longitude` / `Altitude`: `double`
- `Altitude Type`: enum (WGS84 / Terrain / Rooftop)
- `Parent`: `Transform` (NullMeansSelf)
- Output: the new GameObject

**Set Geospatial Position** — update an existing Location Object's coordinates. **Must be called before the anchor has resolved** — once ARCore has pinned the anchor to the world, it cannot be moved. To reposition a placed object, destroy and re-create it.
- `Target`: `GameObject` with a Location Object
- `Latitude` / `Longitude` / `Altitude`: `double`
- `Altitude Type`: enum

**Get Geospatial Position** — read a Location Object's current coordinates.

![Location Object Visual Scripting](../images/location-object-visual-scripting.webp "Visual Scripting graph showing Instantiate Geospatial Anchor being called for each coordinate in a list, spawning one pinned prefab per entry")

## Using decimal-degree lat/lng

Latitude and longitude are **doubles** — single-precision floats lose 1–10 metres of precision, which matters for city-block placements. Always use double literals and double variables when passing coordinates. The inspector fields and VS ports are typed as double; convert from float only as a last resort.

## When anchors resolve

A new Location Object doesn't immediately appear at its lat/lng:
1. On `Awake`, if coordinates are already set in the inspector, Meadow creates an `ARGeospatialCreatorAnchor` component.
2. Once the AR session's Earth API reaches *Tracking* (GPS + VPS converged), the anchor resolves to its world position.
3. The GameObject snaps to that position, then stays there as the user moves.

If you inspect a new Location Object in the first few seconds, it may be at (0, 0, 0) — "null island", a few kilometres off the coast of Africa. Don't worry, it'll snap into place once VPS resolves.

## Common issues

### The object never appears at the coordinate

- Check you're in an area with [VPS coverage](/geospatial/#how-it-works) — same rules as geospatial experience placement.
- Check the device has GPS + network access. Indoor use will not work.
- Check the ARCore Extensions package is enabled in your project (Meadow Studio enables it by default).
- Give it 5–10 seconds. VPS convergence is not instant.

### The object is at (0, 0, 0) in the editor

Expected — `LocationObject` needs the ARCore session to resolve, which only runs on device. Test with a build.

### `SetGeospatialPosition` does nothing after the anchor resolved

ARCore's Creator anchors are fire-and-forget: once resolved, they can't be moved. Destroy the GameObject and use `InstantiateGeospatialAnchor` to spawn a new one at the new coordinates.

### The object shows up but rotates unexpectedly when I walk around

Same behaviour as full-experience geospatial placement — as VPS refines, the anchor refines. Use Reposition Type *Smooth* on your experience (or accept the snap) to manage this visually.
