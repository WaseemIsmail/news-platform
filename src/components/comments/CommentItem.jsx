"use client";

import { useState } from "react";
import ReplyBox from "./ReplyBox";

export default function CommentItem({ comment, onReply, onDelete }) {
  const [showReplyBox, setShowReplyBox] = useState(false);

  const replies = comment.replies || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {comment.name || "Anonymous"}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {comment.createdAt?.toDate
              ? comment.createdAt.toDate().toLocaleString()
              : "Recently posted"}
          </p>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            className="text-xs font-medium text-red-600 transition hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">
        {comment.comment}
      </p>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowReplyBox((prev) => !prev)}
          className="text-sm font-medium text-amber-700 transition hover:text-amber-800"
        >
          {showReplyBox ? "Cancel Reply" : "Reply"}
        </button>
      </div>

      {showReplyBox && (
        <div className="mt-5">
          <ReplyBox
            articleId={comment.articleId}
            parentId={comment.id}
            onSubmit={async (replyData) => {
              await onReply(replyData);
              setShowReplyBox(false);
            }}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-6 space-y-4 border-l border-slate-200 pl-5">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {reply.name || "Anonymous"}
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    {reply.createdAt?.toDate
                      ? reply.createdAt.toDate().toLocaleString()
                      : "Recently replied"}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-700">
                {reply.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}