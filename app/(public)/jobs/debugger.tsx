"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Add this component temporarily to your jobs page to debug filters
export function FilterDebugger() {
  const searchParams = useSearchParams();
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <Button
        onClick={() => setShowDebug(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white"
      >
        Debug Filters
      </Button>
    );
  }

  const allParams = Object.fromEntries(searchParams.entries());

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-auto bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex justify-between items-center">
          Current URL Parameters
          <Button
            onClick={() => setShowDebug(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Raw URL:</strong>
          <div className="bg-gray-100 p-1 rounded text-xs break-all">
            {window.location.search}
          </div>
        </div>

        <div>
          <strong>Parsed Parameters:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(allParams, null, 2)}
          </pre>
        </div>

        <div>
          <strong>Individual Params:</strong>
          <ul className="space-y-1">
            <li>
              q: <code>{searchParams.get("q") || "null"}</code>
            </li>
            <li>
              jobType: <code>{searchParams.get("jobType") || "null"}</code>
            </li>
            <li>
              jobCategory:{" "}
              <code>{searchParams.get("jobCategory") || "null"}</code>
            </li>
            <li>
              salary: <code>{searchParams.get("salary") || "null"}</code>
            </li>
            <li>
              remote: <code>{searchParams.get("remote") || "null"}</code>
            </li>
            <li>
              page: <code>{searchParams.get("page") || "null"}</code>
            </li>
          </ul>
        </div>

        <Button
          onClick={() => {
            console.log("🔍 URL Search Params Debug:");
            console.log("Raw URL:", window.location.search);
            console.log("All params:", allParams);
            console.log("Individual params:", {
              q: searchParams.get("q"),
              jobType: searchParams.get("jobType"),
              jobCategory: searchParams.get("jobCategory"),
              salary: searchParams.get("salary"),
              remote: searchParams.get("remote"),
              page: searchParams.get("page"),
            });
          }}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Log to Console
        </Button>
      </CardContent>
    </Card>
  );
}
