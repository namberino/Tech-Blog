interface TagListProps {
  tags: string[];
  className?: string;
}

export default function TagList({ tags, className }: TagListProps) {
  if (tags.length === 0) return null;

  const containerClassName = className
    ? `flex flex-wrap gap-2 ${className}`
    : 'flex flex-wrap gap-2';

  return (
    <div className={containerClassName}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full border border-neutral-300/70 bg-neutral-100/70 px-3 py-1 text-[10px] font-mono tracking-widest text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
