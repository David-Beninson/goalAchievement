import { MongoClient } from "mongodb";

const { MONGO_URL, MONGO_DB } = process.env;

if (!MONGO_URL) {
  throw new Error("No URL provided");
}

if (!MONGO_DB) {
  throw new Error("No database name provided");
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGO_URL, opts).then((client) => {
      console.log("Connected to MongoDB!");
      return {
        client,
        db: client.db(MONGO_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
