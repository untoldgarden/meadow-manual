---
hidden: true
layout: default
title: Subtitles
toc: true
permalink: /subtitles/
order: 115
---

# Subtitles

The `SubtitlePlayer` component displays timed subtitles from an `.srt` file on top of a `UIDocument`. Use it for audio walks, narrative AR pieces, guided tours, and anywhere you want spoken content captioned for accessibility.

## Setup

1. Add a `UIDocument` component to a GameObject with a UXML that contains a `<ui:Label>` (default name: `text`). This label is where subtitles will appear.
2. Add the **Subtitle Player** component to the same GameObject (it requires a UIDocument).
3. Configure the inspector:
   - **Srt**: A `.srt` subtitle file. Unity only reads specific text extensions as TextAssets — if you have `my_track.srt`, rename it to `my_track.txt` (or `.xml`/`.json`/`.bytes`) so Unity imports it. The component parses the SRT format regardless of the file extension.
   - **Sync With Audio Source**: If enabled, subtitle timing is driven by `AudioSource.time` rather than wall-clock time. Strongly recommended when subtitles accompany audio — keeps captions aligned even when audio loading is delayed.
   - **Audio Source**: The `AudioSource` to sync to. If left empty, the component looks for one on the same GameObject.

![Subtitle Player inspector](../images/subtitle-player-inspector.webp "Subtitle Player component inspector showing Srt, Sync With Audio Source, and Audio Source fields")

## Automatic start

If **Srt** is assigned in the inspector, subtitles start playing automatically on `Start()`. Leave it empty and call `StartSubtitles(TextAsset)` from script (or Visual Scripting) to trigger them manually — useful for chapter-based experiences.

## Manual control via script / Visual Scripting

The component exposes two public methods:

- **`StartSubtitles(TextAsset subtitleFile, string labelName = "text")`** — start displaying subtitles from the supplied file. `labelName` defaults to `"text"` but you can specify another named Label element if your UXML uses a different name.
- **`StopSubtitles()`** — stop immediately and clear the label.

Both are callable from Visual Scripting via `Invoke Member`.

![Subtitle Visual Scripting](../images/subtitles-visual-scripting.webp "Visual Scripting graph calling StartSubtitles with a TextAsset input when a chapter begins")

## The SRT format

SRT is a plain-text subtitle format with numbered entries, start/end timestamps, and text:

```
1
00:00:00,000 --> 00:00:03,500
Welcome to the experience.

2
00:00:03,800 --> 00:00:07,200
Follow the path ahead of you.
```

Timestamps are `HH:MM:SS,mmm` (hours, minutes, seconds, milliseconds — note the comma before milliseconds). Blank line between entries.

Any text editor can produce SRT; most audio editing tools (Reaper, Audition, Descript) can export SRT directly from audio transcripts.

## UXML label styling

The `Label` element (named `text` by default) is shown/hidden automatically during playback. Style it in your UXML/USS — typical patterns:

- Full-width bar at the bottom of the screen with a semi-transparent background
- White text with a dark outline for readability on any background
- `font-size` scaled to screen size (16–24px usually works)

## Common issues

### Subtitles never show

- Make sure the UIDocument has a `<ui:Label name="text">` (or whatever name you passed to `StartSubtitles`). The component logs a warning + retries rebuilding the visual tree if the label isn't found, but if it's permanently absent you'll see `Label 'text' not found` in the console.
- On Unity 6 specifically: if you built your UXML asset on an older Unity version, the visual tree may be incompatible — rebuild the asset bundle from the current project.

### Subtitles are out of sync with audio

Enable **Sync With Audio Source** and assign the AudioSource. Without sync, timing uses `Time.realtimeSinceStartup` — any delay starting the audio (network streaming, asset bundle load) means subtitles run ahead of the voice.

### First subtitle is missing / skipped

Likely a UTF-8 BOM at the start of the SRT file confusing the parser — `SubtitlePlayer` strips BOMs automatically, so if you still see this on the latest version, the file might use a non-standard timestamp format (e.g., `.` instead of `,` before milliseconds).
