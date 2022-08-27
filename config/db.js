const mongodb = require("mongodb")

let db

module.exports.getDB = () => {
  if (!db) {
    this.connectDB()
  }
  return db
}

module.exports.connectDB = () => {
  return new Promise((resolve, reject) => {
    // Connecting to Database and listening to server
    mongodb.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err, client) {
        if (err) {
          reject(err)
        } else {
          db = client.db()
          resolve(db)
        }
      }
    )
  })
}
