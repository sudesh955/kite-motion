import {ReactNode} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {TextSize, TextType} from "src/ui/font";
import Text from "src/ui/text";

function KV() {
	const sizes: TextSize[] = ["large", "medium", "small"];
	const types: TextType[] = ["display", "headline", "title", "label", "body"];
	const items: ReactNode[] = [];
	for (const type of types) {
		for (const size of sizes) {
			items.push(
				<Text key={type + size} size={size} type={type}>
					{type}-{size}
				</Text>,
			);
		}
	}
	return (
		<ScrollView>
			<View style={styles.content}>{items}</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: 16,
		padding: 16,
	},
});

export default KV;
