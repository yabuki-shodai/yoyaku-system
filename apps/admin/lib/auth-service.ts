import { accounts } from "./mock-data";

export function loginWithStaffId(loginId: string, password: string) {
  const normalized = loginId.trim().toLowerCase();
  if (!normalized || !password) return null;
  return accounts.find((account) => account.loginId === normalized) ?? null;
}
