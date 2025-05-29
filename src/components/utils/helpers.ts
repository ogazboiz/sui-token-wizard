import { deriveFullCoinType } from "../hooks/getData"
import { SuiClient } from "@mysten/sui/client";

export const detectTokenType = (coinType: string): 'standard' | 'regulated' | 'closed-loop' => {
    if (coinType.includes("regulated_coin")) {
        return "regulated"
    } else if (coinType.includes("token")) {
        return "closed-loop"
    } else if (coinType.includes("my_coin")) {
        return "standard"
    }
    return "standard"
}

export const extractPackageIdFromCoinType = (coinType: string): string => {
    const parts = coinType.split("::")
    return parts[0] // This is the package ID
}

export const extractPackageIdFromObject = (objectId: string): string => {
    return objectId.split("::")[0] || objectId
}

export const detectTokenTypeFromPackageId = async (suiClient: SuiClient, pkgId: string): Promise<'standard' | 'regulated' | 'closed-loop' | null> => {
    const derivedCoinType = await deriveFullCoinType(suiClient, pkgId);

    if (derivedCoinType) {
        return detectTokenType(derivedCoinType);
    }

    return null;
}