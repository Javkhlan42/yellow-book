export const signIn = () => Promise.resolve();
export const signOut = () => Promise.resolve();
export const useSession = () => ({
  data: null,
  status: 'unauthenticated' as const,
});

export const SessionProvider = ({ children }: { children: any }) => children;
