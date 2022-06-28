# Socket Hang Up 오류 재현

```sh
$ npm run start:server
```

```sh
$ npm run start:client
```

## server로그
```
--------
connect
/?t=0
process request
timeout
closed
5003 ms
--------
--------
connect
/?t=1
process request
timeout
closed
5003 ms
--------
```

## client로그
```
0
socket lookup
socket connect
socket ready
socket end
false
socket close
---------
1
socket lookup
socket connect
socket ready
---------
socket end
2
false
socket close
false
socket close
/socket-hang-up-test/node_modules/node-fetch/lib/index.js:1529
                        reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
          ^
FetchError: request to http://localhost:4021/?t=2 failed, reason: socket hang up
    at ClientRequest.<anonymous> (/socket-hang-up-test/node_modules/node-fetch/lib/index.js:1529:11)
    at ClientRequest.emit (node:events:527:28)
    at ClientRequest.emit (node:domain:475:12)
    at Socket.socketCloseListener (node:_http_client:427:11)
    at Socket.emit (node:events:539:35)
    at Socket.emit (node:domain:475:12)
    at TCP.<anonymous> (node:net:709:12) {
  type: 'system',
  errno: 'ECONNRESET',
  code: 'ECONNRESET'
}
```

## 결론
서버 keepAliveTimeout 과 클라이언트 http keepAlive timeout 이 동일하면서, 서버에서 socket connection 을 끊었을 때, 클라이언트 socket 이 close 되는 시점과 fetch 하는 시점이 맞물리면 `socket hang up` 또는 `ECONNRESET` 를 받을 수 있다.
