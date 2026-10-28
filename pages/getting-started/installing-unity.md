---
layout: default
title: Installing Unity
toc: true
permalink: /installing-unity/
order: 1
---

<div style="padding:56.25% 0 0 0;position:relative;margin-bottom:2em;">
    <iframe 
        src="https://player.vimeo.com/video/1027857357?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" 
        style="position:absolute;top:0;left:0;width:100%;height:100%;" 
        frameborder="0" 
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        title="Install Unity"
        allowfullscreen>
    </iframe>
</div>
<script src="https://player.vimeo.com/api/player.js"></script>

## Installing Unity {#installing-unity}

Your Unity installs and projects are managed through an application called Unity Hub. You need to download this software to install and use Unity. It’s similar to Adobe Creative Cloud.



1. Download Unity hub from [https://unity.com/download](https://unity.com/download)
2. Install it
3. Open the Hub, create an account, and login
4. Install an editor. Unity publishes new versions often. Install **Unity 6.3 LTS** (any 6000.3.x version works), even if the Hub recommends a newer version. Newer versions like Unity 6.6 have not been tested with Meadow yet, but most features usually work. Problems tend to come up with VFX Graph and Shader Graph between Unity versions, so if your project relies heavily on VFX Graph or Shader Graph, stay on Unity 6.3.

![The Install Unity Editor window in Unity Hub, with Unity 6.3 LTS in the list](../images/install-unity.webp "Install Unity 6.3")
5. When prompted, install iOS and Android modules. At the moment both are needed even if you only plan on building for one platform.
![The Add modules step, with Android Build Support and iOS Build Support selected](../images/hubModules.webp "Add the iOS and Android modules")
6. Get a license. Use the free personal one. You do **not** need a Pro Unity License to use Meadow.

> **<font color="red">Important:</font>** Unity with the iOS and Android modules takes up more than 20 GB of disk space. The Hub shows how much is **Required** and how much is **Available** at the top of the module list. If Available is shown in red, there isn't enough space, so free some up before you continue.
