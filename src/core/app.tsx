import {PropsWithRef, lazy} from "react";

import {invariant} from "./invariant";
import {createResource} from "./promise";
import {Route} from "./router";
import {
	App,
	AppData,
	AppState,
	AppSubscriber,
	CacheData,
	IsBlocked,
	Location,
	Navigation,
	Resource,
	RouteModule,
} from "./types";

function randomId() {
	return Math.floor(Math.random() * 0xffffffff).toString(36);
}

interface RouteData {
	name: string;
	handler: () => unknown;
}

export function createApp(
	initialState: AppState,
	startLocation: Partial<Location> = {},
): App {
	const appId = randomId();
	const routes: RouteData[] = [];
	const history: Location[] = [
		{
			data: null,
			id: randomId(),
			name: "/",
			...startLocation,
		},
	];
	const blocks: IsBlocked[] = [];
	const subscriptions: AppSubscriber[] = [];

	const cacheData: CacheData = {};
	let historyIndex: number = 0;
	let location: Location = history[0];
	let state = initialState;
	let data: AppData = {state, location};

	const app: App = {
		back,
		start,
		restart,
		route,
		block,
		module,
		getData,
		navigate,
		dispatch,
		subscribe,
		toJSON() {
			return appId;
		},
		cacheData() {
			return cacheData;
		},
		location() {
			return location;
		},
		history() {
			return history;
		},
	};

	function updateData() {
		data = {state, location};
		return data;
	}

	function callRouteHandlers() {
		const name = location.name;
		for (let i = 0; i < routes.length; i++) {
			const route = routes[i];
			if (name === route.name) {
				route.handler();
				return;
			}
		}
		if (__DEV__) {
			console.warn("no routes matched current location", name);
		}
	}

	function callSubscribers() {
		for (let i = 0; i < subscriptions.length; i++) {
			subscriptions[i](data);
		}
	}

	function readLocation(): Location {
		return history[historyIndex];
	}

	function onLocationUpdate() {
		location = readLocation();
		updateData();
		callRouteHandlers();
		const deleted: string[] = [];
		const locationId = location.id;
		for (const key in cacheData) {
			const value = cacheData[key];
			if (!value) {
				deleted.push(key);
			} else if (value.locationId && value.locationId !== locationId) {
				deleted.push(key);
			}
		}
		for (let i = 0; i < deleted.length; i++) {
			delete cacheData[deleted[i]];
		}
		updateData();
		callSubscribers();
	}

	function back() {
		for (let i = 0; i < blocks.length; i++) {
			if (blocks[i]()) {
				return false;
			}
		}
		if (historyIndex == 0) {
			return false;
		}
		historyIndex--;
		onLocationUpdate();
		return true;
	}

	function block(isBlocked: IsBlocked): () => void {
		blocks.push(isBlocked);
		return () => {
			const index = blocks.indexOf(isBlocked);
			if (index !== -1) {
				blocks.splice(index, 1);
			}
		};
	}

	function navigate(navigation: Navigation) {
		for (let i = 0; i < blocks.length; i++) {
			if (blocks[i]()) {
				return;
			}
		}

		if ("locationId" in navigation) {
			const index = history.findIndex(
				(item) => item.id === navigation.locationId,
			);
			invariant(index !== -1);
			historyIndex = index;
			history[index] = {...history[index]};
			if (navigation.update) {
				const data = history[index].data;
				invariant(typeof data === "object");
				if (data) {
					history[index].data = {...data, ...navigation.update};
				} else {
					history[index].data = navigation.update;
				}
			}
		} else if ("taskId" in navigation) {
			historyIndex = history.findIndex((item) => item.id === navigation.taskId);
			const location: Location = {
				id: randomId(),
				name: navigation.name,
				data: navigation.data || null,
			};
			history[++historyIndex] = location;
		} else if (navigation.replace) {
			const location: Location = {
				...history[historyIndex],
				id: randomId(),
				data: navigation.data || null,
			};
			if (typeof navigation.name === "string") {
				location.name = navigation.name;
			}
			history[historyIndex] = location;
		} else {
			if (typeof navigation.update !== "undefined") {
				history[historyIndex].data = navigation.update;
			}
			const location: Location = {
				id: randomId(),
				name: navigation.name,
				data: navigation.data || null,
			};
			history[++historyIndex] = location;
		}
		onLocationUpdate();
	}

	function dispatch(
		update: Partial<AppState> | ((state: AppState) => null | Partial<AppState>),
	): AppState {
		if (typeof update === "function") {
			const updates = update(state);
			if (updates === null) return state;
			state = {...state, ...updates};
		} else {
			state = {...state, ...update};
		}
		updateData();
		callSubscribers();
		return state;
	}

	function getData(): AppData {
		return data;
	}

	function subscribe(callback: AppSubscriber) {
		subscriptions.push(callback);
		return () => {
			const index = subscriptions.indexOf(callback);
			if (index !== -1) {
				subscriptions.splice(index, 1);
			}
		};
	}

	function route(path: string, handler: () => unknown) {
		routes.push({name: path, handler});
	}

	function module<Props extends JSX.IntrinsicAttributes>(
		path: string,
		loadModule: () => Promise<RouteModule<Props>>,
	): JSX.Element {
		let module: null | RouteModule<Props> = null;
		const Lazy = lazy(loadModule);
		let resource: Resource<null | Props>;

		async function getProps(): Promise<null | Props> {
			await Promise.resolve(); // https://codepen.io/sudesh955/pen/JjeEKrd
			if (module === null) {
				module = await loadModule();
			}
			if (module.loader) {
				return module.loader();
			} else {
				return {} as Props;
			}
		}

		routes.push({
			name: path,
			handler() {
				resource = createResource(getProps());
			},
		});

		function Component({resource}: {resource: Resource<null | Props>}) {
			const props = resource.read() as PropsWithRef<Props>;
			return props && <Lazy {...props} />;
		}
		return (
			<Route
				key={path}
				path={path}
				render={() => <Component resource={resource} />}
			/>
		);
	}

	function start(init?: () => void) {
		updateData();
		if (init) init();
		onLocationUpdate();
	}

	function restart(
		location: Partial<Location> = startLocation,
		init?: () => void,
	) {
		historyIndex = 0;
		history.length = 1;
		history[0] = {
			data: null,
			id: randomId(),
			name: "/",
			...location,
		};
		start(init);
	}

	return app;
}
