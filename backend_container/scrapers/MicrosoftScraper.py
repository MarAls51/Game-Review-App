import sys
import asyncio
import json
from logger import get_logger
from playwright.async_api import async_playwright

logger = get_logger()

class XboxGamertagValidator:
    def __init__(self):
        self.url = "https://xboxgamertag.com/search/{gamertag}"

    async def validate_gamertag(self, gamertag):
        logger.info(f"Validating gamertag: {gamertag}")
        url = self.url.format(gamertag=gamertag)

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()

                await page.goto(url, timeout=10000)

                games = await page.query_selector_all('.game-card-desc h3')
                progress_bars = await page.query_selector_all('.progress-bar')

                game_data = []
                for game, progress_bar in zip(games, progress_bars):
                    game_title = await game.inner_text()
                    progress = await progress_bar.get_attribute('aria-valuenow')
                    game_data.append({
                        'title': game_title,
                        'progress': progress
                    })

                if len(game_data) == 0:
                    logger.info("No game data found. Exiting.")
                    sys.exit(0)

                with open(f'games_{gamertag}.json', 'w') as json_file:
                    json.dump(game_data, json_file, indent=4)
                    logger.info(f"Game data for {gamertag} saved to 'games_{gamertag}.json'")

                await browser.close()

                sys.exit(1)

        except Exception as e:
            logger.error(f"Error validating gamertag: {e}")
            sys.exit(0)

    def run(self, gamertag):
        asyncio.run(self.validate_gamertag(gamertag))

if __name__ == '__main__':
    if len(sys.argv) < 2:
        logger.error("Usage: python MicrosoftScraper.py <gamertag>")
        sys.exit(1)

    gamertag = sys.argv[1]
    validator = XboxGamertagValidator()
    validator.run(gamertag)
