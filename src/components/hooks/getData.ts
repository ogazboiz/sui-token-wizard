import { useQuery } from "@tanstack/react-query";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { CoinMetadata, SuiClient } from "@mysten/sui/client";
import { normalizeSuiAddress } from "@mysten/sui/utils";

interface UseCoinMetadataParams {
    coinType: string;
}

interface UseCoinMetadataResult {
    data: CoinMetadata | null | undefined;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    refetch: () => void;
}

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

interface UseCoinMetadataParams {
    coinType: string;
    tokenData?: TokenData | null;
}

interface UseCoinMetadataResult {
    data: CoinMetadata | null | undefined;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    refetch: () => void;
}

interface UseDenyListParams {
    denyCap: string;
    coinType: string;
}

interface UseDenyListResult {
    data: string[] | undefined;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    refetch: () => void;
}

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
        // Query the package to get its modules
        const packageObject = await suiClient.getObject({
            id: normalizedPkgId,
            options: { showContent: true },
        });

        if (packageObject.data?.content?.dataType !== "package") {
            throw new Error("Specified ID is not a valid package");
        }

        const disassembled = packageObject.data?.content?.disassembled;
        let disassembledModuleName;
        if (disassembled && typeof disassembled === "object") {
            const moduleNames = Object.keys(disassembled); // ['u_regulated_coin', ...]
            // console.log("Module names:", moduleNames);
            disassembledModuleName = moduleNames[0];
        }

        // Construct the coinType
        return `${normalizedPkgId}::${disassembledModuleName}`;
    } catch (err) {
        throw new Error(`Failed to derive coinType: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
}

// async function getPackageMetadata(packageId: string) {
//   const response = await client.getObject({
//     id: packageId,
//     options: { showContent: true },
//   });

//   // The content field contains the MovePackage metadata
//   return response.data?.content;
// }

export const useGetPackageMetadata = (packageId: string) => {
    const suiClient = useSuiClient();
    return useQuery({
        queryKey: ["packageMetadata", packageId],
        queryFn: async () => {
            const metadata = await getMetadataField(suiClient, packageId);
            return metadata;
        }
    });
}


export async function getMetadataField(suiClient: SuiClient, objectId: string) {
    const object = await suiClient.getObject({ id: objectId, options: { showContent: true } });
    if (!object.data) {
        throw new Error("Object not found");
    }
    // @ts-expect-error: Sui object content fields are not typed in the SDK
    return object.data?.content?.fields;
}

export async function getDenyList(suiClient: SuiClient, denyCapId: string) {
    const object = await suiClient.getObject({ id: denyCapId, options: { showContent: true } });
    // @ts-expect-error: Sui object content fields are not typed in the SDK
    return object.data?.content?.fields;
}

// async function getAllCoins(suiClient: SuiClient, address: string) {
//     const coins = await suiClient.getAllCoins({ owner: address });
//     return coins.data;
// }

export const useGetAllCoins = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ['allCoins', address],
        queryFn: async () => {
            const coins = await suiClient.getAllCoins({
                owner: address
            });
            return coins;
        }
    });
}

async function getNftsByOwner(suiClient: SuiClient, address: string, nftType: string) {
  const response = await suiClient.getOwnedObjects({
    owner: address,
    options: {
      showType: true,
      showDisplay: true,
    },
  });

  // Filter objects by the NFT type
  const nfts = response.data.filter(
    (item) => item.data?.type === nftType
  );

  return nfts;
}

export const useGetNftsByOwner = (address: string, nftType: string) => {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ['nftsByOwner', address, nftType],
    queryFn: async () => {
      const nfts = await getNftsByOwner(suiClient, address, nftType);
      return nfts;
    }
  });
}

// export function useFetchCounterNft(address: string, packageId: string) {

//     // if (!account) {
//     //     return { data: [] };
//     // }

//     const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
//         'getOwnedObjects',
//         {
//             owner: address,
//             limit: 1,
//             filter: {
//                 MatchAll: [
//                     {
//                         StructType: `${packageId}::counter_nft::Counter`,
//                     },
//                     {
//                         AddressOwner: address,
//                     },
//                 ],
//             },
//             options: {
//                 showOwner: true,
//                 showType: true,
//             },
//         },
//         { queryKey: ['CounterNFT'] },
//     );

//     return {
//         data: data && data.data.length > 0 ? data?.data : [],
//         isLoading,
//         isError,
//         error,
//         refetch,
//     };
// }


export const useGetObjects = (account: string) => {
    const { data, isPending, error } = useSuiClientQuery(
        "getOwnedObjects",
        {
            owner: account?.address as string,
        },
        {
            enabled: !!account,
        },
    );

    return {
        data,
        isPending,
        error,
    };
}


export const useGetTransactions = (address: string) => {
    const suiClient = useSuiClient();
    return useQuery({
        queryKey: ['transactions', address],
        queryFn: async () => {
            const transactions = await suiClient.queryTransactionBlocks({
                filter: {
                    FromAddress: address
                }
            });
            return transactions;
        }
    });
};

export const useGetBalance = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ['balance', address],
        queryFn: async () => {
            const balance = await suiClient.getBalance({
                owner: address
            });
            return balance;
        }
    });
};

export const useGetOwnedObjects = (address: string) => {
    const suiClient = useSuiClient();

    return useQuery({
        queryKey: ['objects', address],
        queryFn: async () => {
            const objects = await suiClient.getOwnedObjects({
                owner: address
            });
            return objects;
        }
    });
};


// export const useGetObject = (objectId: string) => {
//     const suiClient = useSuiClient();

//     return useQuery({
//         queryKey: ['object', objectId],
//         queryFn: async () => {
//             const object = await suiClient.getObject({
//                 id: objectId
//             });
//             return object;
//         }
//     });
// };
