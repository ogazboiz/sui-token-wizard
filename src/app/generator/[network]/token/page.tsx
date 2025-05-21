// Create this file at: app/generator/[network]/token/page.tsx

import TokenManager from "@/components/generator/token-manager";

export default function TokenPage({ params }: { params: { network: string } }) {
  return <TokenManager network={params.network} />;
}