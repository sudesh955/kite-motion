import {useContext} from "react";
import {Pressable, PressableProps, StyleSheet, View} from "react-native";

import Icon from "./icon";
import {Theme, ThemeContext, useStyles} from "./theme";
import {opacity} from "./colors";

interface Props {
	size?: number;
	icon: number;
	scale?: number;
	label?: string;
	color?: string;
	onPress?: () => void;
	mode: "filled" | "standard";
}

function IconButtonRoot(props: {
	label?: string;
	touchColor: string;
	onPress?: () => void;
	scale?: number;
	children: PressableProps["children"];
}) {
	const styles = useStyles(makeStyles, props.scale || 1);
	return (
		<Pressable
			style={styles.root}
			onPress={props.onPress}
			aria-label={props.label}
			accessibilityRole="button"
		>
			{props.children}
		</Pressable>
	);
}

function IconButtonStandard({icon, size, ...props}: Omit<Props, "mode">) {
	const styles = useStyles(makeStyles, props.scale || 1);
	const theme = useContext(ThemeContext);
	const touchColor = opacity(theme.colors.onSurface, 0.12);
	return (
		<IconButtonRoot touchColor={touchColor} {...props}>
			{({pressed}) => (
				<View style={styles.container}>
					<View
						style={[styles.state, pressed && {backgroundColor: touchColor}]}
					>
						<Icon
							icon={icon}
							size={size}
							color={props.color || theme.colors.onSurfaceVariant}
						/>
					</View>
				</View>
			)}
		</IconButtonRoot>
	);
}

function IconButtonFilled({
	icon,
	size,
	...props
}: Omit<Props, "mode">): JSX.Element {
	const styles = useStyles(makeStyles, props.scale || 1);
	const theme = useContext(ThemeContext);
	const touchColor = opacity(theme.colors.onPrimary, 0.12);
	return (
		<IconButtonRoot {...props} touchColor={touchColor}>
			{({pressed}) => (
				<View
					style={[styles.container, {backgroundColor: theme.colors.primary}]}
				>
					<View
						style={[styles.state, pressed && {backgroundColor: touchColor}]}
					>
						<Icon
							size={size}
							icon={icon}
							color={props.color || theme.colors.onPrimary}
						/>
					</View>
				</View>
			)}
		</IconButtonRoot>
	);
}

function IconButton({mode, onPress, ...props}: Props): JSX.Element {
	switch (mode) {
		case "filled":
			return <IconButtonFilled onPress={onPress} {...props} />;
		case "standard":
			return <IconButtonStandard onPress={onPress} {...props} />;
	}
}

function makeStyles(_: Theme, scale: number) {
	const styles = StyleSheet.create({
		root: {
			width: 48,
			height: 48,
			padding: 4,
			borderRadius: 24,
			overflow: "hidden",
			transform: [{scale}],
		},
		container: {
			borderRadius: 20,
			overflow: "hidden",
		},
		state: {
			padding: 8,
			borderRadius: 20,
			alignItems: "center",
			justifyContent: "center",
		},
	});
	return styles;
}

export default IconButton;
