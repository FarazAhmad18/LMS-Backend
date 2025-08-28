const bcrypt = require('bcrypt');

(async () => {
  const hashed = await bcrypt.hash('12345678', 10);
  console.log('Hashed password:', hashed);
})();
