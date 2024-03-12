package com.rtn

import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import android.os.Looper
import androidx.core.content.ContextCompat
import androidx.core.location.LocationListenerCompat
import androidx.core.location.LocationManagerCompat
import androidx.core.location.LocationRequestCompat
import com.facebook.react.ReactActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext

class Gps(context: ReactApplicationContext) : NativeGPSSpec(context), LocationListenerCompat {
    private var mLocationManager: LocationManager? = null

    @SuppressLint("MissingPermission")
    override fun startGPS() {
        val context = reactApplicationContext
        obtainPermission(context) { granted ->
            if (!granted) return@obtainPermission
            val locationManager = getLocationManager(context)
            val request = LocationRequestCompat.Builder(100)
                .setMinUpdateIntervalMillis(0)
                .setMinUpdateDistanceMeters(0.0f)
                .setQuality(LocationRequestCompat.QUALITY_HIGH_ACCURACY).build()
            LocationManagerCompat.requestLocationUpdates(
                locationManager,
                LocationManager.GPS_PROVIDER,
                request,
                this,
                Looper.getMainLooper()
            )
        }
    }

    @SuppressLint("MissingPermission")
    override fun stopGPS() {
        val locationManager = mLocationManager ?: return
        LocationManagerCompat.removeUpdates(locationManager, this)
    }

    private fun obtainPermission(
        context: ReactApplicationContext,
        block: (granted: Boolean) -> Unit
    ) {
        val permissions = arrayOf(
            android.Manifest.permission.ACCESS_FINE_LOCATION,
            android.Manifest.permission.ACCESS_COARSE_LOCATION
        )
        if (checkPermissions(context, permissions)) return block(true)
        val activity = currentActivity as ReactActivity? ?: return block(false)
        val requestCode = safePositiveRandomInt()
        activity.requestPermissions(permissions, requestCode) { _, _, _ ->
            block(checkPermissions(context, permissions))
            return@requestPermissions true
        }
    }

    private fun checkPermissions(
        context: ReactApplicationContext,
        permissions: Array<String>
    ): Boolean {
        var granted = 0
        for (permission in permissions) {
            if (
                PackageManager.PERMISSION_GRANTED == ContextCompat.checkSelfPermission(
                    context,
                    permission
                )
            ) {
                granted += 1
            }
        }
        return granted == permissions.size
    }

    private fun getLocationManager(context: ReactApplicationContext): LocationManager {
        mLocationManager?.let { return it }
        val locationManager = ContextCompat.getSystemService(context, LocationManager::class.java)!!
        mLocationManager = locationManager
        return locationManager
    }

    override fun onLocationChanged(location: Location) {
        appEventEmitter.sendEvent("appLocation", Arguments.createMap().apply {
            putDouble("lat", location.latitude)
            putDouble("lng", location.longitude)
            putDouble("altitude", location.altitude)
            putDouble("time", location.time.toDouble())
            putDouble("speed", location.speed.toDouble())
            putDouble("bearing", location.bearing.toDouble())
            putDouble("accuracy", location.accuracy.toDouble())
        })
    }
}