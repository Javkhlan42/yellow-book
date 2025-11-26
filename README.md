# Yellow Book Web Application# YellowBook



A modern Yellow Pages-style directory web application built with Nx monorepo, featuring a Next.js frontend and Express.js backend with Prisma ORM.<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>



## 📁 Project Structure✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.



```[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

yellow-book/

├── apps/## Generate a library

│   ├── web/          # Next.js frontend application

│   ├── api/          # Express.js backend API```sh

│   ├── web-e2e/      # E2E tests for webnpx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1

│   └── api-e2e/      # E2E tests for API```

├── libs/

│   ├── contract/     # Shared Zod schemas and types## Run tasks

│   └── config/       # Shared configuration

├── prisma/To build the library use:

│   ├── schema.prisma # Database schema

│   ├── migrations/   # Database migrations```sh

│   └── seed.ts       # Database seed scriptnpx nx build pkg1

└── .github/```

    └── workflows/

        └── ci.yml    # GitHub Actions CI pipelineTo run any task with Nx use:

```

```sh

## 🚀 Featuresnpx nx <target> <project-name>

```

- **Nx Monorepo**: Modern build system with affected commands

- **Type-Safe Contracts**: Shared Zod schemas between frontend and backendThese targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

- **Prisma ORM**: Type-safe database access with migrations

- **Next.js Frontend**: React-based UI with App Router[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

- **Express.js API**: RESTful API with validation

- **CI/CD Ready**: GitHub Actions workflow with Nx affected runs## Versioning and releasing

- **Code Quality**: ESLint, Prettier, and TypeScript configured

To version and release the library use

## 🛠️ Tech Stack

```

- **Monorepo**: Nxnpx nx release

- **Frontend**: Next.js 15, React 19, TypeScript```

- **Backend**: Express.js, Node.js, TypeScript

- **Database**: SQLite (Prisma ORM)Pass `--dry-run` to see what would happen without actually releasing the library.

- **Validation**: Zod

- **Testing**: Jest, Playwright[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

- **CI/CD**: GitHub Actions

## Keep TypeScript project references up to date

## 📦 Getting Started

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

### Prerequisites

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

- Node.js 20.x or higher

- npm```sh

npx nx sync

### Installation```



1. Navigate to the yellow-book directoryYou can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

2. Install dependencies:

```bash```sh

npm installnpx nx sync:check

``````



3. Set up the database:[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

```bash

npm run db:migrate## Set up CI!

npm run db:seed

```### Step 1



### Running the ApplicationTo connect to Nx Cloud, run the following command:



Start the API server:```sh

```bashnpx nx connect

npm run start:api```

```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

In a separate terminal, start the web application:

```bash- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

npm run start:web- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

```- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

- API: http://localhost:3333

- Web: http://localhost:4200### Step 2



## 📝 Available ScriptsUse the following command to configure a CI workflow for your workspace:



- `npm run start:api` - Start the API server in development mode```sh

- `npm run start:web` - Start the web app in development modenpx nx g ci-workflow

- `npm run build` - Build all projects```

- `npm run test` - Run all tests

- `npm run lint` - Lint all projects[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

- `npm run format` - Format all code with Prettier

- `npm run format:check` - Check code formatting## Install Nx Console

- `npm run typecheck` - Run TypeScript type checking

- `npm run db:migrate` - Run database migrationsNx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

- `npm run db:seed` - Seed the database

- `npm run db:studio` - Open Prisma Studio[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)



## 🏗️ Development## Useful links



### Running Affected CommandsLearn more:



Nx can run commands only for affected projects:- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)

- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

```bash- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

# Test only affected projects- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

npx nx affected -t test

And join the Nx community:

# Build only affected projects- [Discord](https://go.nx.dev/community)

npx nx affected -t build- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)

- [Our Youtube channel](https://www.youtube.com/@nxdevtools)

# Lint only affected projects- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

npx nx affected -t lint
```

## 📚 API Endpoints

### GET /api/yellow-books

Returns a list of all business listings.

**Response:**
```json
[
  {
    "id": "uuid",
    "businessName": "Joe's Pizza Palace",
    "category": "Restaurant",
    "phoneNumber": "+1 (555) 123-4567",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "description": "Authentic New York style pizza since 1985",
    "website": "https://joespizza.example.com",
    "email": "info@joespizza.example.com"
  }
]
```

## 🚀 CI/CD

The project includes a GitHub Actions workflow that:

1. Determines affected projects using `nx affected`
2. Runs format checking, linting, and type checking
3. Tests and builds affected projects
4. Runs database migrations
5. Uploads coverage reports

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting: `npm run test && npm run lint`
4. Format code: `npm run format`
5. Submit a pull request

## 📄 License

MIT
