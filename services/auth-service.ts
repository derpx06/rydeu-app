import * as SecureStore from 'expo-secure-store';
import type { AuthSession, AuthUser, LoginCredentials } from '@/types';

export { type AuthSession, type AuthUser, type LoginCredentials };

const SESSION_KEY = 'rydeu_session';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const asString = (value: unknown) => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim();
  if (typeof value === 'number') return String(value);
  return undefined;
};

export async function restoreStoredSession(): Promise<AuthSession | null> {
  try {
    const sessionJson = await SecureStore.getItemAsync(SESSION_KEY);
    if (!sessionJson) return null;

    const session = JSON.parse(sessionJson) as AuthSession;

    if (!isRecord(session.user) || !asString(session.token)) {
      await clearStoredSession();
      return null;
    }

    const token = asString(session.token);
    if (!token) {
      await clearStoredSession();
      return null;
    }

    return {
      token,
      user: {
        id: asString(session.user.id),
        name: asString(session.user.name),
        email: asString(session.user.email),
        firstName: asString(session.user.firstName),
        lastName: asString(session.user.lastName),
        userType: typeof session.user.userType === 'number' ? session.user.userType : undefined,
        verified: typeof session.user.verified === 'boolean' ? session.user.verified : undefined,
        mobileNo: typeof session.user.mobileNo === 'string' ? session.user.mobileNo : null,
        organization: isRecord(session.user.organization) ? session.user.organization : undefined,
      },
    };
  } catch (error) {
    await clearStoredSession();
    return null;
  }
}

export async function loginCustomer({ email, password, type }: LoginCredentials) {
  try {
    const response = await fetch('https://api-staging.rydeu.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        type,
      }),
    });

    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(data.message || 'Login failed');
    }

    const userData = data.data.user;
    const account = userData.account || {};
    const organization = account.organization || {};

    const session: AuthSession = {
      token: data.data.token,
      user: {
        id: userData.id,
        email: userData.email,
        firstName: account.firstName,
        lastName: account.lastName,
        name: `${account.firstName || ''} ${account.lastName || ''}`.trim() || 'Rydeu Customer',
        userType: userData.userType,
        verified: userData.verified,
        mobileNo: userData.mobileNo,
        organization: {
          id: organization.id,
          companyName: organization.companyName,
          domainName: organization.domainName,
          country: organization.country,
          city: organization.city,
          orgCreditProfile: organization.orgCreditProfile,
        },
      },
    };

    await persistSession(session);
    return session;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
  }
}

export async function persistSession(session: AuthSession) {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to persist session:', error);
  }
}

export async function clearStoredSession() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}
