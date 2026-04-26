# Getting Started with Macadam

Macadam is a serverless, offline-first financial tracker. There is no backend to install and no database to configure—everything runs directly in your browser.

## 🚀 Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/raiz-toff/macadam.git
   cd macadam
   ```

2. **Open the App**:
   Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, or Edge).
   
   *Tip: For the best experience (including PWA installation), serve the files using a simple local server.*
   ```bash
   # Using Python's built-in server (optional)
   python3 -m http.server 8000
   ```

3. **Install as an App**:
   Since Macadam is a Progressive Web App (PWA), you can install it on your device:
   - **Desktop**: Click the "Install" icon in the browser address bar.
   - **Mobile**: Use "Add to Home Screen" from your browser's share/settings menu.

## 🔒 Security & Data

- **The Vault**: All your data is stored in a local "Vault" (IndexedDB) on your device. It never leaves your machine.
- **PIN Protection**: On your first visit, you will be prompted to set a local PIN to secure your data.
- **Backups**: We strongly recommend using the **Download Backup** feature in the Settings page regularly. This saves your data as a JSON file which you can restore on any other device.

## 📊 Using the App

1. **Dashboard**: Your financial overview, including earnings charts and expense summaries.
2. **Weekly Log**: Enter your platform earnings (DoorDash, UberEats, etc.) and tips.
3. **Expenses**: Track fuel, maintenance, and business costs.
4. **Settings**: Manage your vault, export backups, or clear local data.

## 🛠️ Development

If you want to modify Macadam:
- Core logic is in `static/script.js` and `static/db.js`.
- Styling is handled in `static/style.css`.
- Service worker logic is in `sw.js`.

No build step is required—just save your changes and refresh the browser!
