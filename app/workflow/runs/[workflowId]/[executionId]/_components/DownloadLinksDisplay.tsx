import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DownloadLinksDisplayProps {
  outputs: string;
}

export function DownloadLinksDisplay({ outputs }: DownloadLinksDisplayProps) {
  let parsedOutputs: any;

  try {
    parsedOutputs = JSON.parse(outputs);
  } catch {
    return null;
  }

  // Check if this contains download URLs (CSV Export outputs)
  const downloadUrl = parsedOutputs["Download URL"];
  const rowCount = parsedOutputs["Row Count"];

  if (!downloadUrl) {
    return null;
  }

  const handleDownload = () => {
    // Create a link and click it to download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = downloadUrl.split("/").pop() || "export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download size={20} className="text-green-500" />
          CSV Export Ready
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Export completed with {rowCount} rows
            </p>
            <p className="text-xs text-muted-foreground">
              File: {downloadUrl.split("/").pop()}
            </p>
          </div>
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download size={16} />
            Download CSV
          </Button>
        </div>

        {/* Alternative: Direct link */}
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Or access directly:
            <a
              href={downloadUrl}
              target="_blank"
              className="ml-1 text-blue-600 hover:underline"
            >
              {window.location.origin}
              {downloadUrl}
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
