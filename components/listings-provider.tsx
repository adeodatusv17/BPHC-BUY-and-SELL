"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "../lib/supabase"
import type { Listing } from "@/types/listing"

interface ListingsContextType {
  listings: Listing[]
  addListing: (listing: Omit<Listing, "id" | "created_at">) => Promise<void>
  deleteListing: (id: string) => Promise<void>
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterCategory: string
  setFilterCategory: (category: string) => void
  sortOption: string
  setSortOption: (option: string) => void
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined)

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortOption, setSortOption] = useState("latest")

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
    if (error) console.error('Error fetching listings:', error)
    else setListings(data || [])
  }

  const addListing = async (listing: Omit<Listing, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from('listings')
      .insert([{ ...listing, created_at: new Date().toISOString() }])
      .select()
    if (error) console.error('Error adding listing:', error)
    else if (data) setListings(prev => [data[0], ...prev])
  }

  const deleteListing = async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
    if (error) console.error('Error deleting listing:', error)
    else setListings(prev => prev.filter(listing => listing.id !== id))
  }

  const filteredAndSortedListings = listings
    .filter((listing) =>
      searchQuery === "" || listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((listing) =>
      filterCategory === "all" || listing.category === filterCategory
    )
    .sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price
      if (sortOption === "price-high") return b.price - a.price
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime() // Latest by default
    })

  return (
    <ListingsContext.Provider value={{
      listings, addListing, deleteListing,
      searchQuery, setSearchQuery,
      filterCategory, setFilterCategory,
      sortOption, setSortOption
    }}>
      {children}
    </ListingsContext.Provider>
  )
}

export const useListings = () => {
  const context = useContext(ListingsContext)
  if (context === undefined) {
    throw new Error("useListings must be used within a ListingsProvider")
  }
  return context
}