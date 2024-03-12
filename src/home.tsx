import {Key, useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";

import AppGps, {type Location, addLocationListener} from "app-native/gps";

import Text from "src/ui/text";
import {useStyles} from "src/ui/theme";
import {currentApp} from "src/core";

interface Props {
	key?: Key;
}

export async function loader(): Promise<Props> {
	AppGps.startGPS();
	return {};
}

function Home() {
	const styles = useStyles(makeStyles);
	const [state, setState] = useState<Location>();
	useEffect(() => {
		const subscription = addLocationListener((location) => {
			setState(location);
		});
		return () => subscription.remove();
	}, []);
	useEffect(() => {
		return currentApp().block(() => {
			AppGps.stopGPS();
			return false;
		});
	}, []);
	return (
		<View style={styles.root}>
			<Text>{state && JSON.stringify(state, null, 4)}</Text>
		</View>
	);
}

function makeStyles() {
	const styles = StyleSheet.create({
		root: {
			flex: 1,
			padding: 16,
			alignItems: "center",
			justifyContent: "center",
		},
	});
	return styles;
}

export default Home;
