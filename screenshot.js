const puppeteer = require('puppeteer');

let browser;
let page;

/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.screenshot = async (req, res) => {
    const url = req.query.url;
    if (!url) {
      return res.send('Please provide URL as GET parameter, for example: <a href="?url=https://example.com">?url=https://example.com</a>');
    }

    const width = req.query.width ? parseInt(req.query.width, 10) : 1280;
    const height = req.query.height ? parseInt(req.query.height, 10) : 800;
    const delay = req.query.delay ? parseInt(req.query.delay, 10) : 100;
  
    if(!browser) {
        browser = await puppeteer.launch();
    }
    if(!page) {
        page = await browser.newPage();
    }

    await page.setViewport({width, height});
    try {
        await page.goto(url);
    } catch(e) {
        return res.send('Unable to open page');
    }

    let imageBuffer
    try {
        setTimeout(() => {
            imageBuffer = await page.screenshot();
        }, delay);
    } catch(e) {
        return res.send('Unable to take screenshot');
    }
  
    res.set('Content-Type', 'image/png');
    return res.send(imageBuffer);
  };
  
