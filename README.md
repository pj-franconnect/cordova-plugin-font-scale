# cordova-plugin-font-scale

Reads the device's text-size setting so a Cordova app can size its own text from it (WCAG 1.4.4 Resize Text), and
controls the Android WebView's text zoom so text is not scaled twice.

| | Android | iOS | Other platforms |
|---|---|---|---|
| `getFontScale()` | `Configuration.fontScale` (Settings > Display > Font size) | Dynamic Type body size / 17pt (the default "Large") | `1` |
| `getTextZoom()` | `WebSettings.getTextZoom()` | `null` | `null` |
| `setTextZoom(percent)` | `WebSettings.setTextZoom(percent)`, 50-500 | no-op | no-op |

All methods return promises and are available as `cordova.plugins.fontScale` after `deviceready`.

## Install

```bash
cordova plugin add C:\rizepoint\github\cordova-plugin-font-scale
```

## Usage

```js
document.addEventListener('deviceready', applyFontScale);
document.addEventListener('resume', applyFontScale); // the setting may have changed while the app was in the background

async function applyFontScale() {
    const fontScale = cordova.plugins.fontScale;
    await fontScale.setTextZoom(100); // the app applies the scale itself
    const scale = await fontScale.getFontScale();
    document.documentElement.style.setProperty('--ma-font-size-base', `${Math.round(scale * 100)}%`);
}
```

## Notes

- **Android double scaling:** some WebView versions apply the system font scale as text zoom on their own. If
  `getTextZoom()` returns something other than 100 with a larger system font, call `setTextZoom(100)` before applying
  the scale yourself.
- **Android configuration changes:** changing the system font size recreates the activity unless the app declares
  `fontScale` in `android:configChanges`, so the page reloads and `deviceready` fires again.
- **iOS:** WKWebView does not scale web text with Dynamic Type, so there is nothing to undo. The largest accessibility
  sizes give a scale of about 3.1.
- **Text zoom** needs the system WebView engine (the cordova-android default).
