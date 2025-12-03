const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3020/api"

interface FetchOptions extends RequestInit {
  token?: string | null
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API không khả dụng")
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Đã xảy ra lỗi" }))
      throw new Error(error.message)
    }

    return res.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Không thể kết nối đến server")
    }
    throw error
  }
}

// Chat API
export const chatApi = {
  getMessages: () => fetchApi<{ messages: Message[] }>("/chat/messages"),
  sendMessage: (content: string, token: string) =>
    fetchApi<{ message: Message }>("/chat/messages", {
      method: "POST",
      body: JSON.stringify({ content }),
      token,
    }),
  getOnlineCount: () => fetchApi<{ count: number }>("/chat/online"),
}

// Forum API
export const forumApi = {
  getPosts: (params?: { category?: string; search?: string; page?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)
    if (params?.page) searchParams.set("page", params.page.toString())
    return fetchApi<{ posts: ForumPost[]; total: number }>(`/forum/posts?${searchParams}`)
  },
  getPost: (id: string) => fetchApi<{ post: ForumPost }>(`/forum/posts/${id}`),
  createPost: (data: CreatePostData, token: string) =>
    fetchApi<{ post: ForumPost }>("/forum/posts", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  likePost: (id: string, token: string) =>
    fetchApi<{ liked: boolean }>(`/forum/posts/${id}/like`, {
      method: "POST",
      token,
    }),
  getComments: (postId: string) => fetchApi<{ comments: Comment[] }>(`/forum/posts/${postId}/comments`),
  addComment: (postId: string, content: string, token: string) =>
    fetchApi<{ comment: Comment }>(`/forum/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
      token,
    }),
  deleteComment: (commentId: string, token: string) =>
    fetchApi(`/forum/comments/${commentId}`, {
      method: "DELETE",
      token,
    }),
}

// Wiki API
export const wikiApi = {
  getArticles: (category?: string) => {
    const params = category ? `?category=${category}` : ""
    return fetchApi<{ articles: WikiArticle[] }>(`/wiki/articles${params}`)
  },
  getArticle: (slug: string) => fetchApi<{ article: WikiArticle }>(`/wiki/articles/${slug}`),
  createArticle: (data: CreateArticleData, token: string) =>
    fetchApi<{ article: WikiArticle }>("/wiki/articles", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  updateArticle: (slug: string, data: Partial<CreateArticleData>, token: string) =>
    fetchApi<{ article: WikiArticle }>(`/wiki/articles/${slug}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),
  getHistory: (slug: string) => fetchApi<{ history: ArticleVersion[] }>(`/wiki/articles/${slug}/history`),
}

// GitHub API
export const githubApi = {
  getReleases: () => fetchApi<{ releases: Release[] }>("/github/releases"),
}

// Donation API
export const donationApi = {
  getActive: () => fetchApi<{ donation: Donation | null }>("/donation/active"),
  getRecentDonors: () => fetchApi<{ donors: Donor[] }>("/donation/recent-donors"),
  createPayment: (data: CreatePaymentData) =>
    fetchApi<{ checkoutUrl: string; orderCode: string }>("/donation/create-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  checkPayment: (orderCode: string) =>
    fetchApi<{ status: string; amount: number }>(`/donation/check-payment/${orderCode}`),
  // Admin
  adminList: (token: string) => fetchApi<{ donations: Donation[] }>("/donation/admin/list", { token }),
  adminCreate: (data: CreateDonationData, token: string) =>
    fetchApi<{ donation: Donation }>("/donation/admin/create", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
  adminUpdate: (id: string, data: Partial<CreateDonationData>, token: string) =>
    fetchApi<{ donation: Donation }>(`/donation/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),
  adminDelete: (id: string, token: string) =>
    fetchApi(`/donation/admin/${id}`, {
      method: "DELETE",
      token,
    }),
  adminTransactions: (id: string, token: string) =>
    fetchApi<{ transactions: Transaction[] }>(`/donation/admin/${id}/transactions`, { token }),
  adminAddManual: (id: string, data: ManualDonationData, token: string) =>
    fetchApi<{ transaction: Transaction }>(`/donation/admin/${id}/add-manual`, {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
}

// Types
export interface Message {
  id: string
  userId: string
  username: string
  displayName: string
  content: string
  createdAt: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  authorId: string
  authorName: string
  authorDisplayName: string
  likes: number
  commentsCount: number
  createdAt: string
  hasLiked?: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  displayName: string
  content: string
  createdAt: string
}

export interface WikiArticle {
  id: string
  title: string
  slug: string
  content: string
  category: string
  excerpt: string
  authorId: string
  authorName: string
  updatedAt: string
}

export interface ArticleVersion {
  id: string
  content: string
  authorName: string
  createdAt: string
}

export interface Release {
  id: string
  tagName: string
  name: string
  body: string
  publishedAt: string
  htmlUrl: string
  type: "major" | "minor" | "patch" | "hotfix"
}

export interface Donation {
  id: string
  title: string
  description: string
  goalAmount: number
  currentAmount: number
  isActive: boolean
  endDate?: string
  donorsCount: number
  createdAt: string
}

export interface Donor {
  name: string
  amount: number
  message?: string
  createdAt: string
}

export interface Transaction {
  id: string
  donorName: string
  amount: number
  message?: string
  status: "pending" | "success" | "failed"
  createdAt: string
}

export interface CreatePostData {
  title: string
  content: string
  category: string
  tags: string[]
}

export interface CreateArticleData {
  title: string
  slug: string
  content: string
  category: string
}

export interface CreatePaymentData {
  donationId: string
  amount: number
  donorName?: string
  message?: string
}

export interface CreateDonationData {
  title: string
  description: string
  goalAmount: number
  endDate?: string
  isActive: boolean
}

export interface ManualDonationData {
  amount: number
  donorName: string
  message?: string
}
