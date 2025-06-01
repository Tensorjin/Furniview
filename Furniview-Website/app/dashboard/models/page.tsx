'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Company {
  id: string;
  name: string;
  website_url?: string | null;
}

interface CompanyMember {
  role: string;
  companies: Company;
}

export default function ManageModelsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userCompanies, setUserCompanies] = useState<CompanyMember[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } else if (data.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, [supabase, router]);

  useEffect(() => {
    if (user) {
      const fetchUserCompanies = async () => {
        setLoadingCompanies(true);
        const { data, error } = await supabase
          .from('company_members')
          .select('role, companies(id, name, website_url)')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user companies:', error);
          setUserCompanies([]);
        } else if (data) {
          setUserCompanies(data as CompanyMember[]);
          if (data.length > 0 && data[0].companies) {
            setSelectedCompanyId(data[0].companies.id);
          }
        }
        setLoadingCompanies(false);
      };
      fetchUserCompanies();
    }
  }, [user, supabase]);

  if (loadingUser || loadingCompanies) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!user) {
    return null; // Should have been redirected
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Furniture Models</CardTitle>
          <CardDescription>
            Select a company to view and manage its furniture models.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userCompanies.length === 0 && (
            <p>You are not a member of any company yet. <a href="/dashboard/company/create" className="text-blue-600 hover:underline">Create one?</a></p>
          )}
          {userCompanies.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="company-select">Select Company:</Label>
              <Select
                value={selectedCompanyId || ''}
                onValueChange={(value) => setSelectedCompanyId(value)}
              >
                <SelectTrigger id="company-select">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {userCompanies.map((member) => (
                    member.companies && (
                      <SelectItem key={member.companies.id} value={member.companies.id}>
                        {member.companies.name}
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedCompanyId && (
            <div>
              {/* Placeholder for listing models and create model form/button */}
              <p>Models for company ID: {selectedCompanyId} will be listed here.</p>
              <Button className="mt-4">Add New Model</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 