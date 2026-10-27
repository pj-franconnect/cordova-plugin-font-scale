package com.rizepoint.cordova.fontscale;

import android.view.View;
import android.webkit.WebView;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Reports the system font scale (Settings > Display > Font size) and reads or sets the WebView's text zoom.
 */
public class FontScale extends CordovaPlugin {
    private static final int MIN_TEXT_ZOOM = 50;
    private static final int MAX_TEXT_ZOOM = 500;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case "getFontScale":
                float fontScale = cordova.getActivity().getResources().getConfiguration().fontScale;
                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, fontScale));
                return true;
            case "getTextZoom":
                onWebView(callbackContext, (webView) -> callbackContext.success(webView.getSettings().getTextZoom()));
                return true;
            case "setTextZoom":
                int percent = args.getInt(0);
                if (percent < MIN_TEXT_ZOOM || percent > MAX_TEXT_ZOOM) {
                    callbackContext.error("setTextZoom expects a whole number from " + MIN_TEXT_ZOOM + " to " + MAX_TEXT_ZOOM);
                    return true;
                }
                onWebView(callbackContext, (webView) -> {
                    webView.getSettings().setTextZoom(percent);
                    callbackContext.success();
                });
                return true;
            default:
                return false;
        }
    }

    private interface WebViewAction {
        void run(WebView webView);
    }

    // WebView settings must be used on the UI thread, and only the system WebView engine has them.
    private void onWebView(CallbackContext callbackContext, WebViewAction action) {
        cordova.getActivity().runOnUiThread(() -> {
            View view = webView.getView();
            if (view instanceof WebView) {
                action.run((WebView) view);
            } else {
                callbackContext.error("Text zoom needs the system WebView engine");
            }
        });
    }
}
