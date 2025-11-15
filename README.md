# @gang-of-front/cli

> CLI tool to generate and manage frontend microfrontends using Single SPA and more

A powerful command-line interface built with [Plop.js](https://plopjs.com/) that helps you manage microfrontends architecture, including deployment to S3 and import map management.

## Features

- 🚀 **Microfrontends Management**: Deploy and sync microfrontends to S3
- 📦 **Import Map Updates**: Automatically update import-map.json for Single SPA applications
- 🔄 **Environment Support**: Deploy to different environments (dev, stg, prod)
- ✅ **Remote Verification**: Verify remote files before updating import maps
- 🎯 **Interactive Prompts**: User-friendly CLI prompts for configuration

## Installation

```bash
npm install -g @gang-of-front/cli
```

Or use with `npx`:

```bash
npx @gang-of-front/cli
```

## Usage

### Basic Usage

Run the CLI without arguments to see available commands:

```bash
gof-cli
```

Or use with npx:

```bash
npx gof-cli
```

### Available Commands

#### `microfrontends-sync`

Synchronizes your built microfrontend files to S3.

**Interactive mode:**
```bash
gof-cli microfrontends-sync
```

**With parameters:**
```bash
gof-cli microfrontends-sync --dist ./dist --hash abc123 --bucket my-bucket --s3Endpoint https://s3.example.com --environment prod
```

**Parameters:**
- `dist` - Dist folder path (default: `./dist`)
- `hash` - Hash to locate files (required)
- `bucket` - S3 bucket name
- `s3Endpoint` - S3 endpoint URL
- `environment` - Environment to deploy to (`dev`, `stg`, or `prod`)

**What it does:**
- Uploads files from your `dist` folder to S3
- Organizes files in the path: `microfrontends/{environment}/{orgName}/{projectName}/{hash}/`
- Shows upload progress

#### `microfrontends-import-map`

Updates the import-map.json file in S3 to register your microfrontend.

**Interactive mode:**
```bash
gof-cli microfrontends-import-map
```

**With parameters:**
```bash
gof-cli microfrontends-import-map --hash abc123 --bucket my-bucket --s3Endpoint https://s3.example.com --domainBucket https://assets.gangoffront.com --environment prod --remoteVerify true
```

**Parameters:**
- `hash` - Hash to locate files (required)
- `bucket` - S3 bucket name
- `s3Endpoint` - S3 endpoint URL
- `domainBucket` - Public domain of bucket (default: `https://assets.gangoffront.com`)
- `remoteVerify` - Enable remote file verification (default: `true`)
- `environment` - Environment to update (`dev`, `stg`, or `prod`)

**What it does:**
- Downloads the current import-map.json from S3
- Adds or updates your microfrontend service entry
- Shows a diff of changes before uploading
- Uploads the updated import-map.json back to S3
- Verifies remote file exists (if `remoteVerify` is enabled)

## How It Works

The CLI automatically extracts your project information from `package.json`:

- **Organization name**: Extracted from `@org/package-name` format
- **Project name**: Extracted from `@org/package-name` format

The CLI uses this information to:
1. Determine the correct S3 path structure
2. Generate the correct service URL for import maps
3. Organize files in a consistent structure

## Project Structure

```
cli/
├── bin/
│   └── cli.js              # CLI entry point
├── src/
│   ├── actions/            # Action handlers
│   │   ├── microfrontends-import-map.js
│   │   └── microfrontends-sync.js
│   ├── generators/         # Plop generators
│   │   ├── microfrontends-import-map.js
│   │   └── microfrontends-sync.js
│   ├── utils/              # Utility functions
│   ├── chooseGenerator.js  # Generator selection logic
│   ├── getGenerator.js     # Generator retrieval
│   ├── run.js              # Main run function
│   └── runGenerator.js     # Generator execution
├── plopfile.js             # Plop configuration
└── package.json
```

## Requirements

- Node.js (ES modules support)
- AWS S3 access credentials configured
- A `package.json` file in your project root with a scoped package name (e.g., `@org/package-name`)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
