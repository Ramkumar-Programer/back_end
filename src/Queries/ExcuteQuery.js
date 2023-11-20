

// async function executeQuery(db, query, params = []) {
  
//     return new Promise((resolve, reject) => {
//         db.query(query, params, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

async function executeQuery(db, query, params = []) {
  try {
    const result = await db.promise().query(query, params);
    return result[0]; // Assuming you want to return the result data
  } catch (error) {
    throw error;
  }
}



module.exports = {
    executeQuery
}
