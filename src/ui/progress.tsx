import {memo, useEffect, useMemo} from "react";
import {Animated, Easing, StyleSheet, View} from "react-native";

import {Theme, useStyles} from "./theme";

interface ProgressProps {
	value?: number;
	absolute?: boolean;
}

function makeAnimated() {
	const value = new Animated.Value(0);
	const width = value.interpolate({
		inputRange: [0.0, 0.5, 1.0],
		outputRange: ["0%", "100%", "0%"],
	});
	const left = value.interpolate({
		inputRange: [0.0, 0.5, 1],
		outputRange: ["0%", "0%", "100%"],
	});
	return {value, left, width};
}

function Indeterminate() {
	const styles = useStyles(makeStyles);
	const {value, left, width} = useMemo(makeAnimated, []);
	useEffect(() => {
		const animation = Animated.loop(
			Animated.sequence([
				Animated.timing(value, {
					toValue: 1,
					duration: 1000,
					easing: Easing.linear,
					useNativeDriver: false,
				}),
			]),
		);
		animation.start();
		return () => animation.stop();
	}, [value]);
	return <Animated.View style={[styles.progress, {left, width}]} />;
}

function Progress({value, absolute}: ProgressProps) {
	const styles = useStyles(makeStyles);
	return (
		<View style={[styles.root, absolute && styles.absolute]}>
			{typeof value !== "number" ? (
				<Indeterminate />
			) : (
				<View style={[styles.progress, {width: `${value * 100}%`}]} />
			)}
		</View>
	);
}

function makeStyles(theme: Theme) {
	const styles = StyleSheet.create({
		root: {
			height: 4,
			backgroundColor: theme.colors.surfaceContainerHighest,
		},
		absolute: {
			left: 0,
			right: 0,
			zIndex: 10,
			position: "absolute",
		},
		progress: {
			height: 4,
			backgroundColor: theme.colors.primary,
		},
	});
	return styles;
}

export default memo(Progress);
