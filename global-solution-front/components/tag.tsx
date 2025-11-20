interface TagProps {
  name: string
  href?: string
}

export function Tag({ name, href }: TagProps) {
  const content = (
    <span className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium hover:bg-primary/10 transition-colors">
      #{name}
    </span>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}
