import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import server from "@/server";
import { useEffect } from "react";
import { addressesType } from "@/App";
import { Wallet as WalletIcon } from "lucide-react";

type WalletProps = {
  balance: number;
  address: string;
  setBalance: (balance: number) => void;
  setAddress: (address: string) => void;
  addresses: addressesType[];
};

export default function Wallet({
  balance,
  setBalance,
  address,
  setAddress,
  addresses,
}: WalletProps) {
  useEffect(() => {
    async function fetchBalance() {
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
    fetchBalance();
  }, [address]);

  async function handleChange(value: string) {
    setAddress(value);
  }

  return (
    <Card className="w-full bg-gray-800 text-white overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-2">
        <WalletIcon className="w-6 h-6 text-blue-500" />
        <CardTitle className="text-xl font-medium">Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleChange}>
          <SelectTrigger className="bg-gray-700 text-white truncate">
            <SelectValue placeholder="Select an address" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700">
            {addresses.map((item) => (
              <SelectItem
                key={item.address}
                value={item.address}
                className="text-white"
              >
                {item.name} &mdash; {item.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <Badge className="h-9 px-4 py-2">
          Balance: {balance ? `${balance} ETH` : "Select an address"}
        </Badge>
      </CardFooter>
    </Card>
  );
}
