import type {TurboModule} from "react-native/Libraries/TurboModule/RCTExport";
import {TurboModuleRegistry} from "react-native";
import {Float} from "react-native/Libraries/Types/CodegenTypes";

export type Location = {
	lat: Float;
	lng: Float;
};

interface Spec extends TurboModule {
	stopGPS(): void;
	startGPS(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("AppGPS");
