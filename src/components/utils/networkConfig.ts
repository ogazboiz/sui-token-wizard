import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { testnetNftPackageId } from "./constants";


const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        devnet: {
            url: getFullnodeUrl("devnet"),
            variables: {
                nftPackageId: testnetNftPackageId,
            },
        },
        testnet: {
            url: getFullnodeUrl("testnet"),
            variables: {
                nftPackageId: testnetNftPackageId,
            },
        },
        mainnet: {
            url: getFullnodeUrl("mainnet"),
            variables: {
                nftPackageId: testnetNftPackageId,
            },
        },
    });

export { useNetworkVariable, useNetworkVariables, networkConfig };
