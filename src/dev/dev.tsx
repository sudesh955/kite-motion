import {ScrollView, StyleSheet, View} from "react-native";

import {currentApp} from "src/core";
import {homePath} from "src/paths/paths";
import Button from "src/ui/button";
import {useStyles} from "src/ui/theme";

function DevTools() {
	const styles = useStyles(makeStyles);
	return (
		<ScrollView>
			<View style={styles.content}>
				<Button
					mode="filled"
					onPress={() => currentApp().navigate({name: "/dev/kv"})}
				>
					KV
				</Button>
				<Button
					mode="filled"
					onPress={() => currentApp().navigate({name: "/dev/ui/text"})}
				>
					Text
				</Button>
				<Button
					mode="filled"
					onPress={() => currentApp().navigate({name: "/dev/ui/skia"})}
				>
					Skia
				</Button>
				<Button
					mode="filled"
					onPress={() => currentApp().restart(homePath.location(null))}
				>
					Restart
				</Button>
			</View>
		</ScrollView>
	);
}

function makeStyles() {
	const styles = StyleSheet.create({
		content: {
			gap: 16,
			padding: 16,
		},
	});
	return styles;
}

export default DevTools;
