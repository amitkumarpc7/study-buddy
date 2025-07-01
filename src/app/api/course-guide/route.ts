import { NextRequest, NextResponse } from "next/server";
import { db } from "../../firebaseconfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

async function callOpenRouterAI(input: string) {
  const prompt = `You are an expert course advisor. A user wants to learn: "${input}"

1. Summarize the user's learning goal.
2. Give a clear, step-by-step learning roadmap as an array of steps, each with a step name and description.
3. Suggest 3–5 specific course topics (no platform names), each with:
   - title
   - description
   - a valid working https URL (always include it as 'url', and make sure it’s complete and quoted properly).

Respond ONLY in valid JSON with the structure:
{
  summary: string,
  roadmap: Array<{ step: string, description: string }>,
  suggestedCourses: Array<{ title: string, description: string, url: string }>
}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistralai/mistral-small-3.2-24b-instruct:free",
      messages: [
        { role: "system", content: "You are a helpful course advisor." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter API error: ${res.status} - ${errorText}`);
  }

  let content = (await res.json()).choices?.[0]?.message?.content || "";

  try {
    content = content
      .replace(/```json|```/g, "")
      .replace(/[^\x20-\x7E\n\r]/g, "")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/^\s*"\s*",?\s*$/gm, "");

    console.log("✅ Cleaned JSON:\n", content);

    const parsed = JSON.parse(content);

    if (!parsed.roadmap || !Array.isArray(parsed.suggestedCourses)) {
      throw new Error("Missing or malformed roadmap/suggestedCourses");
    }

    parsed.suggestedCourses = parsed.suggestedCourses.filter(
      (course: any) =>
        course &&
        typeof course.title === "string" &&
        typeof course.description === "string" &&
        typeof course.url === "string" &&
        course.url.startsWith("https://")
    );

    return parsed;
  } catch (err) {
    console.error("🚨 Failed to parse AI response:", err);
    console.log("📦 Raw content:\n", content);
    throw new Error("Failed to parse AI response");
  }
}





// 🔁 POST: Generate & Save Roadmap
export async function POST(req: NextRequest) {
  try {
    const { input, userId } = await req.json();
    if (!input || !userId)
      return NextResponse.json(
        { error: "Missing input or userId" },
        { status: 400 }
      );

    const ai = await callOpenRouterAI(input);

    const obj = {
      input,
      roadmap: ai.roadmap,
      suggestedCourses: ai.suggestedCourses,
      createdAt: new Date().toISOString(),
      userId,
    };

    await addDoc(collection(db, "courseRequests"), obj);
    return NextResponse.json(obj);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 500 }
    );
  }
}

// 🔁 GET: Fetch Previous Requests
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json([]);

  const q = query(
    collection(db, "courseRequests"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  const data = snap.docs.map((doc) => doc.data());
  return NextResponse.json(data);
}

// 🔁 DELETE: Remove a Course Guide History Entry
export async function DELETE(req: NextRequest) {
  try {
    const { userId, input, createdAt } = await req.json();
    if (!userId || !input || !createdAt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // Find the document
    const q = query(
      collection(db, "courseRequests"),
      where("userId", "==", userId),
      where("input", "==", input),
      where("createdAt", "==", createdAt)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    // Delete all matching docs (should be only one)
    await Promise.all(
      snap.docs.map((d) => deleteDoc(doc(db, "courseRequests", d.id)))
    );
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 500 }
    );
  }
}
