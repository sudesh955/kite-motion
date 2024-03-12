import {Text as NativeText, TextStyle as NativeTextStyle} from "react-native";
import {ReactNode, useContext} from "react";
import {ThemeContext} from "./theme";
import {TextSize, TextType, fonts} from "./font";

export interface TextProps {
	type?: TextType;
	size?: TextSize;
	align?: NativeTextStyle["textAlign"];

	color?: string;
	children: ReactNode;
}

export function Text(props: TextProps) {
	const theme = useContext(ThemeContext);
	const {
		type = "body",
		size = "medium",
		align: textAlign,
		color = theme.colors.onBackground,
		children,
	} = props;
	const font = fonts[`${type}/${size}`];
	return <NativeText style={[{color, textAlign}, font]}>{children}</NativeText>;
}

export default Text;
