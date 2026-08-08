import { supabase } from "./supabaseClient";

// Personal data — stays on this device only (matches the old shared:false behavior)
export function getLocal(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
}

export function setLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

// Shared data — visible to everyone using the app (matches the old shared:true behavior)
export async function getShared(key) {
  try {
    const { data, error } = await supabase
      .from("app_data")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return null;
    return JSON.parse(data.value);
  } catch (e) {
    return null;
  }
}

export async function setShared(key, value) {
  try {
    const { error } = await supabase
      .from("app_data")
      .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
    if (error) throw error;
    return true;
  } catch (e) {
    return false;
  }
}
