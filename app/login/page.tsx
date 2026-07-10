import { Suspense } from 'react';
import { LoginView } from '../../modules/auth/LoginView';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <LoginView />
    </Suspense>
  );
}
