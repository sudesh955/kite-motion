import type {TurboModule} from "react-native/Libraries/TurboModule/RCTExport";
import {NativeEventEmitter, TurboModuleRegistry} from "react-native";

interface Spec extends TurboModule {
	addListener: (eventType: string) => void;
	removeListeners: (count: number) => void;
}

export const NativeCore = TurboModuleRegistry.getEnforcing<Spec>("AppCore");

export const CoreEvents = new NativeEventEmitter(NativeCore);

export default NativeCore;
