interface Elevation {
	elevation: number;
	shadowColor: string;
	shadowRadius: number;
	shadowOpacity: number;
	shadowOffset: {width: number; height: number};
}

export interface Elevations {
	level1: Elevation;
	level2: Elevation;
	level3: Elevation;
	level4: Elevation;
	level5: Elevation;
}

export const darkElevations: Elevations = {
	level1: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level2: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level3: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level4: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level5: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
};

export const lightElevations: Elevations = {
	level1: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level2: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level3: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level4: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
	level5: {
		elevation: 4,
		shadowRadius: 4,
		shadowOpacity: 0.4,
		shadowColor: "white",
		shadowOffset: {width: 0, height: 4},
	},
};
