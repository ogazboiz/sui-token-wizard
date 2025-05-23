import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { PaginatedObjectsResponse, SuiClient, SuiObjectResponse } from "@mysten/sui/client";
import { normalizeSuiAddress } from "@mysten/sui/utils";

// Interface for token and NFT data
export interface Token {
    id: string
    name: string
    symbol: string
    decimals: number
    description: string
    network: string
    supply: string
    address: string
    createdAt: string
    type: "fungible"
    status: string
}

export interface NFTCollection {
    id: string;
    name: string;
    symbol: string;
    network: string;
    supply: string;
    minted: string;
    address: string;
    owner: string | {
        AddressOwner: string;
    } | {
        ObjectOwner: string;
    } | {
        Shared: {
            initial_shared_version: string;
        };
    };
    createdAt: string;
    image: string;
    status: string;
}

export interface TokenData {
    txId: string | null
    treasuryCap: string | null
}

export interface OldTokenData {
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

export const getTokenData = async (
    suiClient: SuiClient,
    packageId: string,
    ownerAddress: string,
    coinType: string
): Promise<TokenData> => {
    try {
        const normalizedPkgId = normalizeSuiAddress(packageId);
        console.log("NormalizedPkgId:", normalizedPkgId);

        // Fetch transactions for the owner with proper pagination
        const transactions = await suiClient.queryTransactionBlocks({
            filter: { FromAddress: ownerAddress },
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
            limit: 70, // Add limit to get more results
        });

        console.log("Transactions count:", transactions.data.length);

        // Find transaction that published the package
        const publishTx = transactions.data.find((tx) => {
            // Check object changes for package publication
            const hasPackageCreation = tx.objectChanges?.some(
                (change) => change.type === 'published' &&
                    change.packageId === normalizedPkgId
            );

            // Also check created objects as fallback
            const hasCreatedPackage = tx.effects?.created?.some(
                // @ts-expect-error - objectId type ish
                (obj) => obj.objectId === normalizedPkgId
            );

            return hasPackageCreation || hasCreatedPackage;
        });

        console.log("PublishTx found:", !!publishTx);
        const txId = publishTx?.digest || null;

        // Fetch owned objects for the owner with pagination
        let allObjects: SuiObjectResponse[] = [];
        let cursor: string | null = null;

        do {
            const objectsPage: PaginatedObjectsResponse = await suiClient.getOwnedObjects({
                owner: ownerAddress,
                options: {
                    showType: true,
                    showContent: true,
                },
                cursor,
                limit: 50,
            });

            allObjects = allObjects.concat(objectsPage.data);
            cursor = objectsPage.hasNextPage ? (objectsPage.nextCursor ?? null) : null;
        } while (cursor);

        console.log("All Objects count:", allObjects.length);

        // Find TreasuryCap for the coin type
        const treasuryCapObj = allObjects.find((obj) => {
            const objType = obj.data?.type;
            if (!objType) return false;

            // Check for TreasuryCap with the specific coin type
            if (objType.includes(`0x2::coin::TreasuryCap<${coinType}>`)) {
                return true;
            }

            // If coinType doesn't include the package ID, check for TreasuryCap with any coin type from this package
            if (!coinType.includes(normalizedPkgId) &&
                objType.includes('0x2::coin::TreasuryCap') &&
                objType.includes(normalizedPkgId)) {
                return true;
            }

            return false;
        });

        console.log("TreasuryCapObj found:", !!treasuryCapObj);
        const treasuryCap = treasuryCapObj?.data?.objectId || null;

        return {
            txId,
            treasuryCap,
        };

    } catch (error: unknown) {
        console.error("Error in getTokenData:", error);
        return {
            txId: null,
            treasuryCap: null,
        };
    }
};

// Utility functions
export async function deriveCoinType(
    suiClient: SuiClient,
    newPkgId: string,
): Promise<string> {

    if (!newPkgId) {
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

export async function deriveFullCoinType(
    suiClient: SuiClient,
    newPkgId: string,
): Promise<string> {

    if (!newPkgId) {
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
export const useGetMetadataField = (coinType: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ["packageMetadata", coinType],
        queryFn: () => getMetadataField(suiClient, coinType),
        enabled: !!coinType,
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