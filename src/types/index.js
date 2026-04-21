/**
 * Central type-like reference objects for the Contextra project.
 * This project uses JavaScript, so these are documentation-friendly
 * shape exports rather than real TypeScript interfaces.
 */

export const UserShape = {
  id: "",
  uid: "",
  fullName: "",
  displayName: "",
  email: "",
  photoURL: "",
  role: "reader",
  createdAt: null,
  updatedAt: null,
};

export const ArticleShape = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  content: "",
  image: "",
  category: "",
  tags: [],
  author: "",
  authorId: "",
  status: "published",
  featured: false,
  trendingScore: 0,
  views: 0,
  publishedAt: null,
  createdAt: null,
  updatedAt: null,
};

export const CategoryShape = {
  id: "",
  name: "",
  slug: "",
  description: "",
  image: "",
  count: 0,
  createdAt: null,
  updatedAt: null,
};

export const TagShape = {
  id: "",
  name: "",
  slug: "",
  count: 0,
  createdAt: null,
  updatedAt: null,
};

export const CommentShape = {
  id: "",
  articleId: "",
  articleSlug: "",
  articleTitle: "",
  userId: "",
  authorName: "",
  authorEmail: "",
  content: "",
  status: "pending",
  likesCount: 0,
  parentId: null,
  createdAt: null,
  updatedAt: null,
  moderatedAt: null,
};

export const BookmarkShape = {
  id: "",
  userId: "",
  articleId: "",
  articleSlug: "",
  articleTitle: "",
  articleImage: "",
  category: "",
  author: "",
  publishedAt: null,
  createdAt: null,
};

export const NotificationShape = {
  id: "",
  userId: "",
  title: "",
  message: "",
  type: "general",
  read: false,
  href: "",
  createdAt: null,
};

export const PollOptionShape = {
  label: "",
  votes: 0,
};

export const PollShape = {
  id: "",
  question: "",
  options: [],
  status: "active",
  createdAt: null,
  updatedAt: null,
};

export const TimelineEventShape = {
  id: "",
  date: "",
  title: "",
  description: "",
  type: "event",
  image: "",
  source: "",
};

export const TimelineShape = {
  id: "",
  title: "",
  slug: "",
  summary: "",
  category: "",
  tags: [],
  coverImage: "",
  status: "published",
  events: [],
  createdAt: null,
  updatedAt: null,
};

export const SiteSettingsShape = {
  siteName: "Contextra",
  siteDescription: "",
  adminEmail: "",
  allowComments: true,
  allowRegistrations: true,
  enableNewsletter: true,
  maintenanceMode: false,
  updatedAt: null,
};

export const ActivityShape = {
  id: "",
  type: "activity",
  title: "",
  description: "",
  href: "",
  createdAt: null,
};

export const ReactionShape = {
  id: "",
  articleId: "",
  userId: "",
  type: "like",
  createdAt: null,
};

const types = {
  UserShape,
  ArticleShape,
  CategoryShape,
  TagShape,
  CommentShape,
  BookmarkShape,
  NotificationShape,
  PollOptionShape,
  PollShape,
  TimelineEventShape,
  TimelineShape,
  SiteSettingsShape,
  ActivityShape,
  ReactionShape,
};

export default types;