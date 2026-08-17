import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Search | Contextra",
  description: "Search published Contextra reporting by headline, topic, category, author, or tag.",
  url: "/search",
  noIndex: true,
});

export default function SearchLayout({ children }) {
  return children;
}
