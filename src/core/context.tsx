import {createContext, ReactNode, useEffect, useMemo, useState} from "react";

import {createTranslator, TranslatorContext} from "./translator";
import {App, AppData} from "./types";

export const AppContext = createContext<AppData>({
	state: {theme: "dark", locale: "english"},
	location: {id: "0", data: null, name: "/"},
});

interface AppProviderProps {
	app: App;
	children: ReactNode;
}

export function AppProvider({app, children}: AppProviderProps) {
	const [data, setData] = useState(app.getData());
	useEffect(() => {
		setData(app.getData());
		return app.subscribe(() => setData(app.getData()));
	}, [app]);
	const locale = data.state.locale;
	const translator = useMemo(() => createTranslator(locale), [locale]);
	return (
		<TranslatorContext.Provider value={translator}>
			<AppContext.Provider value={data}>{children}</AppContext.Provider>
		</TranslatorContext.Provider>
	);
}
