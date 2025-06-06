from pathlib import Path
from datetime import datetime
import argparse
from .config import load_config
from .job_search import IndeedSearcher
from .job_apply import JobApplier, ApplicantProfile
from .logger import JobLogger, AppliedJob
from .notify import Notifier


def main():
    parser = argparse.ArgumentParser(description="Automated job application bot")
    parser.add_argument("config", type=Path, help="Path to config file")
    args = parser.parse_args()

    config = load_config(args.config)
    searcher = IndeedSearcher(config.search)
    logger = JobLogger(Path("applied_jobs.db"))
    notifier = Notifier(config.application)
    profile = ApplicantProfile(email="you@example.com", phone="123456789")
    applier = JobApplier(config.application, profile)

    for job in searcher.search():
        print(f"Found job: {job.title} at {job.company}")
        applier.apply(job.link)
        logger.log(
            AppliedJob(
                title=job.title,
                company=job.company,
                link=job.link,
                date_applied=datetime.utcnow().isoformat(),
            )
        )
        notifier.send_email(
            to_addr=config.application.notification_email,
            subject=f"Applied to {job.title}",
            body=f"You applied to {job.title} at {job.company}\n{job.link}",
        )

    applier.close()

if __name__ == "__main__":
    main()
