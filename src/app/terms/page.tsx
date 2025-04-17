// app/terms/page.tsx (or pages/terms.tsx if using pages dir)

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import MarkdownRenderer from '@/components/markdown-renderer'

export default async function TermsPage() {
  const filePath = path.join(process.cwd(), 'markdown', 'terms.md')
  const fileContent = fs?.readFileSync(filePath, 'utf8')

  const { content } = matter(fileContent)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <MarkdownRenderer html={contentHtml} />
    </div>
  )
}