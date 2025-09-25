import DynamicEmbeddedWidget from "@/components/dynamic/dynamic-embedded-widget";
import ExternalInlineClaim from "@/components/external-inline-claim";
import { Dashboard } from "@/components/dashboard";

export default function Main() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <DynamicEmbeddedWidget />
        <ExternalInlineClaim />
      </div>
      
      {/* Dashboard - shows when wallet is connected */}
      <div className="w-full">
        <Dashboard />
      </div>
    </div>
  );
}
