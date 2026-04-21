export default function ArticleContent({ content }) {
  if (!content) {
    return (
      <section className="mt-10">
        <p className="text-base leading-8 text-slate-600">
          No article content available.
        </p>
      </section>
    );
  }

  const paragraphs = content
    .split("\n")
    .filter((paragraph) => paragraph.trim() !== "");

  return (
    <section className="mt-10">
      <div className="space-y-6 text-base leading-8 text-slate-700">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}