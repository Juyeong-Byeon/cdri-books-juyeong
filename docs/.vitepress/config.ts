import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';
import tailwindConfig from '../../tailwind.config';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const docsRoot = join(projectRoot, 'docs');
const repository = 'https://github.com/Juyeong-Byeon/cdri-books-juyeong';
const brandColor = tailwindConfig.theme.extend.colors.palette.primary;
const adrFiles = readdirSync(join(docsRoot, 'adr'))
  .filter((file) => /^\d{4}-.+\.md$/.test(file))
  .sort();

const adrSidebar = adrFiles.map((file) => {
  const heading = readFileSync(join(docsRoot, 'adr', file), 'utf8').match(/^#\s+(.+)$/m)?.[1];
  return {
    text: heading?.replace(/^ADR-(\d+):\s*/, '$1 · ') ?? file,
    link: `/adr/${file.replace(/\.md$/, '')}`,
  };
});

// GitHub 원본의 상대 링크를 문서 경로 또는 코드 원문 링크로 변환한다.
// README와 ADR 본문은 저장소에서 읽으며 배포용 사본을 작성하지 않는다.
function resolveRepositoryLink(href: string, sourcePath: string) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(href)) return href;

  const suffixIndex = href.search(/[?#]/);
  const pathname = suffixIndex < 0 ? href : href.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? '' : href.slice(suffixIndex);
  const target = join(dirname(sourcePath), decodeURIComponent(pathname));
  const repositoryPath = relative(projectRoot, target).split(sep).join('/');

  if (repositoryPath === 'README.md') return `/index.md${suffix}`;
  if (repositoryPath.startsWith('docs/') && repositoryPath.endsWith('.md')) {
    return `/${repositoryPath.slice('docs/'.length).replace(/(^|\/)README\.md$/, '$1index.md')}${suffix}`;
  }

  return `${repository}/blob/main/${repositoryPath}${suffix}`;
}

// GitHub 원본의 한글 앵커와 같은 문자 조합을 유지한다.
function slugifyHeading(title: string) {
  return title
    .normalize('NFC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}_ -]/gu, '')
    .replace(/ /g, '-');
}

export default defineConfig({
  lang: 'ko-KR',
  title: 'CERTICOS BOOKS · 설계 문서',
  description: '프로젝트 구조와 아키텍처 결정 기록',
  base: '/docs/',
  outDir: '../dist/docs',
  cleanUrls: true,
  rewrites: { 'adr/README.md': 'adr/index.md' },
  head: [
    [
      'style',
      {},
      `:root { --vp-c-brand-1: ${brandColor}; --vp-c-brand-2: ${brandColor}; --vp-c-brand-3: ${brandColor}; --vp-c-brand-soft: color-mix(in srgb, ${brandColor} 14%, transparent); }`,
    ],
  ],
  themeConfig: {
    nav: [
      { text: '프로젝트', link: '/' },
      { text: 'ADR', link: '/adr/' },
      { text: '성능 측정', link: '/performance/' },
      { text: '앱 열기', link: 'https://cdri.y-one.org' },
    ],
    sidebar: [
      {
        text: '안내',
        items: [
          { text: '프로젝트 개요', link: '/' },
          { text: '설계 결정 목록', link: '/adr/' },
          { text: '성능 측정 기록', link: '/performance/' },
        ],
      },
      { text: '아키텍처 결정 기록', items: adrSidebar },
    ],
    outline: { label: '이 문서에서', level: [2, 3] },
    docFooter: { prev: '이전 문서', next: '다음 문서' },
    sidebarMenuLabel: '문서 목록',
    returnToTopLabel: '맨 위로',
    darkModeSwitchLabel: '화면 모드',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '문서 검색', buttonAriaLabel: '문서 검색' },
          modal: { noResultsText: '검색 결과가 없습니다.' },
        },
      },
    },
    socialLinks: [{ icon: 'github', link: repository }],
  },
  markdown: {
    anchor: { slugify: slugifyHeading },
    headers: { slugify: slugifyHeading },
    toc: { slugify: slugifyHeading },
    config(md) {
      const renderLink = md.renderer.rules.link_open;
      md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
        const token = tokens[index];
        const href = token.attrGet('href');
        const source = env as { relativePath?: string; realPath?: string; path?: string };
        const sourcePath =
          source.relativePath === 'index.md'
            ? join(projectRoot, 'README.md')
            : (source.realPath ?? source.path);
        if (href && sourcePath) token.attrSet('href', resolveRepositoryLink(href, sourcePath));
        return (
          renderLink?.(tokens, index, options, env, renderer) ??
          renderer.renderToken(tokens, index, options)
        );
      };
    },
  },
});
