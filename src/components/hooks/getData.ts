import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { normalizeSuiAddress } from "@mysten/sui/utils";

interface TokenData {
    newPkgId: string;
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

// Utility functions
export async function deriveCoinType(
    suiClient: SuiClient,
    tokenData: TokenData,
): Promise<string> {
    const { newPkgId, symbol } = tokenData;

    if (!newPkgId || !symbol) {
        throw new Error("newPkgId and symbol are required in tokenData");
    }

    const normalizedPkgId = normalizeSuiAddress(newPkgId);

    try {
        const packageObject = await suiClient.getObject({
            id: normalizedPkgId,
            options: { showContent: true },
        });

        if (packageObject.data?.content?.dataType !== "package") {
            throw new Error("Specified ID is not a valid package");
        }

        const disassembled = packageObject.data?.content?.disassembled;
        if (!disassembled || typeof disassembled !== "object") {
            throw new Error("Package disassembly data not available");
        }

        const moduleNames = Object.keys(disassembled);
        if (moduleNames.length === 0) {
            throw new Error("No modules found in package");
        }

        const moduleName = moduleNames[0];
        return `${normalizedPkgId}::${moduleName}`;
    } catch (err) {
        throw new Error(`Failed to derive coinType: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
}

export async function deriveNftType(
    suiClient: SuiClient,
    tokenData: TokenData,
): Promise<string> {
    // This function is identical to deriveCoinType, so we can reuse it
    return deriveCoinType(suiClient, tokenData);
}

 export async function getMetadataField(suiClient: SuiClient, objectId: string) {
    const object = await suiClient.getCoinMetadata({
        coinType: objectId
    });

    if (!object) {
        throw new Error("Object not found");
    }

    return object;
}

export async function getDenyList(suiClient: SuiClient, denyCapId: string) {
    const object = await suiClient.getObject({
        id: denyCapId,
        options: { showContent: true }
    });

    // @ts-expect-error: Sui object content fields are not typed in the SDK
    return object.data?.content?.fields;
}

async function getAllNftsByOwner(suiClient: SuiClient, address: string) {
    const response = await suiClient.getOwnedObjects({
        owner: address,
        options: {
            showType: true,
            showDisplay: true,
            showContent: true,
        },
    });

    // Filter out objects that are NFTs (not coins or other system objects)
    // NFTs typically have custom types that don't start with "0x2::" (system modules)
    return response.data.filter((item) => {
        if (!item.data?.type) return false;
        const type = item.data.type;
        const isNFT = type.includes('nft::');

        return isNFT;
    });
}

async function getAllTokensByOwner(suiClient: SuiClient, address: string) {
    const response = await suiClient.getOwnedObjects({
        owner: address,
        options: {
            showType: true,
            showDisplay: true,
            showContent: true,
        },
    });

    return response.data.filter((item) => {
        if (!item.data?.type) return false;
        const type = item.data.type;
        const isCoin = type.startsWith('0x2::coin::Coin<');

        return isCoin;
    });
}

// Hooks
export const useGetPackageMetadata = (packageId: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["packageMetadata", packageId],
        queryFn: () => getMetadataField(suiClient, packageId),
        enabled: !!packageId,
    });
};

export const useGetAllCoins = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["allCoins", address],
        queryFn: () => suiClient.getAllCoins({ owner: address }),
        enabled: !!address,
    });
};

export const useGetAllNftsByOwner = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["allNftsByOwner", address],
        queryFn: () => getAllNftsByOwner(suiClient, address),
        enabled: !!address,
    });
};


export const useGetAllTokensByOwner = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["allTokensByOwner", address],
        queryFn: () => getAllTokensByOwner(suiClient, address),
        enabled: !!address,
    });
};

export const useGetObjects = (account: { address: string }) => {
    const { data, isPending, error } = useSuiClientQuery(
        "getOwnedObjects",
        {
            owner: account?.address,
        },
        {
            enabled: !!account?.address,
        },
    );

    return {
        data,
        isPending,
        error,
    };
};

export const useGetTransactions = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["transactions", address],
        queryFn: () => suiClient.queryTransactionBlocks({
            filter: {
                FromAddress: address,
            },
        }),
        enabled: !!address,
    });
};

export const useGetBalance = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["balance", address],
        queryFn: () => suiClient.getBalance({ owner: address }),
        enabled: !!address,
    });
};

export const useGetOwnedObjects = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["ownedObjects", address],
        queryFn: () => suiClient.getOwnedObjects({ owner: address }),
        enabled: !!address,
    });
};

export const useGetObject = (objectId: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["object", objectId],
        queryFn: () => suiClient.getObject({ id: objectId }),
        enabled: !!objectId,
    });
};