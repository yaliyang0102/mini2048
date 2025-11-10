"use client";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, zeroAddress } from "viem";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

const abi = [
  {
    "inputs":[
      {"internalType":"address","name":"_receiver","type":"address"},
      {"internalType":"uint256","name":"_quantity","type":"uint256"},
      {"internalType":"address","name":"_currency","type":"address"},
      {"internalType":"uint256","name":"_pricePerToken","type":"uint256"},
      {"internalType":"bytes32[]","name":"_allowlistProof","type":"bytes32[]"},
      {"internalType":"uint256","name":"_proofMaxQuantityPerTransaction","type":"uint256"}
    ],
    "name":"claim","outputs":[],"stateMutability":"payable","type":"function"
  }
] as const;

export default function MintButton({ enabled }: { enabled: boolean }) {
  const { address, isConnected } = useAccount();

  // ✅ 用 writeContractAsync（返回交易 hash）
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const disabled =
    !enabled || !isConnected || !address || !CONTRACT || isPending || confirming;

  const click = async () => {
    if (disabled) return;
    try {
      await writeContractAsync({
        address: CONTRACT,
        abi,
        functionName: "claim",
        args: [address, 1n, zeroAddress, parseEther("0.0001"), [], 1n],
        value: parseEther("0.0001"),
      });
      // 交易发出后，hash 会自动进入 data -> useWaitForTransactionReceipt 跟踪确认
    } catch (e) {
      console.error(e);
      alert("铸造失败，请重试");
    }
  };

  return (
    <button className="btn" disabled={disabled} onClick={click}>
      {isSuccess ? "已铸造 ✅" : confirming ? "确认中…" : isPending ? "提交中…" : "铸造 NFT（0.0001 ETH）"}
    </button>
  );
}
