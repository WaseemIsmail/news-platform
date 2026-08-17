This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Search discovery after publishing

Published articles are automatically included in:

- `/latest`
- `/sitemap.xml`
- `/news-sitemap.xml` for the first 48 hours
- `/feed.xml`
- article, category, and tag pages submitted through IndexNow when configured

To enable IndexNow on Netlify, add an environment variable named `INDEXNOW_KEY` with a random 8–128 character value containing only letters, numbers, and hyphens, then redeploy. The application exposes that value at `/indexnow-key.txt` as required by the protocol and submits changed article/listing URLs after a successful publication.

`INDEXNOW_KEY` must be separate from `NEWS_AUTOMATION_API_KEY`. The automation API key is private; the IndexNow verification key is intentionally public through the verification route.
