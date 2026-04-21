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
import { validateTimeline } from "@/utils/validationSchemas";

/**
 * GET /api/timeline
 * Fetch all timelines
 */
export async function GET() {
  try {
    const timelinesQuery = query(
      collection(db, "timelines"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(timelinesQuery);

    const timelines = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        data: timelines,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET timelines error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch timelines.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/timeline
 * Create new timeline
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const errors = validateTimeline(body);

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

    const payload = {
      title: body.title.trim(),
      slug: body.slug.trim(),
      summary: body.summary.trim(),
      category: body.category?.trim() || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      coverImage: body.coverImage || "",
      status: body.status || "published",
      events: Array.isArray(body.events)
        ? body.events.map((event, index) => ({
            id: event.id || `evt-${index + 1}`,
            date: event.date || "",
            title: event.title?.trim() || "",
            description: event.description?.trim() || "",
            type: event.type || "event",
            image: event.image || "",
            source: event.source || "",
          }))
        : [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "timelines"),
      payload
    );

    return NextResponse.json(
      {
        success: true,
        message: "Timeline created successfully.",
        data: {
          id: docRef.id,
          ...payload,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST timeline error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create timeline.",
      },
      { status: 500 }
    );
  }
}