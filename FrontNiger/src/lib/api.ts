import { getAuthToken } from "@/lib/auth";

export type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super(typeof payload === "string" ? payload : `API Error (${status})`);
    this.status = status;
    this.payload = payload;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`/api${path}`, {
    ...init,
    headers,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, payload);
  }

  return payload as T;
}

async function requestBlob(path: string, init?: RequestInit): Promise<{ blob: Blob; filename?: string }> {
  const token = getAuthToken();

  const headers = new Headers(init?.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`/api${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => null);
    throw new ApiError(res.status, payload);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("content-disposition") || "";
  const filenameMatch = disposition.match(/filename="?([^";]+)"?/i);
  return { blob, filename: filenameMatch?.[1] };
}

export type AuthResponse = {
  token: string;
  email: string;
  name: string;
  role: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  city: string;
  region: string;
  grade: string;
  schoolId?: number | null;
};

export type School = {
  id: number;
  name: string;
  city: string;
  region: string;
  type: "COLLEGE" | "LYCEE" | "UNIVERSITE";
};

export type UserMe = {
  id: number;
  email: string;
  name: string;
  city: string;
  region: string;
  grade?: string | null;
  role?: string;
  school?: School | null;
};

export type DocumentType = "COURS" | "DEVOIR" | "EXAMEN" | "BACCALAUREAT" | "CONCOURS";

export type Document = {
  id: number;
  title: string;
  description?: string | null;
  filePath: string;
  subject: string;
  level: string;
  type: DocumentType;
  year: string;
  school?: School | null;
  uploadedBy?: { id: number; email: string; name: string } | null;
  format: string;
  downloadCount: number;
  viewCount: number;
  uploadDate: string;
};

export type ReactionType = "LIKE" | "DISLIKE";

export type DocumentReactionSummary = {
  documentId: number;
  likeCount: number;
  dislikeCount: number;
  myReaction?: ReactionType | null;
};

export type BookReactionSummary = {
  bookId: number;
  likeCount: number;
  dislikeCount: number;
  myReaction?: ReactionType | null;
};

export type Book = {
  id: number;
  title: string;
  author: string;
  description?: string | null;
  price: number;
  coverImageUrl?: string | null;
  stock: number;
  subject?: string | null;
  level?: string | null;
  school?: School | null;
};

export type CreateOrderRequest = {
  items: { bookId: number; quantity: number }[];
};

export type OrderResponse = {
  id: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalAmount: number;
  createdAt: string;
  items: {
    bookId: number;
    title: string;
    author: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
};

export type AdminDashboardResponse = {
  stats: {
    totalUsers: number;
    totalDocuments: number;
    totalBooks: number;
    totalOrders: number;
    recentUploads: number;
    flaggedContent: number;
  };
  recentDocuments: {
    id: number;
    title: string;
    uploader: string;
    school: string;
    subject: string;
    level: string;
    uploadDate: string;
    downloads: number;
    status: string;
  }[];
  recentUsers: {
    id: number;
    name: string;
    email: string;
    school: string;
    region: string;
    joinDate: string;
    uploads: number;
    status: string;
  }[];
};

export type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  school: string;
  city: string;
  region: string;
  joinDate: string;
  uploads: number;
};

export type AdminDocumentRow = {
  id: number;
  title: string;
  subject: string;
  level: string;
  type: string;
  year: string;
  school: string;
  uploader: string;
  downloads: number;
  views: number;
  uploadDate: string;
};

export type AdminOrderRow = {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  userEmail: string;
  itemCount: number;
};

export const api = {
  auth: {
    login: (body: LoginRequest) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    register: (body: RegisterRequest) =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  users: {
    me: () => request<UserMe>("/users/me"),
    discover: (params?: { schoolId?: number; grade?: string; region?: string }) => {
      const sp = new URLSearchParams();
      if (params?.schoolId) sp.set("schoolId", String(params.schoolId));
      if (params?.grade) sp.set("grade", params.grade);
      if (params?.region) sp.set("region", params.region);
      const suffix = sp.toString() ? `?${sp.toString()}` : "";
      return request<{
        id: number;
        name: string;
        city: string;
        region: string;
        grade?: string | null;
        schoolId?: number | null;
        schoolName?: string | null;
      }[]>(`/users/discover${suffix}`);
    },
  },
  admin: {
    dashboard: () => request<AdminDashboardResponse>("/admin/dashboard"),
    users: () => request<AdminUserRow[]>("/admin/users"),
    documents: () => request<AdminDocumentRow[]>("/admin/documents"),
    orders: () => request<AdminOrderRow[]>("/admin/orders"),
  },
  reactions: {
    documentsSummary: (ids: number[]) => {
      const sp = new URLSearchParams();
      ids.forEach((id) => sp.append("ids", String(id)));
      const suffix = sp.toString() ? `?${sp.toString()}` : "";
      return request<DocumentReactionSummary[]>(`/reactions/documents/summary${suffix}`);
    },
    setDocumentReaction: (documentId: number, reactionType: ReactionType) =>
      request<DocumentReactionSummary>(`/reactions/documents/${documentId}`, {
        method: "POST",
        body: JSON.stringify({ reactionType }),
      }),

    booksSummary: (ids: number[]) => {
      const sp = new URLSearchParams();
      ids.forEach((id) => sp.append("ids", String(id)));
      const suffix = sp.toString() ? `?${sp.toString()}` : "";
      return request<BookReactionSummary[]>(`/reactions/books/summary${suffix}`);
    },
    setBookReaction: (bookId: number, reactionType: ReactionType) =>
      request<BookReactionSummary>(`/reactions/books/${bookId}`, {
        method: "POST",
        body: JSON.stringify({ reactionType }),
      }),
  },
  books: {
    list: (params?: { q?: string; subject?: string; level?: string; schoolId?: number; ids?: number[] }) => {
      const sp = new URLSearchParams();
      if (params?.q) sp.set("q", params.q);
      if (params?.subject) sp.set("subject", params.subject);
      if (params?.level) sp.set("level", params.level);
      if (params?.schoolId) sp.set("schoolId", String(params.schoolId));
      (params?.ids || []).forEach((id) => sp.append("ids", String(id)));
      const suffix = sp.toString() ? `?${sp.toString()}` : "";
      return request<Book[]>(`/books${suffix}`);
    },
    get: (id: number) => request<Book>(`/books/${id}`),
  },
  orders: {
    mine: () => request<OrderResponse[]>("/orders/mine"),
    create: (body: CreateOrderRequest) =>
      request<OrderResponse>("/orders", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
  documents: {
    search: (params?: {
      subject?: string;
      level?: string;
      type?: DocumentType;
      year?: string;
      schoolId?: number;
      region?: string;
    }) => {
      const sp = new URLSearchParams();
      if (params?.subject) sp.set("subject", params.subject);
      if (params?.level) sp.set("level", params.level);
      if (params?.type) sp.set("type", params.type);
      if (params?.year) sp.set("year", params.year);
      if (params?.schoolId) sp.set("schoolId", String(params.schoolId));
      if (params?.region) sp.set("region", params.region);
      const suffix = sp.toString() ? `?${sp.toString()}` : "";
      return request<Document[]>(`/documents/search${suffix}`);
    },
    get: (id: number) => request<Document>(`/documents/${id}`),
    upload: (form: FormData) =>
      request<Document>("/documents", {
        method: "POST",
        body: form,
      }),
    download: (id: number) => requestBlob(`/documents/download/${id}`),
  },
  schools: {
    list: (params?: { region?: string; city?: string }) => {
      const sp = new URLSearchParams();
      if (params?.region) sp.set("region", params.region);
      if (params?.city) sp.set("city", params.city);
      const suffix = sp.toString() ? `?${sp.toString()}` : "";
      return request<School[]>(`/schools${suffix}`);
    },
  },
};
