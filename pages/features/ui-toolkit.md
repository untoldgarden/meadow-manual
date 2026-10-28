---
hidden: true
layout: default
title: UI Toolkit
toc: true
permalink: /ui-toolkit/
order: 165
---

# UI Toolkit

Meadow experiences can use Unity's **UI Toolkit** for menus, HUDs, text inputs, sliders, buttons — anything that's flat, 2D, screen-space UI. You build the layout in a `.uxml` file (Unity's declarative UI format), add a `UIDocument` component to a GameObject, and wire behaviour with the Visual Scripting nodes below.

> **New to UI Toolkit?** See Unity's [UI Builder documentation](https://docs.unity3d.com/Manual/UIBuilder.html) first — that covers the visual editor for authoring UXML.

## Getting a UIDocument into your experience

1. Create a UXML file (File → Create → UI Toolkit → UI Document).
2. Design the layout in UI Builder or by editing the UXML directly.
3. Add a `UIDocument` component to a GameObject in your prefab.
4. Assign your `.uxml` to the **Source Asset** field.
5. Assign a **Panel Settings** asset (create one via Assets → Create → UI Toolkit → Panel Settings Asset).

The UI will render on screen whenever the GameObject is active in your experience.

![UIDocument component setup](../images/ui-toolkit-uidocument-setup.webp "UIDocument component inspector with Source Asset and Panel Settings assigned")

## Visual Scripting nodes

All UI Toolkit nodes live under `XREF/UI` in the fuzzy finder.

Every node except **Set Visual Element Text** takes a `UIDocument` as its first port, and that port defaults to self — leave it unconnected and the node uses the `UIDocument` on the GameObject running the graph.

### Instantiating and populating content

**Instantiate Visual Asset** — clone a UXML template (usually a row or card) and add it into a container. Use this for dynamic lists like leaderboards, inventories, chat messages.
- `Target Document`: `UIDocument` — which document to add into
- `Container Name`: `string` — the name of the `VisualElement` inside the document that should host the new clone
- `Visual Tree Asset`: `VisualTreeAsset` — the UXML template to clone
- Output: the cloned root `VisualElement` (handy to keep a reference for later updates)

**Clear Element Children** — remove all children from a named `VisualElement`. Pairs with Instantiate Visual Asset for "rebuild list from scratch" flows.
- `Target Document`: `UIDocument`
- `Container Name`: `string`

**Set Visual Element Text** — set the `text` of a `Label` / `TextField` / `Button`, searching **relative to a `VisualElement` you supply**.
- `Element`: `VisualElement` — the subtree to search inside. **This must be connected.** Unlike every other node here it takes a `VisualElement`, not a `UIDocument`, so it has no self-default — leaving it empty logs `Element is null` and does nothing. Usually you wire it from **Instantiate Visual Asset**'s `Instance` output.
- `Child Name`: `string` — name of a descendant to write to. Leave it **empty** to set the text on `Element` itself.
- `Text`: `string`

#### Set Visual Element Text vs Set Visual Asset Property

Both set text on a `Label` / `TextField` / `Button`, and they overlap whenever the element's name is unique in the document. The difference is **where the search starts**:

| | Set Visual Element Text | Set Visual Asset Property |
|---|---|---|
| Searches from | the `VisualElement` you pass | the document root |
| Element port | `VisualElement`, must be wired | `UIDocument`, defaults to self |
| Blank name | writes to the element itself | not supported |
| Value types | `string` only | `string` and `Texture2D` |

The practical consequence is repeated content. If you clone a row template ten times and every row contains a `Label` named `messageLabel`, a document-root search always returns the **first** match — so **Set Visual Asset Property** can only ever write to row 0. **Set Visual Element Text**, scoped to one row's `VisualElement`, writes to the row you mean. For dynamic lists — chat logs, leaderboards, inventories — use Set Visual Element Text.

For one-off elements with unique names, either works; Set Visual Asset Property is less wiring because its document port defaults to self.

### Styling and layout

**Set Display Style** — show or hide a `VisualElement` (`DisplayStyle.Flex` vs `DisplayStyle.None`). Hidden elements don't take up layout space.
- `Target Document`: `UIDocument`
- `Element Name`: `string`
- `Display`: `DisplayStyle`

**Set Element Style** — set an arbitrary inline style property by name. Useful for runtime colour, opacity, background-image swaps.

**Set Element Width** / **Set Element Height** — change an element's size. Value is `StyleLength` (e.g. `200f` for 200 pixels, or use USS percent strings in UXML for proportional sizing).

**Set Visual Asset Property** — set text or a background image on a named element, searched from the document root. Despite the general-sounding name it handles exactly two value types; it is not a generic property setter.
- (unlabelled first port): `UIDocument` — defaults to self
- `Property`: `string` — the element's `name` in UXML
- `Value`: `object` —
  - `string` → sets `text` on a `Label`, `value` on a `TextField`, or `text` on a `Button` (matched in that order)
  - `Texture2D` → sets `style.backgroundImage`
  - anything else logs `Property type ... not supported` and does nothing

See [Set Visual Element Text vs Set Visual Asset Property](#set-visual-element-text-vs-set-visual-asset-property) for which to reach for.

**Fade Property** — tween a numeric or color property from its current value to a target over a duration. Works for `opacity`, `backgroundColor`, and similar.

### Button, slider, and text-field events

Since UI Toolkit controls fire callbacks in C# rather than UnityEvents, these nodes let you bridge to a Visual Scripting Custom Event.

**Set Button Event Trigger** — wire a button's `clicked` callback to a Custom Event.
- `Target Document`: `UIDocument`
- `Button Name`: `string`
- `Custom Event Name`: `string` — fires `TriggerCustomEvent` with this name when the button is clicked
- `Arg 0` (optional): `string` — passed as a payload to the Custom Event

**Remove Button Events** — unregister all click handlers from a button. Use this when you're re-wiring dynamically instantiated buttons and don't want callbacks stacking up.

**Set Slider On Value Changed Event** — fires a Custom Event whenever a slider's value changes.
- `Target Document`: `UIDocument`
- `Slider Name`: `string`
- `Custom Event Name`: `string` — Custom Event Arg.0 = the new slider value (`float`)

**Get Slider Value** — read a slider's current value without needing an event.

**Set Text Field On Value Changed Event** — fires a Custom Event whenever the user types in a TextField. **Custom Event Arg.0 = the current text string.** Use this for live search boxes, inline validation, chat input previews.

![UI Toolkit button event trigger](../images/ui-toolkit-button-event-visual-scripting.webp "Visual Scripting graph wiring Set Button Event Trigger on document load, with a Custom Event receiver handling the click")

## Patterns

### Dynamic list (e.g. leaderboard)

1. UXML has a container `<ui:VisualElement name="list">`.
2. Create a row template UXML with a `name="rank"`, `name="player"`, `name="score"` inside.
3. When the data changes: **Clear Element Children** (on `"list"`) → loop your data → **Instantiate Visual Asset** (template into `"list"`) → **Set Visual Element Text** on the cloned row's labels.

![Dynamic list pattern Visual Scripting](../images/ui-toolkit-dynamic-list-visual-scripting.webp "Visual Scripting graph showing the Clear / Instantiate / Set Text loop for rebuilding a list")

### Modal / popup

1. Place the popup root `<ui:VisualElement name="popup">` in your UXML with `display: none` by default.
2. When you want to show it: **Set Display Style** → `Flex`. When closing: → `None`.

### Custom Event naming

Custom Event names are arbitrary strings that your graph listens for via **Trigger Custom Event** on one side and **Custom Event** (receiver) on the other. Pick descriptive names (`submitButtonPressed`, `nameFieldChanged`) to keep your graphs readable.

## Common issues

### Clicking a button does nothing

- Check the UXML — does `<ui:Button name="myButton">` use the exact name you passed to **Set Button Event Trigger**? Names are case-sensitive.
- Check the button's `picking-mode` in UXML — if it's `Ignore`, input events won't fire. It should be `Position` (default).
- If the button is a child of a `<ui:VisualElement picking-mode="Ignore">`, its click is still live, but if a *parent* covers the button with `position: absolute` and a higher z-order, the parent eats the click.

### Text field doesn't accept input on mobile

UI Toolkit's `TextField` requires `hide-mobile-input="false"` on mobile to show the native keyboard. If you set it to `"true"`, the field takes input only when the Unity on-screen keyboard overlay is visible.

### Password manager (iOS Keychain / 1Password) doesn't suggest a password

Known limitation: UI Toolkit's `<ui:TextField password="true">` doesn't expose the iOS `UITextContentType.password` or Android `autofillHints="password"` attributes. Password managers can't detect the field as a password input. There's no clean UXML workaround as of Unity 6; users will need to paste passwords manually.

### UI shows on top of the main app UI during experience load

Each UIDocument creates its own render panel. If your experience's UIDocument `PanelSettings.Sort Order` is equal to or higher than the main app's, it renders on top — and its screen-filling root captures all pointer events, making the main UI unresponsive. Set the experience's PanelSettings Sort Order to a negative number (e.g. `-1`) to render below the main app.
