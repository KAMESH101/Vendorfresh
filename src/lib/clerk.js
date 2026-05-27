export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if Clerk publishable key is a placeholder or mock developmental credential
export const isMockAuth = !clerkPubKey || clerkPubKey.includes('mock');
