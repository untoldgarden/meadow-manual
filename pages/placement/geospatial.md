---
hidden: true
layout: default
title: Geospatial
toc: true
permalink: /geospatial/
order: 320
---

# Geospatial Placement

Geospatial placement uses Google's **Visual Positioning System (VPS)** combined with GPS to place your experience at a real-world latitude, longitude, and altitude — no scanning required. It's Meadow's default outdoor placement method and what powers most public-space experiences.

> **Tip:** For indoor or precise installations, use [Cloud Anchors](/cloud-anchors/) instead — VPS relies on outdoor imagery in Google's Street View dataset.

## How it works

1. The user opens your experience at a location where VPS imagery is available.
2. Their device captures a few frames of the surroundings and ships them to Google.
3. Google matches the frames against its VPS database and returns an accurate geo-location (typically within 50cm).
4. Meadow places your experience at the latitude / longitude you set, aligned to geographic north.

Most urban areas and well-photographed streets have VPS coverage. Rural or covered areas may not.

## Step 1: Place the experience on the map

1. Go to the [Meadow Web App](https://app.meadow.space/) and open your experience.
2. In **Distribution**, search for the location where the experience should live.
3. Drag the marker to the exact spot. The coordinates you set here are where the experience's origin (0, 0, 0) will appear in the real world.
4. Save the experience.

![Experience placement on map](../images/experiencelocation-edit-location.webp)

## Step 2: Configure placement type

1. In Distribution → Location, click **Edit**.
2. Set **Placement Type** to **Geospatial**.
3. Save.

That's it for the webapp side — no on-site scanning required.

## Step 3: Configure the Experience component in Unity

Open the [Experience component](/experience-component/) on your prefab and set:

- **Placement Type**: defaults to *Geospatial* when the webapp has it set (this field in Unity is read-only — it reflects the webapp value).
- **Facing Direction**: typically **North** for geospatial experiences. Orient your content in Unity as if the user is facing +Z when looking north — i.e., design with north along +Z.
- **Vertical Positioning**: usually **Floor** for ground-standing content. Use *None* for content suspended at chest height.
- **Reposition Type**: **Smooth** — so the content slides into place as VPS refines the anchor.

![Experience component configured for Geospatial](../images/geospatial-experience-component.webp "Experience component inspector showing Placement Type: Geospatial, Facing Direction: North, Vertical Positioning: Floor, Reposition Type: Smooth")

## Convergence time

Geospatial placement takes **3–10 seconds** after the app opens at the site to reach full accuracy. During this window your experience may be off by a few metres. Design the first 5–10 seconds of your experience to be forgiving — an intro UI, audio, or welcome scene gives VPS time to resolve.

Prompting the user to pan the phone around speeds this up significantly (more visual frames for matching).

## Facing direction — North orientation

When **Facing Direction = North**, Meadow aligns your experience so that +Z in Unity world space points geographic north. Design your content accordingly:
- If the user should see the experience when facing north, place visible content along +Z from the origin.
- If the experience is bidirectional (viewable from any direction), no special consideration.

## Indoor geospatial?

Geospatial will not work reliably indoors. It depends on GPS (degraded indoors) and VPS imagery from Street View (typically outdoor-only). For indoor placement:
- Use [Cloud Anchors](/cloud-anchors/) — scan the room, pin your experience to visual features.
- Or use a nearby outdoor geospatial anchor and have the user walk indoors while the experience tracks via regular AR SLAM.

## Common issues

### The experience appears in the wrong spot

Most likely VPS hasn't converged yet. Wait 5–10 seconds. If it never converges:
- Are you in an area with Street View coverage? Check on [Google Maps](https://maps.google.com) — if Street View isn't available, VPS likely isn't either.
- Is the device's GPS on and accurate? A 50m GPS error can prevent VPS from even trying.
- Is the sky visible? Dense tree cover and deep street canyons degrade the initial GPS fix.

### The experience is at the wrong altitude

- If `Vertical Positioning = Altitude`, GPS altitude is notoriously unreliable — easily off by 10+ metres. Switch to **Floor** (uses plane detection) or **None** (uses device height).
- If `Vertical Positioning = Floor`, the app needs to detect a horizontal plane near the user. Prompt them to look down at the ground briefly.

### The experience rotates unexpectedly when I walk around

When geospatial anchors refine (as more VPS matches come in), the experience rotates to match the refined north. If your **Reposition Type = Instant**, this looks jarring. Use **Smooth** so the rotation is gradual.

### Cold-start accuracy is terrible

That's expected — see the convergence section. The first 3–10 seconds are VPS converging. Design an intro that masks this.
