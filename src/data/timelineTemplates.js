const timelineTemplates = [
  {
    id: "election-crisis",
    name: "Election / Political Timeline",
    slug: "election-political-timeline",
    category: "Politics",
    description:
      "A structured timeline template for elections, leadership changes, protests, policy decisions, and constitutional developments.",
    coverImage: "/images/default-og.jpg",
    status: "active",
    fields: {
      title: "Election Timeline 2026",
      summary:
        "Track the most important political developments, campaign events, results, and public reactions in chronological order.",
      category: "Politics",
      tags: ["election", "politics", "government"],
    },
    events: [
      {
        id: "evt-1",
        date: "2026-01-05",
        title: "Election officially announced",
        description:
          "Authorities confirm the official election schedule and nomination period.",
        type: "announcement",
      },
      {
        id: "evt-2",
        date: "2026-01-18",
        title: "Candidates submit nominations",
        description:
          "Major parties and independent candidates submit nomination papers.",
        type: "milestone",
      },
      {
        id: "evt-3",
        date: "2026-02-10",
        title: "Nationwide debates begin",
        description:
          "Candidates participate in televised debates and policy discussions.",
        type: "debate",
      },
      {
        id: "evt-4",
        date: "2026-03-01",
        title: "Voting day",
        description:
          "Citizens vote across the country while observers monitor polling stations.",
        type: "event",
      },
      {
        id: "evt-5",
        date: "2026-03-02",
        title: "Final results declared",
        description:
          "Election commission confirms final results and announces the winner.",
        type: "result",
      },
    ],
  },
  {
    id: "corporate-story",
    name: "Corporate / Business Timeline",
    slug: "corporate-business-timeline",
    category: "Business",
    description:
      "A clean timeline for company launches, mergers, earnings announcements, restructures, and major strategy shifts.",
    coverImage: "/images/default-og.jpg",
    status: "active",
    fields: {
      title: "Company Growth Timeline",
      summary:
        "Follow key business milestones, product launches, funding rounds, and leadership decisions over time.",
      category: "Business",
      tags: ["business", "company", "finance"],
    },
    events: [
      {
        id: "evt-1",
        date: "2025-01-10",
        title: "Company founded",
        description:
          "The company launches with an initial vision, founding team, and early market focus.",
        type: "launch",
      },
      {
        id: "evt-2",
        date: "2025-04-15",
        title: "Seed funding secured",
        description:
          "The startup raises its first institutional funding round to accelerate growth.",
        type: "funding",
      },
      {
        id: "evt-3",
        date: "2025-08-22",
        title: "First product launched",
        description:
          "The company releases its first major product to the public market.",
        type: "product",
      },
      {
        id: "evt-4",
        date: "2026-01-12",
        title: "Regional expansion announced",
        description:
          "Leadership announces expansion into new markets and strategic hiring plans.",
        type: "expansion",
      },
      {
        id: "evt-5",
        date: "2026-03-30",
        title: "Quarterly earnings released",
        description:
          "The company reports strong growth and outlines the next phase of execution.",
        type: "earnings",
      },
    ],
  },
  {
    id: "tech-product",
    name: "Technology / Product Timeline",
    slug: "technology-product-timeline",
    category: "Technology",
    description:
      "Useful for product rollouts, software releases, AI model launches, hardware announcements, and major upgrades.",
    coverImage: "/images/default-og.jpg",
    status: "active",
    fields: {
      title: "Product Launch Timeline",
      summary:
        "Track every stage of a product journey from announcement to release, adoption, and updates.",
      category: "Technology",
      tags: ["technology", "product", "launch"],
    },
    events: [
      {
        id: "evt-1",
        date: "2025-09-01",
        title: "Prototype revealed",
        description:
          "The first preview showcases the product concept and early technical capabilities.",
        type: "preview",
      },
      {
        id: "evt-2",
        date: "2025-10-10",
        title: "Beta testing opens",
        description:
          "Selected users gain early access and begin testing core features.",
        type: "beta",
      },
      {
        id: "evt-3",
        date: "2025-11-20",
        title: "Official launch event",
        description:
          "The company unveils the product publicly with pricing and rollout details.",
        type: "launch",
      },
      {
        id: "evt-4",
        date: "2026-01-08",
        title: "First major update released",
        description:
          "New features, bug fixes, and performance improvements are introduced.",
        type: "update",
      },
      {
        id: "evt-5",
        date: "2026-02-14",
        title: "Global rollout completed",
        description:
          "The product becomes available across all planned markets and platforms.",
        type: "release",
      },
    ],
  },
  {
    id: "conflict-investigation",
    name: "Conflict / Investigation Timeline",
    slug: "conflict-investigation-timeline",
    category: "World",
    description:
      "Designed for investigations, conflicts, legal cases, and crisis reporting where chronology is central to understanding events.",
    coverImage: "/images/default-og.jpg",
    status: "active",
    fields: {
      title: "Investigation Timeline",
      summary:
        "A chronological breakdown of key developments, statements, evidence, and official responses in a major case.",
      category: "World",
      tags: ["investigation", "conflict", "world"],
    },
    events: [
      {
        id: "evt-1",
        date: "2025-06-02",
        title: "Initial incident reported",
        description:
          "The first reports emerge, drawing public attention and media coverage.",
        type: "incident",
      },
      {
        id: "evt-2",
        date: "2025-06-05",
        title: "Authorities open inquiry",
        description:
          "Officials confirm an investigation and begin collecting statements and evidence.",
        type: "investigation",
      },
      {
        id: "evt-3",
        date: "2025-06-20",
        title: "New evidence published",
        description:
          "Documents, footage, or testimony reveal additional context around the case.",
        type: "evidence",
      },
      {
        id: "evt-4",
        date: "2025-07-03",
        title: "Public response intensifies",
        description:
          "Public pressure, protests, or international reactions grow following new disclosures.",
        type: "reaction",
      },
      {
        id: "evt-5",
        date: "2025-07-19",
        title: "Official findings released",
        description:
          "Authorities issue findings, conclusions, or recommendations based on the inquiry.",
        type: "report",
      },
    ],
  },
];

export default timelineTemplates;