export type Locale = "hindi" | "english";
export type Locales<T> = {key: Locale; value: T}[];
export const languages: Locales<string> = [
	{key: "hindi", value: "Hindi"},
	{key: "english", value: "English"},
];

export function getLocale<T>(locales: Locales<T>, key: Locale) {
	for (let i = 0; i < locales.length; i++) {
		if (locales[i].key === key) {
			return locales[i].value;
		}
	}
	return locales[0].value;
}

export function setLocale<T>(
	locales: Locales<T>,
	key: Locale,
	value: T,
): Locales<T> {
	const next = [...locales];
	for (let i = 0; i < locales.length; i++) {
		if (locales[i].key === key) {
			next[i] = {key, value};
			return next;
		}
	}
	next.push({key, value});
	return next;
}

export function useLocale(): Locale {
	return "english";
}

export function currentLocale(): Locale {
	return "english";
}
