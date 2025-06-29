// Utility functions for analyzing and managing content size in execution details

export interface ContentInfo {
  size: number;
  sizeFormatted: string;
  category: 'small' | 'medium' | 'large';
  type: 'html' | 'json' | 'text';
}

export const SIZE_THRESHOLDS = {
  SMALL: 10 * 1024,    // 10KB
  MEDIUM: 100 * 1024,  // 100KB
} as const;

export function calculateContentSize(content: any): number {
  if (content === null || content === undefined) {
    return 0;
  }
  
  if (typeof content === 'string') {
    return new Blob([content]).size;
  }
  
  return new Blob([JSON.stringify(content)]).size;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function detectContentType(content: any): 'html' | 'json' | 'text' {
  if (typeof content === 'string') {
    // Simple HTML detection
    if (content.includes('<html') || content.includes('<!DOCTYPE') || 
        (content.includes('<') && content.includes('>'))) {
      return 'html';
    }
    return 'text';
  }
  
  return 'json';
}

export function analyzeContent(content: any): ContentInfo {
  const size = calculateContentSize(content);
  const type = detectContentType(content);
  
  let category: 'small' | 'medium' | 'large';
  if (size < SIZE_THRESHOLDS.SMALL) {
    category = 'small';
  } else if (size < SIZE_THRESHOLDS.MEDIUM) {
    category = 'medium';
  } else {
    category = 'large';
  }
  
  return {
    size,
    sizeFormatted: formatBytes(size),
    category,
    type,
  };
}

export function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength) + '...';
}

export function getContentPreview(content: any, maxLength: number = 200): string {
  if (typeof content === 'string') {
    return truncateContent(content, maxLength);
  }
  
  const jsonString = JSON.stringify(content, null, 2);
  return truncateContent(jsonString, maxLength);
}
