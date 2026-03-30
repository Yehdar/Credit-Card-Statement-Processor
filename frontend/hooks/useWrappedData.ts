"use client";

import { useState, useCallback } from "react";
import { analyzeStatement } from "@/lib/api";
import type { WrappedResponse } from "@/types/wrapped";

type Status = "idle" | "loading" | "success" | "error";

interface UseWrappedDataReturn {
  status: Status;
  data: WrappedResponse | null;
  errorMessage: string | null;
  submit: (statementText: string) => Promise<void>;
  reset: () => void;
}

export function useWrappedData(): UseWrappedDataReturn {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<WrappedResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(async (statementText: string) => {
    setStatus("loading");
    setErrorMessage(null);
    setData(null);

    try {
      const result = await analyzeStatement(statementText);
      setData(result);
      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setErrorMessage(null);
  }, []);

  return { status, data, errorMessage, submit, reset };
}
