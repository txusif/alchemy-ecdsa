import { secp256k1 as secp } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes, bytesToHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak.js";

// export const generatePrivateKey = () => {
//   const privateKey = secp.utils.randomPrivateKey();
//   return privateKey;
// };

// export const generatePublicKey = (privateKey: string) => {
//   const publicKey = secp.getPublicKey(privateKey);
//   return publicKey;
// };

// export const generateAddress = (publicKey: string): string => {
//   const hash = keccak256(utf8ToBytes(publicKey));
//   return bytesToHex(hash.slice(-20));
// };

const privateKey = secp.utils.randomPrivateKey();
console.log(toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
console.log(toHex(publicKey));

const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
console.log(`0x${address}`);
