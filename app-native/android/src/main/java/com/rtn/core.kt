package com.rtn

import android.os.Handler
import android.os.Looper
import android.util.Base64
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import okhttp3.OkHttpClient
import java.util.Random
import java.util.concurrent.Executors


class Core(context: ReactApplicationContext) : NativeCoreSpec(context) {
    private var counter: Int = 0

    override fun addListener(eventType: String) {
        if (counter == 0) {
            appEventEmitter.emitter =
                reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        }
        counter += 1
    }

    override fun removeListeners(count: Double) {
        counter -= count.toInt()
        if (counter == 0) {
            appEventEmitter.emitter = null
        }
    }
}

internal class AppEventEmitter {
    var emitter: DeviceEventManagerModule.RCTDeviceEventEmitter? = null

    fun sendEvent(name: String, data: WritableMap? = null) {
        emitter?.emit(name, data)
    }
}

internal val random = Random()
internal val http = OkHttpClient()
internal val appEventEmitter = AppEventEmitter()
internal val mainHandler = Handler(Looper.getMainLooper())
internal val executor = Executors.newSingleThreadScheduledExecutor()

internal fun safePositiveRandomInt(): Int {
    var value = random.nextInt()
    if (value < 0) {
        value = -value
    }
    return value / 2 + 65536
}

internal fun generateURLSafeRandomString(bytes: Int): String {
    val buffer = ByteArray(bytes)
    random.nextBytes(buffer)
    return Base64.encodeToString(buffer, Base64.URL_SAFE or Base64.NO_WRAP or Base64.NO_PADDING)
}