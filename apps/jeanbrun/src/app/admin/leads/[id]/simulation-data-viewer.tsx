"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SimulationDataViewerProps {
  readonly data: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (typeof value === "number") {
    return new Intl.NumberFormat("fr-FR").format(value);
  }
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function DataEntries({
  data,
  depth = 0,
}: {
  readonly data: Record<string, unknown>;
  readonly depth?: number;
}) {
  return (
    <dl
      className={`grid grid-cols-[minmax(120px,auto)_1fr] gap-x-4 gap-y-2 text-sm ${depth > 0 ? "ml-4 border-l pl-4" : ""}`}
    >
      {Object.entries(data).map(([key, value]) => {
        if (isRecord(value)) {
          return (
            <div key={key} className="col-span-2">
              <dt className="mb-1 font-medium text-muted-foreground">
                {key}
              </dt>
              <dd>
                <DataEntries data={value} depth={depth + 1} />
              </dd>
            </div>
          );
        }

        if (Array.isArray(value)) {
          return (
            <div key={key} className="col-span-2">
              <dt className="mb-1 font-medium text-muted-foreground">
                {key}
              </dt>
              <dd className="text-muted-foreground">
                {value.length === 0
                  ? "[]"
                  : value.map((item, i) => (
                      <span key={i} className="mr-2">
                        {formatValue(item)}
                        {i < value.length - 1 ? "," : ""}
                      </span>
                    ))}
              </dd>
            </div>
          );
        }

        return (
          <div key={key} className="contents">
            <dt className="font-medium text-muted-foreground">{key}</dt>
            <dd>{formatValue(value)}</dd>
          </div>
        );
      })}
    </dl>
  );
}

export function SimulationDataViewer({ data }: SimulationDataViewerProps) {
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

  const isObject = isRecord(data);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Donnees de simulation</CardTitle>
            <CardDescription>
              Parametres et resultats de la simulation
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode((prev) =>
                prev === "formatted" ? "raw" : "formatted"
              )
            }
          >
            {viewMode === "formatted" ? "JSON brut" : "Vue formatee"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "formatted" && isObject ? (
          <DataEntries data={data} />
        ) : (
          <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
