import sqlite3
from dataclasses import dataclass
from pathlib import Path

@dataclass
class AppliedJob:
    title: str
    company: str
    link: str
    date_applied: str

class JobLogger:
    def __init__(self, db_path: Path):
        self.conn = sqlite3.connect(db_path)
        self._ensure_table()

    def _ensure_table(self):
        cur = self.conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS applied_jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                company TEXT,
                link TEXT UNIQUE,
                date_applied TEXT
            )
            """
        )
        self.conn.commit()

    def log(self, job: AppliedJob):
        cur = self.conn.cursor()
        cur.execute(
            "INSERT OR IGNORE INTO applied_jobs (title, company, link, date_applied) VALUES (?, ?, ?, ?)",
            (job.title, job.company, job.link, job.date_applied),
        )
        self.conn.commit()
