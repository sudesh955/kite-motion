import {StrictMode, useEffect} from "react";
import {BackHandler, Text} from "react-native";

import {
	App,
	AppProvider,
	AppState,
	ErrorBoundary,
	Location,
	__DEBUG__,
	createApp,
	currentApp,
	getErrorMessage,
	getErrorStack,
	setCurrentApp,
} from "src/core";
import {createRoutes} from "src/routes";
import {ThemeProvider} from "src/ui/theme";

import {homePath} from "./paths/paths";

declare global {
	let appRoot: {app: App; Routes: () => JSX.Element};
}

const startLocation: Partial<Location> = homePath.location(null);

const initialState: AppState = {
	theme: "dark",
	locale: "english",
};

let app = createApp(initialState, startLocation);
let Routes = createRoutes(app);

if (__DEV__) {
	// this is required for react-refresh
	if (typeof appRoot === "undefined") {
		const app = createApp(initialState, startLocation);
		const Routes = createRoutes(app);
		setCurrentApp(app);
		app.start();
		appRoot = {app, Routes};
	}
	app = appRoot.app;
	Routes = appRoot.Routes;
} else {
	setCurrentApp(app);
	app.start();
}

function Root() {
	useEffect(() => {
		const subscription = BackHandler.addEventListener("hardwareBackPress", () =>
			currentApp().back(),
		);
		return () => subscription.remove();
	}, []);
	return (
		<StrictMode>
			<ErrorBoundary
				onCatch={(error) => (
					<>
						<Text>{getErrorMessage(error)}</Text>
						{__DEBUG__ && getErrorStack(error)}
					</>
				)}
			>
				<AppProvider app={app}>
					<ThemeProvider>
						<Routes />
					</ThemeProvider>
				</AppProvider>
			</ErrorBoundary>
		</StrictMode>
	);
}

export default Root;
