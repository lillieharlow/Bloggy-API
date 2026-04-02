// ========== Unique User Factories ==========

const buildUniqueUser = () => {
  const now = Date.now();
  return {
    username: `tester${now}`,
    email: `tester${now}@example.com`,
    password: 'secret123',
  };
};

module.exports = {
  buildUniqueUser,
};
