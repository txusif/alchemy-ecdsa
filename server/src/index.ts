import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { bytesToHex, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const publicKeysToAddresses: {
  [key: string]: string;
} = {
  "03542f3e3277c2fe8cae92259e1c0df64ecbd3f07cdd32f7df31d43bf7e09b7d51":
    "0xb1f953587e08870627ea78e69d5775f04301b08a",

  "02c0d849c935110cf23d45da432f90a23f663f49fe69a1209866d912ee38c3ee9c":
    "0x776ea27e3e9aeb98b39eff4bfaadfc165ae1b32f",

  "0306575ef8b1f1fefcb3346d4700729a99ad3d6e536742c3c26fd0dc9aee77d187":
    "0x13ff4f466ec4c687d00e6a664501227f07694ecf",

  "0231fe3a3d124f0dbf0c76b9c11fe4ed28689cee21e473bcb93ec00f7c3fda65b5":
    "0xd9397ebc61c1e124a8962cfd685cf14f06f31bd7",
};

const balances: {
  [key: string]: { name: string; balance: number };
} = {
  "0xb1f953587e08870627ea78e69d5775f04301b08a": {
    name: "Account 1",
    balance: 100,
  },
  "0x776ea27e3e9aeb98b39eff4bfaadfc165ae1b32f": {
    name: "Account 2",
    balance: 75,
  },
  "0x13ff4f466ec4c687d00e6a664501227f07694ecf": {
    name: "Account 3",
    balance: 50,
  },
  "0xd9397ebc61c1e124a8962cfd685cf14f06f31bd7": {
    name: "Account 4",
    balance: 25,
  },
  "0xf5b02e6374c34b0a7f4e7fd110265c945aac5265": {
    name: "Account 5",
    balance: 10,
  },
};

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running!");
});

app.get("/addresses", (req: Request, res: Response) => {
  res.send(
    Object.keys(balances).map((address) => ({
      address,
      name: balances[address].name,
    }))
  );
});

app.get("/balance/:address", (req: Request, res: Response) => {
  const { address } = req.params;
  const balance = balances[address].balance;
  res.send({ balance });
});

app.post("/send", (req: Request, res: Response) => {
  const { transaction, signature } = req.body;
  const { sender, recipient, amount } = transaction;

  const r = BigInt(signature.r["$bigint"]);
  const s = BigInt(signature.s["$bigint"]);
  const recovery = signature.recovery;

  const sig = new secp.Signature(r, s, recovery);

  const txHash = keccak256(utf8ToBytes(JSON.stringify(transaction)));

  const publicKey = sig.recoverPublicKey(txHash);

  if (!publicKeysToAddresses[publicKey.toHex()]) {
    res.status(400).send({ message: "Invalid private key!" });
  }

  if (publicKeysToAddresses[publicKey.toHex()] !== sender) {
    res.status(400).send({ message: "Invalid sender!" });
  }

  if (!balances[recipient]) {
    res.status(400).send({ message: "Invalid recipient!" });
  }

  if (balances[sender].balance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender].balance -= amount;
    balances[recipient].balance += amount;

    res.send({
      balance: balances[sender].balance,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
