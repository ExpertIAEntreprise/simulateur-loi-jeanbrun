#!/usr/bin/env node
/**
 * Wireframe Screenshot Capture Script
 * Uses Playwright to capture the wireframe HTML as a PNG
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function captureWireframe() {
  const htmlPath = path.join(__dirname, 'page-ville-wireframe.html');
  const outputPath = path.join(__dirname, 'page-ville-wireframe.png');

  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // High DPI for crisp text
  });

  const page = await context.newPage();

  console.log('Loading wireframe HTML...');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.waitForTimeout(1000);

  console.log('Capturing full page screenshot...');
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png',
  });

  await browser.close();

  console.log(`Screenshot saved to: ${outputPath}`);

  // Get file size
  const stats = fs.statSync(outputPath);
  console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

captureWireframe().catch(console.error);
