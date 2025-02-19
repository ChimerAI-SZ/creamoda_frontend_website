import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
    console.log("Attempting to fetch from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successful response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Detailed error:", error);

    return NextResponse.json(
      { success: false, message: "获取Google登录链接失败" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
