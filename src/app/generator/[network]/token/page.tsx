// Create this file at: app/generator/[network]/token/page.tsx

import TokenManager from "@/components/generator/token-manager";
import { Network } from "@/components/hooks/tokenData";

export default function TokenPage({ network }: { network: string }) {
  return <TokenManager network={network as Network} />;
}