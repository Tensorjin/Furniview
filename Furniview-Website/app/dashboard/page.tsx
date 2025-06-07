'use client'

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Building, PackageSearch } from 'lucide-react';
import { AddModelDialog } from '@/components/dashboard/add-model-dialog';

interface Company {
  id: string;
  name: string;
  website_url?: string;
}

interface CompanyMembership {
  role: string;
  companies: Company;
}

interface FurnitureModel {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  company_id: string;
  created_by_user_id: string;
  model_file_path?: string | null;
}

export default function DashboardPage() {
  const supabase = getSupabaseClient();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userCompanies, setUserCompanies] = useState<CompanyMembership[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const [models, setModels] = useState<FurnitureModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);

  const [isAddModelDialogOpen, setIsAddModelDialogOpen] = useState(false);

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
          const companiesData = data as CompanyMembership[] || [];
          setUserCompanies(companiesData);
          if (!selectedCompanyId && companiesData.length > 0 && companiesData[0].companies) {
            setSelectedCompanyId(companiesData[0].companies.id);
          }
        } catch (e: any) {
          setCompaniesError(e.message || "Failed to load companies.");
        }
        setCompaniesLoading(false);
      };
      fetchUserCompanies();
    }
  }, [user, supabase, searchParams, selectedCompanyId]);

  const fetchModels = useCallback(async () => {
    if (selectedCompanyId && user) {
      setModelsLoading(true);
      setModelsError(null);
      try {
        const { data, error } = await supabase
          .from('furniture_models')
          .select('*')
          .eq('company_id', selectedCompanyId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setModels(data as FurnitureModel[] || []);
      } catch (e: any) {
        setModelsError(e.message || "Failed to load models.");
        setModels([]);
      }
      setModelsLoading(false);
    } else {
      setModels([]);
    }
  }, [selectedCompanyId, user, supabase]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleModelAdded = () => {
    fetchModels();
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user session...</p>
      </div>
    );
  }
  
  const selectedCompanyName = userCompanies.find(c => c.companies?.id === selectedCompanyId)?.companies?.name;

  return (
    <>
      <div className="container mx-auto px-4 py-12 pt-20 sm:pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-foreground-muted">Welcome back, {user.email?.split('@')[0]}!</p>
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
              Your new company has been successfully set up. You can now manage its models.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
              <Card>
                  <CardHeader>
                  <CardTitle>Your Companies</CardTitle>
                  <CardDescription>
                      Select a company to manage its models.
                  </CardDescription>
                  </CardHeader>
                  <CardContent>
                  {companiesLoading && <p>Loading your companies...</p>}
                  {companiesError && <p className="text-red-500">Error: {companiesError}</p>}
                  {!companiesLoading && !companiesError && userCompanies.length === 0 && (
                      <div className="text-center py-8">
                          <Building className="mx-auto h-12 w-12 text-foreground-muted mb-4" />
                      <p className="mb-4 text-foreground-muted">No companies found.</p>
                      <Link href="/dashboard/company/create">
                          <Button variant="outline">Create Your First Company</Button>
                      </Link>
                      </div>
                  )}
                  {!companiesLoading && !companiesError && userCompanies.length > 0 && (
                      <ul className="space-y-3">
                      {userCompanies.map((membership) => (
                          <li key={membership.companies.id}>
                              <Button 
                                  variant={selectedCompanyId === membership.companies.id ? "secondary" : "ghost"}
                                  className="w-full justify-start text-left h-auto py-3 px-4"
                                  onClick={() => setSelectedCompanyId(membership.companies.id)}
                              >
                                  <div>
                                      <h3 className="font-semibold text-md">
                                          {membership.companies.name}
                                      </h3>
                                      <p className="text-xs text-foreground-muted capitalize">Your role: {membership.role}</p>
                                  </div>
                              </Button>
                          </li>
                      ))}
                      </ul>
                  )}
                  </CardContent>
              </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedCompanyId ? (
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                      <CardTitle>Models for {selectedCompanyName || 'Selected Company'}</CardTitle>
                      <CardDescription>View, add, or manage 3D models for this company.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setIsAddModelDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add New Model
                  </Button>
                </CardHeader>
                <CardContent>
                  {modelsLoading && <p>Loading models...</p>}
                  {modelsError && <p className="text-red-500">Error: {modelsError}</p>}
                  {!modelsLoading && !modelsError && models.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-border rounded-md">
                      <PackageSearch className="mx-auto h-12 w-12 text-foreground-muted mb-4" />
                      <p className="text-foreground-muted mb-3">No models found for {selectedCompanyName}.</p>
                      <Button variant="outline" size="sm" onClick={() => setIsAddModelDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add First Model
                      </Button>
                    </div>
                  )}
                  {!modelsLoading && !modelsError && models.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {models.map((model) => (
                        <Card key={model.id} className="flex flex-col">
                          <CardHeader>
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-sm text-foreground-muted line-clamp-3">{model.description || 'No description available.'}</p>
                            {model.model_file_path && <p className="text-xs mt-2 text-blue-500 truncate">File: {model.model_file_path.split('/').pop()}</p>}
                          </CardContent>
                          <CardFooter className="mt-auto flex justify-between items-center">
                            <Button variant="outline" size="xs">View/Edit</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : companiesLoading ? null : (
              <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-border rounded-md min-h-[300px]">
                  <Building className="mx-auto h-12 w-12 text-foreground-muted mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Company</h3>
                  <p className="text-foreground-muted">
                      {userCompanies.length > 0 ? 
                          'Please select a company from the list on the left to view its furniture models.' : 
                          'Create or join a company to start managing furniture models.'
                      }
                  </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedCompanyId && (
        <AddModelDialog 
          isOpen={isAddModelDialogOpen}
          onOpenChange={setIsAddModelDialogOpen}
          companyId={selectedCompanyId}
          companyName={selectedCompanyName}
          onModelAdded={handleModelAdded}
        />
      )}
    </>
  );
} 