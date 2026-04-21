import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

/**
 * GET /api/reactions?articleId=xxx
 * Fetch reactions for a specific article
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

    const reactionsQuery = query(
      collection(db, "reactions"),
      where("articleId", "==", articleId)
    );

    const snapshot = await getDocs(reactionsQuery);

    const reactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const summary = reactions.reduce(
      (acc, reaction) => {
        const type = reaction.type || "like";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {}
    );

    return NextResponse.json(
      {
        success: true,
        data: reactions,
        summary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET reactions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reactions.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reactions
 * Create or toggle a reaction
 */
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.articleId) {
      return NextResponse.json(
        {
          success: false,
          message: "articleId is required.",
        },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required.",
        },
        { status: 400 }
      );
    }

    const reactionType = body.type || "like";

    const existingReactionQuery = query(
      collection(db, "reactions"),
      where("articleId", "==", body.articleId),
      where("userId", "==", body.userId)
    );

    const existingSnapshot = await getDocs(existingReactionQuery);

    if (!existingSnapshot.empty) {
      const existingDoc = existingSnapshot.docs[0];
      const existingData = existingDoc.data();

      if ((existingData.type || "like") === reactionType) {
        await deleteDoc(existingDoc.ref);

        return NextResponse.json(
          {
            success: true,
            message: "Reaction removed successfully.",
            removed: true,
            data: {
              id: existingDoc.id,
              ...existingData,
            },
          },
          { status: 200 }
        );
      }

      await deleteDoc(existingDoc.ref);
    }

    const payload = {
      articleId: body.articleId,
      userId: body.userId,
      type: reactionType,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "reactions"), payload);

    return NextResponse.json(
      {
        success: true,
        message: "Reaction saved successfully.",
        removed: false,
        data: {
          id: docRef.id,
          ...payload,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST reaction error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save reaction.",
      },
      { status: 500 }
    );
  }
}