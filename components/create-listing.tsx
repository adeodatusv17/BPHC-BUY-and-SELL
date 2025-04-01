"use client"

import { useState } from "react"
import { useListings } from "./listings-provider"
import { ShoppingBag, Search, Upload } from "lucide-react"

export default function CreateListing() {
  const { addListing } = useListings()
  const [listingType, setListingType] = useState<"sell" | "buy">("sell")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Electronics")
  const [price, setPrice] = useState("")
  const [budget, setBudget] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [contactName, setContactName] = useState("")
  const [contactNumber, setContactNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newListing = {
      id: Date.now().toString(),
      type: listingType,
      title,
      description,
      category,
      price: listingType === "sell" ? parseFloat(price) : 0,
      budget: listingType === "buy" ? parseFloat(budget) : 0,
      images,
      created_at: new Date().toISOString(),
      contact_name: contactName.toString(),
      contact_number: contactNumber.toString()
    }
    addListing(newListing)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageUrls = files.map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...imageUrls].slice(0, 5))
  }

 
// Update the event handler type definitions
const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contactName') setContactName(value);
  }
  
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    
    if (name === 'price') setPrice(numericValue);
    if (name === 'budget') setBudget(numericValue);
    if (name === 'contactNumber') setContactNumber(numericValue);
  }
  

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* ... (keep all other elements the same until contact fields) ... */}

      {/* Price Input */}
      {listingType === "sell" && (
        <div className="mb-4">
          <label className="block mb-2">Price</label>
          <input
            type="text"
            name="price"
            inputMode="numeric"
            value={price}
            onChange={handleNumberInput}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}

      {/* Budget Input */}
      {listingType === "buy" && (
        <div className="mb-4">
          <label className="block mb-2">Budget</label>
          <input
            type="text"
            name="budget"
            inputMode="numeric"
            value={budget}
            onChange={handleNumberInput}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      )}

      {/* Contact Name */}
      <div>
  <label>Contact Name</label>
  <input 
    type="text" 
    name="contactName"
    value={contactName}
    onChange={handleTextInput}
    required
  />
</div>

      {/* Contact Number */}
      <div>
  <label>Contact Number</label>
  <input 
    type="text" 
    name="contactNumber"
    value={contactNumber}
    onChange={handleNumberInput}
    required
  />
</div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Create Listing
      </button>
    </form>
  )
}