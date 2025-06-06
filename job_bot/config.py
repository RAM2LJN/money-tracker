from dataclasses import dataclass
from pathlib import Path
import json
import yaml

@dataclass
class SearchConfig:
    keywords: list
    locations: list
    salary_min: int | None = None
    salary_max: int | None = None
    posted_within: str | None = None

@dataclass
class AppConfig:
    resume_path: Path
    cover_letter_path: Path | None = None
    rate_limit_per_day: int = 10
    notification_email: str | None = None
    telegram_token: str | None = None
    telegram_chat_id: str | None = None

@dataclass
class Config:
    search: SearchConfig
    application: AppConfig


def load_config(path: Path) -> Config:
    """Load a YAML or JSON configuration file."""
    text = path.read_text()
    data = yaml.safe_load(text) if path.suffix in {'.yaml', '.yml'} else json.loads(text)
    search = SearchConfig(**data['search'])
    app = AppConfig(**data['application'])
    return Config(search=search, application=app)
