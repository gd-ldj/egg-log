'use strict';

const mock = require('egg-mock');

describe('test/log.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/log-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, log')
      .expect(200);
  });
});
