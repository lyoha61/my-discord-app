// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<F extends any[]> (
	fn: (...args: F) => void, delay:number
) {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: F) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), delay)
	}
}