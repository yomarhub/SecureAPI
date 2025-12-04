rm data/database.sqlite && touch $_ && sqlite3 data/database.sqlite --init create.sql .exit
node src/seed.js