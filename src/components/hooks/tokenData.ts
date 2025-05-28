import { SuiClient } from "@mysten/sui/client";
import { useQuery } from "@tanstack/react-query";
import { deriveFullCoinType } from "./getData";

interface TokenData {
    pkgId: string;
    symbol: string;
    name?: string;
    description?: string;
    decimal?: string;
    txId?: string;
    owner?: string;
    treasuryCap?: string;
    metadata?: string;
    denyCap?: string;
    type?: string;
    features?: {
        burnable?: boolean;
        mintable?: boolean;
        pausable?: boolean;
        denylist?: boolean;
    };
}

const fetchTokenData = async (
    suiClient: SuiClient,
    pkgId: string,
): Promise<TokenData> => {
    if (!pkgId) {
        throw new Error("pkgId is required in tokenData");
    }

    // // Fetch the package object to get module info
    // const packageObject = await suiClient.getObject({
    //     id: pkgId,
    //     options: { showContent: true },
    // });
    // console.log("Package object:", packageObject)

    const coinType = await deriveFullCoinType(suiClient, pkgId);
    const metadata = await suiClient.getCoinMetadata({ coinType });
     

    // Try to extract symbol and name from metadata if available
    const symbol = metadata?.symbol || "";
    const name = metadata?.name || "";
    const description = metadata?.description || "";
    const decimal = metadata?.decimals?.toString() || "";
    const metadataId = metadata?.id || "";
    // You may want to extract more fields as needed

    return {
        pkgId,
        symbol,
        name,
        description,
        decimal,
        metadata: metadataId,
        // Add more fields as needed
    };
}

export const useFetchTokenData = (suiClient: SuiClient, pkgId: string, coinType?: string) => {
    const { data, isLoading, isError } = useQuery<TokenData, Error>({
        queryKey: ["tokenData", pkgId, coinType],
        queryFn: () => fetchTokenData(suiClient, pkgId, coinType),
        enabled: !!pkgId,
    });

    return {
        data,
        isLoading,
        isError,
    };
}