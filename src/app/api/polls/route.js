import { NextResponse } from "next/server";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { validatePoll } from "@/utils/validationSchemas";

/**
 * GET /api/polls
 * Fetch all polls
 */
export async function GET() {
  try {
    const pollsQuery = query(
      collection(db, "polls"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(pollsQuery);

    const polls = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: polls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET polls error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch polls.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/polls
 * Create new poll
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const errors = validatePoll(body);

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

    const cleanedOptions = body.options.map((option) => {
      if (typeof option === "string") {
        return {
          label: option.trim(),
          votes: 0,
        };
      }

      return {
        label: option.label?.trim() || "",
        votes: Number(option.votes || 0),
      };
    });

    const payload = {
      question: body.question.trim(),
      options: cleanedOptions,
      status: body.status || "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "polls"),
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Poll created successfully.",
        data: {
          id: docRef.id,
          ...payload,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST poll error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create poll.",
      },
      { status: 500 }
    );
  }
}