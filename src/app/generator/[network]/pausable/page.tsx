import TokenManager from "@/components/generator/token-manager";


export default function PausablePage({ params }: { params: { network: string } }) {
  return <TokenManager network={params.network} />;
}