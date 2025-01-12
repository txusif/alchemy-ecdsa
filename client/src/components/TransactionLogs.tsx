import { Transaction } from "@/App";
import { ArrowUpRight, CircleX } from "lucide-react";

interface TransactionLogsProps {
  transactions: Transaction[];
}

export default function TransactionLogs({
  transactions,
}: TransactionLogsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Transaction Logs</h2>
      <ul className="space-y-2">
        {transactions.map((tx, index) => (
          <li
            key={index}
            className={`p-2 rounded flex items-start space-x-2 bg-gray-800 ${
              tx.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {tx.success ? (
              <ArrowUpRight className="w-5 h-5 flex-shrink-0 mt-1" />
            ) : (
              <CircleX className="w-5 h-5 flex-shrink-0 mt-1" />
            )}
            <div className="flex-grow overflow-hidden">
              <p className="truncate">
                {tx.success
                  ? `Transferred ${tx.amount} ETH`
                  : `Transaction Failed ${tx.amount} ETH`}
              </p>
              <p className="truncate text-sm opacity-80 text-white">
                From: {tx.sender}
              </p>
              <p className="truncate text-sm opacity-80 text-white">
                To: {tx.recipient}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
