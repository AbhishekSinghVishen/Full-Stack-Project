from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sqlite3
from datetime import datetime
import time

# Set up Selenium WebDriver
service = Service("C:\\chromedriver-win64\\chromedriver.exe")  # Update with your ChromeDriver path
chrome_options = Options()
chrome_options.add_argument("--start-maximized")
driver = webdriver.Chrome(service=service, options=chrome_options)

# Connect to SQLite database
conn = sqlite3.connect('db.sqlite3', check_same_thread=False)
cursor = conn.cursor()
print('Database connection established')

try:
    # Open the Amazon page
    driver.get('https://www.amazon.in/s?k=bottle')
    time.sleep(3)  # Allow the initial page to load

    # Scroll incrementally and wait for content to load
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollBy(0, 1000);")  # Scroll down
        time.sleep(2)  # Allow new content to load
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:  # Exit if no new content is loaded
            break
        last_height = new_height

    # Wait for product containers to be visible
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.s-main-slot .s-result-item'))
    )

    # Extract product containers
    product_containers = driver.find_elements(By.CSS_SELECTOR, '.s-main-slot .s-result-item')

    # Initialize current time
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Loop through product containers and extract data
    for product in product_containers:
        try:
            # Extract title
            try:
                title_element = product.find_element(By.CSS_SELECTOR, 'h2 a span')
                title = title_element.text.strip()
            except:
                title = None

            # Extract price
            try:
                price_element = product.find_element(By.CSS_SELECTOR, '.a-price-whole')
                price = price_element.text.replace(',', '').strip()  # Remove commas for database insertion
            except:
                price = None

            # Extract image URL
            try:
                img_element = product.find_element(By.CSS_SELECTOR, '.s-image')
                img_path = img_element.get_attribute('src').strip()
            except:
                img_path = None

            # Process title to generate `name` and `brand`
            if title:
                title_words = title.split()  # Split title into words
                name = " ".join(title_words[:2])  # Use first two words for name
                brand = title_words[0]  # Use the first word for brand
            else:
                name, brand = None, None

            # Only process products with complete data
            if name and brand and price and img_path:
                # Check if the product already exists in the database
                cursor.execute(
                    'SELECT COUNT(*) FROM base_product WHERE name = ? AND brand = ? AND price = ?',
                    (name, brand, price)
                )
                result = cursor.fetchone()
                if result[0] == 0:  # If product doesn't exist, insert it
                    cursor.execute(
                        'INSERT INTO base_product (name, description, brand, price, image, category, createdAt, numReviews, countInStock, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        (name, title, brand, price, img_path, 'Bottle', current_time, 0, 100, 6)
                    )
                    conn.commit()
                    print(f"Inserted product: {name} | Brand: {brand} | Price: {price}")
                else:
                    print(f"Skipped duplicate product: {name} | Brand: {brand} | Price: {price}")
            else:
                print(f"Skipped product due to missing data: Name={name}, Brand={brand}, Price={price}, Image={img_path}")

        except Exception as e:
            print(f"Error processing product: {e}")
            continue

finally:
    # Close the WebDriver and database connection
    driver.quit()
    conn.close()
    print("Driver and database connection closed")
