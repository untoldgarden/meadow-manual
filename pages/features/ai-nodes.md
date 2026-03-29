---
layout: default
title: AI Nodes
toc: true
permalink: /ai-nodes/
order: 33
---

# AI Nodes {#ai-nodes}

Meadow provides visual scripting nodes for integrating AI capabilities directly into your experiences. You can send text and image prompts to large language models and use text-to-speech to generate audio — all from within your visual scripting graphs.

### Requirements

All AI nodes require an **API key** from the respective provider. You are responsible for your own API usage and costs. Keep your API keys secure and be mindful of rate limits.

- **ChatGPT / ChatGPT TTS**: [OpenAI API key](https://platform.openai.com/api-keys)
- **Claude**: [Anthropic API key](https://console.anthropic.com/)
- **Gemini / Gemini TTS**: [Google AI API key](https://aistudio.google.com/apikey)

<br>

## Chat Nodes

The chat nodes send a text prompt (and optionally an image) to an AI model and return a text response. All three chat nodes share the same interface pattern.

### ChatGPT

Sends a request to OpenAI's ChatGPT API.

**Inputs:**
- **Message**: `string` — The user prompt to send.
- **Image** *(optional)*: `Texture2D` — An image to include with the prompt (vision).
- **System Prompt** *(optional)*: `string` — Instructions that guide the AI's behaviour.
- **API Key**: `string` — Your OpenAI API key.
- **Model**: `ChatGPTModel` — Which model to use. Options:
  - GPT-5.2, GPT-5.1, GPT-5, GPT-5 Mini, GPT-5 Nano
  - GPT-4.1, GPT-4.1 Mini, GPT-4.1 Nano
  - o4 Mini
- **Max Tokens**: `int` — Maximum length of the response (default: 1024).

**Outputs:**
- **Success** → Control flow on successful response.
- **Failure** → Control flow on error.
- **Response**: `string` — The AI's text response.
- **Error**: `string` — Error message if the request failed.

<br>

### Claude

Sends a request to Anthropic's Claude API.

**Inputs:**
- **Message**: `string` — The user prompt to send.
- **Image** *(optional)*: `Texture2D` — An image to include with the prompt (vision).
- **System Prompt** *(optional)*: `string` — Instructions that guide the AI's behaviour.
- **API Key**: `string` — Your Anthropic API key.
- **Model**: `ClaudeModel` — Which model to use. Options:
  - Claude Sonnet 4.5, Claude Opus 4.5, Claude Opus 4.1
  - Claude Sonnet 4, Claude Opus 4
  - Claude 3.5 Haiku
- **Max Tokens**: `int` — Maximum length of the response (default: 1024).

**Outputs:**
- **Success** → Control flow on successful response.
- **Failure** → Control flow on error.
- **Response**: `string` — The AI's text response.
- **Error**: `string` — Error message if the request failed.

<br>

### Gemini

Sends a request to Google's Gemini API.

**Inputs:**
- **Message**: `string` — The user prompt to send.
- **Image** *(optional)*: `Texture2D` — An image to include with the prompt (vision).
- **System Prompt** *(optional)*: `string` — Instructions that guide the AI's behaviour.
- **API Key**: `string` — Your Google AI API key.
- **Model**: `GeminiModel` — Which model to use. Options:
  - Gemini 3 Flash (Preview), Gemini 3 Pro (Preview)
  - Gemini 2.5 Flash, Gemini 2.5 Pro
  - Gemini 2.0 Flash
- **Max Tokens**: `int` — Maximum length of the response (default: 1024).

**Outputs:**
- **Success** → Control flow on successful response.
- **Failure** → Control flow on error.
- **Response**: `string` — The AI's text response.
- **Error**: `string` — Error message if the request failed.

<br>

## Text-to-Speech Nodes

The TTS nodes convert text into spoken audio, returning an `AudioClip` that you can play with an `AudioSource` component.

### ChatGPT TTS

Generates speech using OpenAI's TTS API.

**Inputs:**
- **Text**: `string` — The text to convert to speech (max 4096 characters).
- **API Key**: `string` — Your OpenAI API key.
- **Model**: `ChatGPTTTSModel` — Which TTS model to use. Options:
  - GPT-4o Mini TTS
  - TTS-1
  - TTS-1 HD
- **Voice**: `ChatGPTTTSVoice` — The voice to use. Options:
  - Alloy, Ash, Ballad, Coral, Echo, Sage, Shimmer, Verse, Marin, Cedar
- **Speed**: `float` — Playback speed (0.25 to 4.0, default: 1.0).

**Outputs:**
- **Success** → Control flow on successful response.
- **Failure** → Control flow on error.
- **Audio Clip**: `AudioClip` — The generated speech audio.
- **Error**: `string` — Error message if the request failed.

<br>

### Gemini TTS

Generates speech using Google's Gemini TTS API.

**Inputs:**
- **Text**: `string` — The text to convert to speech.
- **API Key**: `string` — Your Google AI API key.
- **Voice**: `GeminiTTSVoice` — The voice to use. Options:
  - Aoede, Charon, Fenrir, Kore, Puck, Leda, Orus, Zephyr

**Outputs:**
- **Success** → Control flow on successful response.
- **Failure** → Control flow on error.
- **Audio Clip**: `AudioClip` — The generated speech audio.
- **Error**: `string` — Error message if the request failed.

<br>

## Playing TTS Audio

To play the audio clip returned by a TTS node:

1. Add an `AudioSource` component to a GameObject in your scene.
2. After the TTS node's **Success** output, use a **Set AudioSource Clip** node to assign the audio clip.
3. Use a **Play AudioSource** node to play it.

<br>

## Tips

- **System prompts** are useful for setting the AI's personality, language, or constraining its output format. For example: *"You are a friendly museum guide. Keep responses under 50 words."*
- **Vision** works by connecting a `Texture2D` to the Image input. This could be a camera capture, a rendered texture, or any image in your scene. The AI will describe or respond based on the image content.
- **Smaller models are faster and cheaper.** Use GPT-5 Nano, Claude 3.5 Haiku, or Gemini 2.0 Flash for quick interactions. Save the larger models for complex reasoning.
- **API calls take time.** Consider showing a loading indicator while waiting for responses, especially on slower connections.
- All AI nodes are found under the **XREF → AI** category in the visual scripting fuzzy finder.
