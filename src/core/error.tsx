import {Component, ReactNode} from "react";

export class AppError extends Error {
	code: string;

	constructor(code: string, message?: string) {
		super(message);
		this.code = code;
	}
}

export function getErrorMessage(
	error: unknown,
	message: string = "Unknown Error",
): string {
	if (!error) {
		return "";
	} else if (error instanceof Error && error.message) {
		return error.message;
	} else {
		return message;
	}
}

export function getErrorCode(error: unknown): string {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		typeof error.code === "string"
	) {
		return error.code;
	} else {
		return "Unknown Error";
	}
}

export function getErrorStack(error: unknown): string {
	if (error instanceof Error) {
		return error.message + "\n" + error.stack;
	} else {
		return "unknown error";
	}
}

interface Props {
	children: ReactNode;
	onCatch: (error: unknown) => ReactNode;
}

export class ErrorBoundary extends Component<Props, {error: ReactNode}> {
	state = {error: null};

	componentDidCatch(error: unknown) {
		this.setState({error: this.props.onCatch(error)});
	}

	render() {
		if (!this.state.error) {
			return this.props.children;
		} else {
			return this.state.error;
		}
	}
}
