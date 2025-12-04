const bcrypt = require('bcrypt');
const saltRounds = 10;

async function CheckHash(plainTextPassword, hash) {
  return await bcrypt.compare(plainTextPassword, hash);
}

async function Hash(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  Hash(process.argv[2]).then(hash => console.log(hash));
}

if (module == require.main) main();

module.exports = { Hash, CheckHash };