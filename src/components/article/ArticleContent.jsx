function buildBlocks(content) {
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (list?.items.length) blocks.push(list);
    list = null;
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.+)/);

    if (bulletMatch || numberedMatch) {
      const type = numberedMatch ? "ol" : "ul";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((numberedMatch || bulletMatch)[1]);
      return;
    }

    flushList();

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
    } else if (line.startsWith("> ")) {
      blocks.push({ type: "quote", text: line.slice(2) });
    } else {
      blocks.push({ type: "p", text: line });
    }
  });

  flushList();
  return blocks;
}

export default function ArticleContent({ content }) {
  if (!content) {
    return (
      <section className="mt-10" aria-label="Article content">
        <p className="text-base leading-8 text-slate-600 dark:text-slate-300">No article content available.</p>
      </section>
    );
  }

  const blocks = buildBlocks(content);

  return (
    <section className="mt-10" aria-label="Article content">
      <div className="article-prose text-slate-700 dark:text-slate-200">
        {blocks.map((block, index) => {
          if (block.type === "h2") {
            return <h2 key={index} className="mb-4 mt-12 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl dark:text-white">{block.text}</h2>;
          }
          if (block.type === "h3") {
            return <h3 key={index} className="mb-3 mt-10 text-xl font-bold text-slate-950 sm:text-2xl dark:text-white">{block.text}</h3>;
          }
          if (block.type === "quote") {
            return <blockquote key={index} className="my-8 border-l-4 border-amber-500 bg-amber-50 px-6 py-5 text-xl font-medium leading-8 text-slate-800 dark:bg-slate-900 dark:text-slate-100">{block.text}</blockquote>;
          }
          if (block.type === "ul" || block.type === "ol") {
            const List = block.type;
            return <List key={index} className={`my-6 space-y-2 pl-6 ${block.type === "ol" ? "list-decimal" : "list-disc"}`}>{block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1">{item}</li>)}</List>;
          }
          return <p key={index} className="mb-6">{block.text}</p>;
        })}
      </div>
    </section>
  );
}
