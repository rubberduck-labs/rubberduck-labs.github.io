import { commands } from '../commands';

interface FileSystemNode {
  type: 'directory' | 'file' | 'executable';
  contents?: string[] | { [key: string]: FileSystemNode };
}

interface FileSystem {
  type: 'directory';
  contents: {
    [key: string]: FileSystemNode;
  };
}

export class FileSystemManager {
  private fileSystem: FileSystem;
  private currentPath: string[] = [];

  constructor(fileSystemData: FileSystem) {
    this.fileSystem = fileSystemData;
  }

  getCurrentPath(): string {
    return '/' + this.currentPath.join('/');
  }

  getPrompt(): string {
    return `rubberduck@dev:${this.getCurrentPath()}$`;
  }

  private traverseToPath(path: string[]): FileSystemNode | null {
    let current: FileSystemNode = this.fileSystem;
    
    for (const segment of path) {
      if (segment === '') continue;
      if (current.type !== 'directory' || !current.contents) return null;
      if (!(segment in current.contents)) return null;
      current = current.contents[segment];
    }
    
    return current;
  }

  listDirectory(path: string = '.'): string[] | null {
    const targetPath = path === '.' ? this.currentPath : this.resolvePath(path);
    const node = this.traverseToPath(targetPath);
    
    if (!node || node.type !== 'directory' || !node.contents) return null;
    
    return Object.entries(node.contents).map(([name, node]) => {
      return node.type === 'directory' ? name + '/' : name;
    });
  }

  resolvePath(path: string): string[] {
    if (path.startsWith('/')) {
      return path.split('/').filter(Boolean);
    }
    
    const resolvedPath = [...this.currentPath];
    const segments = path.split('/').filter(Boolean);
    
    for (const segment of segments) {
      if (segment === '..') {
        resolvedPath.pop();
      } else if (segment !== '.') {
        resolvedPath.push(segment);
      }
    }
    
    return resolvedPath;
  }

  changeDirectory(path: string): boolean {
    const newPath = this.resolvePath(path);
    const node = this.traverseToPath(newPath);
    
    if (!node || node.type !== 'directory') return false;
    
    this.currentPath = newPath;
    return true;
  }

  readFile(path: string): string[] | null {
    const fullPath = this.resolvePath(path);
    const fileName = fullPath[fullPath.length - 1];
    const dirPath = fullPath.slice(0, -1);
    
    const dirNode = this.traverseToPath(dirPath);
    if (!dirNode || dirNode.type !== 'directory' || !dirNode.contents) return null;
    
    const fileNode = dirNode.contents[fileName];
    if (!fileNode || !('contents' in fileNode) || !Array.isArray(fileNode.contents)) return null;
    
    return fileNode.contents;
  }

  isExecutable(path: string): boolean {
    const segments = path.split('/');
    const fileName = segments.pop() || '';
    const dirPath = segments.length ? segments.join('/') : '.';
    
    const targetPath = this.resolvePath(dirPath);
    const dirNode = this.traverseToPath(targetPath);
    
    if (!dirNode || dirNode.type !== 'directory' || !dirNode.contents) return false;
    
    const fileNode = dirNode.contents[fileName];
    return fileNode?.type === 'executable';
  }

  getCommandForExecutable(path: string): string | null {
    const segments = path.split('/');
    const fileName = segments.pop() || '';
    
    // Remove .sh extension if present
    const baseName = fileName.replace(/\.sh$/, '');
    
    // Check if command exists
    return baseName in commands ? baseName : null;
  }

  getCompletions(input: string): string[] {
    // If input is empty, return all possible commands and current directory contents
    if (!input) {
      const builtinCommands = ['cd', 'ls', 'cat', 'clear', 'exit', 'help'];
      const dirContents = this.listDirectory('.') || [];
      return [...builtinCommands, ...dirContents];
    }

    // Split input into command and args
    const parts = input.split(' ');
    const lastPart = parts[parts.length - 1];

    // If we're completing the first word (command)
    if (parts.length === 1) {
      const builtinCommands = ['cd', 'ls', 'cat', 'clear', 'exit', 'help'];
      const dirContents = this.listDirectory('.') || [];
      const allCommands = [...builtinCommands, ...dirContents];
      
      return allCommands.filter(cmd => cmd.startsWith(input));
    }

    // If we're completing a path
    if (parts[0] === 'cd' || parts[0] === 'cat' || parts[0] === 'ls') {
      const pathParts = lastPart.split('/');
      const dirPath = pathParts.slice(0, -1).join('/') || '.';
      const partial = pathParts[pathParts.length - 1];
      
      const dirContents = this.listDirectory(dirPath);
      if (!dirContents) return [];
      
      const matches = dirContents.filter(item => item.startsWith(partial));
      
      // If we're in a subdirectory, prepend the path
      if (pathParts.length > 1) {
        const prefix = pathParts.slice(0, -1).join('/') + '/';
        return matches.map(match => prefix + match);
      }
      
      return matches;
    }

    return [];
  }
}