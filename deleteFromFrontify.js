const puppeteer = require('puppeteer');

// Add a .env file for Username and Password
require('dotenv').config();

// URL's and Page elements
const loginAndRedirectUrl = process.env.LOGIN_URL;
const componentCardElement = '.e-card.pattern.cf';
const settingsButton = '.btn-configure';
const deleteButton = '.btn.btn-delete';
const confirmDelete = 'a.cm-btn.cm-btn--primary';

// Delete Function
puppeteer.launch({ headless: true }).then(async browser => {

    const page = await browser.newPage();
    // Loads Frontify and enters Username and Password
    await page.setViewport({ width: 1200, height: 720 })
    await page.goto(loginAndRedirectUrl, { waitUntil: 'networkidle0' }); // wait until page load
    await page.type('.fld.email', process.env.LOGIN_EMAIL);
    await page.type('.fld.password', process.env.LOGIN_PASSWORD);
    console.log('Entered Username and Password!');

    // Click login and wait for page to load
    await Promise.all([
        page.click('.btn-signin'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    console.log('Logged in successfully!');

    console.log('Assessing Page Elements!');
    await page.waitFor(1000);
    const searchValue = await page.$$(`${componentCardElement}`);
    console.log(searchValue.length);
    let counter = searchValue.length;
    // If you have gotten to this for loop, the page has loaded with components
    for (let i = 0; i < counter; i++) {
        console.log('Deleting from Frontify!');
        if (await page.$(componentCardElement) !== null) {
            await page.waitFor(500);
            await page.click(settingsButton);
            await page.waitFor(500);
            await page.click(deleteButton);
            await page.waitFor(500);
            await page.$eval(confirmDelete, el => el.click());
        }
    }
    clearInterval(twirlTimer)
    await browser.close();
    console.log('Elements deleted. Closing browser.');
});

const twirlTimer = (() => {
    const P = ["\\", "|", "/", "-"];
    let x = 0;
    return setInterval(() => {
        process.stdout.write("\r" + P[x++]);
        x &= 3;
    }, 50);
})();