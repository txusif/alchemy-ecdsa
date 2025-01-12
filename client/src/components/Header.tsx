import { Wallet } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-gray-800 text-white">
      <div className="flex items-center space-x-2 container mx-auto py-6">
        <Wallet className="w-8 h-8 text-blue-500" />
        <h1 className="text-xl font-bold">WEB3 Wallet</h1>
      </div>
    </header>
  );
}
