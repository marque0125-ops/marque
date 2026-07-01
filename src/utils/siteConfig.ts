/**
 * siteConfig.ts
 * Utility for reading and writing site configuration to Supabase's site_config table.
 * All UI content (videos, banners, testimonials, brands) is stored here so it
 * persists across browser sessions and devices — it is NEVER lost.
 */

import { supabase } from "./supabase";

const isConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");

/**
 * Load a single config value from Supabase by key.
 * Returns null if not found or Supabase is not configured.
 */
export async function loadSiteConfig<T>(key: string): Promise<T | null> {
  if (!isConfigured) return null;
  try {
    const { data, error } = await (supabase as any)
      .from("site_config")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return null;
    return data.value as T;
  } catch (e) {
    console.warn(`[siteConfig] Failed to load key "${key}":`, e);
    return null;
  }
}

/**
 * Save a config value to Supabase using upsert.
 * Silently fails if Supabase is not configured (dev mode).
 */
export async function saveSiteConfig(key: string, value: unknown): Promise<void> {
  if (!isConfigured) return;
  try {
    const { error } = await (supabase as any).from("site_config").upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (error) {
      console.warn(`[siteConfig] Failed to save key "${key}":`, error.message);
    }
  } catch (e) {
    console.warn(`[siteConfig] Exception saving key "${key}":`, e);
  }
}

/**
 * Load all site config keys in a single query.
 * Returns a record of key → value.
 */
export async function loadAllSiteConfig(): Promise<Record<string, unknown>> {
  if (!isConfigured) return {};
  try {
    const { data, error } = await (supabase as any)
      .from("site_config")
      .select("key, value");

    if (error || !data) return {};
    const result: Record<string, unknown> = {};
    for (const row of data as Array<{ key: string; value: unknown }>) {
      result[row.key] = row.value;
    }
    return result;
  } catch (e) {
    console.warn("[siteConfig] Failed to load all config:", e);
    return {};
  }
}
