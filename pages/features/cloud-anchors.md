---
layout: default
title: Cloud Anchors
toc: true
permalink: /cloud-anchors/
---

# Cloud Anchors

Cloud Anchors allow you to place experiences at precise real-world locations that persist across sessions and devices. Using Google's ARCore Cloud Anchors, your experience will appear in the exact same position for all users who visit the location.

> **Note:** Cloud Anchor creation is a PRO feature. [Upgrade to PRO to create and use Cloud Anchors in your experiences.](https://app.meadow.space/dashboard/user/account#subscription)

## Use Cases

There are two ways to use Cloud Anchors in Meadow:

1. **Cloud Anchor Location** - Position your entire experience at a precise real-world location
2. **Persistent Objects** - Anchor specific objects within your experience to real-world positions

---

## Cloud Anchor Location

Use this when you want your experience to appear at an exact position in the real world - for example, placing a virtual sculpture in a specific corner of a gallery, or positioning an interactive installation at a precise spot in a venue.

> **Tip:** For outdoor experiences, consider using the Geospatial placement type instead, as it is more robust in open environments.

### Step 1: Place Your Experience on the Map

First, you need to place your experience at the general location where you want it to appear.

1. Go to the [Meadow Web App](https://app.meadow.space/) and open your experience
2. In the **Distribution** section, search for your location and place the experience on the map
3. Save the experience

### Step 2: Create the Cloud Anchor On-Site

You need to physically go to the location to scan the environment and create the anchor.

1. Open the Meadow app on your device
2. Go to **Profile > Settings > Tools > Cloud Anchor**
3. Select your experience from the list
4. You'll enter AR. 

<div style="display: flex; gap: 1rem; aspect-ratio: 16/9; max-height: 400px;">
  <img src="../images/cloudanchor-utility.webp" alt="Cloud Anchor Utility" style="height: 100%; width: auto; object-fit: contain;">
  <img src="../images/cloudanchor-chooseexperience.webp" alt="Cloud Anchor Experience Selection" style="height: 100%; width: auto; object-fit: contain;">
</div>
<br>
### Step 3: Scan the Environment

1. Look around, and press the position where you want to place your experience. 
2. You will see an anchor appear. 
3. Move around the space to scan your surroundings thoroughly:

- Include as much of the surrounding environment as possible
- Scan walls, floors, furniture, and distinctive features
- Move slowly and steadily
- Cover multiple angles of the space

<div style="display: flex; gap: 1rem; aspect-ratio: 16/9; max-height: 400px;">
  <img src="../images/cloudanchor-scanning.webp" alt="Cloud Anchor Scanning" style="height: 100%; width: auto; object-fit: contain;">
  <img src="../images/cloudanchor-placeanchor.webp" alt="Cloud Anchor Place Anchor" style="height: 100%; width: auto; object-fit: contain;">
</div>
<br>
> **Note:** There is currently no indicator showing scan progress or time remaining. Continue scanning until the app prompts you to save.

### Step 4: Save the Anchor

When scanning is complete, you'll be prompted to save the anchor.

1. Enter a memorable name for the anchor (you'll need this later)
2. Press **Save** (there is currently no confirmation message, but the anchor will be saved in the background.)

<div style="display: flex; gap: 1rem; aspect-ratio: 16/9; max-height: 400px;">
  <img src="../images/cloudanchor-saveanchor.webp" alt="Cloud Anchor Save Anchor" style="height: 100%; width: auto; object-fit: contain;">
  <img src="../images/cloudanchor-myAnchor.webp" alt="Cloud Anchor Save Anchor" style="height: 100%; width: auto; object-fit: contain;">
</div>
<br>
> **Tip:** For scanning several cloud anchors, its safest to leave the tool and re-enter for each anchor.

### Step 5: Configure the Location in Web App

Finally, connect the anchor to your experience location:

1. Return to the [Meadow Web App](https://app.meadow.space/)
2. Open your experience and go to the **Distribution** section
3. Click the **Edit** button on your placed location

![alt_text](../images/experiencelocation-edit-button.webp "Experience Location Edit button")

4. Set **Placement Type** to **Cloud Anchor**
5. In the **Cloud Anchor Name** field, enter the exact name you gave the anchor
6. Save the experience

![alt_text](../images/experiencelocation-edit-location.webp "Experience Location Editing")

Your experience will now appear at the precise position where you created the anchor for all users who visit that location.

---

## Persistent Objects

Use the Persistent Objects component when you want to anchor specific GameObjects within your experience to real-world positions. 

### Setup

1. Add the **PersistentObjects** component to a GameObject in your scene
2. Configure the list of anchor-prefab pairs:
   - **Anchor Name**: The identifier for this anchor point
   - **Prefab**: The GameObject to instantiate at this anchor
3. Use the process described in the Cloud Anchor Location section to create anchors on-site and save them with the corresponding names.

![alt_text](../images/persistentobjects.webp "Persistent Objects Setup")

When the experience loads, any saved anchors will be resolved and the corresponding prefabs will be instantiated at their stored positions.

---

## Best Practices

### Ideal Environments

Cloud Anchors work best in:

- **Indoor locations** with stable features
- **Spaces that don't change often** - avoid areas where furniture is frequently rearranged
- **Well-lit environments** with consistent lighting

### Outdoor Considerations

Outdoor Cloud Anchors can work but are more challenging:

- **Scan in overcast weather** for best results
- **Avoid stark shadows** - these change with the sun and can break anchor recognition
- Natural environments with vegetation may be less reliable as plants grow and change

### What Can Break an Anchor

- Moving furniture or objects that were part of the scan
- Significant lighting changes
- Renovations or redecorations
- Seasonal changes (for outdoor anchors)

> **Tip:** If an anchor stops working reliably, you can create a new one by repeating the scanning process at the location.

---

## Known Issues

### Private experiences opened from Profile view may use incorrect placement

When opening a private (unpublished) experience from your Profile that uses Cloud Anchor placement, the experience may occasionally load with "In Front of Camera" placement instead of the Cloud Anchor position.

**Why this happens:** Private experiences load their location data slightly later than public experiences. If you open the experience before the location data has loaded, the app defaults to direct placement.

**Workarounds:**
- Open the experience from the Map view instead of the Profile view
- Wait a few seconds after the app loads before opening the experience from Profile
- If this is a problem for your use case, disable "Available Everywhere" in the experience settings - this ensures the experience can only be opened when the user is at the Cloud Anchor location
