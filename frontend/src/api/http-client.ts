import { API_CONFIG } from "src/config/api";
import type { QueryParams } from "src/types/api";

export interface HttpError extends Error {
	status?: number;
}

class HttpClient {
	private readonly baseURL = API_CONFIG.BASE_URL;

	constructor() {}

	async get<T>(
		endpoint: string, 
		params?: QueryParams
	): Promise<T> {
		let url = `${this.baseURL}/${endpoint}`;

		if (params) {
			const searchParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				searchParams.append(key, String(value));
			});
			url += `?${searchParams.toString()}`
		}

		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`HTTP error! status ${res.status}; error: ${await res.json()}`);

		}

		return await res.json()
	}

	async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
		const res = await fetch(`${this.baseURL}/${endpoint}`, {
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});

		if (!res.ok) {
			const err: HttpError = new Error(`HTTP error! status ${res.status}`);
			err.status = res.status;
			throw err;
		}

		return await res.json()
	}

	async patch<T>(
		endpoint: string, 
		data: Record<string, string | number>
	): Promise<T> {
		const res = await fetch(`${this.baseURL}/${endpoint}` , {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		});

		if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);

		return await res.json();
	}

	async del(endpoint: string): Promise<void> {
		const res = await fetch(`${this.baseURL}/${endpoint}`, {
			method: "DELETE",
		});

		if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
	}
}

export const httpClient = new HttpClient();