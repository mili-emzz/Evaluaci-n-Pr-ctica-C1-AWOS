CREATE USER app_user WITH PASSWORD 'secure_app_password_2024';

REVOKE ALL ON SCHEMA public FROM app_user;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;

GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT ON vw_sales_daily TO app_user;
GRANT SELECT ON vw_top_products_ranked TO app_user;
GRANT SELECT ON vw_inventory_risk TO app_user;
GRANT SELECT ON vw_customer_value TO app_user;
GRANT SELECT ON vw_payment_mix TO app_user;