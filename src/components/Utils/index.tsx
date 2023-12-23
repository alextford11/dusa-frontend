export async function handleErrors(response: Response): Promise<any> {
    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson && (await response.json());

    if (!response.ok) {
        const error: string = data.detail || response.status.toString();
        return Promise.reject(error);
    }

    return data;
}
