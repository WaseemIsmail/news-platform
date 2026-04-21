import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { validateComment } from "@/utils/validationSchemas";

/**
 * GET /api/comments?articleId=xxx
 * Fetch comments for a specific article
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        {
          success: false,
          message: "articleId is required.",
        },
        { status: 400 }
      );
    }

    const commentsQuery = query(
      collection(db, "comments"),
      where("articleId", "==", articleId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(commentsQuery);

    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: comments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET comments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch comments.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Create new comment
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const errors = validateComment(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors,
        },
        { status: 400 }
      );
    }

    if (!body.articleId) {
      return NextResponse.json(
        {
          success: false,
          message: "articleId is required.",
        },
        { status: 400 }
      );
    }

    const payload = {
      articleId: body.articleId,
      articleSlug: body.articleSlug || "",
      articleTitle: body.articleTitle || "",
      userId: body.userId || "",
      authorName: body.authorName || "Anonymous",
      authorEmail: body.authorEmail || "",
      content: body.content.trim(),
      status: body.status || "pending",
      likesCount: 0,
      parentId: body.parentId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      moderatedAt: null,
    };

    const docRef = await addDoc(
      collection(db, "comments"),
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Comment submitted successfully.",
        data: {
          id: docRef.id,
          ...payload,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST comment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create comment.",
      },
      { status: 500 }
    );
  }
}