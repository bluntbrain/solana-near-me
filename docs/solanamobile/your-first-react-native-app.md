Your first React Native dApp
In this tutorial, you'll learn how to build a React Native dApp that sends a message to the Solana network.

What you will learn
How to use Mobile Wallet Adapter to connect to an installed wallet app.
How to connect to devnet, check your wallet balance, and request an airdrop of SOL.
How to use the memo program to write your message to the network
View your message on the Solana Explorer!
Prerequisites
Read the prerequisite setup guide before starting the tutorial. You'll need:

a running Android emulator or device to build and launch your app.
an MWA-compatible wallet installed on the same device.
an IDE/Editor of your choice.
This tutorial will be using the fakewallet app to test your app's integration with Mobile Wallet Adapter.

Clone the React Native dApp Scaffold
This dApp will build off the React Native Scaffold dApp which already has a simple user interface that allows you to connect to a mobile wallet, request an airdrop, and sign transactions.

Step 1. Initialize a template app
npx react-native init FirstDappTutorial --template https://github.com/solana-mobile/solana-mobile-dapp-scaffold.git


Step 2. Enter the directory and install the project dependencies.
yarn
npm
cd FirstDappTutorial && yarn install 

Step 3. Make sure your emulator/device is running, then build and launch the app.
npx react-native run-android

First run
At this point, your app should build, install into your device, and launch automatically. You should also see the Metro Bundler console window pop up. This is where you can read the logs and access the debug menu.

With React Native's fast refresh feature, you can edit the React components, save your changes, and immediately see your app UI update!

Scaffold dApp Components
Now lets quickly go over the features of the dApp Scaffold. If you want to skip to building the memo transaction, then jump to this section.

Connect Button
Clicking on the Connect Wallet button will 'connect' you to a locally installed MWA-compatible wallet. It uses the Mobile Wallet Adapter SDK to request authorization from the wallet and receives your wallet account's info, like the public key.

On click, it starts a wallet session with transact and calls authorizeSession from the AuthorizationProvider class.

await transact(async wallet => {
    await authorizeSession(wallet);
});

AuthorizationProvider is a helper class that manages wallet authorization. It calls wallet.authorize() on first connect, and for subsequent connects it re-uses the authToken in wallet.reauthorize().

const authorizeSession = useCallback(
    async (wallet: AuthorizeAPI & ReauthorizeAPI) => {
        const authorizationResult = await (authorization
        ? wallet.reauthorize({
            auth_token: authorization.authToken,
            identity: APP_IDENTITY,
            })
        : wallet.authorize({
            cluster: APP_CLUSTER,
            identity: APP_IDENTITY,
            }));
        console.log(authorizationResult);
        return (await handleAuthorizationResult(authorizationResult))
        .selectedAccount;
    },
    [authorization, handleAuthorizationResult],
);

Account Info
This is a simple component takes a balance in lamports and converts it to units of SOL for display.

Balance fetching
In the MainScreen.tsx component, we fetch the user's wallet balance when its available, and pass it into the AccountInfo component. To do so, we use the connection class and just call the getBalance function, which is part of the API spec.

const {connection} = useConnection();
const fetchAndUpdateBalance = useCallback(
    async (account: Account) => {
        const fetchedBalance = await connection.getBalance(account.publicKey);
        setBalance(fetchedBalance);
    },
    [connection],
);

Airdrop Button
This component takes in a user's wallet publicKey and requests an airdrop of lamports to that address on click. Again, we use the connection class and call the requestAirdrop RPC method, as part of the API spec.

const requestAirdrop = useCallback(async () => {
    const signature = await connection.requestAirdrop(
        selectedAccount.publicKey,
        LAMPORTS_PER_AIRDROP,
    );
    return await connection.confirmTransaction(signature);
}, [connection, selectedAccount]);

Sign Transaction/Message Button
The SignMessageButton component takes in a messageBuffer byte array and calls wallet.signMessages(). This requests the connected wallet to sign the message with the user's private key.

The SignTransactionButton component does several things on click. Within the wallet session, it constructs a Transaction with a SystemProgram.transfer instruction, then requests the wallet to provide a signature in the transaction.

Sign Message
Sign Transaction
const signMessage = useCallback(
    async (messageBuffer: Uint8Array) => {
        return await transact(async (wallet: Web3MobileWallet) => {
        // First, request for authorization from the wallet.
        const authorizationResult = await authorizeSession(wallet);

        // Sign the payload with the provided address from authorization.
        const signedMessages = await wallet.signMessages({
            addresses: [authorizationResult.address],
            payloads: [messageBuffer],
        });

        return signedMessages[0];
        });
    },
    [authorizeSession],
);

Send a memo transaction
Now that we've gone over the existing scaffold, lets add some new functionality to it.

Instead of a random transfer transaction, lets create a new transaction that records an immutable message on the Solana blockchain, using the Memo program. After that, we can view our message on the Solana Explorer.

Copy over the SignTransactionButton
Lets build off our existing SignTransactionButton, and copy it over into a new component renamed to SendMemoButton. Then, rename the signTransaction helper function into sendMemo.

Construct a memo program transaction
First, let's replace the existing randomTransferTransaction with a new transaction that calls the Solana Memo program address. Within the transact block, add this code and remove randomTransferTransaction.

import {TextEncoder} from 'text-encoding'; // TextEncoder library to convert stirng to buffer.

// Construct a message buffer from a string.
const message = "Hello Solana!";
const messageBuffer = new TextEncoder().encode(message) as Buffer

// Construct a 'Hello World' transaction and replace `randomTransferTransaction
const memoProgramTransaction = new Transaction({
    ...latestBlockhash,
    feePayer: authorizationResult.publicKey,
}).add(
    new TransactionInstruction({
    data: messageBuffer,
    keys: [],
    programId: new PublicKey(
        'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr', // Memo Program address
    ),
    }),
);


Request the wallet to sign and send a transaction
Next, instead of wallet.signTransactions(), now lets request our wallet to send the transaction for us, with wallet.signAndSendTransactions().

This is an optional feature that MWA wallets can choose to support, and fakewallet does support this. You can also directly use connection to send and confirm a transaction.

// Changed to `signAndSendTransactions.` and pass in `memoProgramTransaction`.
const transactionSignatures = await wallet.signAndSendTransactions({
    transactions: [memoProgramTransaction],
});

Confirm the transaction
Now, the last step is to confirm that the transaction was processed by the network. Add this to the send of the transact session and return the both [signature, confirmationRepsonse]. Read the docs learn more about transaction confirmation.

// Add this step to confirm that the transaction was proccessed by the network.
const confirmationResponse = await connection.confirmTransaction({
    signature: signature,
    ...latestBlockhash,
});

return [signature, confirmationResponse];

Add Solana Explorer link navigation
After transaction confirmation, we can now view the message on the Solana blockchain itself! To do so, we'll use the public tool Solana Explorer, construct an explorer URL, and prompt the user to navigate to the link through an alert.

// Show an alert with an explorer link when we have a confirmed memo transaction.
function showExplorerAlert(memoTransactionSignature: string, cluster: string) {
  const explorerUrl =
    'https://explorer.solana.com/tx/' +
    memoTransactionSignature +
    '?cluster=' +
    cluster;
  Alert.alert(
    'Success!',
    'Your message was successfully recorded. View your message on Solana Explorer:',
    [
      {text: 'View', onPress: () => Linking.openURL(explorerUrl)},
      {text: 'Cancel', style: 'cancel'},
    ],
  );
}

Update the button onPress
Almost done! Now just update the onPress handler in the button component to call sendMemo, handle errors, and show the explorer URL. Here is what the final code should look like at this step for sendMemo and the button component.

SendMemoButton
sendMemo
return (
    <Button
        title="Send Memo!"
        disabled={signingInProgress}
        onPress={async () => {
            if (signingInProgress) {
                return;
            }
            setSigningInProgress(true);
            try {
                const [memoTransactionSignature, confirmationResponse] = await sendMemo();
                const err = confirmationResponse.value.err;
                if (err) {
                console.log(
                    'Failed to record message:' +
                    (err instanceof Error ? err.message : err),
                );
                } else {
                    // APP_CLUSTER is either 'devnet', 'testnet', 'mainnet-beta'.
                    showExplorerAlert(memoTransactionSignature, APP_CLUSTER);
                }
            } finally {
                setSigningInProgress(false);
            }
        }}
    />
);

Finishing touches
Last step. All that's left is to render the new SendMemoButton in the app's MainScreen. Just change the existing SignTransactionButton component into the SendMemoButton component and you're done!

Make sure you request an airdrop of SOL before pressing the SendMemoButton, as you need to pay a small fee to send transactions on the network.

Congratulations!

You've finished the tutorial and built your first mobile dApp! Play around with the new SendMemoButton and view your message on the explorer. Make sure, you request an airdrop of SOL before trying to send the transaction.

Next steps
Explore guides and SDK references to learn more and create more advanced applications. Here are some links to explore:

Sample App Collection
If you want to see more examples of dApps, then check out this curated list of Solana mobile sample apps. It also includes a more robust version of the app built in this tutorial.
Guides/References
web3.js Javascript SDK reference
Writing your own Solana programs
Hello World Tutorial: A lengthier tutorial that teaches how to write MWA UI components.
