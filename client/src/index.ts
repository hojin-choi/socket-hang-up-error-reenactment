import http from 'http';
import https from 'https';

import CacheableLookup from 'cacheable-lookup';
import _ from 'lodash';
import Bluebird from 'bluebird';

import nodeFetch from './node-fetch';

const cacheable = new CacheableLookup();
const httpAgent = new http.Agent({ keepAlive: true, timeout: 5000 });
const httpsAgent = new https.Agent({ keepAlive: true, timeout: 5000 });
cacheable.install(httpAgent);
cacheable.install(httpsAgent);

async function invoke(index: number) {
  const result = await nodeFetch(`http://localhost:4021?t=${index}`, { agent: httpAgent });
  return result;
}

(async () => {
  const index_list = _.range(0, 10000);
  await Bluebird.each(index_list, async (index) => {
    console.log(index);
    const result = await invoke(index);
    const txt = await result.text();
    await Bluebird.delay(4999);
    console.log('---------');
  });
})();
