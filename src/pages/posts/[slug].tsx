import { getAllPosts, getPostBySlug } from '@/lib/markdown'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import Layout from '@/layouts/Layout'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import TableOfContents from '@/components/TableOfContents';
import remarkEmoji from 'remark-emoji'

// Thêm interface cho heading
interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface PostProps {
  post: {
    title: string;
    date: string;
    content: string;
  }
}

export default function Post({ post }: PostProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    const articleContent = document.querySelector('.prose');
    if (articleContent) {
      const headingElements = articleContent.querySelectorAll('h2, h3, h4');
      const items: TocItem[] = Array.from(headingElements).map((heading) => {
        // Tạo id nếu chưa có
        if (!heading.id) {
          heading.id = heading.textContent?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '') || '';
        }
        
        return {
          id: heading.id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName[1]),
        };
      });
      setHeadings(items);
    }
  }, [post.content]);
  // Thêm function xử lý copy
  const copyToClipboard = async (text: string, buttonElement: HTMLButtonElement) => {
    try {
      await navigator.clipboard.writeText(text);
      buttonElement.textContent = 'Copied!';
      setTimeout(() => {
        buttonElement.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      // Thêm class group để control copy button visibility
      pre.classList.add('group', 'relative');
      
      // Xác định ngôn ngữ từ class
      const codeElement = pre.querySelector('code');
      const languageClass = codeElement?.className
        .split(' ')
        .find((className) => className.startsWith('language-'));
      const rawLanguage = languageClass ? languageClass.replace('language-', '') : 'text';
      const normalizedLanguage = rawLanguage.toLowerCase();

      const languageAliases: Record<string, string> = {
        js: 'javascript',
        javascript: 'javascript',
        ts: 'typescript',
        typescript: 'typescript',
        jsx: 'jsx',
        tsx: 'tsx',
        py: 'python',
        python: 'python',
        rb: 'ruby',
        ruby: 'ruby',
        php: 'php',
        go: 'go',
        golang: 'go',
        rs: 'rust',
        rust: 'rust',
        java: 'java',
        kt: 'kotlin',
        kotlin: 'kotlin',
        swift: 'swift',
        c: 'c',
        cpp: 'cpp',
        'c++': 'cpp',
        csharp: 'csharp',
        'c#': 'csharp',
        cs: 'csharp',
        lua: 'lua',
        sh: 'bash',
        bash: 'bash',
        zsh: 'zsh',
        shell: 'bash',
        ps1: 'powershell',
        powershell: 'powershell',
        sql: 'sql',
        mysql: 'mysql',
        postgres: 'postgres',
        yaml: 'yaml',
        yml: 'yaml',
        json: 'json',
        toml: 'toml',
        xml: 'xml',
        html: 'html',
        css: 'css',
        scss: 'scss',
        less: 'less',
        md: 'markdown',
        markdown: 'markdown',
        docker: 'dockerfile',
        dockerfile: 'dockerfile',
        makefile: 'makefile',
        cmake: 'cmake',
        graphql: 'graphql',
        ini: 'ini',
        diff: 'diff',
        text: 'text',
        plaintext: 'text',
      };

      const languageStyles: Record<string, { label: string; color: string }> = {
        javascript: { label: 'JavaScript', color: '#f1e05a' },
        typescript: { label: 'TypeScript', color: '#5c7cfa' },
        jsx: { label: 'JSX', color: '#c7a500' },
        tsx: { label: 'TSX', color: '#4f7db5' },
        python: { label: 'Python', color: '#4b8bbe' },
        ruby: { label: 'Ruby', color: '#b64b3a' },
        php: { label: 'PHP', color: '#6b6fb5' },
        go: { label: 'Go', color: '#00a6c7' },
        rust: { label: 'Rust', color: '#c08a6b' },
        java: { label: 'Java', color: '#b07219' },
        kotlin: { label: 'Kotlin', color: '#8b6bd8' },
        swift: { label: 'Swift', color: '#d36a4a' },
        c: { label: 'C', color: '#9e9e9e' },
        cpp: { label: 'C++', color: '#c06c84' },
        csharp: { label: 'C#', color: '#6a9a4f' },
        lua: { label: 'Lua', color: '#5c70a7' },
        bash: { label: 'Bash', color: '#6f8f4f' },
        zsh: { label: 'Zsh', color: '#7aa35a' },
        powershell: { label: 'PowerShell', color: '#4f7db5' },
        sql: { label: 'SQL', color: '#b08d57' },
        mysql: { label: 'MySQL', color: '#4f7db5' },
        postgres: { label: 'PostgreSQL', color: '#5f7ea6' },
        yaml: { label: 'YAML', color: '#9a5b5b' },
        json: { label: 'JSON', color: '#9b9b9b' },
        toml: { label: 'TOML', color: '#8b6d59' },
        xml: { label: 'XML', color: '#8a8a8a' },
        html: { label: 'HTML', color: '#c16652' },
        css: { label: 'CSS', color: '#6b84c4' },
        scss: { label: 'SCSS', color: '#b05b76' },
        less: { label: 'Less', color: '#6076a6' },
        markdown: { label: 'Markdown', color: '#6175a6' },
        dockerfile: { label: 'Dockerfile', color: '#5b7b93' },
        makefile: { label: 'Makefile', color: '#7b7b7b' },
        cmake: { label: 'CMake', color: '#6b6b6b' },
        graphql: { label: 'GraphQL', color: '#b04d7c' },
        ini: { label: 'INI', color: '#8b8b8b' },
        diff: { label: 'Diff', color: '#6f6f6f' },
      };

      const canonicalLanguage = languageAliases[normalizedLanguage] || normalizedLanguage;
      const languageMeta = languageStyles[canonicalLanguage];
      const shouldShowBadge = rawLanguage && canonicalLanguage !== 'text';

      if (shouldShowBadge && !pre.querySelector('.language-badge')) {
        const languageBadge = document.createElement('span');
        languageBadge.textContent = languageMeta?.label || rawLanguage.toUpperCase();
        languageBadge.className = 'language-badge';
        const badgeColor = languageMeta?.color || '#9a9a9a';
        languageBadge.style.setProperty('--lang-accent', badgeColor);
        pre.appendChild(languageBadge);
      }
  
      // Thêm copy button với style mới
      if (!pre.querySelector('.copy-button')) {
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.className = 'copy-button';
        const code = pre.textContent || '';
        copyButton.addEventListener('click', () => copyToClipboard(code, copyButton));
        pre.appendChild(copyButton);
      }
    });
  
    return () => {
      const copyButtons = document.querySelectorAll('.copy-button');
      const languageBadges = document.querySelectorAll('.language-badge');
      copyButtons.forEach(button => button.remove());
      languageBadges.forEach(badge => badge.remove());
    };
  }, []);

  const content = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(remarkEmoji) 
    .use(rehypeKatex)
    .use(rehypeStringify)
    .processSync(post.content)
    .toString()

    return (
      <Layout title={post.title}>
        <article className="max-w-[1600px] mx-auto px-4 lg:px-8 rise-in" style={{ animationDelay: '60ms' }}>
          <div className="flex flex-col xl:flex-row">
            {/* Main content */}
            <div className="flex-1 max-w-4xl">
              <div className="mb-12">
                <Link href="/" className="text-xs font-mono uppercase tracking-widest text-neutral-600 hover:text-neutral-900 mb-8 inline-block dark:text-neutral-400 dark:hover:text-white">
                  Back to home
                </Link>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-neutral-900 dark:text-white">{post.title}</h1>
                <time className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  {new Date(post.date).toLocaleDateString('en-EN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              <div className="prose prose-lg mx-auto surface-panel rounded-xl p-6 dark:prose-invert text-neutral-900 dark:text-neutral-100">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
  
            {/* Table of Contents */}
            <TableOfContents headings={headings} />
          </div>
        </article>
      </Layout>
    );
  }

export async function getStaticPaths() {
  const posts = getAllPosts()
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug }
    })),
    fallback: false
  }
}

export async function getStaticProps({ 
  params 
}: {
  params: { slug: string }
}) {
  const post = getPostBySlug(params.slug)
  return {
    props: { post }
  }
}
