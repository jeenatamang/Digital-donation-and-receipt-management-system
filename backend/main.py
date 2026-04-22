from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Response, Request, Depends
from pydantic import BaseModel
from typing import Optional
import sqlite3
import bcrypt
import jwt
import datetime

app = FastAPI(title="Monastery Donation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "my_super_secret_monastery_key"
ALGORITHM = "HS256"

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class DonationRequest(BaseModel):
    amount: float
    date: str 
    status: str = "Pending"
    donor_email: Optional[str] = None
    donor_name: Optional[str] = None
    donor_id: Optional[int] = None 

def get_db():
    conn = sqlite3.connect('monastery.db')
    conn.row_factory = sqlite3.Row 
    return conn

@app.on_event("startup")
def setup_database():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            donor_id INTEGER,
            FOREIGN KEY (donor_id) REFERENCES Users (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database tables are ready!")
    
def get_current_user(request: Request):
    """Extracts and verifies the JWT token from the httpOnly cookie."""
    token = request.cookies.get("monastery_session")
    
    if not token:
        raise HTTPException(status_code=401, detail="ERROR: The browser did not send any cookie at all!")
        
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception as e:
        error_type = type(e).__name__
        error_message = str(e)
        print(f"CRASH REPORT: {error_type} - {error_message}") 
        raise HTTPException(status_code=401, detail=f"CRASH REPORT: {error_type} - {error_message}")

@app.post("/register")
def register_donor(user: RegisterRequest):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt).decode('utf-8')
    
    if user.email.lower() == "admin@monastery.com":
        assigned_role = "admin"
    else:
        assigned_role = "donor"
    
    cursor.execute('''
        INSERT INTO Users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
    ''', (user.name, user.email, hashed_password, assigned_role))
    
    conn.commit()
    conn.close()
    
    return {"message": f"Account created successfully as a {assigned_role}!"}

@app.post("/login")
def login(user: LoginRequest, response: Response):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Users WHERE email = ?", (user.email,))
    db_user = cursor.fetchone()
    conn.close()
    
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    expire_time = datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    payload = {"sub": str(db_user['id']), "role": db_user['role'], "exp": expire_time}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    response.set_cookie(key="monastery_session", value=token, httponly=True, samesite="lax")
    return {
        "message": f"Welcome {db_user['name']}!", 
        "role": db_user['role'] 
    }

@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="monastery_session")
    return {"message": "Successfully logged out."}

@app.post("/add-donation")
def add_donation(donation: DonationRequest, user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        if user["role"] == "admin":
            if donation.donor_email:
                cursor.execute("SELECT id FROM Users WHERE email = ?", (donation.donor_email,))
                db_user = cursor.fetchone()
                
                if db_user:
                    final_donor_id = db_user["id"]
                else:
                    if not donation.donor_name:
                        raise HTTPException(status_code=400, detail="Donor name required to create a new user.")
                    
                    salt = bcrypt.gensalt()
                    hashed_pw = bcrypt.hashpw("defaultpass123".encode('utf-8'), salt).decode('utf-8')
                    
                    cursor.execute(
                        "INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                        (donation.donor_name, donation.donor_email, hashed_pw, "donor")
                    )
                    final_donor_id = cursor.lastrowid
            elif donation.donor_id:
                final_donor_id = donation.donor_id
            else:
                raise HTTPException(status_code=400, detail="Admin must provide a donor_email or donor_id")
        else:
            final_donor_id = user["sub"] 
            donation.status = "Pending" 
            
        cursor.execute('''
            INSERT INTO Donations (amount, date, status, donor_id)
            VALUES (?, ?, ?, ?)
        ''', (donation.amount, donation.date, donation.status, final_donor_id))
        
        conn.commit()
        return {"message": "Donation added successfully!"}
    
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/get-donations")
def get_donations(user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    
    if user["role"] == "admin":
        cursor.execute('''
            SELECT Donations.id, Donations.amount, Donations.date, Donations.status, Users.name as donor_name 
            FROM Donations JOIN Users ON Donations.donor_id = Users.id
            ORDER BY Donations.date DESC
        ''')
    else:
        cursor.execute('''
            SELECT id, amount, date, status 
            FROM Donations WHERE donor_id = ? 
            ORDER BY date DESC
        ''', (user["sub"],))
        
    donations = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"donations": donations}

@app.get("/get-donors")
def get_donors(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email FROM Users WHERE role = 'donor'")
    donors = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"donors": donors}

@app.get("/receipt/{donation_id}")
def get_receipt(donation_id: int, user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT Donations.id, Donations.amount, Donations.date, Donations.status, Users.name, Users.email, Donations.donor_id
        FROM Donations JOIN Users ON Donations.donor_id = Users.id
        WHERE Donations.id = ?
    ''', (donation_id,))
    
    receipt = cursor.fetchone()
    conn.close()
    
    if not receipt:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    receipt_dict = dict(receipt)
    
    if user["role"] != "admin" and str(receipt_dict["donor_id"]) != str(user["sub"]):
        raise HTTPException(status_code=403, detail="Not authorized to view this receipt")
        
    return {"receipt": receipt_dict}

@app.put("/donations/{donation_id}/verify")
def verify_donation(donation_id: int, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized. Admins only.")
        
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE Donations SET status = 'Verified' WHERE id = ?", (donation_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Donation successfully verified!"}

@app.get("/nuke-cookies")
def nuke_cookies(response: Response):
    response.delete_cookie(key="session_token")
    response.delete_cookie(key="monastery_session")
    return {"message": "All bad cookies destroyed! You have a clean slate."}