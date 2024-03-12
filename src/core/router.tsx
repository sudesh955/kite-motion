import {
	Children,
	createContext,
	isValidElement,
	ReactElement,
	ReactNode,
	Suspense,
	useContext,
} from "react";
import {AppContext} from "./context";
import {currentApp} from "./current";
import {ErrorBoundary} from "./error";
import {invariant} from "./invariant";
import {App, Location, Match, Navigation, RouteModule} from "./types";

const MatchContext = createContext<null | Match>(null);

export interface RouteProps {
	path: string;
	loader?: ReactNode;
	element?: ReactNode;
	render?: () => ReactNode;
	renderError?: (error: unknown) => ReactNode;
}

function renderRoute(props: RouteProps, match: Match): ReactElement {
	const {loader, element, renderError, render} = props;
	let output = render ? render() : element;
	if (loader) {
		output = <Suspense fallback={loader}>{output}</Suspense>;
	}
	if (renderError) {
		output = <ErrorBoundary onCatch={renderError}>{output}</ErrorBoundary>;
	}
	return <MatchContext.Provider value={match}>{output}</MatchContext.Provider>;
}

export function Route(props: RouteProps) {
	const name = useContext(AppContext).location.name;
	if (name === props.path) {
		return renderRoute(props, {name});
	} else {
		return null;
	}
}

export interface SwitchProps {
	children: ReactNode;
	element?: ReactNode;
}

export function Switch({children, element}: SwitchProps) {
	const name = useContext(AppContext).location.name;
	const routes = Children.toArray(children);
	for (let i = 0; i < routes.length; i++) {
		const route = routes[i];
		if (!route) continue;
		invariant(isValidElement(route) && route.type === Route);
		const routeProps = route.props as RouteProps;
		if (name === routeProps.path) {
			const content = renderRoute(routeProps, {name});
			return element ? (
				<OutletContext.Provider value={content}>
					{element}
				</OutletContext.Provider>
			) : (
				content
			);
		}
	}
	return null;
}

const OutletContext = createContext<ReactNode>(null);

export function Outlet() {
	return useContext(OutletContext);
}

class Navigator<Data> {
	name: string;

	constructor(name: string) {
		this.name = name;
	}

	reload(data: Data): Navigation {
		return {data, replace: true};
	}
	replace(data: Data): Navigation {
		return {data, replace: true, name: this.name};
	}
	push<UpdateData = null>(
		data: Data,
		update?: {
			data: UpdateData;
			route: RouteDefinition<UpdateData>;
		},
	) {
		return {data, name: this.name, update: update?.data};
	}
	finishTask(taskId: string, data: Data) {
		return {data, taskId, name: this.name};
	}
	pop(locationId: string, update?: Partial<Data>) {
		return {locationId, update};
	}
}

export class RouteDefinition<Data = null> {
	name: string;
	navigator: Navigator<Data>;

	constructor(name: string) {
		this.name = name;
		this.navigator = new Navigator<Data>(name);
	}

	buildData(data: Data) {
		return data;
	}

	location(data: Data): Location {
		return {
			data,
			name: this.name,
			id: Math.floor(Math.random() * 0xffffffff).toString(36),
		};
	}

	apply<Props extends React.JSX.IntrinsicAttributes>(
		app: App,
		load: () => Promise<RouteModule<Props>>,
	) {
		return app.module(this.name, load);
	}

	data() {
		// TODO: validate
		return currentApp().location().data as Data;
	}
	reload(data: Data) {
		currentApp().navigate(this.navigator.reload(data));
	}
	replace(data: Data) {
		currentApp().navigate(this.navigator.replace(data));
	}
	push<UpdateData = null>(
		data: Data,
		update?: {
			data: UpdateData;
			route: RouteDefinition<UpdateData>;
		},
	) {
		currentApp().navigate(this.navigator.push(data, update));
	}

	finishTask(taskId: string, data: Data) {
		// TODO: verify update.name with current route
		currentApp().navigate(this.navigator.finishTask(taskId, data));
	}

	pop(locationId: string, update?: Partial<Data>) {
		// TODO: verify update.name with locationId
		currentApp().navigate(this.navigator.pop(locationId, update));
	}
}

export function createRouteDefinition<Data = null>(
	name: string,
): RouteDefinition<Data> {
	return new RouteDefinition(name);
}
