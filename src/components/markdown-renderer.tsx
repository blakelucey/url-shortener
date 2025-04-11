// components/MarkdownRenderer.tsx
import { FC } from 'react'

interface MarkdownRendererProps {
  html: string
}

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ html }) => {
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default MarkdownRenderer