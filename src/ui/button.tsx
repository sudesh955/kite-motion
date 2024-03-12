import {ReactNode, useContext} from "react";
import {Pressable, StyleSheet, View} from "react-native";

import {Text} from "./text";
import {Theme, ThemeContext, useStyles} from "./theme";
import {opacity} from "./colors";

interface Props {
	label?: string;
	disabled?: boolean;
	children: ReactNode;
	onPress?: () => void;
	mode: "filled" | "text" | "outlined";
}

function ButtonFilled({
	label,
	children,
	onPress,
	disabled = false,
}: Omit<Props, "mode">): ReactNode {
	const styles = useStyles(makeStyles);
	const theme = useContext(ThemeContext);
	if (disabled) {
		return (
			<View style={styles.root} aria-disabled>
				<View
					style={[
						styles.state,
						{backgroundColor: opacity(theme.colors.onSurface, 0.12)},
					]}
				>
					<Text color={theme.colors.onSurface}>{children}</Text>
				</View>
			</View>
		);
	} else {
		const touchColor = opacity(theme.colors.onPrimary, 0.12);
		return (
			<Pressable
				onPress={onPress}
				aria-label={label}
				accessibilityRole="button"
				style={[styles.root, {backgroundColor: theme.colors.primary}]}
			>
				{({pressed}) => (
					<View
						style={[styles.state, pressed && {backgroundColor: touchColor}]}
					>
						<Text color={theme.colors.onPrimary}>{children}</Text>
					</View>
				)}
			</Pressable>
		);
	}
}

function ButtonOutlined({
	label,
	children,
	onPress,
	disabled = false,
}: Omit<Props, "mode">): ReactNode {
	const styles = useStyles(makeStyles);
	const theme = useContext(ThemeContext);
	if (disabled) {
		return (
			<View style={[styles.root, styles.outlinedRoot]} aria-disabled>
				<View
					style={[
						styles.state,
						{backgroundColor: opacity(theme.colors.primary, 0.12)},
					]}
				>
					<Text color={theme.colors.onSurface}>{children}</Text>
				</View>
			</View>
		);
	} else {
		const touchColor = opacity(theme.colors.primary, 0.12);
		return (
			<Pressable
				onPress={onPress}
				aria-label={label}
				accessibilityRole="button"
				style={[styles.root, styles.outlinedRoot]}
			>
				{({pressed}) => (
					<View
						style={[styles.state, pressed && {backgroundColor: touchColor}]}
					>
						<Text color={theme.colors.primary}>{children}</Text>
					</View>
				)}
			</Pressable>
		);
	}
}

function TextButton({
	label,
	onPress,
	children,
	disabled = false,
}: Omit<Props, "mode">): ReactNode {
	const styles = useStyles(makeStyles);
	const theme = useContext(ThemeContext);
	if (disabled) {
		return (
			<View style={styles.root} aria-disabled>
				<View style={styles.state}>
					<Text color={theme.colors.onSurface}>{children}</Text>
				</View>
			</View>
		);
	} else {
		const touchColor = opacity(theme.colors.primary, 0.12);
		return (
			<Pressable
				onPress={onPress}
				aria-label={label}
				style={styles.root}
				accessibilityRole="button"
			>
				{({pressed}) => (
					<View
						style={[styles.state, pressed && {backgroundColor: touchColor}]}
					>
						<Text color={theme.colors.primary}>{children}</Text>
					</View>
				)}
			</Pressable>
		);
	}
}

function Button({mode, onPress, ...props}: Props): ReactNode {
	switch (mode) {
		case "filled":
			return <ButtonFilled onPress={onPress} {...props} />;
		case "text":
			return <TextButton onPress={onPress} {...props} />;
		case "outlined":
			return <ButtonOutlined onPress={onPress} {...props} />;
		default:
			throw new Error("unknown button type");
	}
}

function makeStyles(theme: Theme) {
	const styles = StyleSheet.create({
		root: {
			borderRadius: 100,
			overflow: "hidden",
		},
		outlinedRoot: {
			borderWidth: 1,
			borderColor: theme.colors.outline,
		},
		state: {
			gap: 8,
			paddingVertical: 10,
			paddingHorizontal: 24,
			overflow: "hidden",
			alignItems: "center",
		},
	});
	return styles;
}

export default Button;
