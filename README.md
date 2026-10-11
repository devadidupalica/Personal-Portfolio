# Dupalica Devadi — Portfolio + Profile Chatbot

Personal portfolio website personalized from the resume supplied for the Krithomedh Technical Recruitment Round 2 assignment.

## Included
- Responsive portfolio with About, Skills, Projects, Experience-related profile information, Education, Certifications, Achievements, and Contact
- Profile-aware JavaScript chatbot
- The supplied resume available from the website's Resume link
- Vanilla HTML, CSS, and JavaScript; no API key or server required

## Run locally
Open `index.html` in a modern browser, or use VS Code Live Server.

## Before submitting
- Review the portfolio and ensure every detail is still accurate.
- Add your actual GitHub, LinkedIn, LeetCode, and/or HackerRank links to `profile.js`. These links were not included in the supplied resume, so they are intentionally not fabricated.
- Add repository links to projects in `profile.js` if you have public repositories.
- The resume in `assets/resume.pdf` is the supplied resume.

## Publish to GitHub
Create a new repository on GitHub. In a terminal opened in this project folder, run:

```bash
git init
git add .
git commit -m "Build personal portfolio with profile chatbot"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your real repository URL. Make the repository public if the recruitment team needs to review it.

## Optional deployment: GitHub Pages
1. Push the project to GitHub.
2. Open repository Settings → Pages.
3. Select “Deploy from a branch”, branch `main`, folder `/ (root)`, and save.
4. Wait for GitHub Pages to provide the website URL.

## Chatbot
The chatbot uses the facts in `profile.js` and works without a paid AI API. It supports questions about projects, skills, resume, education, experience, certifications, achievements, languages, contact, and coding profiles. Since the supplied resume did not contain public coding-profile URLs, add them yourself if available.
