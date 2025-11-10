// Simpan sebagai db-config.ts dan ubah kredensial Anda
// JANGAN commit file ini ke git karena berisi password!

export const DB_CONFIG = {
  host: "localhost",
  user: "root",
  password: "", // XAMPP default kosong
  database: "newparfum",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}
