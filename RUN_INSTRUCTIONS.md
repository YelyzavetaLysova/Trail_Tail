# Trail Tail: Running Backend and Frontend Servers (Windows PowerShell)

## Backend (Python)
1. Open PowerShell and go to the backend folder:
   ```powershell
   cd C:\Users\ZenBook\Desktop\Trail_Tail\backend
   ```
2. Set execution policy for this session:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```
3. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\Activate
   ```
4. Run the backend server:
   ```powershell
   python main.py
   ```
   - The backend runs at: http://localhost:8000

---

## Frontend (Node.js)
1. Open a new PowerShell window and go to the frontend folder:
   ```powershell
   cd C:\Users\ZenBook\Desktop\Trail_Tail\frontend_html
   ```
2. Set execution policy for this session:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```
3. Install dependencies (only needed once):
   ```powershell
   npm install
   ```
4. Start the frontend server:
   ```powershell
   npm run dev
   ```
   - The frontend runs at: http://localhost:3000
   - It expects the backend API at: http://localhost:8000

---

## Notes
- Run backend and frontend in separate PowerShell windows.
- If you see errors about scripts being disabled, set the execution policy as shown above.
- To stop a server, press `CTRL+C` in its PowerShell window.
