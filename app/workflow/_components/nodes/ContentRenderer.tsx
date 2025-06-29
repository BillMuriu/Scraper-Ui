"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { analyzeContent, getContentPreview, ContentInfo } from "@/lib/utils/contentAnalysis";
import { Copy, Download, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContentRendererProps {
  name: string;
  content: any;
}

export function ContentRenderer({ name, content }: ContentRendererProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle null, undefined, or empty content
  if (content === null || content === undefined) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{name}</h4>
          <Badge className="bg-gray-100 text-gray-800">empty</Badge>
        </div>
        <div className="text-xs text-gray-500 italic p-2 border rounded">
          No content available
        </div>
      </div>
    );
  }

  const contentInfo = analyzeContent(content);

  const copyToClipboard = async () => {
    try {
      const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      await navigator.clipboard.writeText(textContent);
      toast.success("Content copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const downloadAsFile = () => {
    try {
      const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.${contentInfo.type === 'json' ? 'json' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded");
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const getSizeColor = (category: string) => {
    switch (category) {
      case 'small':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'large':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Small content - show normally
  if (contentInfo.category === 'small') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{name}</h4>
          <div className="flex items-center gap-2">
            <Badge className={getSizeColor(contentInfo.category)}>
              {contentInfo.sizeFormatted}
            </Badge>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy size={14} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-32 w-full rounded border">
          <div className="p-3 max-w-full overflow-hidden">
            <pre className="text-xs whitespace-pre-wrap break-words overflow-wrap-anywhere">
              {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Medium content - show with expand/collapse
  if (contentInfo.category === 'medium') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{name}</h4>
          <div className="flex items-center gap-2">
            <Badge className={getSizeColor(contentInfo.category)}>
              {contentInfo.sizeFormatted}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy size={14} />
            </Button>
          </div>
        </div>
        <ScrollArea className="h-32 w-full rounded border">
          <div className="p-3 max-w-full overflow-hidden">
            <pre className="text-xs whitespace-pre-wrap break-words overflow-wrap-anywhere">
              {isExpanded 
                ? (typeof content === 'string' ? content : JSON.stringify(content, null, 2))
                : getContentPreview(content, 500)
              }
            </pre>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Large content - show info card only
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{name}</h4>
        <Badge className={getSizeColor(contentInfo.category)}>
          {contentInfo.sizeFormatted}
        </Badge>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Large Content Detected</CardTitle>
          <CardDescription className="text-xs">
            Content is too large to display ({contentInfo.sizeFormatted}). 
            Use the actions below to access the full content.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-xs bg-gray-50 p-2 rounded border">
              <strong>Preview:</strong><br />
              <span className="text-gray-600">
                {getContentPreview(content, 150)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1">
                <Copy size={14} className="mr-1" />
                Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsFile} className="flex-1">
                <Download size={14} className="mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
