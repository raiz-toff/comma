
ROLE & OBJECTIVE
================
You are a senior Kotlin Multiplatform architect and a precise codebase analyst.

Your task is to perform a complete deep-dive of the provided web application codebase and produce a comprehensive, file-by-file migration plan to rewrite it as an identical Kotlin/JS (Kotlin Multiplatform) application.

## STEP 1 — CODEBASE INVENTORY

| File Path | Type | Purpose | Key Exports/Functions | External Libs | State | Side Effects |
| --- | --- | --- | --- | --- | --- | --- |
| `src/core/db.js` | JS | Core system module: db | CURRENT_LOGICAL_SCHEMA_VERSION, DEFAULT_USER, APP_STATE_KEY_DEFAULTS... | - | IndexedDB | IDB / Events |
| `src/core/events.js` | JS | Core system module: events | SHIFT_SAVED, SHIFT_DELETED, EXPENSE_SAVED... | - | App State / DB | IDB / Events |
| `src/core/router.js` | JS | Core system module: router | updateOnboardingFocusClass, Router | - | App State / DB | IDB / Events, Event Bus |
| `src/core/shell.js` | JS | Core system module: shell | - | - | App State / DB | IDB / Events |
| `src/core/store.js` | JS | Core system module: store | bindText, bindClass, bindVisibility... | - | IndexedDB | IDB / Events |
| `src/core/vault-gate.js` | JS | Core system module: vault-gate | isUserVaultActive | - | IndexedDB | IDB / Events |
| `src/css/animations.css` | CSS | Stylesheet | - | - | None | None |
| `src/css/components.css` | CSS | Stylesheet | - | - | None | None |
| `src/css/layout.css` | CSS | Stylesheet | - | - | None | None |
| `src/css/reset.css` | CSS | Stylesheet | - | - | None | None |
| `src/css/themes.css` | CSS | Stylesheet | - | - | None | None |
| `src/css/tokens.css` | CSS | Stylesheet | - | - | None | None |
| `src/css/views/analytics.css` | CSS | UI view component for analytics.css | - | - | None | DOM Mutations |
| `src/css/views/calendar.css` | CSS | UI view component for calendar.css | - | - | None | DOM Mutations |
| `src/css/views/dashboard.css` | CSS | UI view component for dashboard.css | - | - | None | DOM Mutations |
| `src/css/views/onboarding.css` | CSS | UI view component for onboarding.css | - | - | None | DOM Mutations |
| `src/css/views/reports.css` | CSS | UI view component for reports.css | - | - | None | DOM Mutations |
| `src/css/views/search.css` | CSS | UI view component for search.css | - | - | None | DOM Mutations |
| `src/css/views/settings.css` | CSS | UI view component for settings.css | - | - | None | DOM Mutations |
| `src/css/views/shifts.css` | CSS | UI view component for shifts.css | - | - | None | DOM Mutations |
| `src/css/views/tax.css` | CSS | UI view component for tax.css | - | - | None | DOM Mutations |
| `src/css/views/vehicles.css` | CSS | UI view component for vehicles.css | - | - | None | DOM Mutations |
| `src/css/widgets_theme.css` | CSS | Stylesheet | - | - | None | None |
| `src/libs/chart.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/confetti.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/dayjs.duration.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/dayjs.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/dayjs.relativeTime.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/dexie.min.js` | JS | Vendor library | - | - | IndexedDB | None |
| `src/libs/fuse.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/html2canvas.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/papaparse.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/qrcode.min.js` | JS | Vendor library | - | - | None | None |
| `src/libs/sortable.min.js` | JS | Vendor library | - | - | None | None |
| `src/main.js` | JS |  | - | - | IndexedDB | NoneEvent Bus |
| `src/modules/analytics/analytics-charts.js` | JS | Business logic module | renderHourlyTrendChart, renderWeekComparisonChart, renderIncomeSourceChart... | - | None | None |
| `src/modules/analytics/analytics.js` | JS | Business logic module | formatRegisteredMetricValue, listAnalyticsDashboardMetricIds, getRegisteredMetricDisplay | - | IndexedDB | None |
| `src/modules/analytics/widget-data.js` | JS | Business logic module | - | - | None | None |
| `src/modules/demo/sample-year.js` | JS | Business logic module | DEMO_SAMPLE_DATA_YEAR, getDemoAnalyticsAnchorDate, demoSampleRangeOverlaps | - | None | None |
| `src/modules/expenses/expense-form.js` | JS | Business logic module | PRESET_EXPENSE_CATEGORIES, renderExpenseForm | - | None | None |
| `src/modules/expenses/expenses.js` | JS | Business logic module | initExpensesModule | - | IndexedDB | NoneEvent Bus |
| `src/modules/goals/goals.js` | JS | Business logic module | - | - | IndexedDB | NoneEvent Bus |
| `src/modules/notifications/notification-internal.js` | JS | Business logic module | NOTIFICATION_IDS, nowIso, num... | - | IndexedDB | None |
| `src/modules/notifications/notifications.js` | JS | Business logic module | - | - | IndexedDB | None |
| `src/modules/onboarding/onboarding.js` | JS | Business logic module | ONBOARDING_SESSION_KEY, buildOnboardingSetupExport | - | IndexedDB | NoneEvent Bus |
| `src/modules/onboarding/steps.js` | JS | Business logic module | TOTAL_STEPS, defaultDraftFromUser, normalizeTaxRegionForCountry... | - | None | None |
| `src/modules/p13/p13.js` | JS | Business logic module | getCommunityTips, getDidYouKnowTips, toggleZenMode... | - | IndexedDB | None |
| `src/modules/platforms/platform-specific.js` | JS | Business logic module | normalizePlatformSpecific, extractShiftPlatformSpecific, evaluatePlatformAlerts... | - | None | None |
| `src/modules/platforms/platforms.js` | JS | Business logic module | renderPlatformSwitcher, mountPlatformSwitcher | - | IndexedDB | NoneEvent Bus |
| `src/modules/pwa/pwa-settings.js` | JS | Business logic module | mountPwaSettings | - | None | None |
| `src/modules/pwa/pwa.js` | JS | Business logic module | pwaCapabilities, onDeferredReplay, parseShareTargetIntent... | - | IndexedDB | None |
| `src/modules/reports/reports.js` | JS | Business logic module | buildSummaryText, previewVaultImportDiff, getDefaultReportTemplate... | - | IndexedDB | NoneEvent Bus |
| `src/modules/schedule/schedule.js` | JS | Business logic module | - | - | IndexedDB | None |
| `src/modules/search/search.js` | JS | Business logic module | initSearchModule | - | IndexedDB | None |
| `src/modules/settings/appearance-settings.js` | JS | Business logic module | - | - | IndexedDB | NoneEvent Bus |
| `src/modules/settings/data-settings.js` | JS | Business logic module | - | - | IndexedDB | None |
| `src/modules/settings/keyboard-shortcuts.js` | JS | Business logic module | SETTINGS_KEYBOARD_SHORTCUTS, formatShortcutOverlayListItems | - | None | None |
| `src/modules/settings/platforms-settings.js` | JS | Business logic module | - | - | IndexedDB | None |
| `src/modules/settings/settings-utils.js` | JS | Business logic module | esc, normalizeAccentHex, applyAccent... | - | None | None |
| `src/modules/settings/settings.js` | JS | Business logic module | - | - | IndexedDB | NoneEvent Bus |
| `src/modules/shifts/shift-form.js` | JS | Business logic module | renderShiftForm | - | None | None |
| `src/modules/shifts/shifts.js` | JS | Business logic module | - | - | IndexedDB | NoneEvent Bus |
| `src/modules/tax/tax.js` | JS | Business logic module | - | - | IndexedDB | None |
| `src/modules/vehicles/vehicles.js` | JS | Business logic module | - | - | IndexedDB | NoneEvent Bus |
| `src/registry/badges/_TEMPLATE.badge.js` | JS | Defines registry data for _TEMPLATE.badge.js | - | - | None | None |
| `src/registry/badges/bonus_hunter.badge.js` | JS | Defines registry data for bonus_hunter.badge.js | - | - | None | None |
| `src/registry/badges/century_day.badge.js` | JS | Defines registry data for century_day.badge.js | - | - | None | None |
| `src/registry/badges/data_archivist.badge.js` | JS | Defines registry data for data_archivist.badge.js | - | - | None | None |
| `src/registry/badges/early_bird.badge.js` | JS | Defines registry data for early_bird.badge.js | - | - | None | None |
| `src/registry/badges/expense_savvy.badge.js` | JS | Defines registry data for expense_savvy.badge.js | - | - | None | None |
| `src/registry/badges/first_shift.badge.js` | JS | Defines registry data for first_shift.badge.js | - | - | None | None |
| `src/registry/badges/five_hundred_week.badge.js` | JS | Defines registry data for five_hundred_week.badge.js | - | - | None | None |
| `src/registry/badges/goal_month_hit.badge.js` | JS | Defines registry data for goal_month_hit.badge.js | - | - | None | None |
| `src/registry/badges/goal_week_hit.badge.js` | JS | Defines registry data for goal_week_hit.badge.js | - | - | None | None |
| `src/registry/badges/index.js` | JS | Defines registry data for index.js | BadgeRegistry, assertBadgeRegistryValid | - | None | None |
| `src/registry/badges/marathon_shift.badge.js` | JS | Defines registry data for marathon_shift.badge.js | - | - | None | None |
| `src/registry/badges/multi_app_master.badge.js` | JS | Defines registry data for multi_app_master.badge.js | - | - | None | None |
| `src/registry/badges/night_owl.badge.js` | JS | Defines registry data for night_owl.badge.js | - | - | None | None |
| `src/registry/badges/peak_collector.badge.js` | JS | Defines registry data for peak_collector.badge.js | - | - | None | None |
| `src/registry/badges/perfect_week.badge.js` | JS | Defines registry data for perfect_week.badge.js | - | - | None | None |
| `src/registry/badges/personal_best_earnings.badge.js` | JS | Defines registry data for personal_best_earnings.badge.js | - | - | None | None |
| `src/registry/badges/personal_best_hours.badge.js` | JS | Defines registry data for personal_best_hours.badge.js | - | - | None | None |
| `src/registry/badges/placeholder.badge.js` | JS | Defines registry data for placeholder.badge.js | - | - | None | None |
| `src/registry/badges/rain_rider.badge.js` | JS | Defines registry data for rain_rider.badge.js | - | - | None | None |
| `src/registry/badges/streak_100.badge.js` | JS | Defines registry data for streak_100.badge.js | - | - | None | None |
| `src/registry/badges/streak_30.badge.js` | JS | Defines registry data for streak_30.badge.js | - | - | None | None |
| `src/registry/badges/streak_7.badge.js` | JS | Defines registry data for streak_7.badge.js | - | - | None | None |
| `src/registry/badges/thousand_month.badge.js` | JS | Defines registry data for thousand_month.badge.js | - | - | None | None |
| `src/registry/badges/tip_champion.badge.js` | JS | Defines registry data for tip_champion.badge.js | - | - | None | None |
| `src/registry/badges/vehicle_caretaker.badge.js` | JS | Defines registry data for vehicle_caretaker.badge.js | - | - | None | None |
| `src/registry/badges/weekend_warrior.badge.js` | JS | Defines registry data for weekend_warrior.badge.js | - | - | None | None |
| `src/registry/countries/CA.country.js` | JS | Defines registry data for CA.country.js | - | - | None | None |
| `src/registry/countries/UK.country.js` | JS | Defines registry data for UK.country.js | - | - | None | None |
| `src/registry/countries/US.country.js` | JS | Defines registry data for US.country.js | - | - | None | None |
| `src/registry/countries/_TEMPLATE.country.js` | JS | Defines registry data for _TEMPLATE.country.js | - | - | None | None |
| `src/registry/countries/index.js` | JS | Defines registry data for index.js | countryDefToLocaleConfig, getCountryTaxProfile, CountryRegistry... | - | None | None |
| `src/registry/expense-categories/index.js` | JS | Defines registry data for index.js | ExpenseCategoryRegistry, assertExpenseCategoryRegistryValid | - | None | None |
| `src/registry/goal-types/index.js` | JS | Defines registry data for index.js | GoalTypeRegistry, GoalScopeRegistry, assertGoalTypeRegistryValid | - | None | None |
| `src/registry/index.js` | JS | Defines registry data for index.js | - | - | None | None |
| `src/registry/market/resolve.js` | JS | Defines registry data for resolve.js | getMarketContext, resolveAvailablePlatformIds | - | None | None |
| `src/registry/metrics/_TEMPLATE.metric.js` | JS | Defines registry data for _TEMPLATE.metric.js | - | - | None | None |
| `src/registry/metrics/dead_miles_ratio.metric.js` | JS | Defines registry data for dead_miles_ratio.metric.js | - | - | None | None |
| `src/registry/metrics/index.js` | JS | Defines registry data for index.js | getMetricValue, MetricRegistry, assertMetricRegistryValid | - | None | None |
| `src/registry/metrics/month_gross.metric.js` | JS | Defines registry data for month_gross.metric.js | - | - | None | None |
| `src/registry/metrics/month_hourly.metric.js` | JS | Defines registry data for month_hourly.metric.js | - | - | None | None |
| `src/registry/metrics/month_orders.metric.js` | JS | Defines registry data for month_orders.metric.js | - | - | None | None |
| `src/registry/metrics/month_zero_days.metric.js` | JS | Defines registry data for month_zero_days.metric.js | - | - | None | None |
| `src/registry/metrics/placeholder.metric.js` | JS | Defines registry data for placeholder.metric.js | - | - | None | None |
| `src/registry/metrics/shift_duration.metric.js` | JS | Defines registry data for shift_duration.metric.js | - | - | None | None |
| `src/registry/metrics/shift_gross.metric.js` | JS | Defines registry data for shift_gross.metric.js | - | - | None | None |
| `src/registry/metrics/shift_hourly.metric.js` | JS | Defines registry data for shift_hourly.metric.js | - | - | None | None |
| `src/registry/notifications/_TEMPLATE.notification.js` | JS | Defines registry data for _TEMPLATE.notification.js | - | - | None | None |
| `src/registry/notifications/backup_overdue.notification.js` | JS | Defines registry data for backup_overdue.notification.js | - | - | None | None |
| `src/registry/notifications/cross_platform_arbitrage.notification.js` | JS | Defines registry data for cross_platform_arbitrage.notification.js | - | - | IndexedDB | None |
| `src/registry/notifications/daily_summary.notification.js` | JS | Defines registry data for daily_summary.notification.js | - | - | None | None |
| `src/registry/notifications/high_expense.notification.js` | JS | Defines registry data for high_expense.notification.js | - | - | None | None |
| `src/registry/notifications/index.js` | JS | Defines registry data for index.js | NotificationRegistry, assertNotificationRegistryValid | - | None | None |
| `src/registry/notifications/insurance_expiry.notification.js` | JS | Defines registry data for insurance_expiry.notification.js | - | - | IndexedDB | None |
| `src/registry/notifications/low_hourly_rate.notification.js` | JS | Defines registry data for low_hourly_rate.notification.js | - | - | None | None |
| `src/registry/notifications/maintenance_due.notification.js` | JS | Defines registry data for maintenance_due.notification.js | - | - | IndexedDB | None |
| `src/registry/notifications/mid_week_goal.notification.js` | JS | Defines registry data for mid_week_goal.notification.js | - | - | None | None |
| `src/registry/notifications/milestone_proximity.notification.js` | JS | Defines registry data for milestone_proximity.notification.js | - | - | None | None |
| `src/registry/notifications/personal_best.notification.js` | JS | Defines registry data for personal_best.notification.js | - | - | None | None |
| `src/registry/notifications/placeholder.notification.js` | JS | Defines registry data for placeholder.notification.js | - | - | None | None |
| `src/registry/notifications/streak_risk.notification.js` | JS | Defines registry data for streak_risk.notification.js | - | - | None | None |
| `src/registry/notifications/tax_installment_due.notification.js` | JS | Defines registry data for tax_installment_due.notification.js | - | - | None | None |
| `src/registry/notifications/weekly_goal_hit.notification.js` | JS | Defines registry data for weekly_goal_hit.notification.js | - | - | None | None |
| `src/registry/notifications/weekly_goal_miss.notification.js` | JS | Defines registry data for weekly_goal_miss.notification.js | - | - | IndexedDB | None |
| `src/registry/platforms/_TEMPLATE.platform.js` | JS | Defines registry data for _TEMPLATE.platform.js | - | - | None | None |
| `src/registry/platforms/_logos.js` | JS | Defines registry data for _logos.js | SVG_DD, SVG_UE, SVG_FD... | - | None | None |
| `src/registry/platforms/amazonflex.platform.js` | JS | Defines registry data for amazonflex.platform.js | - | - | None | None |
| `src/registry/platforms/doordash.platform.js` | JS | Defines registry data for doordash.platform.js | - | - | None | None |
| `src/registry/platforms/foodora.platform.js` | JS | Defines registry data for foodora.platform.js | - | - | None | None |
| `src/registry/platforms/index.js` | JS | Defines registry data for index.js | PlatformRegistry, assertPlatformRegistryValid, getDefaultSamplePlatformId | - | None | None |
| `src/registry/platforms/instacart.platform.js` | JS | Defines registry data for instacart.platform.js | - | - | None | None |
| `src/registry/platforms/other.platform.js` | JS | Defines registry data for other.platform.js | - | - | None | None |
| `src/registry/platforms/skip.platform.js` | JS | Defines registry data for skip.platform.js | - | - | None | None |
| `src/registry/platforms/specific-normalize.js` | JS | Defines registry data for specific-normalize.js | toNumberField, normalizeStringArrayField, normalizeFromSpecificSchema... | - | None | None |
| `src/registry/platforms/terminology.js` | JS | Defines registry data for terminology.js | PLATFORM_TERMINOLOGY, getPlatformConfig, platformAnalyticsEnabled... | - | None | None |
| `src/registry/platforms/ubereats.platform.js` | JS | Defines registry data for ubereats.platform.js | - | - | None | None |
| `src/registry/provinces/CA/ON.province.js` | JS | Defines registry data for ON.province.js | - | - | None | None |
| `src/registry/provinces/CA/_TEMPLATE.province.js` | JS | Defines registry data for _TEMPLATE.province.js | - | - | None | None |
| `src/registry/provinces/US/AK.province.js` | JS | Defines registry data for AK.province.js | - | - | None | None |
| `src/registry/provinces/US/AL.province.js` | JS | Defines registry data for AL.province.js | - | - | None | None |
| `src/registry/provinces/US/AR.province.js` | JS | Defines registry data for AR.province.js | - | - | None | None |
| `src/registry/provinces/US/AZ.province.js` | JS | Defines registry data for AZ.province.js | - | - | None | None |
| `src/registry/provinces/US/CA.province.js` | JS | Defines registry data for CA.province.js | - | - | None | None |
| `src/registry/provinces/US/CO.province.js` | JS | Defines registry data for CO.province.js | - | - | None | None |
| `src/registry/provinces/US/CT.province.js` | JS | Defines registry data for CT.province.js | - | - | None | None |
| `src/registry/provinces/US/DC.province.js` | JS | Defines registry data for DC.province.js | - | - | None | None |
| `src/registry/provinces/US/DE.province.js` | JS | Defines registry data for DE.province.js | - | - | None | None |
| `src/registry/provinces/US/FL.province.js` | JS | Defines registry data for FL.province.js | - | - | None | None |
| `src/registry/provinces/US/GA.province.js` | JS | Defines registry data for GA.province.js | - | - | None | None |
| `src/registry/provinces/US/HI.province.js` | JS | Defines registry data for HI.province.js | - | - | None | None |
| `src/registry/provinces/US/IA.province.js` | JS | Defines registry data for IA.province.js | - | - | None | None |
| `src/registry/provinces/US/ID.province.js` | JS | Defines registry data for ID.province.js | - | - | None | None |
| `src/registry/provinces/US/IL.province.js` | JS | Defines registry data for IL.province.js | - | - | None | None |
| `src/registry/provinces/US/IN.province.js` | JS | Defines registry data for IN.province.js | - | - | None | None |
| `src/registry/provinces/US/KS.province.js` | JS | Defines registry data for KS.province.js | - | - | None | None |
| `src/registry/provinces/US/KY.province.js` | JS | Defines registry data for KY.province.js | - | - | None | None |
| `src/registry/provinces/US/LA.province.js` | JS | Defines registry data for LA.province.js | - | - | None | None |
| `src/registry/provinces/US/MA.province.js` | JS | Defines registry data for MA.province.js | - | - | None | None |
| `src/registry/provinces/US/MD.province.js` | JS | Defines registry data for MD.province.js | - | - | None | None |
| `src/registry/provinces/US/ME.province.js` | JS | Defines registry data for ME.province.js | - | - | None | None |
| `src/registry/provinces/US/MI.province.js` | JS | Defines registry data for MI.province.js | - | - | None | None |
| `src/registry/provinces/US/MN.province.js` | JS | Defines registry data for MN.province.js | - | - | None | None |
| `src/registry/provinces/US/MO.province.js` | JS | Defines registry data for MO.province.js | - | - | None | None |
| `src/registry/provinces/US/MS.province.js` | JS | Defines registry data for MS.province.js | - | - | None | None |
| `src/registry/provinces/US/MT.province.js` | JS | Defines registry data for MT.province.js | - | - | None | None |
| `src/registry/provinces/US/NC.province.js` | JS | Defines registry data for NC.province.js | - | - | None | None |
| `src/registry/provinces/US/ND.province.js` | JS | Defines registry data for ND.province.js | - | - | None | None |
| `src/registry/provinces/US/NE.province.js` | JS | Defines registry data for NE.province.js | - | - | None | None |
| `src/registry/provinces/US/NH.province.js` | JS | Defines registry data for NH.province.js | - | - | None | None |
| `src/registry/provinces/US/NJ.province.js` | JS | Defines registry data for NJ.province.js | - | - | None | None |
| `src/registry/provinces/US/NM.province.js` | JS | Defines registry data for NM.province.js | - | - | None | None |
| `src/registry/provinces/US/NV.province.js` | JS | Defines registry data for NV.province.js | - | - | None | None |
| `src/registry/provinces/US/NY.province.js` | JS | Defines registry data for NY.province.js | - | - | None | None |
| `src/registry/provinces/US/OH.province.js` | JS | Defines registry data for OH.province.js | - | - | None | None |
| `src/registry/provinces/US/OK.province.js` | JS | Defines registry data for OK.province.js | - | - | None | None |
| `src/registry/provinces/US/OR.province.js` | JS | Defines registry data for OR.province.js | - | - | None | None |
| `src/registry/provinces/US/PA.province.js` | JS | Defines registry data for PA.province.js | - | - | None | None |
| `src/registry/provinces/US/RI.province.js` | JS | Defines registry data for RI.province.js | - | - | None | None |
| `src/registry/provinces/US/SC.province.js` | JS | Defines registry data for SC.province.js | - | - | None | None |
| `src/registry/provinces/US/SD.province.js` | JS | Defines registry data for SD.province.js | - | - | None | None |
| `src/registry/provinces/US/TN.province.js` | JS | Defines registry data for TN.province.js | - | - | None | None |
| `src/registry/provinces/US/TX.province.js` | JS | Defines registry data for TX.province.js | - | - | None | None |
| `src/registry/provinces/US/UT.province.js` | JS | Defines registry data for UT.province.js | - | - | None | None |
| `src/registry/provinces/US/VA.province.js` | JS | Defines registry data for VA.province.js | - | - | None | None |
| `src/registry/provinces/US/VT.province.js` | JS | Defines registry data for VT.province.js | - | - | None | None |
| `src/registry/provinces/US/WA.province.js` | JS | Defines registry data for WA.province.js | - | - | None | None |
| `src/registry/provinces/US/WI.province.js` | JS | Defines registry data for WI.province.js | - | - | None | None |
| `src/registry/provinces/US/WV.province.js` | JS | Defines registry data for WV.province.js | - | - | None | None |
| `src/registry/provinces/US/WY.province.js` | JS | Defines registry data for WY.province.js | - | - | None | None |
| `src/registry/provinces/US/_usStateProvince.js` | JS | Defines registry data for _usStateProvince.js | createUsStateProvince | - | None | None |
| `src/registry/provinces/index.js` | JS | Defines registry data for index.js | ProvinceRegistry, assertProvinceRegistryValid | - | None | None |
| `src/registry/reports/_TEMPLATE.report-section.js` | JS | Defines registry data for _TEMPLATE.report-section.js | - | - | None | None |
| `src/registry/reports/chart.report-section.js` | JS | Defines registry data for chart.report-section.js | - | - | None | None |
| `src/registry/reports/expenses.report-section.js` | JS | Defines registry data for expenses.report-section.js | - | - | None | None |
| `src/registry/reports/index.js` | JS | Defines registry data for index.js | ReportRegistry, assertReportRegistryValid | - | None | None |
| `src/registry/reports/notes.report-section.js` | JS | Defines registry data for notes.report-section.js | - | - | None | None |
| `src/registry/reports/overview.report-section.js` | JS | Defines registry data for overview.report-section.js | - | - | None | None |
| `src/registry/reports/placeholder.report-section.js` | JS | Defines registry data for placeholder.report-section.js | - | - | None | None |
| `src/registry/reports/qr.report-section.js` | JS | Defines registry data for qr.report-section.js | - | - | None | None |
| `src/registry/reports/shifts.report-section.js` | JS | Defines registry data for shifts.report-section.js | - | - | None | None |
| `src/registry/shift-fields/index.js` | JS | Defines registry data for index.js | ShiftFieldRegistry, assertShiftFieldRegistryValid | - | None | None |
| `src/registry/tax/withholding-presets.js` | JS | Defines registry data for withholding-presets.js | WITHHOLDING_PRESETS_CA, WITHHOLDING_PRESETS_US, getWithholdingPresetPct... | - | None | None |
| `src/registry/types.js` | JS | Defines registry data for types.js | - | - | None | None |
| `src/registry/widgets/_TEMPLATE.widget.js` | JS | Defines registry data for _TEMPLATE.widget.js | - | - | None | None |
| `src/registry/widgets/after-render.js` | JS | Defines registry data for after-render.js | afterRenderWidgets | - | None | None |
| `src/registry/widgets/avg-rate.widget.js` | JS | Defines registry data for avg-rate.widget.js | - | - | None | None |
| `src/registry/widgets/best-day.widget.js` | JS | Defines registry data for best-day.widget.js | - | - | None | None |
| `src/registry/widgets/best-hour.widget.js` | JS | Defines registry data for best-hour.widget.js | - | - | None | None |
| `src/registry/widgets/dead-miles.widget.js` | JS | Defines registry data for dead-miles.widget.js | - | - | None | None |
| `src/registry/widgets/deliveries.widget.js` | JS | Defines registry data for deliveries.widget.js | - | - | None | None |
| `src/registry/widgets/earnings.widget.js` | JS | Defines registry data for earnings.widget.js | - | - | None | None |
| `src/registry/widgets/effective-rate.widget.js` | JS | Defines registry data for effective-rate.widget.js | - | - | None | None |
| `src/registry/widgets/esc.js` | JS | Defines registry data for esc.js | esc | - | None | None |
| `src/registry/widgets/expenses.widget.js` | JS | Defines registry data for expenses.widget.js | - | - | None | None |
| `src/registry/widgets/income-breakdown.widget.js` | JS | Defines registry data for income-breakdown.widget.js | - | - | None | None |
| `src/registry/widgets/index.js` | JS | Defines registry data for index.js | DASHBOARD_STAT_STRIP_IDS, DASHBOARD_STRIP_SLOT_ID_SET, DEFAULT_DASHBOARD_WIDGET_ORDER... | - | None | None |
| `src/registry/widgets/month-gross.widget.js` | JS | Defines registry data for month-gross.widget.js | - | - | None | None |
| `src/registry/widgets/month-hourly.widget.js` | JS | Defines registry data for month-hourly.widget.js | - | - | None | None |
| `src/registry/widgets/month-orders.widget.js` | JS | Defines registry data for month-orders.widget.js | - | - | None | None |
| `src/registry/widgets/net-income.widget.js` | JS | Defines registry data for net-income.widget.js | - | - | None | None |
| `src/registry/widgets/out-of-pocket.widget.js` | JS | Defines registry data for out-of-pocket.widget.js | - | - | None | None |
| `src/registry/widgets/per-delivery.widget.js` | JS | Defines registry data for per-delivery.widget.js | - | - | None | None |
| `src/registry/widgets/placeholder.widget.js` | JS | Defines registry data for placeholder.widget.js | - | - | None | None |
| `src/registry/widgets/platform-activity.widget.js` | JS | Defines registry data for platform-activity.widget.js | - | - | None | None |
| `src/registry/widgets/recent-shifts.widget.js` | JS | Defines registry data for recent-shifts.widget.js | - | - | None | None |
| `src/registry/widgets/rolling-trend.widget.js` | JS | Defines registry data for rolling-trend.widget.js | - | - | None | None |
| `src/registry/widgets/scatter.widget.js` | JS | Defines registry data for scatter.widget.js | - | - | None | None |
| `src/registry/widgets/schedule.widget.js` | JS | Defines registry data for schedule.widget.js | - | - | IndexedDB | None |
| `src/registry/widgets/stability-score.widget.js` | JS | Defines registry data for stability-score.widget.js | - | - | None | None |
| `src/registry/widgets/streak.widget.js` | JS | Defines registry data for streak.widget.js | - | - | None | None |
| `src/registry/widgets/tax-jar.widget.js` | JS | Defines registry data for tax-jar.widget.js | - | - | None | None |
| `src/registry/widgets/tips-total.widget.js` | JS | Defines registry data for tips-total.widget.js | - | - | None | None |
| `src/registry/widgets/total-hours.widget.js` | JS | Defines registry data for total-hours.widget.js | - | - | None | None |
| `src/registry/widgets/week-compare.widget.js` | JS | Defines registry data for week-compare.widget.js | - | - | None | None |
| `src/registry/widgets/weekly-goal.widget.js` | JS | Defines registry data for weekly-goal.widget.js | - | - | None | None |
| `src/registry/widgets/weekly-projection.widget.js` | JS | Defines registry data for weekly-projection.widget.js | - | - | None | None |
| `src/registry/widgets/zero-days.widget.js` | JS | Defines registry data for zero-days.widget.js | - | - | None | None |
| `src/ui/charts.js` | JS | UI utility/component | destroyChart, renderBarChart, renderLineChart... | - | None | DOM Mutations |
| `src/ui/components.js` | JS | UI utility/component | showModal, closeModal, showConfirm... | - | None | DOM Mutations |
| `src/ui/icons.js` | JS | UI utility/component | exportIcon, getIcon, iconInnerByName | - | None | DOM Mutations |
| `src/ui/nav-icons.js` | JS | UI utility/component | NAV_ICON_INNER, NAV_ICON_VIEWBOX, NAV_ICON_FILLED | - | None | DOM Mutations |
| `src/utils/calculations.js` | JS |  | calcHourlyRate, calcNetHourlyRate, calcEarningsPerOrder... | - | None | None |
| `src/utils/date-range-presets.js` | JS |  | ymd, startOfWeekDate, defaultRangeForPreset... | - | None | None |
| `src/utils/formatters.js` | JS |  | formatCurrency, formatDuration, formatDistance... | - | None | None |
| `src/utils/locale.js` | JS |  | getCountryDef, getProvinceDef, resolveProvinceDef... | - | None | None |
| `src/utils/strings.js` | JS |  | strings, t | - | None | None |
| `src/views/about-view.js` | JS | UI view component for about-view | render | - | None | DOM Mutations |
| `src/views/analytics-view.js` | JS | UI view component for analytics-view | - | - | IndexedDB | DOM Mutations, Event Bus |
| `src/views/dashboard.js` | JS | UI view component for dashboard | - | - | None | DOM Mutations |
| `src/views/expenses-view.js` | JS | UI view component for expenses-view | - | - | None | DOM Mutations |
| `src/views/goals-view.js` | JS | UI view component for goals-view | - | - | IndexedDB | DOM Mutations |
| `src/views/onboarding-view.js` | JS | UI view component for onboarding-view | render | - | None | DOM Mutations |
| `src/views/print-view.js` | JS | UI view component for print-view | render | - | None | DOM Mutations |
| `src/views/reports-view.js` | JS | UI view component for reports-view | - | - | None | DOM Mutations |
| `src/views/schedule-view.js` | JS | UI view component for schedule-view | - | - | None | DOM Mutations |
| `src/views/settings-view.js` | JS | UI view component for settings-view | - | - | None | DOM Mutations |
| `src/views/shifts-view.js` | JS | UI view component for shifts-view | - | - | IndexedDB | DOM Mutations |
| `src/views/tax-view.js` | JS | UI view component for tax-view | render | - | None | DOM Mutations |
| `src/views/vehicles-view.js` | JS | UI view component for vehicles-view | render | - | None | DOM Mutations |
| `src/views/view-utils.js` | JS | UI view component for view-utils | renderViewPlaceholder | - | None | DOM Mutations |


## STEP 2 — LOGIC EXTRACTION

**Data models**
- `User`, `Shift`, `Expense`, `Goal`, `Vehicle`
- Registry objects: Platform, Country, Province, Widget, Metric, Badge, Notification, Report, ExpenseCategory, ShiftField

**Business rules**
- Tax calculations, net earnings per platform, gross/hourly rate derivations, maintenance tracking
- Platform-specific quirks (Surge vs Peak Pay)
- Gamification (Streaks, Badges, XP)

**UI components**
- `dashboard`, `shifts-view`, `analytics-view`, `settings-view`, `expenses-view`
- Plain JS components returning HTML strings, utilizing DOM APIs

**State management**
- Central `store.js` (pub/sub via event bus `events.js`)
- Persistent IndexedDB storage via `db.js` (Dexie wrapper)

**Event flows**
- Global Event Bus (`bus.emit`, `bus.on`) for decoupled module communication (e.g. `SHIFT_SAVED`, `PLATFORM_CHANGED`)

**API / storage calls**
- Offline-first IndexedDB via Dexie
- PWA sync / ServiceWorker

**Routing**
- Hash-based router (`core/router.js`), offline-safe

**Utilities**
- `formatters.js` (currency, time), `calculations.js` (math, tax), `strings.js` (i18n), `date-range-presets.js`

## STEP 3 — KOTLIN/JS ARCHITECTURE PLAN

- **Kotlin Constructs**: Use `data class` for data models, `sealed class` for Registry items/Events, `object` for Singletons (like Event Bus, Store).
- **UI Framework**: `kotlinx.browser` and `kotlinx.html` (bare DOM approach to mirror the original vanilla JS UI perfectly, avoiding heavy React overhead, sticking to the zero-framework philosophy).
- **State Handling**: Kotlin `StateFlow` or `MutableSharedFlow` from `kotlinx.coroutines` for reactive working memory and event bus.
- **Side Effects**: Kotlin Coroutines (`suspend` functions) for IDB calls and async workflows.
- **Library Equivalents**:
  - `dexie.min.js` → `external` Kotlin wrappers or standard Kotlin/JS dynamic IDB.
  - `dayjs` → `kotlinx-datetime`
  - `Chart.js` → JS Interop (`external class Chart`)
  - `esbuild` → Kotlin/JS IR Compiler (`webpack` under the hood for JS target)
- **Styling**: Keep external CSS resources and link them in the DOM to mirror original styling directly.

## STEP 4 — FILE-BY-FILE MIGRATION MAP

| Original File | New Kotlin File(s) | Migration Notes (Changes, JS Interop, Complexity, Edge Cases) |
| --- | --- | --- |
| `src/core/db.js` | `src/commonMain/kotlin/macadam/core/db.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/core/events.js` | `src/commonMain/kotlin/macadam/core/events.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/core/router.js` | `src/commonMain/kotlin/macadam/core/router.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/core/shell.js` | `src/commonMain/kotlin/macadam/core/shell.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/core/store.js` | `src/commonMain/kotlin/macadam/core/store.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/core/vault-gate.js` | `src/commonMain/kotlin/macadam/core/vault-gate.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/css/animations.css` | `src/commonMain/resources/css/animations.css` | Keep as resource. Complexity: Low. |
| `src/css/components.css` | `src/commonMain/resources/css/components.css` | Keep as resource. Complexity: Low. |
| `src/css/layout.css` | `src/commonMain/resources/css/layout.css` | Keep as resource. Complexity: Low. |
| `src/css/reset.css` | `src/commonMain/resources/css/reset.css` | Keep as resource. Complexity: Low. |
| `src/css/themes.css` | `src/commonMain/resources/css/themes.css` | Keep as resource. Complexity: Low. |
| `src/css/tokens.css` | `src/commonMain/resources/css/tokens.css` | Keep as resource. Complexity: Low. |
| `src/css/views/analytics.css` | `src/commonMain/resources/css/views/analytics.css` | Keep as resource. Complexity: Low. |
| `src/css/views/calendar.css` | `src/commonMain/resources/css/views/calendar.css` | Keep as resource. Complexity: Low. |
| `src/css/views/dashboard.css` | `src/commonMain/resources/css/views/dashboard.css` | Keep as resource. Complexity: Low. |
| `src/css/views/onboarding.css` | `src/commonMain/resources/css/views/onboarding.css` | Keep as resource. Complexity: Low. |
| `src/css/views/reports.css` | `src/commonMain/resources/css/views/reports.css` | Keep as resource. Complexity: Low. |
| `src/css/views/search.css` | `src/commonMain/resources/css/views/search.css` | Keep as resource. Complexity: Low. |
| `src/css/views/settings.css` | `src/commonMain/resources/css/views/settings.css` | Keep as resource. Complexity: Low. |
| `src/css/views/shifts.css` | `src/commonMain/resources/css/views/shifts.css` | Keep as resource. Complexity: Low. |
| `src/css/views/tax.css` | `src/commonMain/resources/css/views/tax.css` | Keep as resource. Complexity: Low. |
| `src/css/views/vehicles.css` | `src/commonMain/resources/css/views/vehicles.css` | Keep as resource. Complexity: Low. |
| `src/css/widgets_theme.css` | `src/commonMain/resources/css/widgets_theme.css` | Keep as resource. Complexity: Low. |
| `src/libs/chart.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/confetti.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/dayjs.duration.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/dayjs.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/dayjs.relativeTime.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/dexie.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/fuse.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/html2canvas.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/papaparse.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/qrcode.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/libs/sortable.min.js` | `N/A` | Replace with Kotlin/JS equivalent library. Complexity: Low. |
| `src/main.js` | `src/commonMain/kotlin/macadam/main.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/modules/analytics/analytics-charts.js` | `src/commonMain/kotlin/macadam/modules/analytics/analytics-charts.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/analytics/analytics.js` | `src/commonMain/kotlin/macadam/modules/analytics/analytics.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/analytics/widget-data.js` | `src/commonMain/kotlin/macadam/modules/analytics/widget-data.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/demo/sample-year.js` | `src/commonMain/kotlin/macadam/modules/demo/sample-year.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/expenses/expense-form.js` | `src/commonMain/kotlin/macadam/modules/expenses/expense-form.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/expenses/expenses.js` | `src/commonMain/kotlin/macadam/modules/expenses/expenses.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/goals/goals.js` | `src/commonMain/kotlin/macadam/modules/goals/goals.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/notifications/notification-internal.js` | `src/commonMain/kotlin/macadam/modules/notifications/notification-internal.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/notifications/notifications.js` | `src/commonMain/kotlin/macadam/modules/notifications/notifications.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/onboarding/onboarding.js` | `src/commonMain/kotlin/macadam/modules/onboarding/onboarding.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/onboarding/steps.js` | `src/commonMain/kotlin/macadam/modules/onboarding/steps.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/p13/p13.js` | `src/commonMain/kotlin/macadam/modules/p13/p13.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/platforms/platform-specific.js` | `src/commonMain/kotlin/macadam/modules/platforms/platform-specific.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/platforms/platforms.js` | `src/commonMain/kotlin/macadam/modules/platforms/platforms.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/pwa/pwa-settings.js` | `src/commonMain/kotlin/macadam/modules/pwa/pwa-settings.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/pwa/pwa.js` | `src/commonMain/kotlin/macadam/modules/pwa/pwa.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/reports/reports.js` | `src/commonMain/kotlin/macadam/modules/reports/reports.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/schedule/schedule.js` | `src/commonMain/kotlin/macadam/modules/schedule/schedule.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/search/search.js` | `src/commonMain/kotlin/macadam/modules/search/search.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/settings/appearance-settings.js` | `src/commonMain/kotlin/macadam/modules/settings/appearance-settings.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/settings/data-settings.js` | `src/commonMain/kotlin/macadam/modules/settings/data-settings.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/settings/keyboard-shortcuts.js` | `src/commonMain/kotlin/macadam/modules/settings/keyboard-shortcuts.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/settings/platforms-settings.js` | `src/commonMain/kotlin/macadam/modules/settings/platforms-settings.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/settings/settings-utils.js` | `src/commonMain/kotlin/macadam/modules/settings/settings-utils.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/settings/settings.js` | `src/commonMain/kotlin/macadam/modules/settings/settings.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/shifts/shift-form.js` | `src/commonMain/kotlin/macadam/modules/shifts/shift-form.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/shifts/shifts.js` | `src/commonMain/kotlin/macadam/modules/shifts/shifts.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/tax/tax.js` | `src/commonMain/kotlin/macadam/modules/tax/tax.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/modules/vehicles/vehicles.js` | `src/commonMain/kotlin/macadam/modules/vehicles/vehicles.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/registry/badges/_TEMPLATE.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/_TEMPLATE.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/bonus_hunter.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/bonus_hunter.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/century_day.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/century_day.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/data_archivist.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/data_archivist.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/early_bird.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/early_bird.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/expense_savvy.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/expense_savvy.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/first_shift.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/first_shift.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/five_hundred_week.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/five_hundred_week.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/goal_month_hit.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/goal_month_hit.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/goal_week_hit.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/goal_week_hit.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/index.js` | `src/commonMain/kotlin/macadam/registry/badges/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/marathon_shift.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/marathon_shift.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/multi_app_master.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/multi_app_master.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/night_owl.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/night_owl.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/peak_collector.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/peak_collector.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/perfect_week.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/perfect_week.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/personal_best_earnings.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/personal_best_earnings.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/personal_best_hours.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/personal_best_hours.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/placeholder.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/placeholder.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/rain_rider.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/rain_rider.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/streak_100.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/streak_100.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/streak_30.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/streak_30.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/streak_7.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/streak_7.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/thousand_month.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/thousand_month.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/tip_champion.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/tip_champion.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/vehicle_caretaker.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/vehicle_caretaker.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/badges/weekend_warrior.badge.js` | `src/commonMain/kotlin/macadam/registry/badges/weekend_warrior.badge.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/countries/CA.country.js` | `src/commonMain/kotlin/macadam/registry/countries/CA.country.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/countries/UK.country.js` | `src/commonMain/kotlin/macadam/registry/countries/UK.country.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/countries/US.country.js` | `src/commonMain/kotlin/macadam/registry/countries/US.country.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/countries/_TEMPLATE.country.js` | `src/commonMain/kotlin/macadam/registry/countries/_TEMPLATE.country.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/countries/index.js` | `src/commonMain/kotlin/macadam/registry/countries/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/expense-categories/index.js` | `src/commonMain/kotlin/macadam/registry/expense-categories/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/goal-types/index.js` | `src/commonMain/kotlin/macadam/registry/goal-types/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/index.js` | `src/commonMain/kotlin/macadam/registry/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/market/resolve.js` | `src/commonMain/kotlin/macadam/registry/market/resolve.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/_TEMPLATE.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/_TEMPLATE.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/dead_miles_ratio.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/dead_miles_ratio.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/index.js` | `src/commonMain/kotlin/macadam/registry/metrics/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/month_gross.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/month_gross.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/month_hourly.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/month_hourly.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/month_orders.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/month_orders.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/month_zero_days.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/month_zero_days.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/placeholder.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/placeholder.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/shift_duration.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/shift_duration.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/shift_gross.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/shift_gross.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/metrics/shift_hourly.metric.js` | `src/commonMain/kotlin/macadam/registry/metrics/shift_hourly.metric.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/_TEMPLATE.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/_TEMPLATE.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/backup_overdue.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/backup_overdue.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/cross_platform_arbitrage.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/cross_platform_arbitrage.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/daily_summary.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/daily_summary.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/high_expense.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/high_expense.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/index.js` | `src/commonMain/kotlin/macadam/registry/notifications/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/insurance_expiry.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/insurance_expiry.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/low_hourly_rate.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/low_hourly_rate.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/maintenance_due.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/maintenance_due.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/mid_week_goal.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/mid_week_goal.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/milestone_proximity.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/milestone_proximity.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/personal_best.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/personal_best.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/placeholder.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/placeholder.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/streak_risk.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/streak_risk.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/tax_installment_due.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/tax_installment_due.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/weekly_goal_hit.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/weekly_goal_hit.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/notifications/weekly_goal_miss.notification.js` | `src/commonMain/kotlin/macadam/registry/notifications/weekly_goal_miss.notification.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/_TEMPLATE.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/_TEMPLATE.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/_logos.js` | `src/commonMain/kotlin/macadam/registry/platforms/_logos.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/amazonflex.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/amazonflex.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/doordash.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/doordash.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/foodora.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/foodora.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/index.js` | `src/commonMain/kotlin/macadam/registry/platforms/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/instacart.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/instacart.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/other.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/other.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/skip.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/skip.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/specific-normalize.js` | `src/commonMain/kotlin/macadam/registry/platforms/specific-normalize.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/terminology.js` | `src/commonMain/kotlin/macadam/registry/platforms/terminology.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/platforms/ubereats.platform.js` | `src/commonMain/kotlin/macadam/registry/platforms/ubereats.platform.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/CA/ON.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/CA/ON.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/CA/_TEMPLATE.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/CA/_TEMPLATE.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/AK.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/AK.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/AL.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/AL.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/AR.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/AR.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/AZ.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/AZ.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/CA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/CA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/CO.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/CO.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/CT.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/CT.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/DC.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/DC.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/DE.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/DE.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/FL.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/FL.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/GA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/GA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/HI.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/HI.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/IA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/IA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/ID.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/ID.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/IL.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/IL.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/IN.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/IN.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/KS.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/KS.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/KY.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/KY.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/LA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/LA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/MA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/MA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/MD.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/MD.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/ME.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/ME.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/MI.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/MI.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/MN.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/MN.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/MO.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/MO.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/MS.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/MS.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/MT.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/MT.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/NC.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/NC.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/ND.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/ND.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/NE.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/NE.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/NH.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/NH.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/NJ.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/NJ.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/NM.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/NM.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/NV.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/NV.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/NY.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/NY.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/OH.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/OH.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/OK.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/OK.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/OR.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/OR.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/PA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/PA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/RI.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/RI.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/SC.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/SC.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/SD.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/SD.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/TN.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/TN.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/TX.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/TX.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/UT.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/UT.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/VA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/VA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/VT.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/VT.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/WA.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/WA.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/WI.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/WI.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/WV.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/WV.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/WY.province.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/WY.province.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/US/_usStateProvince.js` | `src/commonMain/kotlin/macadam/registry/provinces/US/_usStateProvince.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/provinces/index.js` | `src/commonMain/kotlin/macadam/registry/provinces/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/_TEMPLATE.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/_TEMPLATE.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/chart.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/chart.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/expenses.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/expenses.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/index.js` | `src/commonMain/kotlin/macadam/registry/reports/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/notes.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/notes.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/overview.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/overview.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/placeholder.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/placeholder.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/qr.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/qr.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/reports/shifts.report-section.js` | `src/commonMain/kotlin/macadam/registry/reports/shifts.report-section.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/shift-fields/index.js` | `src/commonMain/kotlin/macadam/registry/shift-fields/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/tax/withholding-presets.js` | `src/commonMain/kotlin/macadam/registry/tax/withholding-presets.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/types.js` | `src/commonMain/kotlin/macadam/registry/types.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/_TEMPLATE.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/_TEMPLATE.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/after-render.js` | `src/commonMain/kotlin/macadam/registry/widgets/after-render.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/avg-rate.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/avg-rate.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/best-day.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/best-day.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/best-hour.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/best-hour.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/dead-miles.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/dead-miles.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/deliveries.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/deliveries.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/earnings.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/earnings.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/effective-rate.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/effective-rate.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/esc.js` | `src/commonMain/kotlin/macadam/registry/widgets/esc.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/expenses.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/expenses.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/income-breakdown.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/income-breakdown.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/index.js` | `src/commonMain/kotlin/macadam/registry/widgets/index.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/month-gross.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/month-gross.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/month-hourly.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/month-hourly.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/month-orders.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/month-orders.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/net-income.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/net-income.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/out-of-pocket.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/out-of-pocket.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/per-delivery.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/per-delivery.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/placeholder.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/placeholder.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/platform-activity.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/platform-activity.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/recent-shifts.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/recent-shifts.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/rolling-trend.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/rolling-trend.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/scatter.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/scatter.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/schedule.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/schedule.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/stability-score.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/stability-score.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/streak.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/streak.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/tax-jar.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/tax-jar.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/tips-total.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/tips-total.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/total-hours.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/total-hours.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/week-compare.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/week-compare.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/weekly-goal.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/weekly-goal.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/weekly-projection.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/weekly-projection.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/registry/widgets/zero-days.widget.js` | `src/commonMain/kotlin/macadam/registry/widgets/zero-days.widget.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/ui/charts.js` | `src/commonMain/kotlin/macadam/ui/charts.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/ui/components.js` | `src/commonMain/kotlin/macadam/ui/components.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/ui/icons.js` | `src/commonMain/kotlin/macadam/ui/icons.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/ui/nav-icons.js` | `src/commonMain/kotlin/macadam/ui/nav-icons.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Medium. |
| `src/utils/calculations.js` | `src/commonMain/kotlin/macadam/utils/calculations.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/utils/date-range-presets.js` | `src/commonMain/kotlin/macadam/utils/date-range-presets.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/utils/formatters.js` | `src/commonMain/kotlin/macadam/utils/formatters.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/utils/locale.js` | `src/commonMain/kotlin/macadam/utils/locale.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/utils/strings.js` | `src/commonMain/kotlin/macadam/utils/strings.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: Low. |
| `src/views/about-view.js` | `src/commonMain/kotlin/macadam/views/about-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/analytics-view.js` | `src/commonMain/kotlin/macadam/views/analytics-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/dashboard.js` | `src/commonMain/kotlin/macadam/views/dashboard.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/expenses-view.js` | `src/commonMain/kotlin/macadam/views/expenses-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/goals-view.js` | `src/commonMain/kotlin/macadam/views/goals-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/onboarding-view.js` | `src/commonMain/kotlin/macadam/views/onboarding-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/print-view.js` | `src/commonMain/kotlin/macadam/views/print-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/reports-view.js` | `src/commonMain/kotlin/macadam/views/reports-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/schedule-view.js` | `src/commonMain/kotlin/macadam/views/schedule-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/settings-view.js` | `src/commonMain/kotlin/macadam/views/settings-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/shifts-view.js` | `src/commonMain/kotlin/macadam/views/shifts-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/tax-view.js` | `src/commonMain/kotlin/macadam/views/tax-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/vehicles-view.js` | `src/commonMain/kotlin/macadam/views/vehicles-view.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |
| `src/views/view-utils.js` | `src/commonMain/kotlin/macadam/views/view-utils.kt` | Port logic to Kotlin. Interop: Minimal. Complexity: High. |


## STEP 5 — PROJECT SCAFFOLD

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "1.9.23"
}

kotlin {
    js(IR) {
        browser {
            commonWebpackConfig {
                cssSupport {
                    enabled.set(true)
                }
            }
        }
        binaries.executable()
    }

    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-html:0.11.0")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
                implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.5.0")
                // External JS dependencies handled via npm
                implementation(npm("dexie", "3.2.4"))
                implementation(npm("chart.js", "4.4.1"))
            }
        }
    }
}
```

**Directory Tree (src/):**
```text
src/
  jsMain/
    kotlin/macadam/
      core/
      models/
      modules/
      registry/
      ui/
      utils/
      views/
      main.kt
    resources/
      index.html
      css/
```

**External Declaration Shim Example (Dexie):**
```kotlin
@file:JsModule("dexie")
@file:JsNonModule

package macadam.libs

import kotlin.js.Promise

@JsName("Dexie")
external class Dexie(databaseName: String) {
    fun version(versionNumber: Int): Version
    fun table(tableName: String): Table<dynamic, dynamic>
}

external interface Version {
    fun stores(schema: dynamic)
}

external interface Table<T, Key> {
    fun add(item: T): Promise<Key>
    fun put(item: T): Promise<Key>
    fun get(key: Key): Promise<T?>
}
```

## STEP 6 — IMPLEMENTATION ORDER & MILESTONES

- **Phase 1 — Project setup + data models + utilities (no UI)**
  - *Files*: `build.gradle.kts`, models, `utils/*`, `registry/*`
  - *Criteria*: Build succeeds, unit tests for calculations pass. Complexity: Low.
- **Phase 2 — Core UI shell + routing + State/Events**
  - *Files*: `core/events.kt`, `core/router.kt`, `core/store.kt`, `core/shell.kt`, `core/db.kt`
  - *Criteria*: Event bus routes events, IDB wrappers function, basic DOM mounts. Complexity: High.
- **Phase 3 — Feature components (one per original JS module)**
  - *Files*: `modules/*`
  - *Criteria*: Business logic translated to Kotlin coroutines/flows. Complexity: Medium.
- **Phase 4 — Core Views**
  - *Files*: `views/*`
  - *Criteria*: UI rendering matches original HTML string output using `kotlinx.html`. Complexity: High.
- **Phase 5 — Styling parity + edge case handling**
  - *Files*: `css/*`
  - *Criteria*: Pixel-perfect visual match. CSS correctly applied. Complexity: Low.
- **Phase 6 — Testing + production build**
  - *Criteria*: Production JS bundle compiled, ServiceWorker ported, PWA installable.

## RISK REGISTER

1. **High**: **IndexedDB/Dexie Interop** - Dexie's dynamic schema definitions might be tricky to type safely in Kotlin/JS.
2. **Medium**: **Chart.js Interop** - Passing complex configuration objects from Kotlin to JS requires careful use of `js("{ ... }")` or external interfaces.
3. **Medium**: **Bundle Size** - Kotlin/JS standard library adds size overhead; might violate the ultra-lightweight goal of the original vanilla JS app without strict dead-code elimination.
4. **Low**: **CSS Custom Properties** - Using CSS vars heavily in vanilla JS means we just need to ensure `style` attributes apply them correctly in Kotlinx.html.
