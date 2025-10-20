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

With live reload:
```bash
bundle exec jekyll serve --livereload
```

The site will be available at `http://localhost:4000`

### Publishing changes

All pushes to `main` will be automatically published. 
