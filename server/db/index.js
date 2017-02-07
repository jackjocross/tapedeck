import mongoose from 'mongoose';

let db;
let tokenSchema;
let Token;

const initDb = () => {
  // Setting up DB
  db = mongoose.connection;
  mongoose.connect('mongodb://localhost/tapedeck');
  db.on('error', () => console.error('connection error'));
  db.once('open', () => {
    console.log('DB Connection Successful!');
  });

  tokenSchema = mongoose.Schema({
    cookie: String,
    access_token: String,
    refresh_token: String,
    plugins: Object,
  });
  tokenSchema.index({ cookie: 1, access_token: 1, refresh_token: 1 });

  Token = mongoose.model('Token', tokenSchema);
};

export const insertOrUpdateDb = (opts) => {
  console.log('Updating db..', opts);
  const { cookie } = opts;
  return Token.findOneAndUpdate({ cookie }, opts, { upsert: true }).exec();
};

export const loadDb = () => {
  console.log('Loading db..');
  return Token.find({}, 'refresh_token').exec();
};

export const loadFromDb = (opts) => {
  console.log('Loading from db..', opts);
  const { cookie } = opts;
  return Token.findOne({ cookie }).exec();
};

export default initDb;
