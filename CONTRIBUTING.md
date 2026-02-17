# Contributing to Smart Bookmark Manager

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/smart-bookmark-app.git
   cd smart-bookmark-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables (see QUICKSTART.md)
5. Run the development server:
   ```bash
   npm run dev
   ```

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test thoroughly:
   - Test login/logout
   - Test adding bookmarks
   - Test deleting bookmarks
   - Test real-time sync (open multiple tabs)
   - Test in both light and dark mode

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: component/file description`
- `Refactor: what was refactored`
- `Docs: documentation changes`

## Code Style

- Use TypeScript for all new files
- Follow existing code formatting
- Use Tailwind CSS for styling
- Keep components small and focused
- Add comments for complex logic

## Testing Checklist

Before submitting a PR, ensure:

- [ ] Code runs without errors
- [ ] Authentication works
- [ ] Bookmarks can be added
- [ ] Bookmarks can be deleted
- [ ] Real-time sync works
- [ ] UI looks good in light/dark mode
- [ ] Mobile responsive
- [ ] No console errors
- [ ] TypeScript compiles without errors

## Feature Ideas

Here are some ideas for contributions:

- Add tags/categories
- Search functionality
- Import/export bookmarks
- Bookmark folders
- Bulk operations (delete multiple)
- Bookmark sorting options
- Bookmark editing
- URL preview/favicon
- Keyboard shortcuts
- Browser extension

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
