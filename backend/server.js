const dotenv = require('dotenv');
var path = require('path')

dotenv.config({ path: './config.env' });

const app = require('./app');

const dbVideoSharing = require('./config/database/db_index');

dbVideoSharing.connect();

//console.log(process.env);
//START SERVER
const port = process.env.PORT || 9000;
const server= app.listen(port, () => {
  console.log('App listening to ' + port);
});
