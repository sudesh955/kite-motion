export {createApp} from "./app";
export {AppContext, AppProvider} from "./context";
export {currentApp, setCurrentApp} from "./current";
export {
	AppError,
	ErrorBoundary,
	getErrorCode,
	getErrorMessage,
	getErrorStack,
} from "./error";
export {invariant} from "./invariant";
export {
	currentLocale,
	languages,
	useLocale,
	getLocale,
	setLocale,
} from "./locale";
export type {Locale, Locales} from "./locale";
export {cache, createResource, load, use} from "./promise";
export {Outlet, Route, Switch, createRouteDefinition} from "./router";
export type {RouteDefinition} from "./router";
export {TranslatorContext} from "./translator";
export type {
	App,
	AppState,
	Location,
	Navigation,
	Resource,
	RouteModule,
} from "./types";

export const __DEBUG__ = __DEV__;
// export const __DEBUG__ = false;
