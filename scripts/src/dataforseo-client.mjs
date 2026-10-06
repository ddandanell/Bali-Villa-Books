// Server-side tooling only. Never import this module into the browser bundle.
export function dataforseoAuthorization(env = process.env) {
  const login = env.DATAFORSEO_LOGIN?.trim() ?? "";
  const password = env.DATAFORSEO_PASSWORD?.trim() ?? "";
  // Accept the dashboard's complete Base64 credential in either secure field.
  // This avoids encoding an already encoded login:password pair a second time.
  for (const value of [password, login]) {
    const encoded = value.replace(/^Basic\s+/i, "");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) continue;
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    if (/^[^\s@:]+@[^\s@:]+\.[^\s@:]+:[^\r\n]+$/.test(decoded)) {
      return `Basic ${Buffer.from(decoded).toString("base64")}`;
    }
  }
  if (!/^[^\s@:]+@[^\s@:]+\.[^\s@:]+$/.test(login) || !password) {
    throw new Error("DataForSEO requires an API email and password, or a complete Base64 credential in Secrets.");
  }
  return `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`;
}

export async function dataforseoRequest(path, body) {
  if (!/^(appendix\/user_data|keywords_data\/google_ads\/search_volume\/live|dataforseo_labs\/google\/(?:keyword_suggestions|ranked_keywords)\/live|serp\/google\/organic\/live\/advanced)$/.test(path)) {
    throw new Error("Unsupported research endpoint");
  }
  const response = await fetch(`https://api.dataforseo.com/v3/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: dataforseoAuthorization(), "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(90000),
  });
  const result = await response.json();
  if (!response.ok || result.status_code !== 20000) {
    throw new Error(`DataForSEO rejected the request: HTTP ${response.status}, code ${result.status_code}`);
  }
  for (const task of result.tasks ?? []) {
    if (task.status_code !== 20000) throw new Error(`DataForSEO task failed: code ${task.status_code}`);
  }
  return result;
}
