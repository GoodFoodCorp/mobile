import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Session tokens, kept in the platform's secure storage (iOS Keychain,
 * Android Keystore) rather than in AsyncStorage, which is plain text on the
 * device. On the web build (development only) SecureStore does not exist and
 * AsyncStorage is used instead.
 */
const ACCESS_TOKEN_KEY = "goodfood_auth_token";
const REFRESH_TOKEN_KEY = "goodfood_refresh_token";
/** Keys used by versions that stored tokens in AsyncStorage. */
const LEGACY_KEYS = ["@goodfood_auth_token", "@goodfood_refresh_token"];

const secure = Platform.OS !== "web";

async function read(key: string): Promise<string | null> {
  return secure ? SecureStore.getItemAsync(key) : AsyncStorage.getItem(key);
}

async function write(key: string, value: string): Promise<void> {
  if (secure) await SecureStore.setItemAsync(key, value);
  else await AsyncStorage.setItem(key, value);
}

async function remove(key: string): Promise<void> {
  if (secure) await SecureStore.deleteItemAsync(key);
  else await AsyncStorage.removeItem(key);
}

let migrated = false;

/** Moves tokens left in AsyncStorage by older versions into secure storage. */
async function migrateLegacyTokens(): Promise<void> {
  if (migrated || !secure) return;
  migrated = true;
  const [[, access], [, refresh]] = await AsyncStorage.multiGet(LEGACY_KEYS);
  if (access && !(await read(ACCESS_TOKEN_KEY))) await write(ACCESS_TOKEN_KEY, access);
  if (refresh && !(await read(REFRESH_TOKEN_KEY))) await write(REFRESH_TOKEN_KEY, refresh);
  await AsyncStorage.multiRemove(LEGACY_KEYS);
}

export const tokenStore = {
  async getAccessToken(): Promise<string | null> {
    await migrateLegacyTokens();
    return read(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    await migrateLegacyTokens();
    return read(REFRESH_TOKEN_KEY);
  },

  async save(accessToken: string, refreshToken?: string | null): Promise<void> {
    await write(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) await write(REFRESH_TOKEN_KEY, refreshToken);
  },

  async clear(): Promise<void> {
    await Promise.all([remove(ACCESS_TOKEN_KEY), remove(REFRESH_TOKEN_KEY)]);
    await AsyncStorage.multiRemove(LEGACY_KEYS);
  },
};
