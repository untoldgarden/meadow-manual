---
hidden: true
layout: default
title: Saving Object Hierarchies
toc: true
permalink: /saving-object-hierarchies/
order: 420
---

# Saving Object Hierarchies

Meadow's [Save System](/save-system/) persists strings, numbers, booleans, and vectors via PlayerPrefs. What if you want to save — and later restore — a **whole GameObject hierarchy** the user built during their session? A painted sculpture the user arranged, a base they built, a chessboard mid-game?

Two visual-scripting nodes handle this: one serialises a GameObject tree into a JSON string, and the other reconstructs the tree from the same string. Together they give you a full round-trip for object-based state.

## When to use this vs `Save Custom Data`

- **Save / Get Custom Data** (from [Save System](/save-system/)) — for simple primitives like `int score`, `string lastChapter`, `Vector3 camPos`. Saves to PlayerPrefs on the device.
- **GameObject To JSON** / **JSON To GameObject** — for whole hierarchies with transforms, components, children. You choose where the resulting JSON string goes — realtime data (cross-user sync), a server via web request, or a single custom-data string field if you want it on-device.

The JSON output is just a string. Everything downstream is up to you.

## Visual Scripting nodes

Both live under `XREF/SaveSystem` in the fuzzy finder.

### GameObject To JSON

Serialises a GameObject and all its children (transforms, components, etc.) into a JSON string.

- **GameObject**: `GameObject` (NullMeansSelf — defaults to the graph's owner GameObject)
- **JSON**: `string` output

### JSON To GameObject

The inverse: takes a JSON string produced by **GameObject To JSON** and reconstructs the hierarchy.

- **JSON**: `string` — the serialised payload
- **Parent**: `GameObject` (NullMeansSelf) — where the new hierarchy is parented. Defaults to the graph's owner GameObject.
- **Start Disabled**: `bool` — if true, the root GameObject is set inactive after instantiation. Useful when you want to position / inspect it before revealing.
- **GameObject**: `GameObject` output — the newly-instantiated root.

## Round-trip example

A user arranges a scene of decorative objects and saves it. On next session, we restore what they built.

**Save**:

```
[Button Pressed]
  → GameObject To JSON (target = sceneRoot)
  → [JSON output as string]
  → Set Realtime Data Variable (name = "mySceneLayout", type = string)
```

**Load**:

```
[On Experience Initialized]
  → Get Realtime Data Variable (name = "mySceneLayout")
  → [JSON string]
  → JSON To GameObject (parent = sceneRoot, startDisabled = false)
```

The reconstructed hierarchy will have the same transforms, components, and child structure as the original.

![Save and load object hierarchy Visual Scripting](../images/saving-object-hierarchies-visual-scripting.webp "Visual Scripting graphs side by side: left shows GameObject To JSON feeding a realtime data write; right shows a realtime data read feeding JSON To GameObject to recreate the hierarchy")

## Realtime Data compatibility

Meadow's Realtime Data system supports string values, and serialised JSON is a string — so a saved hierarchy can sync across users in a multiplayer experience. Two caveats:

1. **Size**: serialised JSON can get large (thousands of characters for complex hierarchies). Realtime writes are cheap at this scale, but if you're syncing per-frame you'll hit rate limits. Save on "user committed" events, not on `Update`.
2. **Secrets**: the JSON contains everything — don't serialise objects with user-private data if you plan to write to the realtime data system where other users can read.

## What gets serialised

- **Transform**: position, rotation, scale, parent hierarchy
- **Common components**: MeshRenderer material references, lights, rigidbody state, collider settings, audio sources, etc. Components that Meadow's serializer knows how to handle.
- **Custom scripts**: public fields of serializable types (primitives, Vectors, enums, lists). Private or `[NonSerialized]` fields are skipped.

Not every possible Unity component is supported — if you have a component that must round-trip, test it first and add missing handlers to your custom scripts if needed (via `[SerializeField]` on the fields you care about).

## Common issues

### JSON string is suspiciously short

Check the **GameObject** input. If it's null (or defaults to a graph-owner that has no children), the serialiser returns an empty object. A warning is logged to the console.

### Restored hierarchy looks wrong

The most common cause is **missing prefab references**: if a saved GameObject was originally instantiated from a prefab with a custom mesh or material, and that prefab isn't in the asset bundle of the loading experience, the restore falls back to default Unity primitives. Make sure anything referenced by saved hierarchies is included in the experience's asset bundle.

### JSON is too large to put in a single realtime data field

Split the hierarchy into chunks. Save each chunk under a separate realtime data key (e.g. `layout_0`, `layout_1`, ...). Restore by concatenating — or better, save logical subsets (`sceneRoot/furniture`, `sceneRoot/decorations`) as separate keys and restore each independently.
