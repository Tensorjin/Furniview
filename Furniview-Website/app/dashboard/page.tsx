'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isLoading: authLoading, session } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?message=Please log in to view the dashboard.');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const newCompanyId = searchParams.get('newCompanyId');
    if (newCompanyId) {
      // You could show a success toast/message here
      console.log(`Successfully created company with ID: ${newCompanyId}`);
      // Optionally, remove the query param from URL to clean it up
      // router.replace('/dashboard', { scroll: false }); 
    }
  }, [searchParams, router]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user session...</p> {/* Or a proper spinner */}
      </div>
    );
  }

  // TODO: Fetch user's companies and display them
  // For now, just a welcome message and a link to create a company if they don't have one (or always show)

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium">Dashboard</h1>
        <Link href="/dashboard/company/create">
            <Button>Create New Company</Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user.email}!</CardTitle>
          <CardDescription>
            This is your main dashboard. From here, you can manage your companies and furniture models.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Future content will include:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground-muted">
            <li>A list of companies you are a member of.</li>
            <li>Quick links to manage furniture models for selected company.</li>
            <li>Notifications or alerts.</li>
          </ul>
          {searchParams.get('newCompanyId') && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md">
              <p className="text-green-700 dark:text-green-300 font-medium">
                Successfully created a new company! 
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 