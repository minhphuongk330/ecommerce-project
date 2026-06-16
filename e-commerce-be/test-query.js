const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'my_shop'
  });

  const [rows] = await connection.execute('SELECT id, name, price, stock, category_id, brand_id FROM product WHERE name LIKE "%Samsung%"');
  console.log('Samsung Products in DB:', rows);
  
  const [brands] = await connection.execute('SELECT * FROM brand');
  console.log('Brands in DB:', brands);

  const [categories] = await connection.execute('SELECT * FROM category');
  console.log('Categories in DB:', categories);
  
  await connection.end();
}

main().catch(console.error);
