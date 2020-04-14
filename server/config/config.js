
//======================================================================
// Port
//======================================================================

process.env.PORT = process.env.PORT || '3000';

//======================================================================
// Enviroment
//======================================================================

process.env.NODE_ENV = process.env.NODE_ENV  || 'dev';

//======================================================================
// Database
//======================================================================

const url_db_dev = "mongodb://localhost:27017/Coffe";
const url_db_prod =  "mongodb+srv://manzano:MzWgQ4kS2QP1tyOP@cluster0-tltvr.mongodb.net/Coffe";

process.env.URL_DB  =  process.env.NODE_ENV === 'dev' ? url_db_dev : url_db_prod
