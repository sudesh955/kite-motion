import {ReactNode, createContext} from "react";

import {Locale} from "./locale";

const strings: {[locale in Locale]: {[key: string]: undefined | string}} = {
	hindi: {},
	english: {},
};

interface Translator {
	locale: Locale;
	(key: string): string;
	t(key: string, ...args: ReactNode[]): ReactNode;
}

export function createTranslator(locale: Locale): Translator {
	const translations = strings[locale];
	const translator: Translator = (key: string) => {
		return translations[key] || key;
	};
	translator.t = (key: string, ...args: ReactNode[]) => {
		key = translations[key] || key;
		const splits = key.split(/{(\d+)}/);
		const result: ReactNode[] = new Array(splits.length);
		const length = (splits.length - 1) / 2;
		for (let i = 0; i < length; i++) {
			result[2 * i] = splits[2 * i];
			const index = splits[2 * i + 1];
			result[2 * i + 1] = args[parseInt(index, 10)] || index;
		}
		result[2 * length + 1] = splits[2 * length + 1];
		return result;
	};
	translator.locale = locale;
	return translator;
}

export const TranslatorContext = createContext<Translator>(
	createTranslator("english"),
);
