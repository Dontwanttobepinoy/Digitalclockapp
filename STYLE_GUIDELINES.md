# DigitalClockApp Style Guidelines

## Table of Contents
1. [Brand Overview](#brand-overview)
2. [Typography](#typography)
3. [Color Palette](#color-palette)
4. [Layout & Spacing](#layout--spacing)
5. [Components](#components)
6. [Interactive Elements](#interactive-elements)
7. [Blog Post Standards](#blog-post-standards)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [File Structure](#file-structure)

---

## Brand Overview

### Brand Identity
- **Name**: DigitalClockApp
- **Domain**: digitalclockapp.com
- **Tagline**: Free Online Clock & Time Zone Converter
- **Primary Function**: Time zone conversion, clock display, timer, stopwatch

### Design Philosophy
- **Minimalist**: Clean, uncluttered interfaces
- **Functional**: Focus on usability and speed
- **Modern**: Contemporary design with digital aesthetics
- **Accessible**: High contrast and readable typography

---

## Typography

### Font Family
```css
font-family: 'Consolas', 'Courier New', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
```

### Font Hierarchy

#### Main Application
- **Clock Display**: `20vw` (portrait), `15vw` (landscape)
- **Date Display**: `4vw`
- **Navigation Buttons**: `0.9rem`
- **Action Buttons**: `1.1rem`
- **Timer/Stopwatch Display**: `3rem` (mobile), `4rem` (desktop)

#### Blog Posts
- **Article Title (H1)**: `2.5rem` (desktop), `2rem` (mobile)
- **Section Headers (H2)**: `1.8rem`
- **Subsection Headers (H3)**: `1.4rem`
- **Sub-subsection Headers (H4)**: `1.2rem`
- **Body Text**: `1rem`
- **Meta Information**: `0.9rem`
- **Tags**: `0.8rem`

### Font Properties
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
letter-spacing: 0.05em;
line-height: 1.6;
```

---

## Color Palette

### Primary Colors
- **Background**: `#000000` (Pure Black)
- **Text**: `#ffffff` (Pure White)
- **Secondary Text**: `#cccccc` (Light Grey)
- **Muted Text**: `#999999` (Medium Grey)

### Interactive Colors
- **Button Default**: `#999999` with `opacity: 0.58`
- **Button Hover**: `#ffffff` with `opacity: 1`
- **Button Active**: `#ffffff` with `opacity: 1`
- **Border**: `#444444` (Dark Grey)
- **Divider**: `#333333` (Very Dark Grey)

### Status Colors
- **Success/Positive**: `#00ff00` (Bright Green)
- **Error/Negative**: `#ff6666` (Light Red)
- **Warning**: `#ffaa00` (Orange)
- **Info**: `#00aaff` (Blue)

### Link Colors
- **Internal Links**: `#ffffff` with underline
- **External Links**: `#999999` with underline
- **Link Hover**: `#cccccc` (internal), `#ffffff` (external)

---

## Layout & Spacing

### Container Structure
```css
.main-content {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
```

### Blog Layout
```css
.blog-main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.blog-article {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444444;
    border-radius: 0.5rem;
    padding: 2rem;
}
```

### Spacing System
- **Small Gap**: `0.5rem`
- **Medium Gap**: `1rem`
- **Large Gap**: `1.5rem`
- **Extra Large Gap**: `2rem`
- **Section Gap**: `3rem`

### Border Radius
- **Small**: `0.2rem`
- **Medium**: `0.3rem`
- **Large**: `0.5rem`

---

## Components

### Navigation Menu
```css
.navigation-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    padding: 1rem;
    display: flex;
    justify-content: flex-start; /* Portrait */
    justify-content: center; /* Landscape */
    align-items: center;
    gap: 0.5rem;
    z-index: 1000;
    transition: opacity 0.5s ease;
}
```

### Navigation Buttons
```css
.nav-btn {
    background: transparent;
    border: none;
    color: #999999;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    padding: 0.8rem 1rem;
    cursor: pointer;
    opacity: 0.58;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
}

.nav-btn:hover {
    color: #ffffff;
    opacity: 1;
}

.nav-btn.active {
    color: #ffffff !important;
    opacity: 1 !important;
}
```

### Action Buttons
```css
.action-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    font-family: 'Consolas', 'Courier New', monospace;
    background: transparent;
    border: 1px solid #444444;
    border-radius: 0.3rem;
    color: #999999;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
    min-width: 5rem;
    opacity: 0.58;
}

.action-btn:hover, .action-btn:focus {
    background: #000000;
    color: #eeeeee;
    border-color: #cccccc;
    opacity: 1;
}
```

### Clock Display
```css
.time-display {
    font-size: 20vw; /* Portrait */
    font-size: 15vw; /* Landscape */
    color: #ffffff;
    text-align: center;
    margin: 0;
    line-height: 1;
}

.date-display {
    font-size: 4vw;
    color: #999999;
    text-align: center;
    margin: 0.5rem 0;
}
```

### Timer/Stopwatch Display
```css
.timer-display, .stopwatch-display {
    font-size: 3rem; /* Mobile */
    font-size: 4rem; /* Desktop */
    color: #ffffff;
    text-align: center;
    margin: 1rem 0;
}

.milliseconds-display {
    font-size: 1.2rem;
    color: #999999;
    text-align: center;
    margin: 0.5rem 0;
}
```

---

## Interactive Elements

### Button States
1. **Default**: Grey text (`#999999`) with `opacity: 0.58`
2. **Hover**: White text (`#ffffff`) with `opacity: 1`
3. **Active**: White text with `opacity: 1`
4. **Focus**: Same as hover state

### Transitions
```css
transition: all 0.2s ease;
```

### Hover Effects
- **Buttons**: Color change and opacity increase
- **Links**: Color change
- **Navigation**: Smooth opacity transitions

### Focus States
- **Buttons**: Same as hover state
- **Inputs**: Border color change
- **Links**: Color change

---

## Blog Post Standards

### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- SEO Meta Tags -->
    <!-- Open Graph Meta Tags -->
    <!-- Twitter Card Meta Tags -->
    <!-- Canonical URL -->
    <!-- Favicon -->
    <!-- Stylesheet -->
    <!-- Structured Data -->
</head>
<body>
    <header class="blog-header">
        <nav class="blog-nav">
            <a href="index.html" class="nav-btn">← Back to DigitalClockApp</a>
        </nav>
    </header>

    <main class="blog-main">
        <article class="blog-article">
            <header class="article-header">
                <h1>Article Title</h1>
                <div class="article-meta">
                    <span class="publish-date">Published: Date</span>
                    <span class="category">Category: Type</span>
                    <span class="read-time">Reading Time: X minutes</span>
                </div>
            </header>

            <div class="article-content">
                <!-- Content sections -->
            </div>

            <footer class="article-footer">
                <div class="related-articles">
                    <h3>Related Articles</h3>
                    <ul>
                        <!-- Related links -->
                    </ul>
                </div>
                
                <div class="article-tags">
                    <span class="tag">Tag 1</span>
                    <span class="tag">Tag 2</span>
                </div>
            </footer>
        </article>
    </main>

    <footer class="blog-footer">
        <div class="footer-content">
            <p>&copy; 2024 DigitalClockApp.com - Free Online Clock & Time Zone Converter</p>
            <p>Description of the page content</p>
        </div>
    </footer>
</body>
</html>
```

### Blog Components

#### Article Header
```css
.article-header h1 {
    font-size: 2.5rem;
    color: #ffffff;
    margin: 0 0 1rem 0;
    line-height: 1.2;
}

.article-meta {
    color: #999999;
    font-size: 0.9rem;
    margin-bottom: 2rem;
}
```

#### Content Sections
```css
.article-content h2 {
    font-size: 1.8rem;
    color: #ffffff;
    margin: 2rem 0 1rem 0;
    border-bottom: 1px solid #444444;
    padding-bottom: 0.5rem;
}

.article-content h3 {
    font-size: 1.4rem;
    color: #ffffff;
    margin: 1.5rem 0 0.5rem 0;
}

.article-content p {
    margin: 1rem 0;
    color: #cccccc;
}
```

#### Comparison Tables
```css
.conversion-table {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #444444;
    border-radius: 0.3rem;
    padding: 1.5rem;
    margin: 1.5rem 0;
}

.conversion-table th {
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-weight: bold;
    padding: 0.75rem;
}

.conversion-table td {
    color: #cccccc;
    padding: 0.75rem;
    border-bottom: 1px solid #444444;
}
```

#### Call-to-Action Sections
```css
.cta-section {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #666666;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    margin: 2rem 0;
}

.cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 1.1rem;
    font-family: 'Consolas', 'Courier New', monospace;
    background: transparent;
    border: 1px solid #444444;
    border-radius: 0.3rem;
    color: #999999;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
    min-width: 5rem;
    opacity: 0.58;
    text-decoration: none;
    display: inline-block;
    margin-top: 1rem;
}
```

#### Tags
```css
.tag {
    display: inline-block;
    background: #444444;
    color: #ffffff;
    padding: 0.3rem 0.8rem;
    border-radius: 0.2rem;
    font-size: 0.8rem;
    margin: 0.2rem;
}
```

---

## Responsive Design

### Breakpoints
- **Mobile**: `max-width: 768px`
- **Small Mobile**: `max-width: 480px`
- **Landscape**: `orientation: landscape`

### Mobile Adaptations

#### Navigation
```css
@media screen and (max-width: 768px) {
    .navigation-menu {
        padding: 0 0.5rem;
        gap: 0.5rem;
    }
    
    .nav-btn {
        font-size: 0.8rem;
        padding: 0.6rem 0.8rem;
    }
}
```

#### Typography
```css
@media screen and (max-width: 768px) {
    .time-display {
        font-size: 20vw;
    }
    
    .date-display {
        font-size: 4vw;
    }
    
    .article-header h1 {
        font-size: 2rem;
    }
}
```

#### Layout
```css
@media screen and (max-width: 768px) {
    .blog-main {
        padding: 1rem;
    }
    
    .blog-article {
        padding: 1rem;
    }
    
    .pros-cons-section {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
```

### Landscape Mode
```css
@media screen and (orientation: landscape) {
    .navigation-menu {
        justify-content: center;
    }
    
    .time-display {
        font-size: 15vw;
    }
}
```

---

## Accessibility

### Color Contrast
- **Primary Text**: White on black (21:1 ratio)
- **Secondary Text**: Light grey on black (7:1 ratio)
- **Interactive Elements**: High contrast on hover

### Focus Indicators
- All interactive elements have visible focus states
- Focus follows logical tab order

### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- ARIA labels where needed

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows visual layout
- Escape key functionality for modals

---

## File Structure

### Main Application
```
/
├── index.html              # Main application
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript
├── digital-7.ttf           # Font file (if used)
├── logo.png                # Brand logo
├── click.mp3               # Click sound
├── alarm.mp3               # Alarm sound
├── robots.txt              # SEO robots file
├── sitemap.xml             # SEO sitemap
└── CHANGELOG.md            # Development changelog
```

### Blog Posts
```
/
├── est-to-ist-conversion-guide.html
├── pst-to-ist-conversion-guide.html
├── cst-to-ist-conversion-guide.html
├── utc-to-ist-conversion-guide.html
├── us-time-zones-guide.html
├── best-online-time-zone-converters-compared.html
└── [future-blog-posts].html
```

### Documentation
```
/
├── STYLE_GUIDELINES.md     # This file
├── SEO_Optimization_Guide.md
├── Backlink_Strategy.md
└── CHANGELOG.md
```

---

## Implementation Checklist

### New Components
- [ ] Use established color palette
- [ ] Follow typography hierarchy
- [ ] Implement proper spacing
- [ ] Add hover and focus states
- [ ] Test responsive behavior
- [ ] Verify accessibility

### New Blog Posts
- [ ] Follow HTML structure template
- [ ] Include all required meta tags
- [ ] Add structured data
- [ ] Use proper heading hierarchy
- [ ] Include related articles section
- [ ] Add relevant tags
- [ ] Test mobile responsiveness

### Code Standards
- [ ] Use semantic HTML
- [ ] Follow CSS naming conventions
- [ ] Include proper comments
- [ ] Test cross-browser compatibility
- [ ] Validate HTML and CSS
- [ ] Optimize for performance

---

*Last Updated: July 2024*
*Version: 1.0* 