//user login function
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
  
  // Fetch dogs function

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
  
  // searching, filters, sorting, and pagination.

export async function searchDogs(
    breeds: string[] = [],
    sort: string = "breed:asc",
    cursor?: string,
    size: number = 25
  ): Promise<{ resultIds: string[]; total: number; next?: string; prev?: string }> {
    const apiUrl = import.meta.env.VITE_API_URL || "https://frontend-take-home-service.fetch.com";
    let url = new URL(`${apiUrl}/dogs/search`);
  
    // Append breed filters
    if (breeds.length > 0) {
      breeds.forEach((breed) => url.searchParams.append("breeds", breed));
    }
    url.searchParams.append("sort", sort);
    url.searchParams.append("size", size.toString());
  
    if (cursor) {
      if (cursor.includes("=")) {
        const cursorParams = new URLSearchParams(cursor);
        if (cursorParams.has("from")) {
          url.searchParams.set("from", cursorParams.get("from")!);
        }
      } else {
        url.searchParams.append("from", cursor);
      }
    }
  
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
  
  
  // Fetches detailed dog objects for a given array of dog IDs
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


//generate match function
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
  