import {ComponentType} from "react";
import {Locale} from "./locale";

export interface AppState {
	locale: Locale;
	theme: "dark" | "light";
}

export interface Location {
	id: string;
	data: unknown;
	name: string;
}

export interface Match {
	name: string;
}

export interface AppData {
	state: AppState;
	location: Location;
}

export type AppSubscriber = (state: AppData) => unknown;

export interface Loader<T> {
	(): Promise<null | T>;
}

export interface Resource<T = unknown> {
	read(): T;
	promise: Promise<T>;
}

export type IsBlocked = () => boolean;

export type Navigation =
	| {
			replace: true;
			name?: string;
			data?: unknown;
	  }
	| {
			replace?: false;
			name: string;
			data?: unknown;
			update?: unknown;
	  }
	| {
			taskId: null | string;
			name: string;
			data?: unknown;
	  }
	| {
			locationId: string;
			update?: unknown;
	  };

export interface App {
	location(): Location;
	history(): Location[];
	cacheData(): CacheData;

	getData(): AppData;
	start(init?: () => void): void;
	restart(location?: Partial<Location>, init?: () => void): void;

	back(): boolean;
	block(isBlocked: IsBlocked): () => void;
	navigate(navigation: Navigation): void;

	dispatch(
		update: Partial<AppState> | ((state: AppState) => null | Partial<AppState>),
	): AppState;

	route<Path extends string>(path: Path, handler: () => void): void;
	module<Path extends string, Props extends JSX.IntrinsicAttributes>(
		path: Path,
		loadModule: () => Promise<RouteModule<Props>>,
	): JSX.Element;

	subscribe(fn: AppSubscriber): () => void;

	toJSON(): string;
}

export interface CacheDataEntry<T = unknown> {
	time: number;
	invalid: boolean;
	locationId?: string;
	resource: Resource<T>;
}

export interface CacheData {
	[key: string]: undefined | CacheDataEntry;
}

export interface RouteModule<Props> {
	default: ComponentType<Props>;
	loader?: Loader<Props>;
}
