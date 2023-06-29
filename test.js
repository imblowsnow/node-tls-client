const tlsClient = require('./dist/index.js');
const {randomUUID} = require("crypto");


let session = new tlsClient.Session({
    clientIdentifier: "chrome_109",
});

session.proxy = "http://127.0.0.1:10809";

const headers = {
    "content-type": "application/json",
    'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJpbS5ibG93c25vd0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImh0dHBzOi8vYXBpLm9wZW5haS5jb20vYXV0aCI6eyJ1c2VyX2lkIjoidXNlci1oelRseE9LQlJCaTg0d2NINHJubENFZDUifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6ImF1dGgwfDYzOGYyMzkyOWIwN2QwNzhkYWI1MDgxMSIsImF1ZCI6WyJodHRwczovL2FwaS5vcGVuYWkuY29tL3YxIiwiaHR0cHM6Ly9vcGVuYWkub3BlbmFpLmF1dGgwYXBwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2ODc5MTQxNTYsImV4cCI6MTY4OTEyMzc1NiwiYXpwIjoiVGRKSWNiZTE2V29USHROOTVueXl3aDVFNHlPbzZJdEciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG1vZGVsLnJlYWQgbW9kZWwucmVxdWVzdCBvcmdhbml6YXRpb24ucmVhZCBvcmdhbml6YXRpb24ud3JpdGUifQ.cdpXJX9LrcNYx8WYDxWC_tO_lzrjr0F21ErSrutefHXDb1tWG_x6nJ-3jevgR9SfGj6lPDjw3-UgJZFhcnapdTFWCUoslCrljLV7hJ3A5_BgXAgvQ2L1HGXp5LB-IUdlh5VOccepiCqCirupwMQ4QLPbeWMhsrXuI5KdCuyu9v7ijQNJ0xNmbtMnTvnW3CzSKU5-KhNpKTs3zk-M-TX7g80PH4WxE38VrPksu26Pd1nJit6Stb3pULZTfxIK4oqndMdNWLA3HL0V8kAmuuSTR8LsUS86lYkjD3_HjwZnXYWnoEdVpRTA-7SyZ_jGGMyCC36XGeePIPhZNDKLBT-eWw',
    'accept-language': 'en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3',
    'cache-control': 'no-cache',
    'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cookie': 'safesearch_guest=Moderate; uuid_guest=' + randomUUID(),
    "user-agent": "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36"
};
function run(){
    let id = randomUUID()
    let time = new Date().getTime();
    let flag = false;
// 并发为1
    return session.post("https://chat.openai.com/backend-api/conversation", {
        stream: true,
        callback: (res) => {
            console.log(res.toString());
        },
        headers: headers,
        json: {
            "action": "next",
            "messages": [
                {
                    "id": randomUUID(),
                    "author": {
                        "role": "user"
                    },
                    "content": {
                        "content_type": "text",
                        "parts": [
                            "你是不是chatgpt4？"
                        ]
                    },
                    "metadata": {}
                }
            ],
            "parent_message_id": randomUUID(),
            "model": "gpt-4-mobile",
            "timezone_offset_min": -480,
            "history_and_training_disabled": false,
            "arkose_token": null
        }
    }).then((res) => {
        console.log("response：" + res.status) ;
        console.log("time：" + (new Date().getTime() - time));
    })
}
async function main(){
    run();
    // for (let i = 0; i < 50; i++) {
    //     await run();
    // }
}

main();

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
})
process.on("uncaughtException", (error) => {
    console.error('uncaughtException at:', error);
});
