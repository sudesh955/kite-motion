import {EmitterSubscription} from "react-native";

import AppGps, {Location} from "./js/NativeGPS";
import {CoreEvents} from "./js/NativeCore";
export type {Location} from "./js/NativeGPS";

export function addLocationListener(
	listener: (location: Location) => unknown,
): EmitterSubscription {
	return CoreEvents.addListener("appLocation", listener);
}

export default AppGps;
