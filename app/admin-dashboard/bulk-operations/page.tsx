'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Trash2, Loader2, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function BulkOperationsPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState({
    import: false,
    export: false,
    delete: false
  });
  const [progress, setProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setIsLoading(prev => ({ ...prev, import: true }));
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // TODO: Implement actual CSV import logic with Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setProgress(100);
      
      toast({
        title: 'Import Successful',
        description: 'Users have been imported successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'There was an error importing users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, import: false }));
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleExport = async () => {
    setIsLoading(prev => ({ ...prev, export: true }));
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // TODO: Implement actual CSV export logic with Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setProgress(100);
      
      toast({
        title: 'Export Successful',
        description: 'Users have been exported successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, export: false }));
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleBatchDelete = async () => {
    setIsLoading(prev => ({ ...prev, delete: true }));
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // TODO: Implement actual batch delete logic with Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setProgress(100);
      
      toast({
        title: 'Deletion Successful',
        description: 'Selected users have been deleted successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: 'There was an error deleting users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
      setShowDeleteConfirm(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Bulk Operations</h1>
        <p className="text-muted-foreground">
          Perform batch actions such as import/export, and mass updates for users and data.
        </p>
      </motion.div>

      <div className="grid gap-6">
        {/* Import Card */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Import Users</CardTitle>
                  <CardDescription>Upload a CSV file to import users in bulk</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImport} className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="csv-import"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                    disabled={isLoading.import}
                  />
                  <p className="text-xs text-muted-foreground">
                    CSV files only. <a href="/templates/users-import-template.csv" className="text-blue-600 hover:underline dark:text-blue-400">Download template</a>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={!csvFile || isLoading.import}>
                    {isLoading.import ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Users
                      </>
                    )}
                  </Button>
                  {isLoading.import && (
                    <span className="text-sm text-muted-foreground">
                      {progress}% Complete
                    </span>
                  )}
                </div>
                {isLoading.import && (
                  <Progress value={progress} className="h-2" />
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Export Card */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle>Export Users</CardTitle>
                    <CardDescription>Download all users as a CSV file</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Export all users with their details to a CSV file for backup or analysis.
                  </p>
                  <Button 
                    onClick={handleExport} 
                    disabled={isLoading.export}
                    className="w-full sm:w-auto"
                  >
                    {isLoading.export ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export Users
                      </>
                    )}
                  </Button>
                  {isLoading.export && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Preparing export...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delete Card */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-destructive/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Permanently delete multiple users</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete all selected users.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isLoading.delete}
                    className="w-full sm:w-auto"
                  >
                    {isLoading.delete ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Batch Delete Users
                      </>
                    )}
                  </Button>
                  {isLoading.delete && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Deleting users...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-red-100 dark:bg-red-900/20" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete all selected users? This action cannot be undone and will permanently remove all user data.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading.delete}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBatchDelete}
                  disabled={isLoading.delete}
                >
                  {isLoading.delete ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete All Users'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
