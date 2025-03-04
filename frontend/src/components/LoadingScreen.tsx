import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  text: string;
}

export const LoadingScreen = ({ text }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <Loader2 className="animate-spin w-12 h-12 mb-4 text-white" />
      <p className="text-lg">{text}</p>
    </div>
  );
};
