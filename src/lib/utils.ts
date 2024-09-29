import type { FileInfo } from './types';

export function sortFiles(files: FileInfo[], sortOption: string): FileInfo[] {
  return [...files].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOption === "type") {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });
}
