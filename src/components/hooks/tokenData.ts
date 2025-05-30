import { PaginatedObjectsResponse, SuiClient, SuiObjectResponse, SuiTransactionBlockResponse } from "@mysten/sui/client";
import { useQuery } from "@tanstack/react-query";
import { deriveFullCoinType } from "./getData";
import { normalizeSuiAddress } from "@mysten/sui/utils";
// import { CoinMetadata } from "@mysten/sui/client"

export type TokenType = "standard" | "regulated" | "closed-loop" | undefined;

export type Network = "mainnet" | "testnet" | "devnet";

export interface TokenData {
    pkgId: string;
    symbol: string;
    name: string;
    description: string;
    decimal: string;
    txId: string;
    owner: string;
    treasuryCap: string;
    metadata: string;
    denyCap?: string;
    coinId?: string;
    tokenId?: string;
    type: TokenType
    features?: {
        burnable?: boolean;
        mintable?: boolean;
        pausable?: boolean; // Always false for closed-loop and standard coin
        denylist?: boolean; // Always false for closed-loop and standard coin
        allowlist?: boolean; // Only true for closed-loop token
        transferRestrictions?: boolean; // Only true for closed-loop token
    };
}

const fetchTokenData = async (
    suiClient: SuiClient,
    pkgId: string,
    owner: string,
    tokenType: TokenType,
): Promise<TokenData> => {
    console.log("token type here", tokenType);
    if (!pkgId) {
        throw new Error("pkgId is required in tokenData");
    }
    const coinType = await deriveFullCoinType(suiClient, pkgId);
    const metadata = await suiClient.getCoinMetadata({ coinType });
    // const owner = await getPackageOwner(suiClient, pkgId); //make this work
    const { txId, treasuryCap, denyCap, coinId, tokenId } = await getTxIdsAndCaps(suiClient, pkgId, owner, coinType);

    const symbol = metadata?.symbol || "";
    const name = metadata?.name || "";
    const description = metadata?.description || "";
    const decimal = metadata?.decimals?.toString() || "";
    const metadataId = metadata?.id || "";

    const features =
        tokenType === "closed-loop"
            ? {
                burnable: true,
                mintable: true,
                pausable: false,
                denylist: false,
                allowlist: true,
                transferRestrictions: true,
            }
            : tokenType === "regulated"
                ? {
                    burnable: true,
                    mintable: true,
                    pausable: true,
                    denylist: true,
                    allowlist: false,
                    transferRestrictions: false,
                }
                : tokenType === "standard"
                    ? {
                        burnable: true,
                        mintable: true,
                        pausable: false,
                        denylist: false,
                        allowlist: false,
                        transferRestrictions: false,
                    }
                    : {};

    return {
        pkgId,
        symbol,
        name,
        description,
        decimal,
        metadata: metadataId,
        owner: owner,
        txId: txId ?? "",
        treasuryCap: treasuryCap ?? "",
        denyCap: denyCap ?? "",
        coinId: coinId ?? "",
        tokenId: tokenId ?? "",
        type: tokenType ?? undefined,
        features
    };
}

export const useFetchTokenData = (suiClient: SuiClient, pkgId: string, owner: string, tokenType: TokenType) => {
    const { data, isLoading, isError, refetch } = useQuery<TokenData, Error>({
        queryKey: ["tokenData", pkgId, tokenType],
        queryFn: () => fetchTokenData(suiClient, pkgId, owner, tokenType),
        enabled: !!pkgId,
    });

    return {
        data,
        isLoading,
        isError,
        refetch
    };
}

export async function getPackageOwner(client: SuiClient, packageId: string) {
    const object = await client.getObject({ id: packageId, options: { showOwner: true } });
    return object.data?.owner;
}

interface TxIdsAndCaps {
    txId: string | null;
    treasuryCap: string | null;
    denyCap?: string | null;
    coinId?: string | null;
    tokenId?: string | null;
}

export const getTxIdsAndCaps = async (
    suiClient: SuiClient,
    packageId: string,
    ownerAddress: string,
    coinType: string
): Promise<TxIdsAndCaps> => {
    try {
        const normalizedPkgId = normalizeSuiAddress(packageId);
        console.log("NormalizedPkgId:", normalizedPkgId);

        // Fetch transactions for the owner with proper pagination
        let allTransactions: SuiTransactionBlockResponse[] = [];
        let txCursor: string | null = null;
        let hasNextPage = true;

        while (hasNextPage) {
            const result = await suiClient.queryTransactionBlocks({
                filter: { FromAddress: ownerAddress },
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                },
                limit: 100,
                cursor: txCursor || undefined,
            });

            allTransactions = allTransactions.concat(result.data);
            hasNextPage = result.hasNextPage;
            txCursor = result.nextCursor ?? null;
        }

        console.log("allTransactions:", allTransactions);

        // Find transaction that published the package
        const publishTx = allTransactions.find((tx) => {
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
        console.log("publishTx:", publishTx);
        // seems to be working for only closed loop rn - need to fix

        const txId = publishTx?.effects?.transactionDigest || null;

        // Fetch owned objects for the owner with pagination
        let allObjects: SuiObjectResponse[] = [];
        let objCursor: string | null = null;

        do {
            const objectsPage: PaginatedObjectsResponse = await suiClient.getOwnedObjects({
                owner: ownerAddress,
                options: {
                    showType: true,
                    showContent: true,
                },
                cursor: objCursor,
                limit: 50,
            });

            allObjects = allObjects.concat(objectsPage.data);
            objCursor = objectsPage.hasNextPage ? (objectsPage.nextCursor ?? null) : null;
        } while (objCursor);


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

        const treasuryCap = treasuryCapObj?.data?.objectId || null;

        // Find DenyCap for the coin type if it exists
        const denyCapObj = allObjects.find((obj) => {
            const objType = obj.data?.type;
            if (!objType) return false;

            // Check for DenyCap with the specific coin type
            if (objType.includes(`0x2::coin::DenyCapV2<${coinType}>`)) {
                return true;
            }

            // If coinType doesn't include the package ID, check for DenyCap with any coin type from this package
            if (!coinType.includes(normalizedPkgId) &&
                objType.includes('0x2::coin::DenyCap') &&
                objType.includes(normalizedPkgId)) {
                return true;
            }

            return false;
        });

        const denyCap = denyCapObj?.data?.objectId || null;

        // Find coinId for the coin type if it exists
        const coinIdObj = allObjects.find((obj) => {
            const objType = obj.data?.type;
            if (!objType) return false;

            // Check for coinId with the specific coin type
            if (objType.includes(`0x2::coin::Coin<${coinType}>`)) {
                return true;
            }

            // If coinType doesn't include the package ID, check for coinId with any coin type from this package
            if (!coinType.includes(normalizedPkgId) &&
                objType.includes('0x2::coin::Coin') &&
                objType.includes(normalizedPkgId)) {
                return true;
            }

            return false;
        });

        const coinId = coinIdObj?.data?.objectId || null;

        // Find tokenId for the closed loop tokens
        const tokenIdObj = allObjects.find((obj) => {
            const objType = obj.data?.type;
            if (!objType) return false;

            // Check for tokenId with the specific token type
            if (objType.includes(`0x2::token::Token<${coinType}>`)) {
                return true;
            }

            // If coinType doesn't include the package ID, check for tokenId with any token type from this package
            if (!coinType.includes(normalizedPkgId) &&
                objType.includes('0x2::token::Token') &&
                objType.includes(normalizedPkgId)) {
                return true;
            }

            return false;
        });

        const tokenId = tokenIdObj?.data?.objectId || null;


        return {
            txId,
            treasuryCap,
            denyCap,
            coinId,
            tokenId,
        };

    } catch (error: unknown) {
        console.error("Error in getTokenData:", error);
        return {
            txId: null,
            treasuryCap: null,
            denyCap: null,
            coinId: null,
            tokenId: null
        };
    }
};

// async function getPublishTxAndTreasuryCap(client: SuiClient, packageId: string): Promise<TxIdsAndCaps> {
//     // Find transactions involving the packageId
//     const txs = await client.queryTransactionBlocks({
//         filter: { InputObject: packageId },
//         limit: 1,
//     });

//     if (!txs.data.length) return null;

//     const txid = txs.data[0].digest;
//     const txDetails = await client.getTransactionBlock({ digest: txid, options: { showObjectChanges: true } });

//     // Find TreasuryCap object in object changes
//     const treasuryCap = txDetails.objectChanges?.find(
//         (change) => change.objectType && change.objectType.includes('TreasuryCap')
//     );

//     return {
//         txid,
//         treasuryCap: treasuryCap?.objectId,
//     };
// }