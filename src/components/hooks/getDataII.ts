import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";
import { SuiClient, SuiObjectData } from "@mysten/sui/client";
import { normalizeSuiAddress } from "@mysten/sui/utils";

interface CoinBalance {
  coinType: string;
  balance: bigint;
  coinObjects: SuiObjectData[];
}

interface UseUserCoinsParams {
  address: string;
  coinType?: string; // Optional coinType to filter (e.g., "0x2::sui::SUI")
}

interface UseUserCoinsResult {
  data: CoinBalance[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  refetch: () => void;
}

async function fetchUserCoins(
  suiClient: SuiClient,
  address: string,
  coinType?: string,
): Promise<CoinBalance[]> {
  if (!address) {
    throw new Error("Address is required");
  }

  const normalizedAddress = normalizeSuiAddress(address);
  const normalizedCoinType = coinType ? normalizeSuiAddress(coinType) : undefined;

  try {
    // Fetch all owned objects with pagination
    const coinObjects: SuiObjectData[] = [];
    let cursor: string | null = null;

    do {
      const response = await suiClient.getOwnedObjects({
        owner: normalizedAddress,
        options: { showContent: true, showType: true },
        cursor,
      });

      const objects = response.data
        .filter(
          (obj) =>
            !!obj.data &&
            typeof obj.data.type === "string" &&
            obj.data.type.startsWith("0x2::coin::Coin<"),
        )
        .map((obj) => obj.data as SuiObjectData);

      coinObjects.push(...objects);
      cursor = response.hasNextPage ? (response.nextCursor ?? null) : null;
    } while (cursor);

    // Group coins by coinType
    const coinMap = new Map<string, CoinBalance>();

    console.log(coinObjects);
    for (const obj of coinObjects) {
      const typeMatch = obj.data?.type?.match(/0x2::coin::Coin<(.+)>/);
      if (!typeMatch) continue;

      const objCoinType = normalizeSuiAddress(typeMatch[1]);
      if (normalizedCoinType && objCoinType !== normalizedCoinType) continue;

      const balanceField = (obj.data.content as any)?.fields?.balance;
      const balance = BigInt(balanceField || 0);

      if (coinMap.has(objCoinType)) {
        const existing = coinMap.get(objCoinType)!;
        existing.balance += balance;
        existing.coinObjects.push(obj);
      } else {
        coinMap.set(objCoinType, {
          coinType: objCoinType,
          balance,
          coinObjects: [obj],
        });
      }
    }

    return Array.from(coinMap.values());
  } catch (err) {
    throw new Error(`Failed to fetch user coins: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}

async function fetchDenyList(
  suiClient: SuiClient,
  denyCap: string,
  coinType: string,
): Promise<string[]> {
  if (!denyCap || !coinType) {
    throw new Error("denyCap and coinType are required");
  }

  const normalizedCoinType = normalizeSuiAddress(coinType);
  const normalizedDenyCap = normalizeSuiAddress(denyCap);

  try {
    // Fetch the DenyCap object to get the DenyList ID
    const denyCapObject = await suiClient.getObject({
      id: normalizedDenyCap,
      options: { showContent: true },
    });
    console.log("denyCapObject", denyCapObject);

    if (
      !denyCapObject.data ||
      denyCapObject.data.content?.type !== "0x2::deny_list::DenyCap"
    ) {
      throw new Error("Invalid DenyCap object");
    }

    const denyListId = (denyCapObject.data.content as any).fields.deny_list;
    console.log("denyListId", denyListId);
    if (!denyListId) {
      throw new Error("DenyList ID not found in DenyCap");
    }

    // Fetch the DenyList object
    const denyListObject = await suiClient.getObject({
      id: denyListId,
      options: { showContent: true },
    });
    console.log("denyListObject", denyListObject);

    if (
      !denyListObject.data ||
      denyListObject.data.content?.type !== "0x2::deny_list::DenyList"
    ) {
      throw new Error("Invalid DenyList object");
    }

    // Fetch dynamic fields for the DenyList to get denied addresses
    const dynamicFields = await suiClient.getDynamicFields({ parentId: denyListId });

    // Filter for the coinType-specific deny list (stored as a table)
    const coinDenyListField = dynamicFields.data.find(
      (field) => field.name.type === normalizedCoinType,
    );

    if (!coinDenyListField) {
      return []; // No denied addresses for this coin type
    }

    // Fetch the table of denied addresses
    const tableId = coinDenyListField.objectId;
    const tableObjects = await suiClient.getDynamicFields({ parentId: tableId });

    // Extract addresses from the table
    const deniedAddresses = tableObjects.data
      .filter((field) => field.name.type === "address")
      .map((field) => field.name.value as string);

    return deniedAddresses;
  } catch (err) {
    throw new Error(`Failed to fetch denylist: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}

export function useDenyList({ denyCap, coinType }: UseDenyListParams): UseDenyListResult {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["denyList", denyCap, coinType],
    queryFn: () => fetchDenyList(suiClient, denyCap, coinType),
    enabled: !!denyCap && !!coinType,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useCoinMetadata({ coinType, tokenData }: UseCoinMetadataParams): UseCoinMetadataResult {
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["coinMetadata", coinType || tokenData?.newPkgId || ""],
    queryFn: async () => {
      let finalCoinType = coinType;
      if (!finalCoinType && tokenData) {
        finalCoinType = await deriveCoinType(suiClient, tokenData);
      }

      if (!finalCoinType) {
        throw new Error("Coin type or tokenData is required");
      }

      const normalizedCoinType = normalizeSuiAddress(finalCoinType);
      const metadata = await suiClient.getCoinMetadata({ coinType: normalizedCoinType });
      return metadata;
    },
    enabled: !!(coinType || (tokenData?.newPkgId && tokenData?.symbol)),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}