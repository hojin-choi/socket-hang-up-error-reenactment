import http from 'http';

const server = http.createServer((req, res) => {
  console.log(req.url);
  console.log('process request');
  res.end('message');
});

server.keepAliveTimeout = 5000;

server.on('connection', (socket) => {
  const start = new Date().getTime();
  socket.on('close', () => {
    console.log('closed');
    console.log(`${new Date().getTime() - start} ms`);
    console.log('--------');
  });

  socket.on('timeout', () => {
    console.log('timeout');
  });
  console.log('--------');
  console.log('connect');
});

server.listen(4021, () => {
  console.log('listening...');
});