import sys
import asyncio
import json
from playwright.async_api import async_playwright
from logger import get_logger

class SteamStatScraper:
    def __init__(self):
        self.url = "https://steamcharts.com/app/{appid}"
        self.logger = get_logger()

    async def validate_gamertag(self, appid):
        self.logger.info(f"Starting extraction for appid: {appid}")
        url = self.url.format(appid=appid)

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()

                await page.goto(url, timeout=50000)

                await page.wait_for_selector('.odd')

                rows = await page.query_selector_all('.odd')

                game_data = []
                for row in rows:
                    cells = await row.query_selector_all('td')

                    if len(cells) >= 2:
                        month_text = await cells[0].inner_text()
                        count_text = await cells[1].inner_text()

                        try:
                            count_value = float(count_text.replace(',', '').strip())
                        except ValueError:
                            continue

                        game_data.append({
                            'month': month_text,
                            'count': count_value
                        })

                if len(game_data) == 0:
                    self.logger.warning("No data found for this appid.")
                    sys.exit(0)

                with open(f'games_{appid}.json', 'w') as json_file:
                    json.dump(game_data, json_file, indent=4)

                self.logger.info(f"Successfully extracted stats for appid {appid}")

                await browser.close()

                sys.exit(1)

        except Exception as e:
            self.logger.error(f"Error extracting stats for appid {appid}: {e}")
            sys.exit(0)

    def run(self, appid):
        self.logger.info("Running SteamStatScraper")
        asyncio.run(self.validate_gamertag(appid))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: python SteamChartsScraper.py <appid>\n")
        sys.exit(1)

    appid = sys.argv[1]
    extractor = SteamStatScraper()
    extractor.run(appid)
