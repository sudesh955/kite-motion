package com.rtn

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class Package : TurboReactPackage(), ReactModuleInfoProvider {

	override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> {
		return listOf()
	}

	override fun getModule(name: String, context: ReactApplicationContext): NativeModule? {
		return when (name) {
			NativeGPSSpec.NAME -> Gps(context)
			NativeCoreSpec.NAME -> Core(context)
			NativeFilesSpec.NAME -> Files(context)
			NativeKeyValueSpec.NAME -> KeyValue(context)
			else -> null
		}
	}

	override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
		return this
	}

	override fun getReactModuleInfos(): Map<String, ReactModuleInfo> {
		return mapOf(
			NativeGPSSpec.NAME to defaultReactModuleInfo(NativeFilesSpec.NAME),
			NativeCoreSpec.NAME to defaultReactModuleInfo(NativeCoreSpec.NAME),
			NativeFilesSpec.NAME to defaultReactModuleInfo(NativeFilesSpec.NAME),
			NativeKeyValueSpec.NAME to defaultReactModuleInfo(NativeKeyValueSpec.NAME),
		)
	}

	private fun defaultReactModuleInfo(name: String): ReactModuleInfo {
		return ReactModuleInfo(
			name,
			name,
			false,
			false,
			false,
			true
		)
	}
}
