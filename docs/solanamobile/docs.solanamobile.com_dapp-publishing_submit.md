---
url: "https://docs.solanamobile.com/dapp-publishing/submit"
title: "Submit your dApp release | Solana Mobile Docs"
---

[Skip to main content](https://docs.solanamobile.com/dapp-publishing/submit#__docusaurus_skipToContent_fallback)

On this page

After minting a Publisher and App NFT, you will need to mint a **Release NFT** in order to submit for app review.

A Release NFT:

- Contains metadata that represents a specific release version of an app.
- Should be newly created each time an updated app version is submitted.

## Mint a release NFT [​](https://docs.solanamobile.com/dapp-publishing/submit\#mint-a-release-nft "Direct link to Mint a release NFT")

Using the same wallet that contains your Publisher and App NFTs, run this command.

```codeBlockLines_e6Vv
npx dapp-store create release -k <path_to_your_keypair> -b <path_to_your_android_sdk_build_tools> [-u <mainnet_beta_rpc_url>]

```

**You will repeat this step for each new version of your dApp you want to release**. The mint address of the latest release is recorded in your configuration file.

tip

When using CLI version >= `0.8.0`, the following commands will submit a Solana transaction that includes a default priority fee of `500000` lamports.

To customize this value, use param `-p` or `--priority-fee-lamports <priority-fee-lamports>`

caution

Please make sure your network connection is reliable and has a minimum upload speed of 0.25 megabytes per second.

## Submit your app [​](https://docs.solanamobile.com/dapp-publishing/submit\#submit-your-app "Direct link to Submit your app")

After minting a complete set of on-chain NFTs (publisher, dApp, and release), you may choose to submit them to the Solana dApp Publisher Portal, as a candidate for inclusion in the Solana dApp Store catalog:

```codeBlockLines_e6Vv
npx dapp-store publish submit -k <path_to_your_keypair> -u <mainnet_beta_rpc_url> --requestor-is-authorized --complies-with-solana-dapp-store-policies

```

The two flags for this command ( `--requestor-is-authorized` and `--complies-with-solana-dapp-store-policies`) are attestations from the requestor that this dApp is compliant with Solana dApp Store policies, and that they are authorized to submit this request to the Solana dApp Publisher Portal.

## Get in contact for App Review [​](https://docs.solanamobile.com/dapp-publishing/submit\#get-in-contact-for-app-review "Direct link to Get in contact for App Review")

Congrats! You've successfully submitted your app. Now, we'll review your app based on our policies.

1. Join the Solana Mobile Discord.
2. In the `#developer` channel, get the developer role.
3. Leave a message in the `#dapp-store` channel that you've completed app review.
4. We'll be in contact through the channel shortly after.

- [Mint a release NFT](https://docs.solanamobile.com/dapp-publishing/submit#mint-a-release-nft)
- [Submit your app](https://docs.solanamobile.com/dapp-publishing/submit#submit-your-app)
- [Get in contact for App Review](https://docs.solanamobile.com/dapp-publishing/submit#get-in-contact-for-app-review)