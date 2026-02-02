import { test, expect } from '@playwright/test';

test.describe('Matrix Resource Orchestrator Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for React to hydrate
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should display the header with title', async ({ page }) => {
    const header = page.getByRole('heading', { level: 1 });
    await expect(header).toBeVisible({ timeout: 10000 });
    await expect(header).toContainText('Matrix Resource Orchestrator');
  });

  test('should display metrics cards', async ({ page }) => {
    await expect(page.getByText('Active Projects')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Team Members')).toBeVisible();
    await expect(page.getByText('Avg Utilization')).toBeVisible();
    await expect(page.getByText('Total ROI')).toBeVisible();
    // Use exact match to avoid matching "Resource Conflicts"
    await expect(page.getByText('Conflicts', { exact: true })).toBeVisible();
    await expect(page.getByText('Milestones', { exact: true })).toBeVisible();
  });

  test('should display silo utilization chart', async ({ page }) => {
    await expect(page.getByText('Silo Utilization')).toBeVisible({ timeout: 10000 });
    // Verify silos are shown
    await expect(page.getByText('Biology').first()).toBeVisible();
    await expect(page.getByText('Automation').first()).toBeVisible();
    await expect(page.getByText('CompSci').first()).toBeVisible();
  });

  test('should display project ROI landscape', async ({ page }) => {
    await expect(page.getByText('Project ROI Landscape')).toBeVisible({ timeout: 10000 });
  });

  test('should display projects table', async ({ page }) => {
    await expect(page.getByText('Projects by Business Impact')).toBeVisible({ timeout: 10000 });
    // Verify project names
    await expect(page.getByText('Next-Gen ELN Integration')).toBeVisible();
    await expect(page.getByText('High-Throughput Screening Platform')).toBeVisible();
    await expect(page.getByText('Research Data Lake')).toBeVisible();
  });

  test('should display resource matrix', async ({ page }) => {
    await expect(page.getByText('Resource Availability Matrix')).toBeVisible({ timeout: 10000 });
    // Verify some resource names
    await expect(page.getByText('Dr. Sarah Chen')).toBeVisible();
    await expect(page.getByText('Michael Park')).toBeVisible();
  });

  test('should filter resources by silo', async ({ page }) => {
    // Wait for the filter buttons to be visible
    const biologyButton = page.getByRole('button', { name: 'Biology' }).first();
    await expect(biologyButton).toBeVisible({ timeout: 10000 });

    // Click on Biology filter
    await biologyButton.click();
    await page.waitForTimeout(500);

    // Should see biology resources
    await expect(page.getByText('Dr. Sarah Chen')).toBeVisible();
  });

  test('should open project detail panel on row click', async ({ page }) => {
    // Wait for table to load
    await expect(page.getByText('Projects by Business Impact')).toBeVisible({ timeout: 10000 });

    // Click on a project row
    const projectRow = page.locator('tr').filter({ hasText: 'Next-Gen ELN Integration' }).first();
    await projectRow.click();

    // Wait for panel to open
    await page.waitForTimeout(500);

    // Should see project detail panel
    await expect(page.getByText('ROI Metrics')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Required Functional Silos')).toBeVisible();
    await expect(page.getByText('Allocated Team')).toBeVisible();
  });

  test('should show conflict panel', async ({ page }) => {
    await expect(page.getByText('Resource Conflicts')).toBeVisible({ timeout: 10000 });
  });

  test('should display correct project priority badges', async ({ page }) => {
    await expect(page.getByText('Projects by Business Impact')).toBeVisible({ timeout: 10000 });
    // Check for priority badges in table
    const criticalBadge = page.locator('span').filter({ hasText: 'critical' }).first();
    await expect(criticalBadge).toBeVisible();
  });

  test('should display ROI values in projects table', async ({ page }) => {
    // Wait for table
    await expect(page.getByText('Projects by Business Impact')).toBeVisible({ timeout: 10000 });
    // Check for ROI values (look for dollar amounts)
    await expect(page.getByText('$15.5M').first()).toBeVisible();
  });
});
