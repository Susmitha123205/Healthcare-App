import jwt from "jsonwebtoken"

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any
  } catch (error) {
    return null
  }
}
