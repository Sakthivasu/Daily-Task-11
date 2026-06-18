import mysql.connector
import random
from datetime import datetime, timedelta
 
def seed_database():
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345",
        database="sales_analytics"
    )
    cursor = db.cursor()
 
    # 1. Clear existing data
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    cursor.execute("TRUNCATE TABLE sales;")
    cursor.execute("TRUNCATE TABLE products;")
    cursor.execute("TRUNCATE TABLE categories;")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
 
    # 2. Seed Categories
    categories = ["Electronics", "Clothing", "Food", "Books", "Sports",]
    for cat in categories:
        cursor.execute("INSERT INTO categories (name) VALUES (%s)", (cat,))
    db.commit()
 
    # 3. Seed Products (25 items mapped to category IDs 1-5)
    products = [
        ("Smartphone", 1, 699.99), ("Laptop", 1, 999.99), ("Wireless Headphones", 1, 149.99),("Monitor", 1, 249.99),("Keyboard", 1, 29.99),
        ("T-Shirt", 2, 19.99), ("Jeans", 2, 49.99), ("Jacket", 2, 89.99),("Shorts", 2, 24.99),("Formal Shirt", 2, 29.99),
        ("Organic Coffee", 3, 12.50), ("Dark Chocolate", 3, 4.99), ("Olive Oil", 3, 18.00),("Milk 1L", 3, 2.50),("Curd", 3, 1.99),
        ("Sci-Fi Novel", 4, 14.99), ("History Book", 4, 24.99), ("Self-Help Book", 4, 19.99),("Artificial Intelligence", 4, 44.99),("Business Strategy", 4, 21.99),
        ("Yoga Mat", 5, 29.99), ("Dumbbells Set", 5, 59.99), ("Running Shoes", 5, 79.99),("Football", 5, 24.99),("Basketball", 5, 29.99),
    ]
    for name, cat_id, price in products:
        cursor.execute("INSERT INTO products (name, category_id, price) VALUES (%s, %s, %s)", (name, cat_id, price))
    db.commit()
 
    # 4. Seed 120 Sales Records over the past year
    regions = ["North", "South", "East", "West"]
    start_date = datetime.now() - timedelta(days=365)
 
    for _ in range(120):
        product_id = random.randint(1, 25)
        # Fetch the product price to calculate total_amount accurately
        cursor.execute("SELECT price FROM products WHERE id = %s", (product_id,))
        price = cursor.fetchone()[0]
       
        quantity = random.randint(1, 5)
        total_amount = price * quantity
       
        # Generate random date over the last 12 months
        random_days = random.randint(0, 360)
        sold_on = (start_date + timedelta(days=random_days)).strftime('%Y-%m-%d')
        region = random.choice(regions)
 
        cursor.execute(
            "INSERT INTO sales (product_id, quantity, total_amount, sold_on, region) VALUES (%s, %s, %s, %s, %s)",
            (product_id, quantity, total_amount, sold_on, region)
        )
   
    db.commit()
    print("Database seeded successfully with 120 records!")
    cursor.close()
    db.close()
 
if __name__ == "__main__":
    seed_database()
 