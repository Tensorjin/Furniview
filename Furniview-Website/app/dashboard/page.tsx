'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Building } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  website_url?: string;
}

interface CompanyMembership {
  role: string;
  companies: Company;
}

export default function DashboardPage() {
  const supabase = getSupabaseClient();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userCompanies, setUserCompanies] = useState<CompanyMembership[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?message=Please log in to view the dashboard.');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const newCompanyId = searchParams.get('newCompanyId');
    if (newCompanyId) {
      console.log(`New company with ID: ${newCompanyId} was processed.`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      const fetchUserCompanies = async () => {
        setCompaniesLoading(true);
        setCompaniesError(null);
        try {
          const { data, error } = await supabase
            .from('company_members')
            .select(`
              role,
              companies (id, name, website_url)
            `)
            .eq('user_id', user.id);

          if (error) {
            console.error("Error fetching user companies:", error);
            throw error;
          }
          setUserCompanies(data as CompanyMembership[] || []);
        } catch (e: any) {
          setCompaniesError(e.message || "Failed to load companies.");
        }
        setCompaniesLoading(false);
      };
      fetchUserCompanies();
    }
  }, [user, supabase, searchParams]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-medium">Dashboard</h1>
          <p className="text-foreground-muted">Welcome, {user.email}!</p>
        </div>
        <Link href="/dashboard/company/create">
            <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Company
            </Button>
        </Link>
      </div>
      
      {searchParams.get('newCompanyId') && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <AlertTitle className="text-green-700 dark:text-green-300">Company Created!</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            Your new company has been successfully set up.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Companies</CardTitle>
          <CardDescription>
            Manage your companies and their furniture models from here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companiesLoading && <p>Loading your companies...</p>}
          {companiesError && <p className="text-red-500">Error: {companiesError}</p>}
          {!companiesLoading && !companiesError && userCompanies.length === 0 && (
            <div className="text-center py-8">
                <Building className="mx-auto h-12 w-12 text-foreground-muted mb-4" />
              <p className="mb-4 text-foreground-muted">You are not a member of any companies yet.</p>
              <Link href="/dashboard/company/create">
                <Button variant="outline">Create Your First Company</Button>
              </Link>
            </div>
          )}
          {!companiesLoading && !companiesError && userCompanies.length > 0 && (
            <ul className="space-y-4">
              {userCompanies.map((membership) => (
                <li key={membership.companies.id} className="border p-4 rounded-md hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {membership.companies.name}
                      </h3>
                      {membership.companies.website_url && (
                        <a 
                            href={membership.companies.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {membership.companies.website_url}
                        </a>
                      )}
                      <p className="text-xs text-foreground-muted mt-1">Your role: <span className="font-medium capitalize">{membership.role}</span></p>
                    </div>
                    <div>
                      <Link href={`/dashboard/company/${membership.companies.id}/models`}> 
                        <Button variant="outline" size="sm">Manage Models</Button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 