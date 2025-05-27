'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/components/auth/auth-provider'
import { getSupabaseClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function CreateCompanyPage() {
  const supabase = getSupabaseClient();
  const { user, isLoading: authLoading, session } = useAuth();
  const router = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyContactEmail, setCompanyContactEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?message=Please log in to create a company.');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!session) {
        setError("No active session. Please log in again.");
        setLoading(false);
        return;
    }

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('create-company-and-assign-admin', {
        body: { 
          companyName,
          companyWebsite,
          companyContactEmail
        },
        // Supabase client automatically includes Authorization header if session is active
        // However, for clarity or if needing specific headers, you can set them:
        // headers: {
        //   Authorization: `Bearer ${session.access_token}`,
        // },
      });

      if (invokeError) {
        console.error("Error invoking Edge Function:", invokeError);
        throw new Error(invokeError.message || 'Failed to invoke company creation function.');
      }

      if (data?.error) {
        console.error("Error from Edge Function execution:", data.error, data.details);
        throw new Error(data.details || data.error || 'An error occurred during company creation.');
      }
      
      if (data?.success && data.companyId) {
        setMessage(`Company '${companyName}' created successfully! Redirecting...`);
        setCompanyName('');
        setCompanyWebsite('');
        setCompanyContactEmail('');
        // TODO: Redirect to the new company's dashboard or a general dashboard
        // For now, redirecting to a generic dashboard page. We'll create this next.
        router.push(`/dashboard?newCompanyId=${data.companyId}`); 
      } else {
        throw new Error('Company creation did not return expected success state or company ID.');
      }

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    }
    setLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user session...</p> {/* Or a proper spinner */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background-subtle px-4 py-12 pt-24">
      <Card className="w-full max-w-lg shadow-xl animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium">Create Your Company</CardTitle>
          <CardDescription>
            Set up your company on Furniview to start managing your 3D furniture models.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Your Company Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={loading}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
              <Input
                id="companyWebsite"
                type="url"
                placeholder="https://yourcompany.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                disabled={loading}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyContactEmail">Contact Email (Optional)</Label>
              <Input
                id="companyContactEmail"
                type="email"
                placeholder="contact@yourcompany.com"
                value={companyContactEmail}
                onChange={(e) => setCompanyContactEmail(e.target.value)}
                disabled={loading}
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full text-base py-3" disabled={loading || !companyName.trim()}>
              {loading ? 'Creating Company...' : 'Create Company'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm min-h-[40px]">
          {message && <p className="text-green-600 dark:text-green-500 animate-fade-in">{message}</p>}
          {error && <p className="text-red-600 dark:text-red-500 animate-fade-in">{error}</p>}
          {!loading && !error && !message && (
             <p className="text-xs text-foreground-muted">
              Already have a company? Go to your <Link href="/dashboard" className="underline hover:text-primary">Dashboard</Link>.
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
} 