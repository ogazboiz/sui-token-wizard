import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { testnetNftPackageId, testnetCoinPackageId } from "./constants";


const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        devnet: {
            url: getFullnodeUrl("devnet"),
            variables: {
                nftPackageId: testnetNftPackageId,
                coinPackageId: testnetCoinPackageId,
            },
        },
        testnet: {
            url: getFullnodeUrl("testnet"),
            variables: {
                nftPackageId: testnetNftPackageId,
                coinPackageId: testnetCoinPackageId,
            },
        },
        mainnet: {
            url: getFullnodeUrl("mainnet"),
            variables: {
                nftPackageId: testnetNftPackageId,
                coinPackageId: testnetCoinPackageId,
            },
        },
    });

export { useNetworkVariable, useNetworkVariables, networkConfig };
