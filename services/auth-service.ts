export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
};

let activeSession: AuthSession | null = null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown) => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  if (typeof value === 'number') return String(value);
  return undefined;
};

export async function restoreStoredSession() {
  if (!activeSession) return null;

  if (!isRecord(activeSession.user) || !asString(activeSession.token)) {
    await clearStoredSession();
    return null;
  }

  return {
    token: activeSession.token,
    user: {
      id: asString(activeSession.user.id),
      name: asString(activeSession.user.name),
      email: asString(activeSession.user.email),
    },
  };
}

export async function loginCustomer({ email }: LoginCredentials) {
  const session = {
    token: `local-session-${Date.now()}`,
    user: {
      id: 'local-customer',
      name: 'Rydeu Customer',
      email,
    },
  };

  await persistSession(session);
  return session;
}

export async function persistSession(session: AuthSession) {
  activeSession = session;
}

export async function clearStoredSession() {
  activeSession = null;
}
