# Pokerinno welcome videos

The Academy frontend automatically looks for one local video per selected login language:

- `pokerinno-intro-pt-BR.mp4`
- `pokerinno-intro-en-US.mp4`
- `pokerinno-intro-es-ES.mp4`

Place the final approved MP4 files in this `dist/assets/` directory using exactly those names.

If a file is absent or cannot be played, the UI automatically falls back to the animated Pokerinno image + localized speech bubble. The Android app therefore remains functional without remote media.

Recommended export:
- MP4 / H.264
- portrait or square framing focused on Pokerinno
- short welcome message
- burned-in captions matching the selected language
- normalized voice level
- no remote URL dependency
