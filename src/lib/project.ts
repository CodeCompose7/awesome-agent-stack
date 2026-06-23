import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export interface ProjectFile {
  path: string; // path relative to the project folder, e.g. "app.py"
  content: string;
  lang: string; // language id for syntax highlighting
}

const SAMPLES_DIR = 'samples';

function langFor(name: string): string {
  if (name === 'Dockerfile' || name.endsWith('.dockerfile')) return 'docker';
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    py: 'python',
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    md: 'markdown',
    toml: 'toml',
    yml: 'yaml',
    yaml: 'yaml',
    json: 'json',
    sh: 'bash',
    bash: 'bash',
    env: 'bash',
    sql: 'sql',
    go: 'go',
    rs: 'rust',
  };
  return map[ext] ?? 'text';
}

// Show order: README first, Dockerfile next, source files, then the rest.
function priority(name: string): number {
  if (/^readme/i.test(name)) return 0;
  if (name === 'Dockerfile' || name.endsWith('.dockerfile')) return 1;
  if (/^requirements|^package\.json$|^pyproject/i.test(name)) return 3;
  return 2;
}

function walk(dir: string, base: string, out: ProjectFile[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push({ path: relative(base, full), content: readFileSync(full, 'utf8'), lang: langFor(name) });
  }
}

/** Read the sample project at `samples/<slug>/`, ordered for display. */
export function getProject(slug: string): ProjectFile[] | null {
  const dir = join(SAMPLES_DIR, slug);
  if (!existsSync(dir)) return null;
  const files: ProjectFile[] = [];
  walk(dir, dir, files);
  if (!files.length) return null;
  return files.sort(
    (a, b) => priority(a.path) - priority(b.path) || a.path.localeCompare(b.path),
  );
}
