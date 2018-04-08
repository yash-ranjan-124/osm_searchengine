const tape = require('tape');
const request = require('request');
const proxyquire = require('proxyquire').noCallThru();
const fs = require('fs');
const path = require('path');
const mocklogger = require('pelias-mock-logger');

tape('entry point tests', (test) => {
  test.test('finite/non-blank lat/lon should call lookup and return result', (t) => {
    const logger = mocklogger();
    const app = proxyquire('../app', {
      'pelias-wof-admin-lookup': {
        localResolver: () => {
          return {
            lookup: (centroid, layers, callback) => {
              t.deepEquals(centroid, { lat: 12.121212, lon: 21.212121 });
              t.deepEquals(layers, undefined);
              callback(undefined, 'this is the result');
            }
          };
        }
      },
      'pelias-logger': logger
    })();
    const server = app.listen();
    const port = server.address().port;

    request.get(`http://localhost:${port}/21.212121/12.121212`, (err, response, body) => {
      t.ok(logger.isInfoMessage(/GET \/21.212121\/12.121212 /));
      t.notOk(err);
      t.equals(response.statusCode, 200);
      t.equals(body, 'this is the result');
      t.end();
      server.close();
    });
  });

  test.test('layers should be passed to lookup when supplied', t => {
    const logger = mocklogger();

    const app = proxyquire('../app', {
      'pelias-wof-admin-lookup': {
        localResolver: () => {
          return {
            lookup: (centroid, layers, callback) => {
              t.deepEquals(centroid, { lat: 12.121212, lon: 21.212121 });
              t.deepEquals(layers, ['layer1', 'layer2']);
              callback(undefined, 'this is the result');
            }
          };
        }
      },
      'pelias-logger': logger
    })();
    const server = app.listen();
    const port = server.address().port;

    request.get(`http://localhost:${port}/21.212121/12.121212?layers=%20layer1%20,,%20layer2%20`, (err, response, body) => {
      t.ok(logger.isInfoMessage(/GET \/21.212121\/12.121212\?layers=%20layer1%20,,%20layer2%20 /));
      t.notOk(err);
      t.equals(response.statusCode, 200);
      t.equals(body, 'this is the result');
      t.end();
      server.close();
    });
  });

  test.test('layers trimmable to empty string should pass undefined to lookup', t => {
    const logger = mocklogger();
    const app = proxyquire('../app', {
      'pelias-wof-admin-lookup': {
        localResolver: () => {
          return {
            lookup: (centroid, layers, callback) => {
              t.deepEquals(centroid, { lat: 12.121212, lon: 21.212121 });
              t.deepEquals(layers, undefined);
              callback(undefined, 'this is the result');
            }
          };
        }
      },
      'pelias-logger': logger
    })();
    const server = app.listen();
    const port = server.address().port;

    request.get(`http://localhost:${port}/21.212121/12.121212?layers=%20`, (err, response, body) => {
      t.ok(logger.isInfoMessage(/GET \/21.212121\/12.121212\?layers=%20 /));
      t.notOk(err);
      t.equals(response.statusCode, 200);
      t.equals(body, 'this is the result');
      t.end();
      server.close();
    });
  });

  test.test('layers reduceable to all empty strings should pass undefined to lookup', t => {
    const logger = mocklogger();
    const app = proxyquire('../app', {
      'pelias-wof-admin-lookup': {
        localResolver: () => {
          return {
            lookup: (centroid, layers, callback) => {
              t.deepEquals(centroid, { lat: 12.121212, lon: 21.212121 });
              t.deepEquals(layers, undefined);
              callback(undefined, 'this is the result');
            }
          };
        }
      },
      'pelias-logger': logger
    })();
    const server = app.listen();
    const port = server.address().port;

    request.get(`http://localhost:${port}/21.212121/12.121212?layers=,,`, (err, response, body) => {
      t.ok(logger.isInfoMessage(/GET \/21.212121\/12.121212\?layers=,, /));
      t.notOk(err);
      t.equals(response.statusCode, 200);
      t.equals(body, 'this is the result');
      t.end();
      server.close();
    });
  });

  test.test('request not matching desired path should return 404', (t) => {
    const logger = mocklogger();
    const app = proxyquire('../app', {
      'pelias-wof-admin-lookup': {
        localResolver: () => {
          return {
            lookup: () => {
              throw Error('lookup should not have been called');
            }
          };
        }
      },
      'pelias-logger': logger
    })();
    const server = app.listen();
    const port = server.address().port;

    request.get(`http://localhost:${port}/21.212121`, (err, response, body) => {
      t.ok(logger.hasInfoMessages());
      t.notOk(err);
      t.equals(response.statusCode, 404);
      t.end();
      server.close();
    });
  });

  test.test('non-blank/finite lat should return 400', (t) => {
    ['a', NaN, Infinity, '{}', false, null, undefined, ' '].forEach((bad_lat_value) => {
      const logger = mocklogger();

      const app = proxyquire('../app', {
        'pelias-wof-admin-lookup': {
          localResolver: () => {
            return {
              lookup: () => {
                throw Error('lookup should not have been called');
              }
            };
          }
        },
        'pelias-logger': logger
      })();

      const server = app.listen();
      const port = server.address().port;

      request.get(encodeURI(`http://localhost:${port}/21.212121/${bad_lat_value}`), (err, response, body) => {
        t.ok(logger.hasInfoMessages());
        t.notOk(err);
        t.equals(response.statusCode, 400);
        t.equals(body, 'Cannot parse input');
        server.close();
      });
    });
    t.end();
  });

  test.test('non-blank/finite lon should return 400', (t) => {
    ['a', NaN, Infinity, '{}', false, null, undefined, ' '].forEach((bad_lon_value) => {
      const logger = mocklogger();
      const app = proxyquire('../app', {
        'pelias-wof-admin-lookup': {
          localResolver: () => {
            return {
              lookup: () => {
                throw Error('lookup should not have been called');
              }
            };
          }
        },
        'pelias-logger': logger
      })();

      const server = app.listen();
      const port = server.address().port;

      request.get(encodeURI(`http://localhost:${port}/${bad_lon_value}/21.212121`), (err, response, body) => {
        t.ok(logger.hasInfoMessages());
        t.notOk(err);
        t.equals(response.statusCode, 400);
        t.equals(body, 'Cannot parse input');
        server.close();
      });
    });
    t.end();
  });

  test.test('presence of any do_not_track header should log request without lat/lon', (t) => {
    ['DNT', 'dnt', 'do_not_track'].forEach((header) => {
      const logger = mocklogger();

      const app = proxyquire('../app', {
        'pelias-wof-admin-lookup': {
          localResolver: () => {
            return {
              lookup: (centroid, layers, callback) => {
                t.deepEquals(centroid, { lat: 12.121212, lon: 21.212121 });
                t.deepEquals(layers, undefined);
                callback(undefined, 'this is the result');
              }
            };
          }
        },
        'pelias-logger': logger
      })();
      const server = app.listen();
      const port = server.address().port;

      const options = {
        url: `http://localhost:${port}/21.212121/12.121212`,
        headers: {}
      };

      options.headers[header] = `${header} header value`;

      request(options, (err, response, body) => {
        t.ok(logger.isInfoMessage(/GET \/\[removed\]\/\[removed\] /));
        t.notOk(err);
        t.equals(response.statusCode, 200);
        t.equals(body, 'this is the result');

        server.close();
      });
    });
    t.end();
  });
});
