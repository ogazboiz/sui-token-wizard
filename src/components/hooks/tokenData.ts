import { PaginatedObjectsResponse, SuiClient, SuiObjectResponse } from "@mysten/sui/client";
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
    coinCap?: string;
    type: TokenType
    features?: {
        burnable?: boolean;
        mintable?: boolean;
        pausable?: boolean;
        denylist?: boolean;
        allowlist?: boolean;
        transferRestrictions?: boolean;
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
    const { txId, treasuryCap } = await getTxnTreasury(suiClient, pkgId, owner, coinType);

    // const {txId, treasuryCap} = await getTxnTreasury(suiClient, coinType);
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
        owner: owner,
        txId: txId ?? "",
        treasuryCap: treasuryCap ?? "",
        type: tokenType ?? undefined,
        features: {
            burnable: true,
            mintable: true,
            pausable: true,
            denylist: true,
        }
    };
}

export const useFetchTokenData = (suiClient: SuiClient, pkgId: string, owner: string, tokenType: TokenType) => {
    const { data, isLoading, isError } = useQuery<TokenData, Error>({
        queryKey: ["tokenData", pkgId, tokenType],
        queryFn: () => fetchTokenData(suiClient, pkgId, owner, tokenType),
        enabled: !!pkgId,
    });

    return {
        data,
        isLoading,
        isError,
    };
}

export async function getPackageOwner(client: SuiClient, packageId: string) {
    const object = await client.getObject({ id: packageId, options: { showOwner: true } });
    return object.data?.owner;
}

// async function getPublishTxAndTreasuryCap(client: SuiClient, packageId: string): Promise<TxnTreasury> {
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

interface TxnTreasury {
    txId: string | null;
    treasuryCap: string | null;
}

export const getTxnTreasury = async (
    suiClient: SuiClient,
    packageId: string,
    ownerAddress: string,
    coinType: string
): Promise<TxnTreasury> => {
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
        console.log("transactions:", transactions);

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
        console.log("publishTx:", publishTx);

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