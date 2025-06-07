'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseClient } from '@/lib/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface AddModelDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  companyId: string | null;
  companyName?: string;
  onModelAdded: () => void; // Callback to refresh model list
}

export function AddModelDialog({ 
    isOpen, onOpenChange, companyId, companyName, onModelAdded 
}: AddModelDialogProps) {
  const supabase = getSupabaseClient();

  const [modelName, setModelName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated string
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setModelFile(event.target.files[0]);
    }
  };

  const resetForm = () => {
    setModelName('');
    setDescription('');
    setTags('');
    setModelFile(null);
    setError(null);
    setSuccessMessage(null);
    // onOpenChange(false); // Close dialog on successful submission if desired
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!modelFile || !companyId || !modelName.trim()) {
      setError("Model name and model file are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('companyId', companyId);
    formData.append('modelName', modelName.trim());
    if (description.trim()) formData.append('description', description.trim());
    if (tags.trim()) formData.append('tags', tags.trim());
    formData.append('modelFile', modelFile);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'upload-furniture-model',
        { body: formData }
      );

      if (invokeError) throw invokeError;
      if (data.error) throw new Error(data.details || data.error);

      if (data.success && data.model) {
        setSuccessMessage(`Model '${data.model.name}' added successfully!`);
        onModelAdded(); // Trigger refresh on dashboard
        resetForm();
        setTimeout(() => onOpenChange(false), 2000); // Close dialog after 2s
      } else {
        throw new Error('Failed to add model. Unexpected response from server.');
      }

    } catch (e: any) {
      console.error("Error uploading model:", e);
      setError(e.message || "An unexpected error occurred while adding the model.");
    }
    setIsSubmitting(false);
  };

  // Reset messages when dialog is closed/opened
  if (!isOpen && (error || successMessage)) {
      setError(null);
      setSuccessMessage(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => {
        if (!isSubmitting) { // Prevent closing while submitting
            onOpenChange(openState);
            if (!openState) resetForm(); // Reset form if dialog is closed
        }
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Model to {companyName || 'Company'}</DialogTitle>
          <DialogDescription>
            Upload a 3D model file (e.g., GLB, GLTF) and provide its details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="modelName">Model Name <span className="text-red-500">*</span></Label>
            <Input 
              id="modelName" 
              value={modelName} 
              onChange={(e) => setModelName(e.target.value)} 
              placeholder="E.g., Modern Armchair V2"
              disabled={isSubmitting}
              required 
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Briefly describe the model, its features, or materials."
              disabled={isSubmitting}
              rows={3}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input 
              id="tags" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
              placeholder="E.g., chair, modern, wood, living room"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="modelFile">Model File <span className="text-red-500">*</span></Label>
            <Input 
              id="modelFile" 
              type="file" 
              onChange={handleFileChange} 
              accept=".glb,.gltf" // Specify accepted file types
              disabled={isSubmitting}
              required 
            />
             {modelFile && <p className="text-xs text-gray-500 mt-1">Selected: {modelFile.name}</p>}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Upload Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
              <AlertTitle className="text-green-700 dark:text-green-300">Success!</AlertTitle>
              <AlertDescription className="text-green-600 dark:text-green-400">{successMessage}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !modelFile || !modelName.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              {isSubmitting ? 'Uploading...' : 'Add Model'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 