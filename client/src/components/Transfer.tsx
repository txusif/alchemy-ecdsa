import { useState } from "react";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import server from "@/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { DollarSign, Key, Send } from "lucide-react";
import { Transaction } from "@/App";
import { toast } from "react-hot-toast";

type TransferProps = {
  address: string;
  setBalance: (balance: number) => void;
  setTransactions: (transaction: Transaction[]) => void;
};

BigInt.prototype.toJSON = function () {
  return { $bigint: this.toString() };
};

export default function Transfer({
  address,
  setBalance,
  setTransactions,
}: TransferProps) {
  const [amount, setAmount] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

  const setValue =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      setter(evt.target.value);

  async function handleTransfer() {
    const transaction = {
      amount: Number(amount),
      recipient,
      sender: address,
    };

    const hashedTransaction = keccak256(
      utf8ToBytes(JSON.stringify(transaction))
    );

    const signedTransaction = secp.sign(hashedTransaction, privateKey);

    try {
      const {
        data: { balance },
      } = await server.post("send", {
        transaction,
        signature: signedTransaction,
      });
      setBalance(balance);
      toast.success("Transaction successful!", {
        style: {
          background: "#1F2937",
          color: "#fff",
          border: "1px solid #374151",
        },
        iconTheme: {
          primary: "#10B981",
          secondary: "#fff",
        },
      });
      setTransactions((transactions: Transaction) => [
        ...transactions,
        { ...transaction, success: true },
      ]);
    } catch (error) {
      toast.error(error.response.data.message, {
        style: {
          background: "#1F2937",
          color: "#fff",
          border: "1px solid #374151",
        },
        iconTheme: {
          primary: "#EF4444",
          secondary: "#fff",
        },
      });
      setTransactions((transactions: Transaction) => [
        ...transactions,
        { ...transaction, success: false },
      ]);
      console.error(error.response.data.message);
    }
  }

  return (
    <Card className="w-full bg-gray-800 text-white overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Send className="w-6 h-6 text-green-500 flex-shrink-0" />
        <CardTitle className="text-xl font-medium">Transfer Funds</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <Input
              type="number"
              placeholder="Amount (ETH)"
              value={amount}
              onChange={setValue(setAmount)}
              min={1}
              className="bg-gray-700 text-white w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={setValue(setRecipient)}
              className="bg-gray-700 text-white w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Your Private Key"
              value={privateKey}
              onChange={setValue(setPrivateKey)}
              className="bg-gray-700 text-white w-full"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTransfer}
          className="w-1/2 mx-auto bg-blue-600 hover:bg-blue-700"
        >
          Transfer
        </Button>
      </CardFooter>
    </Card>
  );
}
