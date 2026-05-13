'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { updateSeeker } from '@/lib/api';

interface StepDocumentsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const documentTypes = [
  {
    id: 'resume',
    label: 'Resume / CV',
    required: true,
    description: 'Your primary CV or resume',
  },
  {
    id: 'coverletter',
    label: 'Cover Letter',
    required: false,
    description: 'Optional personalized cover letter',
  },
  {
    id: 'certifications',
    label: 'Certifications',
    required: false,
    description: 'Professional certifications',
  },
];

export function StepDocuments({
  onNext,
  onPrevious,
}: StepDocumentsProps) {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleFileUpload = async (
    docId: string,
    file: File
  ) => {
    try {
      setError('');

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setUploadedDocs((prev) => ({
        ...prev,
        [docId]: file.name,
      }));

      setUploadedUrls((prev) => ({
        ...prev,
        [docId]: publicUrl,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Upload failed'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedUrls.resume) {
      setError('Please upload a resume');
      return;
    }

    try {
      setError('');
      setIsLoading(true);

      await updateSeeker({
        resume_url: uploadedUrls.resume,
        cover_letter_url: uploadedUrls.coverletter || null,
      });

      onNext();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save documents'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-light tracking-tight">
          Upload Documents
        </h1>

        <p className="text-muted-foreground max-w-md mx-auto">
          Share your resume and any supporting documents
        </p>
      </div>

      <Card className="border-border/40 bg-card/40 backdrop-blur-sm p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {documentTypes.map((doc) => (
            <div key={doc.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium">
                  {doc.label}
                </label>

                {doc.required && (
                  <span className="text-xs text-accent">
                    Required
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {doc.description}
              </p>

              <label className="block">
                <div className="relative border-2 border-dashed border-border/40 rounded-lg p-6 hover:border-accent/50 hover:bg-card/30 transition-all duration-200 cursor-pointer group">

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    disabled={isLoading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        await handleFileUpload(doc.id, file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  {uploadedDocs[doc.id] ? (
                    <div className="flex items-center gap-3 text-accent">
                      <span className="text-lg">✓</span>

                      <div>
                        <p className="text-sm font-medium">
                          {uploadedDocs[doc.id]}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Uploaded successfully
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="text-2xl text-muted-foreground group-hover:text-accent transition-colors">
                        ↑
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Drop file or click to upload
                        </p>

                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, DOCX up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          ))}

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-muted-foreground mt-6">
            <p>
              🔒{' '}
              <span className="text-foreground font-medium">
                Your privacy matters:
              </span>{' '}
              Documents are encrypted and only reviewed by authorized team members.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={isLoading}
              className="flex-1 rounded-full border-border/40"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? 'Saving...' : 'Next Step'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}