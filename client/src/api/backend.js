const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

export async function api(path, { method = "GET", body } = {}) {
    const res = await fetch(`${BASE}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) throw new Error("Please log in again");
    if (res.status === 403) throw new Error("Admin access required");
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    return res.status === 204 ? null : res.json();   // mark and unmark return no body
}