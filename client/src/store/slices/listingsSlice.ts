import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Listing } from "@/types/listing";
import { axiosInstance } from "@/api/axios";

interface ListingsState {
  items: Listing[];
  selectedListing: Listing | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  items: [],
  selectedListing: null,
  isLoading: false,
  error: null,
};

export const fetchListings = createAsyncThunk("listings/fetchAll", async () => {
  const response = await axiosInstance.get<Listing[]>("/listings");
  return response.data;
});

export const fetchListingById = createAsyncThunk("listings/fetchById", async (id: string) => {
  const response = await axiosInstance.get<Listing>(`/listings/${id}`);
  return response.data;
});

export const createListing = createAsyncThunk("listings/create", async (data: Partial<Listing>) => {
  const response = await axiosInstance.post<Listing>("/listings", data);
  return response.data;
});

export const updateListing = createAsyncThunk(
  "listings/update",
  async ({ id, data }: { id: string; data: Partial<Listing> }) => {
    const response = await axiosInstance.put<Listing>(`/listings/${id}`, data);
    return response.data;
  }
);

export const deleteListing = createAsyncThunk("listings/delete", async (id: string) => {
  await axiosInstance.delete(`/listings/${id}`);
  return id;
});

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedListing: (state) => {
      state.selectedListing = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch listings";
      })
      .addCase(fetchListingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch listing";
      })
      .addCase(createListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create listing";
      })
      .addCase(updateListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedListing?._id === action.payload._id) {
          state.selectedListing = action.payload;
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update listing";
      })
      .addCase(deleteListing.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.selectedListing?._id === action.payload) {
          state.selectedListing = null;
        }
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete listing";
      });
  },
});

export const { clearError, clearSelectedListing } = listingsSlice.actions;
export default listingsSlice.reducer; 