import requests
import time
import json
import datetime
import sys
import re
import os

class SteamReviewScraper:
    BASE_URL = "https://store.steampowered.com/appreviews/{appid}?json=1&num_per_page=100&start_offset={offset}&filter=all&day_range=365"
    
    def __init__(self, worker_id, max_reviews=1000, min_upvotes=20, min_funny_upvotes=20, max_chars=30000):
        self.worker_id = worker_id
        self.output_file = f"workers/steam_reviews_{worker_id}.json"
        self.MAX_REVIEWS = max_reviews
        self.MIN_UPVOTES = min_upvotes
        self.MIN_FUNNY_UPVOTES = min_funny_upvotes
        self.MAX_CHARS = max_chars

    def clean_text(self, text):
        """
        Cleans the review text by removing unnecessary characters like newline characters, hyphens, etc.
        """
        cleaned_text = text.replace('\n', ' ').replace('\r', ' ')
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
        cleaned_text = re.sub(r'[-]', '', cleaned_text)
        return cleaned_text.strip()

    def get_reviews_for_game(self, appid):
        all_reviews = []
        review_ids = set()
        offset = 0
        total_char = 0 
        query_summary = None

        while offset < self.MAX_REVIEWS:
            url = self.BASE_URL.format(appid=appid, offset=offset)
            try:
                response = requests.get(url)
            except requests.exceptions.RequestException as e:
                sys.stderr.write(f"Request failed: {str(e)}\n")
                return

            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", 5))
                sys.stderr.write(f"Rate limited. Retrying after {retry_after} seconds.\n")
                time.sleep(retry_after)
                continue

            if response.status_code != 200:
                sys.stderr.write(f"Error fetching reviews: {response.status_code}\n")
                return

            try:
                data = response.json()
            except json.JSONDecodeError as e:
                sys.stderr.write(f"Error parsing JSON response: {str(e)}\n")
                return

            if not data.get('success'):
                sys.stderr.write(f"Failed to fetch reviews: {data}\n")
                return

            reviews = data.get('reviews', [])
            query_summary = data.get('query_summary', {})

            filtered_reviews = [
                review for review in reviews
                if review.get('votes_funny') >= self.MIN_FUNNY_UPVOTES or review.get('votes_up') >= self.MIN_UPVOTES
            ]

            formatted_reviews = []
            for review in filtered_reviews:
                review_id = review.get('recommendationid')
                if review_id and review_id not in review_ids:
                    review_ids.add(review_id)

                    review_text = review.get('review', '').strip()
                    timestamp = review.get('timestamp_created')
                    year = datetime.datetime.utcfromtimestamp(timestamp).year if timestamp else None
                    funny_upvotes = review.get('votes_funny', 0)

                    cleaned_review_text = self.clean_text(review_text)
                    review_length = len(cleaned_review_text)

                    if cleaned_review_text and year:
                        formatted_reviews.append({
                            "t": cleaned_review_text,
                            "y": year,
                            "f": funny_upvotes
                        })
                        total_char += review_length

                    if total_char >= self.MAX_CHARS:
                        print(f"Reached {self.MAX_CHARS} characters, stopping review collection.")
                        break

            if formatted_reviews:
                all_reviews.extend(formatted_reviews)

            if total_char >= self.MAX_CHARS:
                break

            if len(reviews) < 100:
                break

            offset += 100

        reviews_data = {"reviews": all_reviews, "query_summary": query_summary}

        try:
            with open(self.output_file, "w") as f:
                json.dump(reviews_data, f)
                f.flush()
                os.fsync(f.fileno())
            print(f"Successfully wrote JSON file: {self.output_file}")
        except Exception as e:
            sys.stderr.write(f"Error writing JSON file: {str(e)}\n")
            return

    def run(self, appid):
        print(f"Starting review collection for appid: {appid}")
        self.get_reviews_for_game(appid)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.stderr.write("Usage: python steam_api.py <appid> <worker_id>\n")
        sys.exit(1)
    
    appid = sys.argv[1]
    worker_id = sys.argv[2]
    scraper = SteamReviewScraper(worker_id)
    scraper.run(appid)

    if os.path.exists(scraper.output_file):
        sys.exit(0)
    else:
        sys.stderr.write(f"JSON file {scraper.output_file} not found after script execution.\n")
        sys.exit(1)
