import http from 'http';
import app from './app';
import config from './src/utils/config';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
