export type TextSize = "small" | "medium" | "large";
export type TextType = "display" | "headline" | "title" | "label" | "body";

export interface Font {
	fontFamily: string;
	letterSpacing: number;
	lineHeight: number;
	fontSize: number;
	fontWeight:
		| "normal"
		| "bold"
		| "100"
		| "200"
		| "300"
		| "400"
		| "500"
		| "600"
		| "700"
		| "800"
		| "900";
	fontStyle: "normal" | "italic";
}

export type Fonts = {
	[key in `${TextType}/${TextSize}`]: Font;
};

export const fonts: Fonts = {
	"display/large": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 57,
		fontFamily: "Roboto",
		lineHeight: 64,
		letterSpacing: -0.25,
	},
	"display/medium": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 45,
		fontFamily: "Roboto",
		lineHeight: 52,
		letterSpacing: 0,
	},
	"display/small": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 36,
		fontFamily: "Roboto",
		lineHeight: 44,
		letterSpacing: 0,
	},
	"headline/large": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 32,
		fontFamily: "Roboto",
		lineHeight: 40,
		letterSpacing: 0,
	},
	"headline/medium": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 28,
		fontFamily: "Roboto",
		lineHeight: 36,
		letterSpacing: 0,
	},
	"headline/small": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 24,
		fontFamily: "Roboto",
		lineHeight: 32,
		letterSpacing: 0,
	},
	"title/large": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 22,
		fontFamily: "Roboto",
		lineHeight: 28,
		letterSpacing: -0.25,
	},
	"title/medium": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 16,
		fontFamily: "Roboto",
		lineHeight: 24,
		letterSpacing: 0.15,
	},
	"title/small": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 14,
		fontFamily: "Roboto",
		lineHeight: 20,
		letterSpacing: 0.1,
	},
	"label/large": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 14,
		fontFamily: "Roboto",
		lineHeight: 20,
		letterSpacing: 0.1,
	},
	"label/medium": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 12,
		fontFamily: "Roboto",
		lineHeight: 16,
		letterSpacing: 0.5,
	},
	"label/small": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 11,
		fontFamily: "Roboto",
		lineHeight: 16,
		letterSpacing: 0.5,
	},
	"body/large": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 16,
		fontFamily: "Roboto",
		lineHeight: 24,
		letterSpacing: 0.5,
	},
	"body/medium": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 14,
		fontFamily: "Roboto",
		lineHeight: 20,
		letterSpacing: 0.25,
	},
	"body/small": {
		fontWeight: "400",
		fontStyle: "normal",
		fontSize: 12,
		fontFamily: "Roboto",
		lineHeight: 16,
		letterSpacing: 0.4,
	},
};
