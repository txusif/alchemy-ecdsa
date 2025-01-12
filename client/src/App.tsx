import { useEffect, useState } from "react";
import server from "@/server";
import Wallet from "@/components/Wallet";
import Transfer from "@/components/Transfer";
import Header from "@/components/Header";
import TransactionLogs from "@/components/TransactionLogs";
import { Toaster } from "react-hot-toast";

export type addressesType = {
  name: string;
  address: string;
};

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
  success: boolean;
}

export default function App() {
  const [balance, setBalance] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [addresses, setAddresses] = useState<addressesType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const response = await server.get("/addresses");
      setAddresses(response.data);
    };
    fetchAddresses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Wallet
            balance={balance}
            setBalance={setBalance}
            address={selectedAddress}
            setAddress={setSelectedAddress}
            addresses={addresses}
          />
          <Transfer
            address={selectedAddress}
            setBalance={setBalance}
            setTransactions={setTransactions}
          />
        </div>
        <TransactionLogs transactions={transactions} />
      </main>
    </div>
  );
}
