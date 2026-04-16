// ========== Unique User Factory ==========

const buildUniqueUser = () => {
  const now = Date.now();
  return {
    username: `tester${now}`,
    email: `tester${now}@example.com`,
    password: 'secret123',
  };
};

// ========== Test DB URI Builder ==========
const BASE_TEST_DB_URI = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/bloggy_test';

const buildSuiteDbUri = (baseUri, suffix) => {
  const [uriWithoutQuery, query = ''] = baseUri.split('?');
  const lastSlashIndex = uriWithoutQuery.lastIndexOf('/');

  if (lastSlashIndex === -1) {
    return `${baseUri}_${suffix}`;
  }

  const prefix = uriWithoutQuery.slice(0, lastSlashIndex + 1);
  const dbName = uriWithoutQuery.slice(lastSlashIndex + 1) || 'bloggy_test';

  return `${prefix}${dbName}_${suffix}${query ? `?${query}` : ''}`;
};

module.exports = {
  buildUniqueUser,
  BASE_TEST_DB_URI,
  buildSuiteDbUri,
};
