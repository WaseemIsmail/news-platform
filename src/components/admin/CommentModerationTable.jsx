"use client";

import Link from "next/link";

export default function CommentModerationTable({
  comments = [],
  onApprove,
  onReject,
  onDelete,
  loadingId = "",
}) {
  const formatDate = (value) => {
    if (!value) return "N/A";

    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleString();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleString();
  };

  const getStatusBadge = (status) => {
    const currentStatus = status || "pending";

    if (currentStatus === "approved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (currentStatus === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">
          No comments found
        </h3>
        <p className="mt-2 text-slate-600">
          There are no comments available for moderation.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left">
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Comment
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Author
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Article
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Date
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Status
            </th>

            <th className="px-6 py-4 text-sm font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {comments.map((comment, index) => (
            <tr
              key={comment.id || index}
              className="border-b border-slate-100 align-top"
            >
              {/* Comment */}
              <td className="px-6 py-5">
                <p className="max-w-xl text-sm leading-6 text-slate-700">
                  {comment.content || "No comment content"}
                </p>
              </td>

              {/* Author */}
              <td className="px-6 py-5">
                <div className="text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    {comment.authorName || "Anonymous"}
                  </p>

                  {comment.authorEmail && (
                    <p className="mt-1 text-slate-500">
                      {comment.authorEmail}
                    </p>
                  )}
                </div>
              </td>

              {/* Article */}
              <td className="px-6 py-5">
                {comment.articleSlug ? (
                  <Link
                    href={`/article/${comment.articleSlug}`}
                    className="text-sm font-medium text-slate-900 transition hover:text-amber-700"
                  >
                    {comment.articleTitle || "View Article"}
                  </Link>
                ) : (
                  <span className="text-sm text-slate-500">
                    {comment.articleTitle || "N/A"}
                  </span>
                )}
              </td>

              {/* Date */}
              <td className="px-6 py-5 text-sm text-slate-500">
                {formatDate(comment.createdAt)}
              </td>

              {/* Status */}
              <td className="px-6 py-5">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusBadge(
                    comment.status
                  )}`}
                >
                  {comment.status || "pending"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onApprove?.(comment.id)}
                    disabled={loadingId === comment.id}
                    className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => onReject?.(comment.id)}
                    disabled={loadingId === comment.id}
                    className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-60"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => onDelete?.(comment.id)}
                    disabled={loadingId === comment.id}
                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}