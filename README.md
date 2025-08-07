# Meadow Manual

A comprehensive documentation site for Meadow, built with Jekyll.

## Prerequisites

- Ruby >= 3.0.0
- Node.js >= 16.0.0
- Yarn or npm
- Bundler gem

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd UG-1797_Manual
```

2. Install Ruby dependencies:
```bash
bundle install
```

3. Install Node.js dependencies:
```bash
yarn install
# or
npm install
```

## Development

### Running the site locally

```bash
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`

### Building the site

```bash
bundle exec jekyll build
```

The built site will be in the `_site` directory.

## Testing

This project includes a comprehensive test suite with unit tests, integration tests, and end-to-end tests.

### Test Structure

```
tests/
├── unit/           # Unit tests for JavaScript modules
│   ├── main.test.js
│   └── search.test.js
├── integration/    # Integration tests for Jekyll build
│   └── jekyll-build.test.js
├── e2e/           # End-to-end tests with Playwright
│   ├── navigation.spec.js
│   ├── search.spec.js
│   └── content.spec.js
├── __mocks__/     # Mock files for testing
└── jest.setup.js  # Jest configuration
```

### Running Tests

#### Install test dependencies
```bash
yarn install
```

#### Run all tests
```bash
yarn test:all
```

#### Run specific test suites

**Unit tests only:**
```bash
yarn test:unit
```

**Integration tests only:**
```bash
yarn test:integration
```

**End-to-end tests only:**
```bash
yarn test:e2e
```

#### Watch mode for development
```bash
yarn test:watch
```

#### Generate test coverage report
```bash
yarn test:coverage
```

Coverage reports will be generated in the `coverage/` directory. Open `coverage/index.html` in a browser to view the detailed report.

### Linting

Run ESLint to check code quality:
```bash
yarn lint
```

Fix auto-fixable issues:
```bash
yarn lint:fix
```

### Test Scripts

All test commands are defined in `package.json`:

- `test` - Run all Jest tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Generate coverage report
- `test:unit` - Run unit tests only
- `test:integration` - Run integration tests only
- `test:e2e` - Run Playwright E2E tests
- `test:all` - Run all test suites sequentially
- `lint` - Run ESLint
- `lint:fix` - Fix linting issues

### Continuous Integration

The test suite is designed to run in CI environments. Set the `CI` environment variable to optimize test execution:

```bash
CI=true yarn test:all
```

### Writing Tests

#### Unit Tests
Unit tests are written using Jest and Testing Library. They test individual JavaScript modules in isolation.

Example:
```javascript
test('should toggle sidebar on menu click', () => {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  fireEvent.click(menuToggle);
  expect(sidebar.classList.contains('active')).toBe(true);
});
```

#### Integration Tests
Integration tests verify that the Jekyll build process works correctly and generates expected output.

Example:
```javascript
test('should generate search.json', async () => {
  const searchJsonPath = path.join(siteDir, 'search.json');
  const exists = await fsExists(searchJsonPath);
  expect(exists).toBe(true);
});
```

#### E2E Tests
End-to-end tests use Playwright to test the site from a user's perspective in real browsers.

Example:
```javascript
test('should open search modal with Cmd+K', async ({ page }) => {
  await page.keyboard.press('Control+k');
  const searchModal = page.locator('#search-modal');
  await expect(searchModal).toHaveClass(/active/);
});
```

### Test Configuration

#### Jest Configuration
Jest is configured in `package.json` under the `jest` key. Key settings:
- `testEnvironment`: jsdom for browser-like environment
- `setupFilesAfterEnv`: Setup file for test utilities
- `collectCoverageFrom`: Files to include in coverage
- `coverageReporters`: Coverage output formats

#### Playwright Configuration
Playwright is configured in `playwright.config.js`. Key settings:
- `baseURL`: Local server URL
- `projects`: Browser engines to test
- `webServer`: Automatically starts Jekyll server

#### ESLint Configuration
ESLint is configured in `.eslintrc.json` with rules for code quality and consistency.

## Features Tested

### Unit Tests Coverage
- Mobile menu toggle functionality
- Code copy buttons
- Table of contents highlighting
- Smooth scrolling
- External link handling
- Image lightbox
- Search initialization
- Search modal interactions
- Search functionality
- Keyboard navigation

### Integration Tests Coverage
- Jekyll build output
- Page generation
- Asset compilation
- Search index generation
- Layout application
- Include processing

### E2E Tests Coverage
- Site navigation
- Mobile responsiveness
- Search functionality
- Content features
- Accessibility
- Performance

## Troubleshooting

### Common Issues

1. **Tests fail with "Cannot find module"**
   - Run `yarn install` to ensure all dependencies are installed

2. **Jekyll build tests fail**
   - Ensure Ruby dependencies are installed: `bundle install`
   - Check Ruby version: `ruby --version` (should be >= 3.0.0)

3. **E2E tests timeout**
   - Ensure Jekyll server can start: `bundle exec jekyll serve`
   - Check if port 4000 is available

4. **Coverage report not generating**
   - Run `yarn test:coverage` instead of `yarn test`
   - Check that coverage directory has write permissions

## Contributing

When contributing to this project:

1. Write tests for new features
2. Ensure all tests pass before submitting PR
3. Maintain test coverage above 80%
4. Follow the existing test patterns and conventions
5. Run linting before committing: `yarn lint:fix`

## License

[Your License Here]