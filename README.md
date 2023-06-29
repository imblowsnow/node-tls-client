# Node-TLS-Client

Node-TLS-Client is an advanced HTTP library based on requests and tls-client.

# Installation

```
npm install node-tls-client
```

# Examples

The syntax is inspired by [requests](https://github.com/psf/requests), so its very similar and there
are only very few things that are different.

Example 1 - Preset:

```javascript
const TlsClient = require('node-tls-client');

// You can also use the following as `client_identifier`:
// Chrome --> chrome_103, chrome_104, chrome_105, chrome_106, chrome_107, chrome_108
// Firefox --> firefox_102, firefox_104
// Opera --> opera_89, opera_90
// Safari --> safari_15_3, safari_15_6_1, safari_16_0
// iOS --> safari_ios_15_5, safari_ios_15_6, safari_ios_16_0
// iPadOS --> safari_ios_15_6

const res = TlsClient.get(
    'https://www.example.com/',
    {
        headers: {
            "key1": "value1",
        },
        proxy: "http://user:password@host:port"
    }
);

// or

const session = new TlsClient.Session({
    clientIdentifier: "chrome_105",
});

const res = session.get(
    'https://www.example.com/',
    {
        headers: {
            "key1": "value1",
        },
        proxy: "http://user:password@host:port"
    }
);
```

Example 2 - Custom:

```javascript
const TlsClient = require('tls-client');

const session = new TlsClient.Session({
    ja3String: "771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0",
    h2Settings: {
        "HEADER_TABLE_SIZE": 65536,
        "MAX_CONCURRENT_STREAMS": 1000,
        "INITIAL_WINDOW_SIZE": 6291456,
        "MAX_HEADER_LIST_SIZE": 262144
    },
    h2SettingsOrder: [
        "HEADER_TABLE_SIZE",
        "MAX_CONCURRENT_STREAMS",
        "INITIAL_WINDOW_SIZE",
        "MAX_HEADER_LIST_SIZE"
    ],
    supportedSignatureAlgorithms: [
        "ECDSAWithP256AndSHA256",
        "PSSWithSHA256",
        "PKCS1WithSHA256",
        "ECDSAWithP384AndSHA384",
        "PSSWithSHA384",
        "PKCS1WithSHA384",
        "PSSWithSHA512",
        "PKCS1WithSHA512",
    ],
    supportedVersions: ["GREASE", "1.3", "1.2"],
    keyShareCurves: ["GREASE", "X25519"],
    certCompressionAlgo: "brotli",
    pseudoHeaderOrder: [
        ":method",
        ":authority",
        ":scheme",
        ":path"
    ],
    connectionFlow: 15663105,
    headerOrder: [
        "accept",
        "user-agent",
        "accept-encoding",
        "accept-language"
    ]
});

const res = session.post(
    "https://www.example.com/",
    {
        headers: {
            "key1": "value1",
        },
        json: {
            "key1": "key2"
        }
    }
);
```

# Acknowledgements

[tls-client](https://github.com/bogdanfinn/tls-client)
[python-tls-client](https://github.com/florianregaz/python-tls-client)
