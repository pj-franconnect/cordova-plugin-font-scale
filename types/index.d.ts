interface FontScalePlugin {
    /** Device text-size setting as a multiplier, 1 = default (Android font scale, iOS Dynamic Type). 1 elsewhere. */
    getFontScale(): Promise<number>;
    /** Android WebView text zoom in percent (100 = none); null on other platforms. */
    getTextZoom(): Promise<number | null>;
    /** Sets the Android WebView text zoom in percent (50-500); does nothing on other platforms. */
    setTextZoom(percent: number): Promise<void>;
}

interface CordovaPlugins {
    fontScale: FontScalePlugin;
}
