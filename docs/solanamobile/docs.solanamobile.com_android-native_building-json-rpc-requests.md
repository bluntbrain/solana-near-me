---
url: "https://docs.solanamobile.com/android-native/building-json-rpc-requests"
title: "Deep dive: Building JSON RPC request methods | Solana Mobile Docs"
---

[Skip to main content](https://docs.solanamobile.com/android-native/building-json-rpc-requests#__docusaurus_skipToContent_fallback)

On this page

This deep dive explains how to use underlying primitives in the `rpc-core` library to construct RPC requests for any methods that aren't provided by `SolanaRpcClient`.

tip

If you only need to use the common RPC methods already supported by `SolanaRpcClient`, read the [_RPC Client usage guide_](https://docs.solanamobile.com/android-native/rpc-requests).

## Add dependencies [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#add-dependencies "Direct link to Add dependencies")

The [`rpc-core`](https://github.com/solana-mobile/rpc-core) library provides core classes and abstractions to build and submit requests according to the JSON-RPC 2.0 specification.

- build.gradle.kts

```
dependencies {
  implementation("com.solanamobile:rpc-core:0.2.7")
}
```

## Creating a JSON RPC Request [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#creating-a-json-rpc-request "Direct link to Creating a JSON RPC Request")

The `rpc-core` library defines a `JsonRpc20Request` constructor to conveniently construct a Solana JSON RPC request.

Populate the JSON object with the method name and JSON serialized parameters of a [Solana RPC method](https://docs.solana.com/api/http). The
constructor also includes a `requestId` parameter, as per JSON-RPC spec.

### Example: `getLatestBlockhash` RPC request [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#example-getlatestblockhash-rpc-request "Direct link to example-getlatestblockhash-rpc-request")

```codeBlockLines_e6Vv
fun createBlockhashRequest(commitment: String = "confirmed", requestId: String = "1") =
    JsonRpc20Request(
        // JSON RPC Method (ie: `getLatestBlockhash`, `getSignatureForAddresses`)
        method = "getLatestBlockhash",
        // Populate with JSON parameters
        params = buildJsonArray {
            addJsonObject {
                put("commitment", commitment)
            }
        },
        requestId
    )

```

## Defining the JSON RPC Response [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#defining-the-json-rpc-response "Direct link to Defining the JSON RPC Response")

After creating the request, create [Kotlin serializable classes](https://kotlinlang.org/docs/serialization.html#libraries) that define the expected response payload for that request.

In the following example, we are defining the expected response of the `getLatestBlockhash` request using the `kotlinx.serialization` library.

### Example: `getLatestBlockhash` RPC response [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#example-getlatestblockhash-rpc-response "Direct link to example-getlatestblockhash-rpc-response")

```codeBlockLines_e6Vv
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.*

@Serializable
class BlockhashResponse(val value: BlockhashInfo)

@Serializable
class BlockhashInfo(
    val blockhash: String,
    val lastValidBlockHeight: Long
)

// Additionally, define an exception in case of failure during request
class BlockhashException(message: String? = null, cause: Throwable? = null) : RuntimeException(message, cause)

```

## Implement `HttpNetworkDriver` [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#implement-httpnetworkdriver "Direct link to implement-httpnetworkdriver")

The `rpc-core` library defines a `HttpNetworkDriver` interface that is used to make network requests.

```codeBlockLines_e6Vv
interface HttpRequest {
    val url: String
    val method: String
    val properties: Map<String, String>
    val body: String?
}

interface HttpNetworkDriver {
    suspend fun makeHttpRequest(request: HttpRequest): String
}

```

You can use a common networking package like the Ktor library to implement the `makeHttpRequest` method. The following
is an example from the [Kotlin Jetpack Compose Scaffold sample app](https://github.com/solana-mobile/solana-kotlin-compose-scaffold/blob/main/app/src/main/java/com/example/solanakotlincomposescaffold/networking/HttpDriver.kt).

```codeBlockLines_e6Vv
import com.solana.networking.HttpNetworkDriver
import com.solana.networking.HttpRequest
import io.ktor.client.request.*
import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.statement.bodyAsText
import io.ktor.http.HttpMethod

class KtorHttpDriver : HttpNetworkDriver {
    override suspend fun makeHttpRequest(request: HttpRequest): String =
        HttpClient(Android).use { client ->
            client.request(request.url) {
                method = HttpMethod.parse(request.method)
                request.properties.forEach { (k, v) ->
                    header(k, v)
                }
                setBody(request.body)
            }.bodyAsText()
        }
}

```

## Sending RPC requests [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#sending-rpc-requests "Direct link to Sending RPC requests")

After putting these parts together, use the `Rpc20Driver` class to point to an RPC uri, send
the request, and receive a response.

```codeBlockLines_e6Vv
// import com.example.solanakotlincomposescaffold.networking.KtorHttpDriver
import com.solana.networking.Rpc20Driver
import com.solana.rpccore.JsonRpc20Request
import com.solana.transaction.Blockhash
import java.util.UUID

fun getLatestBlockhash(): Blockhash {
    // Create the Rpc20Driver and specify the RPC uri and network driver
    val rpc = Rpc20Driver("https://api.devnet.solana.com", KtorHttpDriver())

    // Construct the RPC request
    val requestId = UUID.randomUUID().toString()
    val request = createBlockhashRequest(commitment, requestId)

    // Send the request and provide the serializer for the expected response
    val response = rpc.makeRequest(request, BlockhashResponse.serializer())

    response.error?.let { error ->
        throw BlockhashException("Could not fetch latest blockhash: ${error.code}, ${error.message}")
    }

    // Unwrap the response to receive the base58 blockhash string
    val base58Blockhash = response.result?.value?.blockhash

    // Return a `Blockhash` object from the web3-solana library
    Blockhash.from(base58Blockhash
        ?: throw BlockhashException("Could not fetch latest blockhash: UnknownError"))
}

```

## Next steps [​](https://docs.solanamobile.com/android-native/building-json-rpc-requests\#next-steps "Direct link to Next steps")

- Browse the [full list](https://docs.solana.com/api/http) of Solana RPC HTTP Methods

- [Add dependencies](https://docs.solanamobile.com/android-native/building-json-rpc-requests#add-dependencies)
- [Creating a JSON RPC Request](https://docs.solanamobile.com/android-native/building-json-rpc-requests#creating-a-json-rpc-request)
  - [Example: `getLatestBlockhash` RPC request](https://docs.solanamobile.com/android-native/building-json-rpc-requests#example-getlatestblockhash-rpc-request)
- [Defining the JSON RPC Response](https://docs.solanamobile.com/android-native/building-json-rpc-requests#defining-the-json-rpc-response)
  - [Example: `getLatestBlockhash` RPC response](https://docs.solanamobile.com/android-native/building-json-rpc-requests#example-getlatestblockhash-rpc-response)
- [Implement `HttpNetworkDriver`](https://docs.solanamobile.com/android-native/building-json-rpc-requests#implement-httpnetworkdriver)
- [Sending RPC requests](https://docs.solanamobile.com/android-native/building-json-rpc-requests#sending-rpc-requests)
- [Next steps](https://docs.solanamobile.com/android-native/building-json-rpc-requests#next-steps)