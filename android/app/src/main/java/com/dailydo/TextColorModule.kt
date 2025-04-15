package com.dailydo

import android.graphics.Color
import android.widget.TextView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.UIManagerModule

class TextColorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "TextColorModule"
    }

    @ReactMethod
    fun setTextColor(viewTag: Int, color: String) {
        val uiManager = reactApplicationContext.getNativeModule(UIManagerModule::class.java)
        uiManager?.addUIBlock { nativeViewHierarchyManager ->
            val view = nativeViewHierarchyManager.resolveView(viewTag)
            if (view is TextView) {
                try {
                    view.setTextColor(Color.parseColor(color))
                } catch (e: IllegalArgumentException) {
                    // Handle invalid color string
                }
            }
        }
    }
}
