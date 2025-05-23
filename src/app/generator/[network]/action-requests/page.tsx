import TokenManager from "@/components/generator/token-manager";

export default function ActionRequestsPage({ params }: { params: { network: string } }) {
  return <TokenManager network={params.network} />;
}