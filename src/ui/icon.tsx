import {Text, View} from "react-native";

interface Props {
	icon: number;
	size?: number;
	color: string;
}

function Icon({icon, color, size = 24}: Props) {
	const fontFamily = "rtnicon";
	return (
		<View aria-hidden>
			<Text
				style={{
					color,
					fontFamily,
					width: size,
					height: size,
					fontSize: size,
				}}
			>
				{String.fromCodePoint(icon)}
			</Text>
		</View>
	);
}

export default Icon;
