import * as SecureStore from "expo-secure-store";

const AUTH_TOKEN_SECURE_KEY = "auth_token";

export async function getSecureAuthToken(): Promise<string> {
  const value = await SecureStore.getItemAsync(AUTH_TOKEN_SECURE_KEY);
  return value ?? "";
}

export async function persistAuthToken(token: string): Promise<void> {
  if (token.length === 0) {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_SECURE_KEY);
    return;
  }
  await SecureStore.setItemAsync(AUTH_TOKEN_SECURE_KEY, token);
}
