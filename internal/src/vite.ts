import path from "node:path"
import { LibraryOptions } from "vite"

export const createLibraryOptions = (
  buildLibEntry: string[], 
  options: Partial<LibraryOptions> = {}
) => {
  return {
    entry: buildLibEntry.reduce((entryObj, entry) => {
      // For root index.ts, use the parent directory name as entryName
      // For subdir/index.ts, use subdir as entryName
      const parts = entry.split(path.sep)
      const entryName = parts.length === 1 
        ? path.parse(entry).name 
        : parts[0]
      entryObj[entryName] = entry
      console.log(`Added entry: ${entryName} -> ${entry}`)
      return entryObj
    }, {} as Record<string, string>),
  
    formats: ['es'],

    fileName(format, entryName) {
      if (entryName === 'index') {
        return `index.${format}.js`
      }
      return `${entryName}/index.${format}.js`
    },

    ...options,
  } as LibraryOptions
}