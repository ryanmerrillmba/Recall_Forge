import { createAdminSupabase, createServerSupabase } from './supabase-server';
import { CHILD_FRIENDLY_ERRORS } from './supabase';

export interface FileUploadOptions {
  bucket: string;
  path: string;
  file: File;
  contentType?: string;
  cacheControl?: string;
}

export interface FileUploadResult {
  path: string;
  url: string;
  size: number;
  contentType: string;
}

export interface CSVValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  columns: string[];
  preview: Array<Record<string, string>>;
}

export class StorageManager {
  private supabase;
  private adminSupabase;

  constructor() {
    this.supabase = createServerSupabase();
    this.adminSupabase = createAdminSupabase();
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile(options: FileUploadOptions): Promise<FileUploadResult> {
    const { bucket, path, file, contentType, cacheControl } = options;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(CHILD_FRIENDLY_ERRORS.TOO_MANY_QUESTIONS.childFriendly);
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await this.adminSupabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: contentType || file.type,
        cacheControl: cacheControl || '3600',
        upsert: true
      });

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = this.adminSupabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      path: data.path,
      url: urlData.publicUrl,
      size: file.size,
      contentType: contentType || file.type
    };
  }

  /**
   * Download a file from Supabase Storage
   */
  async downloadFile(bucket: string, path: string): Promise<Blob> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`File download failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.adminSupabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  /**
   * Get signed URL for temporary access to a file
   */
  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Validate and parse CSV file for flashcards
   */
  async validateCSV(file: File): Promise<CSVValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let rowCount = 0;
    let columns: string[] = [];
    const preview: Array<Record<string, string>> = [];

    try {
      // Read file content
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        errors.push('CSV file is empty');
        return { valid: false, errors, warnings, rowCount: 0, columns: [], preview: [] };
      }

      // Parse header row
      const headerLine = lines[0];
      columns = this.parseCSVLine(headerLine);

      // Validate required columns
      const requiredColumns = ['question', 'answer'];
      const normalizedHeaders = columns.map(col => col.toLowerCase().trim());
      
      const missingColumns = requiredColumns.filter(required => 
        !normalizedHeaders.some(header => 
          header.includes(required) || required.includes(header)
        )
      );

      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      // Find question and answer column indexes
      const questionIndex = this.findColumnIndex(columns, ['question', 'q', 'term', 'front']);
      const answerIndex = this.findColumnIndex(columns, ['answer', 'a', 'definition', 'back']);

      if (questionIndex === -1) {
        errors.push('Could not find question column. Expected column names: question, q, term, or front');
      }

      if (answerIndex === -1) {
        errors.push('Could not find answer column. Expected column names: answer, a, definition, or back');
      }

      // Parse data rows
      const dataLines = lines.slice(1);
      rowCount = dataLines.length;

      // Validate row count
      if (rowCount < 5) {
        errors.push(CHILD_FRIENDLY_ERRORS.TOO_FEW_QUESTIONS.childFriendly);
      }

      if (rowCount > 500) {
        errors.push(CHILD_FRIENDLY_ERRORS.TOO_MANY_QUESTIONS.childFriendly);
      }

      // Parse and validate each row
      for (let i = 0; i < Math.min(dataLines.length, 10); i++) { // Preview first 10 rows
        const line = dataLines[i];
        const values = this.parseCSVLine(line);
        
        const row: Record<string, string> = {};
        columns.forEach((col, index) => {
          row[col] = values[index] || '';
        });

        // Validate required fields
        if (questionIndex >= 0 && answerIndex >= 0) {
          const question = values[questionIndex]?.trim() || '';
          const answer = values[answerIndex]?.trim() || '';

          if (!question) {
            warnings.push(`Row ${i + 2}: Missing question`);
          } else if (question.length < 3) {
            warnings.push(`Row ${i + 2}: Question too short (${question.length} characters)`);
          }

          if (!answer) {
            warnings.push(`Row ${i + 2}: Missing answer`);
          }

          // Check for potentially inappropriate content (basic check)
          if (this.containsPotentiallyInappropriateContent(question) || 
              this.containsPotentiallyInappropriateContent(answer)) {
            warnings.push(`Row ${i + 2}: Content may need review`);
          }
        }

        preview.push(row);
      }

      // Additional validations
      if (warnings.length > rowCount * 0.5) {
        errors.push('Too many rows have issues. Please review your CSV file.');
      }

    } catch (error) {
      errors.push(`Failed to parse CSV file: ${error}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      rowCount,
      columns,
      preview
    };
  }

  /**
   * Parse a single CSV line, handling quoted values
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add final field
    result.push(current.trim());

    return result;
  }

  /**
   * Find column index by possible names
   */
  private findColumnIndex(columns: string[], possibleNames: string[]): number {
    const normalizedColumns = columns.map(col => col.toLowerCase().trim());
    
    for (const name of possibleNames) {
      const index = normalizedColumns.findIndex(col => 
        col === name || col.includes(name) || name.includes(col)
      );
      if (index !== -1) {
        return index;
      }
    }
    
    return -1;
  }

  /**
   * Basic content filtering for child safety
   */
  private containsPotentiallyInappropriateContent(text: string): boolean {
    // This is a basic implementation - in production, you'd want more sophisticated filtering
    const blockedWords = ['inappropriate', 'bad', 'harmful']; // Simplified list
    const lowerText = text.toLowerCase();
    
    return blockedWords.some(word => lowerText.includes(word));
  }

  /**
   * Initialize storage buckets with proper policies
   */
  async initializeStorage(): Promise<void> {
    const buckets = [
      {
        name: 'flashcard-csv',
        policy: {
          allowedMimeTypes: ['text/csv', 'application/csv'],
          fileSizeLimit: 10 * 1024 * 1024, // 10MB
          allowedRoles: ['authenticated']
        }
      },
      {
        name: 'user-avatars',
        policy: {
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
          fileSizeLimit: 2 * 1024 * 1024, // 2MB
          allowedRoles: ['authenticated']
        }
      }
    ];

    for (const bucket of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBuckets } = await this.adminSupabase.storage.listBuckets();
        const bucketExists = existingBuckets?.some(b => b.name === bucket.name);

        if (!bucketExists) {
          // Create bucket
          const { error } = await this.adminSupabase.storage.createBucket(bucket.name, {
            public: false,
            allowedMimeTypes: bucket.policy.allowedMimeTypes,
            fileSizeLimit: bucket.policy.fileSizeLimit
          });

          if (error) {
            console.error(`Failed to create bucket ${bucket.name}:`, error);
          } else {
            console.log(`Created storage bucket: ${bucket.name}`);
          }
        }
      } catch (error) {
        console.error(`Error initializing bucket ${bucket.name}:`, error);
      }
    }
  }
}

// Export singleton instance
export const storage = new StorageManager();

// Utility functions
export const uploadCSVFile = (file: File, userId: string, deckId: string) => 
  storage.uploadFile({
    bucket: 'flashcard-csv',
    path: `${userId}/${deckId}/${file.name}`,
    file,
    contentType: 'text/csv'
  });

export const validateCSVFile = (file: File) => storage.validateCSV(file);
export const initializeStorage = () => storage.initializeStorage();