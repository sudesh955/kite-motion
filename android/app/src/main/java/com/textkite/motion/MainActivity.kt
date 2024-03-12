package com.textkite.motion

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
	override fun getMainComponentName() = "motion"
	override fun createReactActivityDelegate() =
		DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
