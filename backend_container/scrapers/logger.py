import logging
import os

current_directory = os.getcwd()

log_file_path = os.path.join(current_directory, 'logger/scraper.log')

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

file_handler = logging.FileHandler(log_file_path)
file_handler.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)

file_handler.flush()

def get_logger():
    return logger

if __name__ == "__main__":
    logger = get_logger()

