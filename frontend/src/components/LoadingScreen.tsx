import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Loader2 className="animate-spin w-12 h-12 mb-4 text-white" />
      <p className="text-lg">Loading, please wait...</p>
    </div>
  );
};
