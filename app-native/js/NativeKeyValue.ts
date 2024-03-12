import type {TurboModule} from "react-native/Libraries/TurboModule/RCTExport";
import {TurboModuleRegistry} from "react-native";

interface Spec extends TurboModule {
	exists(key: string): boolean;
	get(key: string): null | string;
	read(
		prefix: string,
		count: number,
		decreasing: boolean,
		after: null | string,
	): {key: string; value: string}[];
	readKeys(
		prefix: string,
		count: number,
		decreasing: boolean,
		after: null | string,
	): string[];

	set(key: string, value: string): void;
	setMany(items: {key: string; value: string}[]): void;
	getMany(keys: string[]): {key: string; value: string}[];

	removeAll(): void;
	remove(key: string): void;
	removeMany(keys: string[]): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>("KeyValue");
