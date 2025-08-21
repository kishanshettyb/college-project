export type Users = {
  documentId: string
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  role: {
    documentId: string
    name: string
    description: string
    type: string
  }
}
