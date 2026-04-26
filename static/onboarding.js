// onboarding.js — Macadam Welcome Gate & Setup Wizard
// Loaded after db.js, before script.js on every page.

(function () {
    'use strict';

    const ONBOARDED_KEY = 'macadam_onboarded';
    const DEMO_KEY = 'macadam_demo_loaded';

    // ── PUBLIC API (always available, even for onboarded users) ──
    window.macadamOnboarding = {
        reset: function () {
            localStorage.removeItem(ONBOARDED_KEY);
            localStorage.removeItem(DEMO_KEY);
            window.location.reload();
        },
        clearDemo: async function () {
            try {
                await window.db.weekly_earnings.clear();
                await window.db.expenses.clear();
                await window.db.settings.delete('demo_data');
                localStorage.removeItem(ONBOARDED_KEY);
                localStorage.removeItem(DEMO_KEY);
                window.location.reload();
            } catch (e) {
                console.error('Failed to clear demo data:', e);
                alert('Failed to clear demo data: ' + e.message);
            }
        }
    };

    // ── Fast synchronous guard ──────────────────────────────────
    // localStorage is synchronous → no flash for returning users.
    if (localStorage.getItem(ONBOARDED_KEY) === 'true') return;

    // ── Async detection: check IndexedDB for existing data ──────
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await window.db.open();
            const count = await window.db.weekly_earnings.count();
            if (count > 0) {
                // Existing user with data — mark onboarded, bail out
                localStorage.setItem(ONBOARDED_KEY, 'true');
                return;
            }
        } catch (e) {
            console.warn('Onboarding: DB check failed, showing gate.', e);
        }

        showWelcomeGate();
    });

    // ================================================================
    //  WELCOME GATE
    // ================================================================

    function showWelcomeGate() {
        const gate = document.createElement('div');
        gate.id = 'macadam-welcome-gate';
        gate.innerHTML = `
            <div class="gate-container">
                <div class="gate-header">
                    <div class="gate-logo"><i class="bi bi-car-front-fill"></i> Macadam</div>
                    <p class="gate-tagline">
                        The private vault for independent drivers. Track your earnings,
                        expenses and performance — all stored locally on your device.
                    </p>
                </div>

                <!-- Three paths -->
                <div class="gate-paths" id="gatePaths">
                    <!-- Restore -->
                    <div class="gate-card" id="gateRestore">
                        <div class="gate-card-icon restore">
                            <i class="bi bi-cloud-upload"></i>
                        </div>
                        <div class="gate-card-title">Restore Your Vault</div>
                        <div class="gate-card-desc">
                            Already have a Macadam backup? Import your <code>.json</code> file
                            and pick up right where you left off.
                        </div>
                        <div class="gate-card-action">Upload Backup <i class="bi bi-arrow-right"></i></div>
                        <input type="file" accept=".json" class="gate-file-input" id="gateFileInput">
                    </div>

                    <!-- Demo -->
                    <div class="gate-card" id="gateDemo">
                        <div class="gate-card-icon demo">
                            <i class="bi bi-play-circle"></i>
                        </div>
                        <div class="gate-card-title">Try the Demo</div>
                        <div class="gate-card-desc">
                            See Macadam in action with sample delivery data.
                            You can clear it anytime from Settings.
                        </div>
                        <div class="gate-card-action">Load Demo Data <i class="bi bi-arrow-right"></i></div>
                    </div>

                    <!-- Start Fresh -->
                    <div class="gate-card" id="gateFresh">
                        <div class="gate-card-icon fresh">
                            <i class="bi bi-rocket-takeoff"></i>
                        </div>
                        <div class="gate-card-title">Start Fresh</div>
                        <div class="gate-card-desc">
                            Set up your personal tracker from scratch with a
                            quick guided setup.
                        </div>
                        <div class="gate-card-action">Begin Setup <i class="bi bi-arrow-right"></i></div>
                    </div>
                </div>

                <!-- Wizard (hidden initially, shown when "Start Fresh" is clicked) -->
                <div id="wizardArea" style="display:none;"></div>

                <div class="gate-footer">
                    <i class="bi bi-shield-lock-fill"></i>
                    Your data never leaves this device. No cloud, no tracking.
                </div>
            </div>
        `;

        document.body.appendChild(gate);
        bindGateEvents(gate);
    }

    // ── Gate Event Handlers ─────────────────────────────────────

    function bindGateEvents(gate) {
        // Restore
        const restoreCard = gate.querySelector('#gateRestore');
        const fileInput = gate.querySelector('#gateFileInput');

        restoreCard.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length === 0) return;
            handleRestoreFile(e.target.files[0], gate);
        });

        // Demo
        gate.querySelector('#gateDemo').addEventListener('click', () => {
            handleLoadDemo(gate);
        });

        // Start Fresh → Wizard
        gate.querySelector('#gateFresh').addEventListener('click', () => {
            gate.querySelector('#gatePaths').style.display = 'none';
            showWizard(gate);
        });
    }

    // ================================================================
    //  RESTORE BACKUP (reuse vault_backup logic inline)
    // ================================================================

    function handleRestoreFile(file, gate) {
        const paths = gate.querySelector('#gatePaths');
        paths.innerHTML = `
            <div class="gate-loading">
                <div class="gate-spinner"></div>
                <div class="gate-loading-text">Restoring your vault…</div>
            </div>
        `;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.app !== 'Macadam' || !parsed.data) {
                    throw new Error('Invalid or corrupted backup file.');
                }

                if (parsed.data.weekly_earnings) {
                    await window.db.weekly_earnings.bulkPut(parsed.data.weekly_earnings);
                }
                if (parsed.data.expenses) {
                    await window.db.expenses.bulkPut(parsed.data.expenses);
                }
                if (parsed.data.expense_categories) {
                    for (const cat of parsed.data.expense_categories) {
                        try { delete cat.id; await window.db.expense_categories.put(cat); } catch (_) { /* dup */ }
                    }
                }
                if (parsed.data.settings) {
                    await window.db.settings.bulkPut(parsed.data.settings);
                }

                localStorage.setItem(ONBOARDED_KEY, 'true');
                dismissGate(gate);
            } catch (err) {
                paths.innerHTML = `
                    <div class="gate-loading">
                        <i class="bi bi-exclamation-triangle" style="font-size:2.5rem;color:#f59e0b;"></i>
                        <div class="gate-loading-text" style="color:#f59e0b;">${err.message}</div>
                        <button class="wizard-btn wizard-btn-next" onclick="location.reload()" style="margin-top:1rem;">Try Again</button>
                    </div>
                `;
            }
        };
        reader.onerror = () => {
            paths.innerHTML = `
                <div class="gate-loading">
                    <i class="bi bi-exclamation-triangle" style="font-size:2.5rem;color:#f59e0b;"></i>
                    <div class="gate-loading-text" style="color:#f59e0b;">Error reading file.</div>
                    <button class="wizard-btn wizard-btn-next" onclick="location.reload()" style="margin-top:1rem;">Try Again</button>
                </div>
            `;
        };
        reader.readAsText(file);
    }

    // ================================================================
    //  DEMO DATA
    // ================================================================

    async function handleLoadDemo(gate) {
        const paths = gate.querySelector('#gatePaths');
        paths.innerHTML = `
            <div class="gate-loading">
                <div class="gate-spinner"></div>
                <div class="gate-loading-text">Generating sample data…</div>
            </div>
        `;

        try {
            await loadDemoData();
            localStorage.setItem(ONBOARDED_KEY, 'true');
            localStorage.setItem(DEMO_KEY, 'true');
            await window.db.settings.put({ key: 'demo_data', value: true });
            dismissGate(gate);
        } catch (err) {
            console.error('Demo load failed:', err);
            paths.innerHTML = `
                <div class="gate-loading">
                    <i class="bi bi-exclamation-triangle" style="font-size:2.5rem;color:#f59e0b;"></i>
                    <div class="gate-loading-text" style="color:#f59e0b;">Failed to load demo: ${err.message}</div>
                    <button class="wizard-btn wizard-btn-next" onclick="location.reload()" style="margin-top:1rem;">Try Again</button>
                </div>
            `;
        }
    }

    async function loadDemoData() {
        // Ensure DB is open (may have been closed if DB was deleted and recreated)
        if (!window.db.isOpen()) {
            await window.db.open();
        }

        const today = new Date();
        const weeks = [];
        const expenses = [];

        // Generate 8 weeks of data ending near today
        for (let i = 7; i >= 0; i--) {
            const endDate = new Date(today);
            endDate.setDate(today.getDate() - (i * 7));
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 6);

            const hours = +(15 + Math.random() * 40).toFixed(2);
            const deliveries = Math.floor(20 + Math.random() * 80);
            const ddPay = +(deliveries * (3.5 + Math.random() * 3)).toFixed(2);
            const tips = +(deliveries * (1.5 + Math.random() * 2.5)).toFixed(2);
            const otherPay = Math.random() > 0.6 ? +(Math.random() * 30).toFixed(2) : 0;
            const oop = Math.random() > 0.7 ? +(10 + Math.random() * 60).toFixed(2) : 0;

            weeks.push({
                week_no: 8 - i,
                start_date: fmt(startDate),
                end_date: fmt(endDate),
                hours_worked: hours,
                active_hours: +(hours * (0.55 + Math.random() * 0.15)).toFixed(2),
                deliveries: deliveries,
                doordash_pay: ddPay,
                tips: tips,
                other_pay: otherPay,
                paid_out_of_pocket: oop,
                notes: ''
            });
        }

        // Generate ~15 expense records
        const categories = ['Fuel', 'Maintenance', 'Supplies', 'Phone/Data', 'Insurance', 'Taxes/Fees'];
        const descriptions = {
            'Fuel': ['Shell Gas Station', 'Costco Fuel', 'BP Station', 'Circle K'],
            'Maintenance': ['Oil Change', 'Tire Rotation', 'Car Wash', 'Wiper Blades'],
            'Supplies': ['Phone Mount', 'Insulated Bag', 'Dash Cam', 'USB Charger'],
            'Phone/Data': ['T-Mobile Bill', 'Phone Case', 'Screen Protector'],
            'Insurance': ['Progressive Auto', 'State Farm Monthly'],
            'Taxes/Fees': ['Quarterly Estimate', 'Registration Renewal']
        };
        const amounts = {
            'Fuel': [35, 65],
            'Maintenance': [25, 120],
            'Supplies': [12, 45],
            'Phone/Data': [40, 80],
            'Insurance': [80, 180],
            'Taxes/Fees': [50, 300]
        };

        for (let i = 0; i < 15; i++) {
            const cat = categories[Math.floor(Math.random() * categories.length)];
            const descs = descriptions[cat];
            const [lo, hi] = amounts[cat];
            const d = new Date(today);
            d.setDate(today.getDate() - Math.floor(Math.random() * 56));

            expenses.push({
                date: fmt(d),
                category_id: categories.indexOf(cat) + 1,
                category: cat,
                amount: +(lo + Math.random() * (hi - lo)).toFixed(2),
                description: descs[Math.floor(Math.random() * descs.length)],
                receipt: '',
                notes: ''
            });
        }

        await window.db.weekly_earnings.bulkAdd(weeks);
        await window.db.expenses.bulkAdd(expenses);
    }

    function fmt(d) {
        return d.toISOString().split('T')[0];
    }

    // ================================================================
    //  WIZARD (Start Fresh)
    // ================================================================

    function showWizard(gate) {
        const area = gate.querySelector('#wizardArea');
        area.style.display = 'block';

        const defaultCategories = ['Fuel', 'Maintenance', 'Supplies', 'Insurance', 'Phone/Data', 'Taxes/Fees'];
        let currentStep = 0;
        const totalSteps = 5;
        let wizardCategories = [...defaultCategories];

        area.innerHTML = `
            <div class="wizard-container">
                <div class="wizard-progress" id="wizardProgress">
                    ${Array.from({ length: totalSteps }, (_, i) => `<div class="wizard-dot${i === 0 ? ' active' : ''}" data-step="${i}"></div>`).join('')}
                </div>

                <div class="wizard-panel" id="wizardPanel">
                    <!-- Step 0: Welcome -->
                    <div class="wizard-step active" data-step="0">
                        <div class="wizard-step-icon">🚗</div>
                        <div class="wizard-step-title">Welcome to Macadam</div>
                        <div class="wizard-step-desc">
                            Track your delivery earnings, manage expenses, and monitor your
                            performance — all stored securely on your device. Let's get you set up in under a minute.
                        </div>
                    </div>

                    <!-- Step 1: Preferences -->
                    <div class="wizard-step" data-step="1">
                        <div class="wizard-step-icon">⚙️</div>
                        <div class="wizard-step-title">Your Preferences</div>
                        <div class="wizard-step-desc">
                            Customize a few basics. You can change these later in Settings.
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizCurrency">Currency Symbol</label>
                            <input type="text" id="wizCurrency" value="$" maxlength="4" placeholder="$">
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizTheme">Preferred Theme</label>
                            <select id="wizTheme">
                                <option value="light">Light</option>
                                <option value="dark" selected>Dark</option>
                            </select>
                        </div>
                    </div>

                    <!-- Step 2: Categories -->
                    <div class="wizard-step" data-step="2">
                        <div class="wizard-step-icon">🏷️</div>
                        <div class="wizard-step-title">Expense Categories</div>
                        <div class="wizard-step-desc">
                            These are the default categories. Remove any you don't need, or add your own.
                        </div>
                        <div class="category-chips" id="wizCategoryChips"></div>
                        <div class="add-category-input">
                            <input type="text" id="wizNewCategory" placeholder="Add category…" maxlength="30">
                        </div>
                    </div>

                    <!-- Step 3: First Week (optional) -->
                    <div class="wizard-step" data-step="3">
                        <div class="wizard-step-icon">📊</div>
                        <div class="wizard-step-title">Log Your First Week</div>
                        <div class="wizard-step-desc">
                            Got your latest delivery stats? Enter them now, or skip and add them later.
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizWeekStart">Week Start</label>
                            <input type="date" id="wizWeekStart">
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizWeekEnd">Week End</label>
                            <input type="date" id="wizWeekEnd">
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizHours">Hours Worked</label>
                            <input type="number" id="wizHours" min="0" step="0.5" placeholder="e.g. 32">
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizDeliveries">Deliveries</label>
                            <input type="number" id="wizDeliveries" min="0" placeholder="e.g. 45">
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizDDPay">DoorDash Pay ($)</label>
                            <input type="number" id="wizDDPay" min="0" step="0.01" placeholder="e.g. 350.00">
                        </div>
                        <div class="wizard-form-group">
                            <label for="wizTips">Tips ($)</label>
                            <input type="number" id="wizTips" min="0" step="0.01" placeholder="e.g. 120.50">
                        </div>
                    </div>

                    <!-- Step 4: Done! -->
                    <div class="wizard-step" data-step="4">
                        <div class="wizard-success-icon"><i class="bi bi-check-lg"></i></div>
                        <div class="wizard-step-title">You're All Set!</div>
                        <div class="wizard-step-desc">
                            Macadam is ready to track your hustle. Start logging your weekly earnings
                            and keep an eye on your performance.
                        </div>
                        <div class="wizard-quicklinks">
                            <a href="index.html" class="wizard-quicklink"><i class="bi bi-speedometer2"></i> Dashboard</a>
                            <a href="weekly.html" class="wizard-quicklink"><i class="bi bi-calendar-week"></i> Weekly Log</a>
                            <a href="expenses.html" class="wizard-quicklink"><i class="bi bi-receipt"></i> Expenses</a>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <div class="wizard-nav" id="wizardNav">
                    <button class="wizard-btn wizard-btn-back" id="wizBack" style="visibility:hidden;">
                        <i class="bi bi-arrow-left"></i> Back
                    </button>
                    <button class="wizard-btn wizard-btn-skip" id="wizSkip" style="visibility:hidden;">
                        Skip
                    </button>
                    <button class="wizard-btn wizard-btn-next" id="wizNext">
                        Next <i class="bi bi-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        renderCategoryChips();
        bindWizardEvents();

        // ── Wizard internals ────────────────────────────────────

        function renderCategoryChips() {
            const container = area.querySelector('#wizCategoryChips');
            container.innerHTML = wizardCategories.map((cat, i) => `
                <div class="category-chip">
                    ${cat}
                    <span class="chip-remove" data-idx="${i}"><i class="bi bi-x"></i></span>
                </div>
            `).join('');

            container.querySelectorAll('.chip-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    wizardCategories.splice(parseInt(btn.dataset.idx), 1);
                    renderCategoryChips();
                });
            });
        }

        function bindWizardEvents() {
            const btnNext = area.querySelector('#wizNext');
            const btnBack = area.querySelector('#wizBack');
            const btnSkip = area.querySelector('#wizSkip');
            const newCatInput = area.querySelector('#wizNewCategory');

            btnNext.addEventListener('click', () => goToStep(currentStep + 1));
            btnBack.addEventListener('click', () => goToStep(currentStep - 1));
            btnSkip.addEventListener('click', () => goToStep(currentStep + 1));

            // Add category on Enter
            newCatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const name = newCatInput.value.trim();
                    if (name && !wizardCategories.includes(name)) {
                        wizardCategories.push(name);
                        renderCategoryChips();
                    }
                    newCatInput.value = '';
                }
            });

            // Set default dates for the first week form
            const today = new Date();
            const day = today.getDay() || 7;
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - (day - 1));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const wizStart = area.querySelector('#wizWeekStart');
            const wizEnd = area.querySelector('#wizWeekEnd');
            if (wizStart) wizStart.value = fmt(startOfWeek);
            if (wizEnd) wizEnd.value = fmt(endOfWeek);
        }

        function goToStep(step) {
            if (step < 0 || step >= totalSteps) return;

            // If advancing past the final step → finish
            if (step === totalSteps - 1) {
                finishWizard();
            }

            currentStep = step;

            // Update dots
            area.querySelectorAll('.wizard-dot').forEach((dot, i) => {
                dot.classList.remove('active', 'completed');
                if (i < currentStep) dot.classList.add('completed');
                if (i === currentStep) dot.classList.add('active');
            });

            // Show the right step
            area.querySelectorAll('.wizard-step').forEach((s, i) => {
                s.classList.toggle('active', i === currentStep);
            });

            // Update nav buttons
            const btnBack = area.querySelector('#wizBack');
            const btnNext = area.querySelector('#wizNext');
            const btnSkip = area.querySelector('#wizSkip');

            btnBack.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

            // Show skip only on step 3 (first week)
            btnSkip.style.visibility = currentStep === 3 ? 'visible' : 'hidden';

            if (currentStep === totalSteps - 1) {
                // Last step — hide nav
                area.querySelector('#wizardNav').style.display = 'none';
            } else {
                area.querySelector('#wizardNav').style.display = 'flex';
                btnNext.innerHTML = currentStep === totalSteps - 2
                    ? 'Finish <i class="bi bi-check-lg"></i>'
                    : 'Next <i class="bi bi-arrow-right"></i>';
            }
        }

        async function finishWizard() {
            try {
                // Save preferences
                const currency = area.querySelector('#wizCurrency').value.trim() || '$';
                const theme = area.querySelector('#wizTheme').value;

                await window.db.settings.put({ key: 'currency_symbol', value: currency });
                window.currencySymbol = currency;

                document.documentElement.setAttribute('data-bs-theme', theme);
                localStorage.setItem('theme', theme);

                // Save categories — clear defaults and put the wizard list
                await window.db.expense_categories.clear();
                if (wizardCategories.length > 0) {
                    await window.db.expense_categories.bulkAdd(
                        wizardCategories.map(name => ({ name }))
                    );
                }

                // Save first week if filled out
                const wizHours = area.querySelector('#wizHours');
                const wizDDPay = area.querySelector('#wizDDPay');
                const startDate = area.querySelector('#wizWeekStart').value;
                const endDate = area.querySelector('#wizWeekEnd').value;

                if (wizHours.value && parseFloat(wizHours.value) > 0 && startDate && endDate) {
                    await window.db.weekly_earnings.add({
                        week_no: 1,
                        start_date: startDate,
                        end_date: endDate,
                        hours_worked: parseFloat(wizHours.value) || 0,
                        active_hours: 0,
                        deliveries: parseInt(area.querySelector('#wizDeliveries').value) || 0,
                        doordash_pay: parseFloat(wizDDPay.value) || 0,
                        tips: parseFloat(area.querySelector('#wizTips').value) || 0,
                        other_pay: 0,
                        paid_out_of_pocket: 0,
                        notes: ''
                    });
                }

                localStorage.setItem(ONBOARDED_KEY, 'true');
            } catch (err) {
                console.error('Wizard finish error:', err);
            }
        }
    }

    // ================================================================
    //  GATE DISMISS
    // ================================================================

    function dismissGate(gate) {
        gate.classList.add('gate-exit');
        setTimeout(() => {
            gate.remove();
            window.location.reload();
        }, 350);
    }

})();
