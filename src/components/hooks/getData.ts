import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { normalizeSuiAddress } from "@mysten/sui/utils";
import { getAllObjects, TokenData } from "./tokenData";

// Utility functions
export async function deriveCoinType(
    suiClient: SuiClient,
    tokenData: TokenData,
): Promise<string> {
    const { pkgId, symbol } = tokenData;

    if (!pkgId || !symbol) {
        throw new Error("pkgId and symbol are required in tokenData");
    }

    const normalizedPkgId = normalizeSuiAddress(pkgId);

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

export async function deriveFullCoinType(
    suiClient: SuiClient,
    pkgId: string,
): Promise<string> {
    // const { pkgId, symbol } = tokenData;

    if (!pkgId) {
        throw new Error("pkgId and symbol are required in tokenData");
    }

    const normalizedPkgId = normalizeSuiAddress(pkgId);

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
        console.log("Module name:", moduleName);
        return `${normalizedPkgId}::${moduleName}::${moduleName.toUpperCase()}`;
    } catch (err) {
        throw new Error(`Failed to derive coinType: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
}

export async function getMetadataField(suiClient: SuiClient, coinType: string) {
    const object = await suiClient.getCoinMetadata({
        coinType: coinType,
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
    const allObjects = await getAllObjects(suiClient, address);

    return allObjects.filter((item) => {
        if (!item.data?.type) return false;
        const type = item.data.type;
        const isNFT = type.includes('nft::');

        return isNFT;
    });
}

async function getCLTokensByOwner(suiClient: SuiClient, address: string) {
    const allObjects = await getAllObjects(suiClient, address);

    return allObjects.filter((item) => {
        if (!item.data?.type) return false;
        const type = item.data.type;
        const isCLToken = type.includes('0x2::token::Token<');

        return isCLToken;
    });
}

async function getAllCoinsByOwner(suiClient: SuiClient, address: string) {
    const allObjects = await getAllObjects(suiClient, address);

    return allObjects.filter((item) => {
        if (!item.data?.type) return false;
        const type = item.data.type;
        const isCoin = type.includes('0x2::coin::Coin<');

        return isCoin;
    });
}

async function getAllCoinsAndTokensByOwner(suiClient: SuiClient, address: string) {
    const allCoinsPromise = getAllCoinsByOwner(suiClient, address);
    const allTokensPromise = getCLTokensByOwner(suiClient, address);

    const [allCoins, allTokens] = await Promise.all([allCoinsPromise, allTokensPromise]);
    console.log("allclTokens", allTokens);
    const allCoinsAndTokens = [...allCoins, ...allTokens];
    const formattedCoinsAndTokens = allCoinsAndTokens.map((token) => {
        // @ts-expect-error: Sui object content fields are not typed in the SDK
        const { type, objectId, version, digest, content } = token.data;
        const { fields } = content;
        const { balance } = fields;
        return {
            balance,
            coinObjectId: objectId,
            coinType: type.match(/<([^>]+)>/)[1],
            digest,
            previousTransaction: null,
            version,
        };
    })

    return formattedCoinsAndTokens;
}

// Hooks
export const useGetMetadataField = (coinType: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["packageMetadata", coinType],
        queryFn: () => getMetadataField(suiClient, coinType),
        enabled: !!coinType,
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

export const useGetAllCoinsAndTokensByOwner = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["allCoinsAndTokensByOwner", address],
        queryFn: () => getAllCoinsAndTokensByOwner(suiClient, address),
        enabled: !!address,
    });
};

// get all coins except closed loop tokens
// export const useGetAllCoins = (address: string) => {
//     const suiClient = useSuiClient();

//     return useQuery({
//         queryKey: ["allCoins", address],
//         queryFn: () => suiClient.getAllCoins({ owner: address }),
//         enabled: !!address,
//     });
// };

// export const useGetAllTokensByOwner = (address: string) => {
//     const suiClient = useSuiClient();

//     return useQuery({
//         queryKey: ["allTokensByOwner", address],
//         queryFn: () => getAllTokensByOwner(suiClient, address),
//         enabled: !!address,
//     });
// };

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