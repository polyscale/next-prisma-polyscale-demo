# Next-Prisma-Polyscale Demo Application

This real-estate application is built with Next.js and uses Prisma for interacting with a Postgres database. Easily plugin your PolyScale cache by updating the DATABASE_URL environment variable.

## Development

1. Run `docker compose up` to start a Postgres development instance.
2. Create a `.env` file and include the `DATABASE_URL` variable.
4. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.

### Using PolyScale during local development

Use [ngrok](https://ngrok.com) to expose your local database server to the internet and enable PolyScale to route traffic to it.