import { SuiClient } from "@mysten/sui/client";
import { useQuery } from "@tanstack/react-query";
import { deriveFullCoinType } from "./getData";
// import { CoinMetadata } from "@mysten/sui/client"

export type TokenType = "standard" | "regulated" | "closed-loop" | undefined;

export interface TokenData {
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
    type?: "standard" | "regulated" | "closed-loop";
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
    tokenType: TokenType,
): Promise<TokenData> => {
    console.log("token type here", tokenType);
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
        type: tokenType,
        features: {
            burnable: true,
            mintable: true,
            pausable: true,
            denylist: true,
        }
    };
}

export const useFetchTokenData = (suiClient: SuiClient, pkgId: string, tokenType: TokenType) => {
    const { data, isLoading, isError } = useQuery<TokenData, Error>({
        queryKey: ["tokenData", pkgId, tokenType],
        queryFn: () => fetchTokenData(suiClient, pkgId, tokenType),
        enabled: !!pkgId,
    });

    return {
        data,
        isLoading,
        isError,
    };
}