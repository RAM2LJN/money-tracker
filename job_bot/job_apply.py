from dataclasses import dataclass
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@dataclass
class ApplicantProfile:
    email: str
    phone: str

class JobApplier:
    """Automates applying to jobs using Selenium."""

    def __init__(self, config, profile: ApplicantProfile):
        self.config = config
        self.profile = profile
        self.driver = webdriver.Firefox()

    def close(self):
        self.driver.quit()

    def apply(self, posting_url: str):
        driver = self.driver
        driver.get(posting_url)
        # The following is highly simplified and serves as a placeholder.
        try:
            email_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
            )
            email_input.send_keys(self.profile.email)
            phone_input = driver.find_element(By.CSS_SELECTOR, "input[type='tel']")
            phone_input.send_keys(self.profile.phone)
            resume_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
            resume_input.send_keys(str(self.config.resume_path))
            submit_btn = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
            submit_btn.click()
        except Exception as exc:
            print(f"Failed to apply to {posting_url}: {exc}")
