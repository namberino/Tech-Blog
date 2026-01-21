const siteName = "sondt's Blog"

export const siteConfig = {
  name: siteName,
  metaDescription: 'A professional blog about software development and technology',
  nav: {
    repoLabel: 'Github',
    repoUrl: 'https://github.com/sondt1337/Tech-Blog'
  },
  home: {
    badgeText: 'Security | Systems | Research',
    title: `Welcome to ${siteName}`,
    subtitle: 'Something about infosec!...'
  },
  footer: {
    aboutTitle: `About ${siteName}`,
    aboutText: 'Sharing In-Depth Insights About Security, CTF Challenges, and Tech Architecture.',
    social: {
      githubUrl: 'https://github.com/sondt1337',
      xUrl: 'https://x.com/krixov'
    }
  },
  api: {
    helloName: 'sondt hehe'
  }
} as const
