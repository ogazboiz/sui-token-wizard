import TokenManager from "@/components/generator/token-manager";



export default function DenylistPage({ params }: { params: { network: string } }) {
  return <TokenManager network={params.network} />;
}
