from dataclasses import dataclass
from typing import Iterable
import requests
from bs4 import BeautifulSoup

@dataclass
class JobPosting:
    title: str
    company: str
    link: str
    date_posted: str

class IndeedSearcher:
    """Simple scraper for Indeed job listings."""

    BASE_URL = "https://www.indeed.com/jobs"

    def __init__(self, config):
        self.config = config

    def search(self) -> Iterable[JobPosting]:
        params = {
            "q": " ".join(self.config.keywords),
            "l": " ".join(self.config.locations),
            "fromage": self.config.posted_within,
        }
        response = requests.get(self.BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        for card in soup.select(".jobsearch-SerpJobCard"):
            title_elem = card.select_one("h2.jobTitle")
            link = card.select_one("a")
            company_elem = card.select_one("span.companyName")
            date_elem = card.select_one("span.date")
            if not (title_elem and link):
                continue
            yield JobPosting(
                title=title_elem.get_text(strip=True),
                company=company_elem.get_text(strip=True) if company_elem else "",
                link="https://www.indeed.com" + link['href'],
                date_posted=date_elem.get_text(strip=True) if date_elem else "",
            )
