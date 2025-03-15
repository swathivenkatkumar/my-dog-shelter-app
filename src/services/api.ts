// src/services/api.ts

/**
 * Sends a login request to the backend with the provided name and email.
 */
export async function loginUser(name: string, email: string): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL || "https://frontend-take-home-service.fetch.com";
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials and try again.");
    }
  }
  
  /**
   * Fetches the list of available dog breeds from the backend.
   */
  export async function fetchBreeds(): Promise<string[]> {
    const apiUrl = import.meta.env.VITE_API_URL || "https://frontend-take-home-service.fetch.com";
    const response = await fetch(`${apiUrl}/dogs/breeds`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch breeds.");
    }
    const data: string[] = await response.json();
    return data;
  }
  
  /**
   * Searches for dogs based on filters, sorting, and pagination.
   * The backend returns a list of dog IDs along with pagination cursors.
   *
   * @param {string[]} breeds - Array of breeds to filter on.
   * @param {string} sort - Sort query in the format "breed:asc" or "breed:desc".
   * @param {string} from - Optional pagination cursor.
   * @param {number} size - Number of results per page.
   */
//   export async function searchDogs(
//     breeds: string[] = [],
//     sort: string = "breed:asc",
//     from?: string,
//     size: number = 24
//   ): Promise<{ resultIds: string[]; total: number; next?: string; prev?: string }> {
//     const apiUrl = import.meta.env.VITE_API_URL || "https://frontend-take-home-service.fetch.com";
//     let url = new URL(`${apiUrl}/dogs/search`);
    
//     // Append breed filters, sort, pagination, and size as query parameters.
//     if (breeds.length > 0) {
//       breeds.forEach((breed) => url.searchParams.append("breeds", breed));
//     }
//     url.searchParams.append("sort", sort);
//     if (from) url.searchParams.append("from", from);
//     url.searchParams.append("size", size.toString());
    
//     const response = await fetch(url.toString(), {
//       method: "GET",
//       credentials: "include",
//     });
//     if (!response.ok) {
//       throw new Error("Failed to search dogs.");
//     }
//     const data = await response.json();
//     return data;
//   }


export async function searchDogs(
    breeds: string[] = [],
    sort: string = "breed:asc",
    cursor?: string,
    size: number = 25
  ): Promise<{ resultIds: string[]; total: number; next?: string; prev?: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || "https://frontend-take-home-service.fetch.com";
    let url = new URL(`${apiUrl}/dogs/search`);
  
    // Append breed filters if any.
    if (breeds.length > 0) {
      breeds.forEach((breed) => url.searchParams.append("breeds", breed));
    }
    url.searchParams.append("sort", sort);
    url.searchParams.append("size", size.toString());
  
    // Handle pagination: if a cursor is provided, it might be a full query string (e.g., "from=XYZ").
    if (cursor) {
      if (cursor.includes("=")) {
        // If the cursor looks like a query string, extract the "from" value.
        const cursorParams = new URLSearchParams(cursor);
        if (cursorParams.has("from")) {
          url.searchParams.set("from", cursorParams.get("from")!);
        }
      } else {
        // Otherwise, simply append it as the "from" parameter.
        url.searchParams.append("from", cursor);
      }
    }
  
    console.log("Searching dogs with URL:", url.toString()); // Helpful log to debug pagination
  
    const response = await fetch(url.toString(), {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to search dogs.");
    }
    const data = await response.json();
    return data;
  }
  
  
  /**
   * Fetches detailed dog objects for a given array of dog IDs.
   *
   * @param {string[]} dogIds - Array of dog IDs to retrieve.
   */
  export async function fetchDogs(dogIds: string[]): Promise<Dog[]> {
    const apiUrl = import.meta.env.VITE_API_URL || "https://frontend-take-home-service.fetch.com";
    const response = await fetch(`${apiUrl}/dogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dogIds),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch dog details.");
    }
    const data: Dog[] = await response.json();
    return data;
  }


/**
 * Generates a match from the provided favorite dog IDs.
 *
 * @param {string[]} dogIds - Array of favorite dog IDs.
 * @returns {Promise<{ match: string }>} - An object with a match property containing the matched dog's ID.
 */
export async function generateMatch(dogIds: string[]): Promise<{ match: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || "https://frontend-take-home-service.fetch.com";
    const response = await fetch(`${apiUrl}/dogs/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dogIds),
    });
    if (!response.ok) {
      throw new Error("Failed to generate match.");
    }
    return response.json();
  }
  
  
  // Dog interface
  export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
  }
  