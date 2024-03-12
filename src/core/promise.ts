import {currentApp} from "./current";
import {App, CacheDataEntry, Resource} from "./types";

export interface Cached<A extends unknown[], T> {
	key: string;
	(...args: A): Resource<T>;
	fn: (...args: A) => T | Promise<T>;
}

export function getCacheKey(prefix: string, args: unknown[]): string {
	const key =
		prefix.toString() +
		JSON.stringify(args, (_, item) => {
			const type = typeof item;
			if (type === "object" && item !== null && !Array.isArray(item)) {
				const keys = Object.keys(item).sort();
				const value: unknown[] = [];
				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					value.push(key, item[key]);
				}
				return value;
			} else {
				return item;
			}
		});
	return key;
}

export function load<A extends unknown[], T>(
	name: string,
	fn: (...args: A) => T | Promise<T>,
	args: A,
	invalidate: boolean = true,
	useLocation: boolean = false,
	app = currentApp(),
): Resource<T> {
	const key = getCacheKey(name, args);
	const cacheData = app.cacheData();
	let entry = cacheData[key] as undefined | CacheDataEntry<T>;
	if (!invalidate && entry) {
		return entry.resource;
	}
	entry = cacheData[key] = {
		invalid: false,
		time: Date.now(),
		resource: createResource(Promise.resolve<T>(fn(...args))),
	};
	if (useLocation) {
		entry.locationId = app.location().id;
	}
	return entry.resource;
}

export function cache<A extends unknown[], T>(
	name: string,
	fn: (...args: A) => T | Promise<T>,
	...args: A
): Resource<T> {
	const app = currentApp();
	const location = app.location();
	const cacheData = app.cacheData();
	const key = getCacheKey(name, args);
	let entry = cacheData[key];
	if (!entry || entry.invalid) {
		entry = {
			invalid: false,
			time: Date.now(),
			locationId: location.id,
			resource: createResource(Promise.resolve<T>(fn(...args))),
		};
		cacheData[key] = entry;
	}
	return entry.resource as Resource<T>;
}

export function use<A extends unknown[], T>(
	name: string,
	fn: (...args: A) => T | Promise<T>,
	...args: A
) {
	return cache(name, fn, ...args).read();
}

export function invalidate(app: App, key: string) {
	const entry = app.cacheData()[key];
	if (entry) {
		entry.invalid = true;
	}
}

export function createResource<T>(promise: Promise<T>): Resource<T> {
	let value: T;
	let error: unknown;
	let state: 0 | 1 | 2 = 0;
	const reader: Promise<void> = promise.then(
		(v) => {
			value = v;
			state = 1;
		},
		(e) => {
			error = e;
			state = 2;
		},
	);
	function read(): T {
		switch (state) {
			case 2:
				throw error;
			case 1:
				return value;
			default:
				throw reader;
		}
	}
	return {read, promise};
}
