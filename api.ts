export const usersAPI = {
  async getUsers() {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      return await response.json()
    } catch (error) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  async getUserById(id: string) {
    try {
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) throw new Error("Failed to fetch user")
      return await response.json()
    } catch (error) {
      console.error("Error fetching user:", error)
      throw error
    }
  },

  async updateUser(id: string, data: any) {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update user")
      return await response.json()
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  },
}
