"use client";

import { useWrappedData } from "@/hooks/useWrappedData";
import { StatementInput } from "@/components/StatementInput";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBanner } from "@/components/ErrorBanner";
import { WrappedExperience } from "@/components/wrapped/WrappedExperience";

export default function Home() {
  const { status, data, errorMessage, submit, reset } = useWrappedData();

  if (status === "loading") return <LoadingScreen />;

  if (status === "error") {
    return (
      <ErrorBanner message={errorMessage ?? "Unknown error"} onReset={reset} />
    );
  }

  if (status === "success" && data) {
    return <WrappedExperience data={data} onRestart={reset} />;
  }

  return <StatementInput onSubmit={submit} />;
}
