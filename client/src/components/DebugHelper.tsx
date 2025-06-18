import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DebugHelper() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<Array<{ timestamp: string; message: string }>>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setLogs((prev) => [...prev, { timestamp, message }].slice(-50)); // Keep last 50 logs
  };

  useEffect(() => {
    // Log initial cookies
    addLog(`Initial cookies: ${document.cookie}`);

    // Monitor cookie changes
    const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    if (originalCookieDescriptor) {
      Object.defineProperty(document, 'cookie', {
        get: function() {
          return originalCookieDescriptor.get?.call(this);
        },
        set: function(val) {
          addLog(`Cookie changed: ${val}`);
          return originalCookieDescriptor.set?.call(this, val);
        },
      });
    }

    // Monitor network requests
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const [resource] = args;
      addLog(`Fetch request: ${resource}`);
      
      try {
        const response = await originalFetch.apply(this, args);
        addLog(`Fetch response: ${resource} - ${response.status}`);
        return response;
      } catch (error) {
        addLog(`Fetch error: ${resource} - ${error}`);
        throw error;
      }
    };

    return () => {
      // Restore original fetch
      window.fetch = originalFetch;
      
      // Restore original cookie descriptor
      if (originalCookieDescriptor) {
        Object.defineProperty(document, 'cookie', originalCookieDescriptor);
      }
    };
  }, []);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsVisible(true)}
      >
        Debug
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Debug Helper</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
        >
          Close
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="text-xs font-mono bg-gray-100 p-2 rounded"
              >
                <div className="text-gray-500">{log.timestamp}</div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 