# CST8503 Presentation: Knowledge Representation and Planning

A modern, responsive web presentation about Knowledge Representation and Planning using Prolog, built with vanilla JavaScript and deployed on GitHub Pages.

## 📋 Overview

This presentation covers:
- Knowledge Representation basics
- Planning problems in Artificial Intelligence
- Prolog solutions for planning
- Tips and best practices
- Conclusion and key takeaways

## 🏗️ Project Structure

```
Presentation_KR/
├── index.html              # Main HTML template
├── script.js              # JavaScript for dynamic content loading
├── styles.css             # CSS styles
├── data.json              # Structured data (metadata, navigation, etc.)
├── content/               # HTML content files for each page
│   ├── introduction.html
│   ├── prolog-solutions.html
│   └── tips-practices.html
├── public/               # Static assets
│   └── images/           # Image files
├── scripts/              # Utility scripts
│   └── docx_to_markdown_ko.py
├── .github/              # GitHub Actions workflow
│   └── workflows/
│       └── deploy.yml
└── README.md             # This file
```

## 🎯 Features

- **Data-Driven Architecture**: Content separated from structure using JSON
- **Dynamic Content Loading**: Pages generated dynamically from JSON data
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Navigation**: Page transitions with scroll-to-top functionality
- **Keyboard Navigation**: Arrow keys for page navigation
- **GitHub Pages Deployment**: Automatic deployment via GitHub Actions

## 📁 File Descriptions

### Core Files

- **`index.html`**: Minimal HTML template structure. Navigation and main container are populated dynamically by JavaScript.

- **`script.js`**: Main JavaScript file that:
  - Loads JSON data asynchronously
  - Generates navigation menu dynamically
  - Builds all pages from JSON data
  - Handles page switching and navigation
  - Manages scroll behavior

- **`styles.css`**: Complete styling for the presentation including:
  - Dark theme with gradient backgrounds
  - Responsive layout
  - Navigation bar styling
  - Page content styling
  - Animations and transitions

- **`data.json`**: Centralized data file containing:
  - Presentation metadata (title, subtitle)
  - Navigation menu items
  - Page information (id, title, speaker, content files)
  - Team member data
  - References list

### Content Files

- **`content/introduction.html`**: HTML content for Introduction & KR Basics page
- **`content/prolog-solutions.html`**: HTML content for Prolog Solutions page
- **`content/tips-practices.html`**: HTML content for Tips and Best Practices page

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/LannieYoo/Presentation_KR.git
cd Presentation_KR
```

2. Start a local server (Python):
```bash
python -m http.server 8000
```

3. Open in browser:
```
http://localhost:8000
```

### Using Virtual Environment (venv)

```bash
# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# or
source venv/bin/activate      # Linux/Mac

# Start server
python -m http.server 8000
```

## 🚢 Deployment

### GitHub Pages (Automatic)

The project is automatically deployed to GitHub Pages via GitHub Actions:

1. **Workflow**: `.github/workflows/deploy.yml`
2. **Trigger**: Automatically runs on push to `main` branch
3. **URL**: `https://lannieyoo.github.io/Presentation_KR/`

### Manual Deployment

1. Push changes to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push
```

2. GitHub Actions will automatically:
   - Build and deploy to GitHub Pages
   - Make the site available at the GitHub Pages URL

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: 
  - Async/await for asynchronous operations
  - Template literals for dynamic HTML
  - Arrow functions
  - Fetch API for data loading
- **JSON**: Data structure
- **GitHub Actions**: CI/CD for deployment

## 📝 Data Structure

### `data.json` Structure

```json
{
  "presentation": {
    "title": "...",
    "subtitle": "...",
    "subtitleSecondary": "..."
  },
  "navigation": [
    { "id": "...", "label": "...", "href": "..." }
  ],
  "pages": [
    {
      "id": "...",
      "type": "home|content|references",
      "title": "...",
      "speaker": "...",
      "contentFile": "..." // Optional
    }
  ],
  "teamMembers": [
    { "name": "...", "link": "..." }
  ],
  "references": [
    { "text": "...", "url": "..." }
  ]
}
```

## 🎨 Customization

### Adding a New Page

1. Add page data to `data.json`:
```json
{
  "id": "new-page",
  "type": "content",
  "title": "New Page Title",
  "speaker": "Speaker Name",
  "contentFile": "content/new-page.html"
}
```

2. Add navigation item:
```json
{
  "id": "new-page",
  "label": "New Page",
  "href": "#new-page"
}
```

3. Create content file: `content/new-page.html`

4. The page will be automatically generated!

### Modifying Styles

Edit `styles.css` to customize:
- Colors and themes
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

## ⌨️ Keyboard Shortcuts

- **Arrow Right (→)**: Next page
- **Arrow Left (←)**: Previous page

## 👥 Team Members

- **Jiaxing Yi**: Introduction & KR Basics, Conclusion
- **Peng Wang**: Prolog Solutions
- **Hye Ran Yoo**: Tips and Best Practices

## 📚 References

All references are listed in the References page, formatted according to APA 7th edition style.

## 📄 License

This project is for educational purposes as part of CST8503 course.

## 🤝 Contributing

This is a course project. For suggestions or improvements, please open an issue or submit a pull request.

## 📧 Contact

For questions or issues, please contact the repository owner.

---

**Note**: This presentation uses modern JavaScript (ES6+) features. For best compatibility, use a modern web browser.

