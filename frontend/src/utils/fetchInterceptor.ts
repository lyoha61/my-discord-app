import { refreshAccessToken } from "src/services/authService";

const originalFetch = window.fetch;

window.fetch = async function (...args) {
	let response = await originalFetch.apply(this, args);

	if (response.status === 401) {
		await refreshAccessToken();
		response = await originalFetch.apply(this, args);
		
	}

	return response;
}