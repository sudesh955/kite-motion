import {ReactNode} from "react";

import {App, Switch} from "src/core";
import {homePath} from "./paths/paths";

export function createRoutes(app: App) {
	const routes: ReactNode[] = [homePath.apply(app, () => import("./home"))];
	if (__DEV__) {
		routes.push(
			app.module("/dev", () => import("./dev/dev")),
			app.module("/dev/kv", () => import("./dev/kv")),
			app.module("/dev/ui/text", () => import("./dev/text")),
			app.module("/dev/ui/skia", () => import("./dev/skia")),
		);
	}
	function Routes() {
		return <Switch>{routes}</Switch>;
	}
	return Routes;
}
