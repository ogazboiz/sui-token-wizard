import TokenManager from "@/components/generator/token-manager";
import { Network } from "@/components/hooks/tokenData";

export default function MintTokensPage({ network }: { network: string }) {
  return <TokenManager network={network as Network} />;
}
