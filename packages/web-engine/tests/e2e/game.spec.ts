import { test, expect } from '@playwright/test';

test.describe('Aetherium Game - E-Motion Check-In', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('should display the E-Motion check-in section', async ({ page }) => {
        await expect(page.getByText('E-Motion Check-In')).toBeVisible();
        await expect(page.locator('#feeling')).toBeVisible();
        await expect(page.locator('#intensity')).toBeVisible();
        await expect(page.locator('#persistence')).toBeVisible();
        await expect(page.locator('#grounding')).toBeVisible();
    });

    test('should submit a check-in and display system state', async ({ page }) => {
        // Select feeling
        await page.selectOption('#feeling', 'focused');

        // Adjust sliders (optional, but good to test they exist)
        await page.fill('#intensity', '0.7');
        await page.fill('#persistence', '0.6');
        await page.fill('#grounding', '0.8');

        // Submit
        await page.click('.checkin-button');

        // Verify result
        await expect(page.locator('.result')).toBeVisible();
        await expect(page.getByText(/System State:/)).toBeVisible();
        await expect(page.getByText('Context Metrics')).toBeVisible();
    });

    test('should trigger PROTECTIVE_STATE on high valence', async ({ page }) => {
        await page.selectOption('#feeling', 'energized');
        await page.fill('#intensity', '0.9'); // High valence
        await page.click('.checkin-button');

        await expect(page.getByText('System State: PROTECTIVE_STATE')).toBeVisible();
    });

    test('should trigger COLLAPSE_PROTOCOL on low grounding', async ({ page }) => {
        await page.selectOption('#feeling', 'overwhelmed');
        await page.fill('#grounding', '0.1'); // Low grounding
        await page.click('.checkin-button');

        await expect(page.getByText('System State: COLLAPSE_PROTOCOL')).toBeVisible();
    });
});
