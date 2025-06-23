import mysql from 'mysql2/promise';
//  create the connection to database
const  db = async()=>{
    const getConnection =  await mysql.createConnection({
        host:"localhost",
        password:process.env.PASSWORD,
        user :"root",
        database:"laptopshop",
        port:3306,     
})
    return getConnection;
}



export {db}