// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const cookieValue = request.cookies.get('current-user')?.value;

    if (!cookieValue) {
      return NextResponse.json(null, { status: 404 });
    }

    const user = JSON.parse(cookieValue);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(null, { status: 404 });
  }
}