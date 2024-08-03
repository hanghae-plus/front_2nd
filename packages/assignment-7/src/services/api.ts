export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || response.statusText);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

