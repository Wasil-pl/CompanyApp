const NODE_ENV = process.env.NODE_ENV;

exports.DB_URI =
  NODE_ENV === 'production'
    ? 'url to remote db'
    : NODE_ENV === 'test'
    ? 'mongodb://localhost:27017/companyDBtest'
    : 'mongodb://localhost:27017/companyDB';
