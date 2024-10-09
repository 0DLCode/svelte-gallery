import type { FileInfo } from "$lib/types"
import { writable } from "svelte/store"

export const selectedImage = writable<FileInfo | null>(null)
export const selectedImageIndex = writable<number | null>(null)