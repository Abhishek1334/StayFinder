import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Listing } from "@/types";

interface ListingState {
  listings: Listing[];
  selectedListing: Listing | null;
  filters: {
    location: string;
    minPrice: number;
    maxPrice: number;
    guests: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    amenities: string[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  isLoading: boolean;
  error: string | null;
}

// Load initial state from localStorage
const loadState = (): ListingState => {
  try {
    const serializedState = localStorage.getItem("listingState");
    if (serializedState === null) {
      return {
        listings: [],
        selectedListing: null,
        filters: {
          location: "",
          minPrice: 0,
          maxPrice: 10000,
          guests: 1,
          bedrooms: 1,
          bathrooms: 1,
          propertyType: "all",
          amenities: [],
        },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
        isLoading: false,
        error: null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      listings: [],
      selectedListing: null,
      filters: {
        location: "",
        minPrice: 0,
        maxPrice: 10000,
        guests: 1,
        bedrooms: 1,
        bathrooms: 1,
        propertyType: "all",
        amenities: [],
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },
      isLoading: false,
      error: null,
    };
  }
};

// Save state to localStorage
const saveState = (state: ListingState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("listingState", serializedState);
  } catch (err) {
    // Handle errors silently
  }
};

const initialState: ListingState = loadState();

export const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setListings: (state, action: PayloadAction<Listing[]>) => {
      state.listings = action.payload;
      saveState(state);
    },
    setSelectedListing: (state, action: PayloadAction<Listing | null>) => {
      state.selectedListing = action.payload;
      saveState(state);
    },
    setFilters: (state, action: PayloadAction<Partial<ListingState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
      saveState(state);
    },
    setPagination: (state, action: PayloadAction<Partial<ListingState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
      saveState(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      saveState(state);
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      saveState(state);
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      saveState(state);
    },
    clearListings: (state) => {
      state.listings = [];
      state.selectedListing = null;
      saveState(state);
    },
  },
});

export const {
  setListings,
  setSelectedListing,
  setFilters,
  setPagination,
  setLoading,
  setError,
  resetFilters,
  clearListings,
} = listingSlice.actions;

export default listingSlice.reducer; 