---
hidden: true
layout: default
title: Placement in AR — Best Practices
toc: true
permalink: /placement-best-practices/
order: 310
---

# Placement in AR — Best Practices

This page covers the principles that apply to **every** way of placing content in AR — whether you're using [Geospatial](/geospatial/), [Cloud Anchors](/cloud-anchors/), [Image Tracking](/image-tracking/), or a [Location Object](/location-object/).

Read this first. Half the "my AR experience looks broken" questions we get are solved by one of the rules below.

## The Experience component's placement settings

Your [Experience component](/experience-component/) controls how the experience is spawned when the user opens it. These settings interact with every placement method:

- **Placement Type** — set in the webapp under Distribution. Options: *In Front of Camera* (default, places the experience a fixed distance ahead of the user), *Geospatial* (uses real-world GPS coordinates), or *Cloud Anchor* (resolves a pre-scanned anchor).
- **Placement Distance** — for *In Front of Camera* only. How many metres ahead of the user the experience spawns. Default 1.5m.
- **Facing Direction** — *User* (turns the experience to face the user) or *North* (aligns it to geographic north; geospatial only).
- **Vertical Positioning**:
  - *None* — experience spawns at the user's device height.
  - *Floor* — spawns at the detected floor plane (requires plane detection on).
  - *Altitude* — uses GPS altitude. Unreliable indoors and on many devices — avoid unless you've tested on the target devices.
- **Reposition Type** — *None*, *Smooth*, or *Instant*. Applies when location data refines after spawn (e.g., GPS converges, VPS anchor resolves) and the experience needs to shift. *Smooth* is almost always what you want.
- **Reposition Threshold** — minimum distance in metres between old and new location before a reposition triggers. Prevents jitter from sub-metre GPS drift.

![Experience component placement settings](../images/experience-component-placement-settings.webp "The Placement section of the Experience component inspector, showing Placement Type, Placement Distance, Facing Direction, and Vertical Positioning fields")

## Rule 1: Don't place content behind real walls

AR headsets and phones don't know where physical walls are unless you run occlusion. If you place a virtual object *behind* a real wall (from the user's perspective), the object still renders on top of the wall — it looks wrong and breaks immersion.

**Mitigations:**
- For geospatial experiences, know your site — don't place content in a spot that has line-of-sight obstructions from the viewing position.
- For indoor experiences, use **Cloud Anchors** and scan the room before placing — you'll see exactly where the user will see your content.
- Turn on **Occlusion** in the Experience component if your content spans multiple rooms; the camera's depth estimation will hide geometry behind real walls (on supported devices — not all phones do environment depth).

## Rule 2: Beware the parallax effect

When a user moves their head, nearby virtual objects appear to shift against far backgrounds. If your content is placed too close (< 1.5m), small tracking errors — which AR systems *always* have — manifest as large apparent wobble. Content placed > 3m away is much more stable visually.

![Parallax diagram](../images/placement-parallax-diagram.webp "Diagram showing how a small head movement produces a large apparent shift in a nearby virtual object, but only a small shift in a distant one")

**Mitigations:**
- Default `Placement Distance` to **1.5–2m** minimum for most experiences.
- For intimate / close-up pieces, warn the user to stand still.
- For outdoor geospatial work, favour placements that put content at least 5m from the typical viewing position.

## Rule 3: Don't place content below the floor

Floor detection takes a few seconds. If your experience spawns immediately with `Vertical Positioning = None`, it lands at device height — which can be *below* the eventual floor plane once it's detected, making content sink into the floor.

**Mitigations:**
- Set **Vertical Positioning** to **Floor** if your experience has ground-level content.
- If you use `None`, make sure your content isn't designed with the origin *at the ground* of the content — design around the assumption that (0, 0, 0) is at the user's chest height.
- Enable **Reposition Type = Smooth** so content moves gracefully to the floor once it's detected.

## Rule 4: GPS and geospatial take time to converge

Opening a geospatial experience cold starts a multi-second process: acquire GPS lock, fetch nearby VPS imagery, match visually, resolve the anchor. During this window, your experience may be at the wrong coordinate.

**Mitigations:**
- Design your experience so the first 5–10 seconds are forgiving. A welcome screen, audio intro, or instruction UI gives the geospatial system time to converge before the user sees any critical placement.
- Use `Reposition Type = Smooth` so the content slides into its final position rather than teleporting.
- Prompt the user to look around (pan the phone) — this gives VPS more visual data and speeds up the resolve.

## Rule 5: Match the placement method to the use case

| Use case | Best placement method |
|---|---|
| Outdoor, single specific location | Geospatial |
| Indoor, precise sculpture placement | Cloud Anchor |
| Works at any location the user chooses | In Front of Camera |
| Content appears on a printed image / poster | Image Tracking |
| Multiple separate objects, each at their own lat/lng | Location Object |

## Rule 6: Test at the actual site

There is no substitute. Editor + device simulator gets you 60% of the way; on-site testing uncovers parallax at that specific range, lighting variance, unexpected occluders, and how long it actually takes VPS to resolve at that spot.

## Rule 7: Performance matters for placement

AR tracking is sensitive to frame rate. If your experience drops below ~25 fps, tracking jitter gets noticeably worse and your placement looks less stable — even if the placement logic is correct. Keep your frame rate high (use the Experience component's Performance Manager to monitor).
