import {useDeferredValue, useMemo, useState} from "react";
import {FlatList, StyleSheet, View} from "react-native";

import KeyValue from "app-native/kv";

import Button from "src/ui/button";
import Text from "src/ui/text";
import TextField from "src/ui/textfield";

function KV() {
	const [prefix, setPrefix] = useState("");
	const query = useDeferredValue(prefix);
	const result = useMemo(() => {
		const startedAt = performance.now();
		const items = KeyValue.read(query, 10, false, null);
		return {items, time: performance.now() - startedAt, query};
	}, [query]);
	const [deleted, setDeleted] = useState<{[key: string]: boolean}>({});
	const items = result.items.filter((item) => !deleted[item.key]);
	return (
		<View style={styles.root}>
			<Button mode="filled" onPress={() => KeyValue.removeAll()}>
				Clean
			</Button>
			<View style={styles.query}>
				<TextField
					label="Prefix"
					helperText="required"
					onChange={({value}) => setPrefix(value)}
				/>
			</View>
			<View style={styles.summary}>
				<Text>
					Query: {JSON.stringify(result.query)} in {result.time}ms
				</Text>
			</View>
			<FlatList
				data={items}
				renderItem={({item}) => (
					<View style={styles.item}>
						<Text type="headline" size="large">
							{item.key}
						</Text>
						<Text>{item.value}</Text>
						<Button
							mode="filled"
							onPress={() => {
								KeyValue.remove(item.key);
								setDeleted((deleted) => ({...deleted, [item.key]: true}));
							}}
						>
							Delete
						</Button>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		gap: 8,
		flex: 1,
	},
	summary: {
		paddingHorizontal: 16,
	},
	query: {
		paddingHorizontal: 16,
		paddingBottom: 20,
	},
	item: {
		gap: 8,
		padding: 16,
	},
});

export default KV;
