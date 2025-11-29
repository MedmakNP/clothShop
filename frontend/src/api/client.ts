export const API_URL = "https://clothshop-backend.onrender.com";

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${res.statusText}\n${text}`);
  }
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
  });
  return handleJson<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleJson<T>(res);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return handleJson<T>(res);
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Delete failed: ${res.status} ${res.statusText}\n${text}`);
  }
}

/** Завантаження картинки через твій бекенд → Supabase */
export async function apiUploadImage(
  file: File,
  folder = "products"
): Promise<{ url: string; path: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await fetch(`${API_URL}/upload/image`, {
    method: "POST",
    body: form,
  });

  return handleJson<{ url: string; path: string }>(res);
}