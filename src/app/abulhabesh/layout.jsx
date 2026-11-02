"use client"
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // The login page itself lives at /abulhabesh — don't guard that one,
  // or a logged-out visitor could never reach it to log in.
  const isLoginPage = pathname === '/abulhabesh';

  useEffect(() => {
    if (!loading && !currentUser && !isLoginPage) {
      router.replace('/abulhabesh');
    }
  }, [loading, currentUser, isLoginPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking access...</p>
      </div>
    );
  }

  if (!currentUser && !isLoginPage) {
    return null;
  }

  return <div>{children}</div>;
}
