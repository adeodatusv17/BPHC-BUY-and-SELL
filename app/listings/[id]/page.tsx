"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Listing } from "@/types/listing"
import { ArrowLeft, Package, ShoppingCart, Calendar, Phone, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ListingDetail() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [showContact, setShowContact] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      const listingId = params.id as string // Ensure id is a string

      if (listingId) {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .single()

        if (error) {
          console.error("Error fetching listing:", error)
          router.replace("/") 
        } else {
          const listingWithDateObject = {
            ...data,
            created_at: new Date(data.created_at)
          };
          setListing(listingWithDateObject);
        }
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [params.id, router])

  const handleDelete = async () => {
    if (!listing?.id) return

    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing.id)

      if (error) throw error

      setShowDeleteModal(false)
      router.push("/")
    } catch (error) {
      console.error("Error deleting listing:", error)
      alert("Failed to delete listing. Please try again.")
    }
  }

  if (isLoading) return <p>Loading...</p>
  if (!listing) return <p>Listing not found.</p>


  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const ordinal = getOrdinalSuffix(day);
    
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${day}${ordinal} ${month} ${year} at ${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  

  return (
    <>
      <div className="listing-detail">
        <Link href="/" className="inline-flex items-center text-primary-color mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Back to listings
        </Link>

        <div className="listing-header">
          <h1>{listing.title}</h1>
          <div className="listing-meta">
            <span className={`listing-type ${listing.type}`}>
              {listing.type === "sell" ? (
                <>
                  <Package size={16} className="mr-1" /> For Sale
                </>
              ) : (
                <>
                  <ShoppingCart size={16} className="mr-1" /> Wanted
                </>
              )}
            </span>
            <span className="listing-price">₹{listing.price.toFixed(2)}</span>
            <span className="listing-date">
              <Calendar size={16} />
              {formatDate(listing.created_at)}
            </span>
          </div>
        </div>

        <div className="listing-body">
          <div className="listing-description">
            <h2>Description</h2>
            <p>{listing.description}</p>
          </div>

          <div className="listing-contact">
            <h2>Contact Information</h2>
            <p>
              Posted by: <strong>{listing.contact_name}</strong>
            </p>

            {!showContact ? (
              <button onClick={() => setShowContact(true)} className="button button-primary w-full mt-4">
                Show Contact Details
              </button>
            ) : (
              <div className="contact-details">
                <p>
                  <Phone size={18} />
                  {listing.contact_number}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="listing-actions">
          <button onClick={() => router.push("/")} className="button button-outline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Listings
          </button>

          <button onClick={() => setShowDeleteModal(true)} className="button button-danger">
            <Trash2 size={16} className="mr-2" />
            Delete Listing
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Listing</h2>
            </div>
            <div className="modal-body">
              <div className="flex items-center gap-3 mb-4 text-danger-color">
                <AlertTriangle size={24} />
                <p className="text-danger-color font-semibold">This action cannot be undone</p>
              </div>
              <p>Are you sure you want to delete this listing?</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="button button-outline">
                Cancel
              </button>
              <button onClick={handleDelete} className="button button-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

