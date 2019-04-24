const puppeteer = require('puppeteer');

// Add a .env file for Username and Password
require('dotenv').config();

// URL's and Page elements
const loginAndRedirectUrl = 'https://design.yoobic.com/auth/?referer=%2Fpatterns%2F192174%2Fyobi';
const componentCardElement = '.e-card.pattern.cf';
const settingsButton = '.btn-configure';
const deleteButton = '.btn.btn-delete';
const confirmDelete = 'a.cm-btn.cm-btn--primary';

// Delete Function
async function init() {
    // Change headless to not view browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Loads Frontify and enters Username and Password
    await page.setViewport({ width: 1200, height: 720 })
    await page.goto(loginAndRedirectUrl, { waitUntil: 'networkidle0' }); // wait until page load
    await page.type('.fld.email', process.env.LOGIN_EMAIL);
    await page.type('.fld.password', process.env.LOGIN_PASSWORD);
    console.log('Entered Username and Password');

    // Click login and wait for page to load
    await Promise.all([
        page.click('.btn-signin'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    console.log('Logged in successfully');

    // If you have gotten to this for loop, the page has loaded with components
    // @todo work out how many elements on the page
    for (let i = 0; i < 3; i++) {
        console.log(i);
        if (await page.$(componentCardElement) !== null) {
            await page.waitFor(800);
            await page.click(settingsButton);
            await page.waitFor(800);
            await page.click(deleteButton);
            await page.waitFor(800);
            await page.$eval(confirmDelete, el => el.click());
        }
        console.log('Elements deleted. Closing browser');
    }
    await browser.close();
}

init();