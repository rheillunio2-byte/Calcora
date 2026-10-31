# 🤝 Contributing to Calcora

Thank you for your interest in contributing to **Calcora**!

Contributions are welcome, whether they involve fixing bugs, improving existing features, developing new mathematical functions, enhancing the user interface, improving image recognition, or updating documentation.

This guide explains how to contribute while keeping the project organized, consistent, and maintainable.

---

## 📌 Table of Contents

1. Getting Started
2. Development Requirements
3. Setting Up the Project
4. Types of Contributions
5. Contribution Guidelines
6. Coding Standards
7. Working with Mathematical Functions
8. Working with Image Recognition
9. Reporting Bugs
10. Suggesting Features
11. Submitting Changes
12. Pull Request Guidelines
13. Code of Conduct

---

## 1. Getting Started

Before contributing, familiarize yourself with the project and its existing functionality.

Calcora is a React-based mathematical application developed using Vite. Its main components include:

- Standard calculator.
- Scientific calculator.
- Smart mathematical solver.
- Equation-solving functionality.
- Image-based mathematical problem recognition.
- Calculation history.
- Responsive user interface.

You can begin contributing by reviewing the existing source code, identifying potential improvements, or selecting an issue that you would like to address.

---

## 2. Development Requirements

Before starting development, ensure that you have the following tools installed:

- **Node.js** – JavaScript runtime.
- **npm** – Package manager.
- **Git** – Version control system.
- **Code Editor** – Visual Studio Code or another preferred editor.
- **Modern Web Browser** – For testing the application.

Basic familiarity with the following technologies is recommended:

- React.
- JavaScript.
- HTML5.
- CSS3.
- Vite.
- Git and GitHub.

Experience with mathematical libraries such as Math.js, Nerdamer, and Tesseract.js is helpful when modifying the solver or OCR functionality.

---

## 3. Setting Up the Project

Follow these steps to prepare your local development environment.

### Step 1: Fork the Repository

Fork the Calcora repository to your own GitHub account.

### Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/Calcora.git
```

Replace `YOUR-USERNAME` with your GitHub username or fork location.

### Step 3: Enter the Project Directory

```bash
cd Calcora
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open the local address displayed in your terminal to access the application.

### Step 6: Create a Branch

Create a separate branch for your contribution.

```bash
git checkout -b feature/your-feature-name
```

For bug fixes:

```bash
git checkout -b fix/your-bug-name
```

Avoid making unrelated changes directly to the main branch.

---

## 4. Types of Contributions

### A. Bug Fixes

You can help improve Calcora by identifying and correcting problems such as:

- Incorrect arithmetic results.
- Improper order-of-operations handling.
- Incorrect equation solutions.
- Interface or layout problems.
- Mobile responsiveness issues.
- Broken buttons or input controls.
- Image recognition errors.
- Calculation history problems.

### B. Feature Improvements

Suggestions and implementations for new functionality are welcome, including:

- Additional scientific functions.
- Improved mathematical expression handling.
- More advanced equation solving.
- Better step-by-step explanations.
- Improved image upload and camera functionality.
- Enhanced OCR recognition.
- Graphing and visualization features.
- Keyboard shortcuts.
- Accessibility improvements.

### C. User Interface Improvements

Contributions to the design and usability of Calcora are also encouraged.

Examples include:

- More consistent spacing and typography.
- Smoother transitions and animations.
- Improved button interactions.
- Better mobile layouts.
- More accessible color contrast.
- Clearer mathematical input and result displays.

### D. Documentation Improvements

You may also contribute by:

- Correcting documentation errors.
- Improving installation instructions.
- Adding usage examples.
- Updating technical explanations.
- Improving the README.
- Clarifying known limitations.

---

## 5. Contribution Guidelines

To maintain project quality, please follow these guidelines:

1. Keep contributions relevant to Calcora.
2. Avoid introducing unnecessary dependencies.
3. Preserve existing functionality unless a change is intentional.
4. Use clear and descriptive names for variables, functions, and components.
5. Keep code organized and readable.
6. Test changes before submitting them.
7. Avoid committing generated files or unnecessary dependencies.
8. Update documentation when a contribution changes application behavior.
9. Explain significant changes clearly in your pull request.
10. Do not include private credentials, API keys, or sensitive information in commits.

---

## 6. Coding Standards

Consistency helps make Calcora easier to maintain and improve.

### JavaScript and React

- Use clear and meaningful variable and function names.
- Prefer reusable React components where appropriate.
- Keep components focused on their intended responsibilities.
- Use React state and props appropriately.
- Avoid unnecessary duplication.
- Handle invalid inputs and errors gracefully.
- Remove unused imports and variables.

### CSS

- Maintain consistent spacing and styling.
- Prefer reusable styles and shared design patterns.
- Ensure layouts remain responsive.
- Avoid unnecessary overrides and conflicting rules.
- Maintain readable and organized CSS.
- Consider both light and dark appearance modes when modifying shared interface elements.

### File Organization

Place code in the appropriate project files and directories.

Avoid placing unrelated application logic in a single component when it can reasonably be separated into reusable modules.

---

## 7. Working with Mathematical Functions

Mathematical accuracy is one of Calcora's most important requirements.

When modifying or adding mathematical functionality, ensure that:

- Expressions are evaluated correctly.
- Invalid mathematical inputs are handled safely.
- Parentheses are interpreted correctly.
- Negative numbers and decimal values are supported.
- Division by zero is handled appropriately.
- Results are consistent with standard mathematical conventions.
- Existing calculator functionality is preserved.

### Order of Operations (PEMDAS)

All mathematical expression evaluation must follow standard operator precedence.

The correct order is:

1. Parentheses.
2. Exponents and roots.
3. Multiplication and division, evaluated from left to right.
4. Addition and subtraction, evaluated from left to right.

For example:

```text
8 + 2 × (6 - 3)² ÷ 3
```

Expected result:

```text
14
```

Contributors modifying the expression parser or solver should test expressions involving multiple operations and nested parentheses.

### Testing Mathematical Changes

Whenever possible, test:

- Simple arithmetic expressions.
- Expressions with multiple operators.
- Nested parentheses.
- Exponents and roots.
- Negative numbers.
- Decimal values.
- Trigonometric functions.
- Linear equations.
- Quadratic equations.
- Invalid expressions.

Do not assume that a calculation is correct simply because it produces a numerical result.

---

## 8. Working with Image Recognition

Calcora uses OCR technology to extract mathematical text from images.

Contributions to this functionality should prioritize recognition accuracy and usability.

When improving image recognition:

- Preserve the original image when possible.
- Handle different image dimensions and orientations.
- Provide clear feedback during image processing.
- Handle failed recognition attempts gracefully.
- Avoid automatically trusting uncertain OCR output.
- Allow users to review and correct extracted expressions.
- Test using different image qualities and mathematical layouts.

Important test cases include:

- Printed mathematical expressions.
- Handwritten expressions.
- Fractions.
- Exponents.
- Square roots.
- Parentheses.
- Negative numbers.
- Multiple-line equations.

A successful OCR result does not necessarily mean that the extracted mathematical expression is valid. Recognition and mathematical validation should be treated as separate processes.

---

## 9. Reporting Bugs

If you encounter a problem, please report it through the repository's GitHub Issues section.

A useful bug report should include:

**Title:** A short description of the problem.

**Description:** Explain what happened and what you expected to happen.

**Steps to Reproduce:** Provide the steps needed to reproduce the issue.

**Expected Behavior:** Describe the correct result or behavior.

**Actual Behavior:** Describe what happened instead.

**Environment:** Include relevant information such as:

- Operating system.
- Browser.
- Node.js version, if applicable.
- Application version or commit.

**Screenshots or Examples:** Include screenshots, sample expressions, or images when they help demonstrate the problem.

For mathematical bugs, always include the exact expression or equation that produced the incorrect result.

---

## 10. Suggesting Features

Feature suggestions are welcome.

Before submitting a new suggestion:

1. Check whether a similar feature request already exists.
2. Explain the problem the proposed feature addresses.
3. Describe how the feature should work.
4. Explain how it would improve Calcora.
5. Include examples or reference materials when useful.

Suggestions should be practical, relevant, and consistent with Calcora's purpose as a mathematical calculator and solver.

---

## 11. Submitting Changes

After completing your changes, review and test them before committing.

### Step 1: Check Your Changes

```bash
git status
```

### Step 2: Stage the Relevant Files

```bash
git add .
```

Only stage files that belong to your contribution.

### Step 3: Commit Your Changes

Use a clear and descriptive commit message.

```bash
git commit -m "Improve mathematical expression handling"
```

Other examples:

```bash
git commit -m "Fix calculator input validation"
git commit -m "Improve mobile calculator layout"
git commit -m "Enhance image recognition handling"
git commit -m "Update project documentation"
```

### Step 4: Push Your Branch

```bash
git push origin feature/your-feature-name
```

### Step 5: Open a Pull Request

Visit your fork on GitHub and create a pull request targeting the original repository's main branch.

---

## 12. Pull Request Guidelines

Before submitting a pull request, make sure that:

- [ ] Your changes address the intended issue or feature.
- [ ] Your code follows the project's coding standards.
- [ ] Existing functionality has not been unintentionally broken.
- [ ] Mathematical operations have been tested where applicable.
- [ ] The interface remains responsive.
- [ ] Errors and invalid inputs are handled appropriately.
- [ ] No unnecessary files or dependencies were added.
- [ ] Documentation has been updated when necessary.
- [ ] Your commit messages are clear and descriptive.

### Pull Request Description

A good pull request should explain:

**Summary:** What did you change?

**Purpose:** Why was the change necessary?

**Implementation:** How did you implement it?

**Testing:** What did you test?

**Screenshots:** Include before-and-after screenshots for visual changes when appropriate.

Keep pull requests focused. If you are proposing several unrelated changes, consider submitting separate pull requests.

---

## 13. Code of Conduct

All contributors are expected to maintain a respectful and collaborative environment.

Please:

- Be respectful when communicating with others.
- Provide constructive feedback.
- Respect different levels of experience.
- Avoid personal attacks or inappropriate language.
- Focus discussions on improving the project.
- Be open to suggestions and revisions.

Contributions should help make Calcora more reliable, accessible, and useful for its users.

---

## 📬 Thank You for Contributing!

Thank you for taking the time to contribute to Calcora.

Every improvement, whether a small bug fix, a mathematical enhancement, a user interface refinement, or a documentation update, helps make the project better.

**Together, we can make Calcora a more reliable, user-friendly, and capable mathematical application.**

---

*Calcora — Making mathematical problem-solving simpler, smarter, and more accessible.*