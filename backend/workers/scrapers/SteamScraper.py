import requests
import time

class SteamReviewScraper:
    BASE_URL = "https://store.steampowered.com/appreviews/{appid}?json=1&num_per_page=100&start_offset={offset}&filter=all"
    
    def __init__(self, max_reviews=3000, min_upvotes=20, min_funny_upvotes=30):
        """
        Initialize the SteamReviewScraper with custom settings.
        
        Args:
            max_reviews (int): The maximum number of reviews to fetch. Default is 3000.
            min_upvotes (int): The minimum number of upvotes a review must have to be considered. Default is 20.
            min_funny_upvotes (int): The minimum number of funny upvotes a review must have to be considered. Default is 30.
        """
        self.MAX_REVIEWS = max_reviews
        self.MIN_UPVOTES = min_upvotes
        self.MIN_FUNNY_UPVOTES = min_funny_upvotes

    def get_reviews_for_game(self, appid):
        """
        Fetch reviews for a given game based on its appid.
        Args:
            appid (str): The Steam appid of the game to fetch reviews for.
        Returns:
            list: A list of reviews (dict) or an empty dict if the game does not exist.
        """
        all_reviews = []  # List to store all fetched reviews
        review_ids = set()  # Set to track unique review ids to avoid duplicates
        offset = 0  # Offset for pagination in Steam reviews API
        
        while offset < self.MAX_REVIEWS:
            url = self.BASE_URL.format(appid=appid, offset=offset)
            print(f"Fetching reviews from {url}")
            response = requests.get(url)

            if response.status_code == 429:
                print("Rate limit exceeded. Waiting before retrying...")
                retry_after = int(response.headers.get("Retry-After", 5))
                time.sleep(retry_after)
                continue

            if response.status_code != 200:
                print(f"Error fetching reviews for appid {appid}: {response.status_code}")
                return {} 

            data = response.json()

            if not data.get('success'):
                print(f"Failed to fetch reviews for appid {appid}. Response data: {data}")
                return {}  

            reviews = data.get('reviews', [])
            query_summary = data.get('query_summary', {})

            filtered_reviews = [
                review for review in reviews
                if review.get('votes_funny', 0) >= self.MIN_FUNNY_UPVOTES or review.get('votes_up', 0) >= self.MIN_UPVOTES
            ]

            unique_reviews = []
            for review in filtered_reviews:
                review_id = review.get('recommendationid')
                if review_id and review_id not in review_ids:
                    review_ids.add(review_id)
                    unique_reviews.append(review)

            if unique_reviews:
                all_reviews.extend(unique_reviews)
                print(f"Fetched {len(unique_reviews)} unique reviews... Total: {len(all_reviews)} reviews so far.")

            if len(reviews) < 100: 
                print("No more reviews to fetch.")
                break

            offset += 100 

        return {"reviews": all_reviews} if all_reviews else {}

    def run(self, appid):
        """
        Main method to run the scraper for a single game.
        Args:
            appid (str): The Steam appid of the game to fetch reviews for.
        Returns:
            dict: A dictionary with the reviews or an empty dict if no reviews found.
        """
        reviews_data = self.get_reviews_for_game(appid)
        return reviews_data

if __name__ == "__main__":
    scraper = SteamReviewScraper(max_reviews=3000, min_upvotes=30, min_funny_upvotes=20)
    appid = ""
    reviews = scraper.run(appid)
    print(reviews)
