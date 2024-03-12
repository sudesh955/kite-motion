class InvariantError extends Error {}

export function invariant(condition: unknown, msg?: string): asserts condition {
	if (!condition) {
		throw new InvariantError(msg);
	}
}
