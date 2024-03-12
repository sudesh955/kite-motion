import {createContext, ReactNode, Suspense, useContext, useMemo} from "react";
import {StatusBar, StyleSheet, useColorScheme, View} from "react-native";

import {__DEBUG__, currentApp} from "src/core";

import {Colors, darkColors, lightColors} from "./colors";
import {Fonts, fonts} from "./font";
import {darkElevations, Elevations, lightElevations} from "./elevation";
import IconButton from "./icon-button";
import {ICON_ADB} from "./icons";
import Progress from "./progress";

export interface Theme {
	dark: boolean;
	fonts: Fonts;
	colors: Colors;
	elevation: Elevations;
	name: "dark" | "light";
}

export const darkTheme: Theme = {
	fonts,
	dark: true,
	name: "dark",
	colors: darkColors,
	elevation: darkElevations,
};

export const lightTheme: Theme = {
	fonts,
	dark: false,
	name: "light",
	colors: lightColors,
	elevation: lightElevations,
};

export const ThemeContext = createContext<Theme>(darkTheme);

export function ThemeProvider(props: {children: ReactNode}) {
	const colorScheme = useColorScheme();
	const styles = useStyles(makeStyles);
	const theme = colorScheme === "dark" ? darkTheme : lightTheme;
	return (
		<ThemeContext.Provider value={theme}>
			<StatusBar backgroundColor={theme.colors.background} />
			<View style={[styles.root, {backgroundColor: theme.colors.background}]}>
				<Suspense fallback={<Progress />}>{props.children}</Suspense>
				{__DEBUG__ && (
					<View
						style={[
							styles.debug,
							{backgroundColor: theme.colors.surfaceContainerHighest},
						]}
					>
						<IconButton
							icon={ICON_ADB}
							mode="standard"
							onPress={() => currentApp().navigate({name: "/dev"})}
						/>
					</View>
				)}
			</View>
		</ThemeContext.Provider>
	);
}

function makeStyles() {
	const styles = StyleSheet.create({
		root: {
			flex: 1,
		},
		debug: {
			top: "50%",
			zIndex: 10000,
			borderRadius: 100,
			position: "absolute",
		},
	});
	return styles;
}

interface MakeStyles<A extends unknown[], T> {
	(theme: Theme, ...args: A): T;
}

let fnIdCounter = 0;
const styleCache = new Map<string, unknown>();
const fnIdMap = new Map<object, number>();

export function useStyles<A extends unknown[], T>(
	makeStyles: MakeStyles<A, T>,
	...args: A
): T {
	const theme = useContext(ThemeContext);
	let fnId = fnIdMap.get(makeStyles) || 0;
	if (fnId == 0) {
		fnId = ++fnIdCounter;
		fnIdMap.set(makeStyles, fnId);
	}
	const key = useMemo(() => {
		return (
			fnId.toString(16) +
			theme.name +
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
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [theme, ...args]);
	let styles = styleCache.get(key);
	if (!styles) {
		styles = makeStyles(theme, ...args);
		styleCache.set(key, styles);
	}
	return styles as T;
}
