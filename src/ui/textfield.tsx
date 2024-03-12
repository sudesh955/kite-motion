import {useRef, useState} from "react";
import {StyleSheet, TextInput, TextInputProps, View, Text} from "react-native";

import {Theme, useStyles} from "./theme";

interface Change {
	value: string;
}

interface Props {
	label?: string;
	value?: string;
	error?: boolean;
	placeholder?: string;
	helperText?: string;
	autoFocus?: boolean;
	secureTextEntry?: boolean;
	onBlur?: () => void;
	onChange?: (change: Change) => void;
	keyboardType?: TextInputProps["keyboardType"];
}

function TextField({
	value,
	label,
	error = false,
	placeholder,
	autoFocus,
	helperText,
	keyboardType,
	onBlur,
	onChange,
	secureTextEntry,
}: Props) {
	const ref = useRef<TextInput>(null);
	const [active, setActive] = useState(false);
	const styles = useStyles(makeStyles, active, error);
	return (
		<View style={styles.root}>
			<View style={styles.textfield}>
				<View style={styles.state}>
					<View style={styles.content}>
						<TextInput
							ref={ref}
							value={value}
							onFocus={() => {
								setActive(true);
							}}
							onBlur={() => {
								if (onBlur) onBlur();
								setActive(false);
							}}
							style={styles.input}
							autoFocus={autoFocus}
							placeholder={placeholder}
							keyboardType={keyboardType}
							secureTextEntry={secureTextEntry}
							onChangeText={onChange && ((value) => onChange({value}))}
						/>
						<Text style={styles.label}>{label}</Text>
					</View>
				</View>
			</View>
			{helperText && <Text style={styles.helperText}>{helperText}</Text>}
		</View>
	);
}

function makeStyles(theme: Theme, active: boolean, error: boolean) {
	const styles = StyleSheet.create({
		root: {
			height: 56,
		},
		textfield: {
			borderRadius: 4,
			borderWidth: active ? 3 : 1,
			borderColor: error
				? theme.colors.error
				: active
					? theme.colors.primary
					: theme.colors.outline,
		},
		state: {
			gap: 16,
			paddingLeft: 16,
			paddingVertical: 4,
			flexDirection: "row",
		},
		content: {
			flex: 1,
			flexDirection: "row",
		},
		label: {
			top: -12,
			left: -4,
			paddingHorizontal: 4,
			position: "absolute",
			...theme.fonts["body/small"],
			backgroundColor: theme.colors.surface,
			color: error ? theme.colors.error : theme.colors.primary,
		},
		input: {
			flex: 1,
			...theme.fonts["body/large"],
			color: theme.colors.onSurface,
		},
		helperText: {
			top: 56,
			left: 0,
			right: 0,
			height: 20,
			paddingTop: 4,
			position: "absolute",
			paddingHorizontal: 16,
			...theme.fonts["body/small"],
			color: error ? theme.colors.error : theme.colors.onSurfaceVariant,
		},
	});
	return styles;
}

export default TextField;
