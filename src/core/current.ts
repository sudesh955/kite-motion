import {App} from "./types";

let app: null | App = null;

export function currentApp(): App {
	if (!app) throw new Error();
	return app;
}

export function setCurrentApp(_app: null | App) {
	app = _app;
}
