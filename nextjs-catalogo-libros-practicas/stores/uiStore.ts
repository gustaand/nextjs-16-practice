import { create } from "zustand"

type Filter = "all" | "read" | "unread"

type UiState = {
  query: string
  filter: Filter
  selectedBookId: string | null
  isDetailsOpen: boolean
  theme: "light" | "dark"

  setQuery: (value: string) => void
  setFilter: (value: Filter) => void
  openDetails: (id: string) => void
  closeDetails: () => void
  toggleTheme: () => void
}

export const useUiStore = create<UiState>((set) => ({
  query: "",
  filter: "all",
  selectedBookId: null,
  isDetailsOpen: false,
  theme: "light",

  setQuery: (query) => set({ query }),
  setFilter: (filter) => set({ filter }),
  openDetails: (id) => set({ selectedBookId: id, isDetailsOpen: true }),
  closeDetails: () => set({ isDetailsOpen: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}))