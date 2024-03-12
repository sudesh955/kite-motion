import type {TurboModule} from "react-native/Libraries/TurboModule/RCTExport";
import {TurboModuleRegistry} from "react-native";

interface Spec extends TurboModule {}

export default TurboModuleRegistry.getEnforcing<Spec>("AppFiles");
