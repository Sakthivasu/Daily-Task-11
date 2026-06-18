from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345", 
        database="sales_analytics"
    )

def build_filter_clause():
    """Helper to parse filters and build dynamic WHERE clauses safely."""
    from_date = request.args.get('from')
    to_date = request.args.get('to')
    category_id = request.args.get('category')

    clauses = []
    params = []

    if from_date:
        clauses.append("s.sold_on >= %s")
        params.append(from_date)
    if to_date:
        clauses.append("s.sold_on <= %s")
        params.append(to_date)
    if category_id and category_id != "":
        clauses.append("p.category_id = %s")
        params.append(category_id)

    where_clause = " WHERE " + " AND ".join(clauses) if clauses else ""
    return where_clause, params

@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/api/kpis', methods=['GET'])
def get_kpis():
    where_clause, params = build_filter_clause()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Core Metrics Query
    query = f"""
        SELECT 
            COALESCE(SUM(s.total_amount), 0) as total_revenue,
            COUNT(s.id) as total_orders,
            COALESCE(AVG(s.total_amount), 0) as avg_order_value
        FROM sales s
        JOIN products p ON s.product_id = p.id
        {where_clause}
    """
    cursor.execute(query, params)
    metrics = cursor.fetchone()

    # Top product subquery matching filters
    top_prod_query = f"""
        SELECT p.name, SUM(s.quantity) as units_sold
        FROM sales s
        JOIN products p ON s.product_id = p.id
        {where_clause}
        GROUP BY p.id, p.name
        ORDER BY units_sold DESC LIMIT 1
    """
    cursor.execute(top_prod_query, params)
    top_product = cursor.fetchone()

    metrics['best_selling'] = top_product if top_product else {"name": "N/A", "units_sold": 0}
    
    cursor.close()
    conn.close()
    return jsonify(metrics)

# FIX: Changed methods from ['POST'] to ['GET'] so it can read query parameters
@app.route('/api/sales/monthly', methods=['GET'])
def get_monthly_sales():
    where_clause, params = build_filter_clause()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = f"""
        SELECT DATE_FORMAT(s.sold_on, '%b %Y') AS month, SUM(s.total_amount) AS revenue
        FROM sales s
        JOIN products p ON s.product_id = p.id
        {where_clause}
        GROUP BY YEAR(s.sold_on), MONTH(s.sold_on), DATE_FORMAT(s.sold_on, '%b %Y')
        ORDER BY YEAR(s.sold_on), MONTH(s.sold_on)
    """
    cursor.execute(query, params)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/api/sales/by-category', methods=['GET'])
def get_sales_by_category():
    where_clause, params = build_filter_clause()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = f"""
        SELECT c.name AS category, SUM(s.total_amount) AS revenue
        FROM sales s
        JOIN products p ON s.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        {where_clause}
        GROUP BY c.name
        ORDER BY revenue DESC
    """
    cursor.execute(query, params)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/api/sales/by-region', methods=['GET'])
def get_sales_by_region():
    where_clause, params = build_filter_clause()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = f"""
        SELECT s.region, SUM(s.total_amount) AS revenue
        FROM sales s
        JOIN products p ON s.product_id = p.id
        {where_clause}
        GROUP BY s.region
        ORDER BY revenue DESC
    """
    cursor.execute(query, params)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@app.route('/api/sales/top-products', methods=['GET'])
def get_top_products():
    where_clause, params = build_filter_clause()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = f"""
        SELECT p.name as product, c.name as category, SUM(s.quantity) as units_sold, SUM(s.total_amount) as revenue
        FROM sales s
        JOIN products p ON s.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        {where_clause}
        GROUP BY p.id, p.name, c.name
        ORDER BY revenue DESC LIMIT 5
    """
    cursor.execute(query, params)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)