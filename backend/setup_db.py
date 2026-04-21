import sqlite3
import bcrypt

def create_database():
    conn = sqlite3.connect('monastery.db')
    cursor = conn.cursor()

    print("Creating Users table...")
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL
    )
    ''')

    print("Creating Donations table...")
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Donations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        donor_id INTEGER NOT NULL,
        FOREIGN KEY (donor_id) REFERENCES Users (id)
    )
    ''')


    admin_email = "admin@monastery.com"
    admin_password = "adminpassword123" 
    
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), salt).decode('utf-8')

    cursor.execute("SELECT email FROM Users WHERE email = ?", (admin_email,))
    existing_admin = cursor.fetchone()

    if not existing_admin:
        print(f"Seeding Admin account ({admin_email})...")
        cursor.execute('''
        INSERT INTO Users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
        ''', ("Super Admin", admin_email, hashed_password, "admin"))
    else:
        print("Admin account already exists. Skipping seed.")

    conn.commit()
    conn.close()
    print("\n✅ Success! monastery.db is fully set up and ready to use.")

if __name__ == "__main__":
    create_database()