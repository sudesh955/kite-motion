import {invariant} from "src/core";

export interface Colors {
	primary: string;
	onPrimary: string;
	primaryContainer: string;
	onPrimaryContainer: string;
	primaryFixed: string;
	onPrimaryFixed: string;
	primaryFixedDim: string;
	onPrimaryFixedVariant: string;
	secondary: string;
	onSecondary: string;
	secondaryContainer: string;
	onSecondaryContainer: string;
	secondaryFixed: string;
	onSecondaryFixed: string;
	secondaryFixedDim: string;
	onSecondaryFixedVariant: string;
	tertiary: string;
	onTertiary: string;
	tertiaryContainer: string;
	onTertiaryContainer: string;
	tertiaryFixed: string;
	onTertiaryFixed: string;
	tertiaryFixedDim: string;
	onTertiaryFixedVariant: string;
	error: string;
	onError: string;
	errorContainer: string;
	onErrorContainer: string;
	outline: string;
	background: string;
	onBackground: string;
	surface: string;
	onSurface: string;
	surfaceVariant: string;
	onSurfaceVariant: string;
	inverseSurface: string;
	inverseOnSurface: string;
	inversePrimary: string;
	shadow: string;
	surfaceTint: string;
	outlineVariant: string;
	scrim: string;
	surfaceContainerHighest: string;
	surfaceContainerHigh: string;
	surfaceContainer: string;
	surfaceContainerLow: string;
	surfaceContainerLowest: string;
	surfaceBright: string;
	surfaceDim: string;
}

export const lightColors: Colors = {
	primary: "#68548E",
	surfaceTint: "#68548E",
	onPrimary: "#FFFFFF",
	primaryContainer: "#EBDDFF",
	onPrimaryContainer: "#230F46",
	secondary: "#635B70",
	onSecondary: "#FFFFFF",
	secondaryContainer: "#E9DEF8",
	onSecondaryContainer: "#1F182B",
	tertiary: "#7E525D",
	onTertiary: "#FFFFFF",
	tertiaryContainer: "#FFD9E1",
	onTertiaryContainer: "#31101B",
	error: "#BA1A1A",
	onError: "#FFFFFF",
	errorContainer: "#FFDAD6",
	onErrorContainer: "#410002",
	background: "#FEF7FF",
	onBackground: "#1D1B20",
	surface: "#FEF7FF",
	onSurface: "#1D1B20",
	surfaceVariant: "#E7E0EB",
	onSurfaceVariant: "#49454E",
	outline: "#7A757F",
	outlineVariant: "#CBC4CF",
	shadow: "#000000",
	scrim: "#000000",
	inverseSurface: "#322F35",
	inverseOnSurface: "#F5EFF7",
	inversePrimary: "#D3BCFD",
	primaryFixed: "#EBDDFF",
	onPrimaryFixed: "#230F46",
	primaryFixedDim: "#D3BCFD",
	onPrimaryFixedVariant: "#4F3D74",
	secondaryFixed: "#E9DEF8",
	onSecondaryFixed: "#1F182B",
	secondaryFixedDim: "#CDC2DB",
	onSecondaryFixedVariant: "#4B4358",
	tertiaryFixed: "#FFD9E1",
	onTertiaryFixed: "#31101B",
	tertiaryFixedDim: "#F0B7C5",
	onTertiaryFixedVariant: "#643B46",
	surfaceDim: "#DED8E0",
	surfaceBright: "#FEF7FF",
	surfaceContainerLowest: "#FFFFFF",
	surfaceContainerLow: "#F8F1FA",
	surfaceContainer: "#F2ECF4",
	surfaceContainerHigh: "#EDE6EE",
	surfaceContainerHighest: "#E7E0E8",
};

export const darkColors: Colors = {
	primary: "#D3BCFD",
	surfaceTint: "#D3BCFD",
	onPrimary: "#38265C",
	primaryContainer: "#4F3D74",
	onPrimaryContainer: "#EBDDFF",
	secondary: "#CDC2DB",
	onSecondary: "#342D40",
	secondaryContainer: "#4B4358",
	onSecondaryContainer: "#E9DEF8",
	tertiary: "#F0B7C5",
	onTertiary: "#4A2530",
	tertiaryContainer: "#643B46",
	onTertiaryContainer: "#FFD9E1",
	error: "#FFB4AB",
	onError: "#690005",
	errorContainer: "#93000A",
	onErrorContainer: "#FFDAD6",
	background: "#151218",
	onBackground: "#E7E0E8",
	surface: "#151218",
	onSurface: "#E7E0E8",
	surfaceVariant: "#49454E",
	onSurfaceVariant: "#CBC4CF",
	outline: "#948F99",
	outlineVariant: "#49454E",
	shadow: "#000000",
	scrim: "#000000",
	inverseSurface: "#E7E0E8",
	inverseOnSurface: "#322F35",
	inversePrimary: "#68548E",
	primaryFixed: "#EBDDFF",
	onPrimaryFixed: "#230F46",
	primaryFixedDim: "#D3BCFD",
	onPrimaryFixedVariant: "#4F3D74",
	secondaryFixed: "#E9DEF8",
	onSecondaryFixed: "#1F182B",
	secondaryFixedDim: "#CDC2DB",
	onSecondaryFixedVariant: "#4B4358",
	tertiaryFixed: "#FFD9E1",
	onTertiaryFixed: "#31101B",
	tertiaryFixedDim: "#F0B7C5",
	onTertiaryFixedVariant: "#643B46",
	surfaceDim: "#151218",
	surfaceBright: "#3B383E",
	surfaceContainerLowest: "#0F0D13",
	surfaceContainerLow: "#1D1B20",
	surfaceContainer: "#211F24",
	surfaceContainerHigh: "#2C292F",
	surfaceContainerHighest: "#36343A",
};

export function opacity(color: string, alpha: number): string {
	invariant(color.length === 7);
	return (
		color +
		Math.round(alpha * 255)
			.toString(16)
			.padStart(2, "0")
	);
}
