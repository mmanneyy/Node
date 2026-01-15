const validateUser = (data, users) => {
  if (!data.email || !data.name || !data.password) {
    throw new Error('Some fileds required');
  }
  for (const [key, user] of Object.entries(users)) {
    if (data.email === user.email) {
      throw new Error('Email must be unique');
    }
  }
};

module.exports = validateUser;