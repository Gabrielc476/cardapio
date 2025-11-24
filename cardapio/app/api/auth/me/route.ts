import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify, JWTPayload as JoseJWTPayload } from 'jose';

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface CustomJWTPayload extends JoseJWTPayload {
  userId: number;
  email: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return new NextResponse('No token provided', { status: 401 });
    }

    const { payload } = await jwtVerify<CustomJWTPayload>(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Auth "me" error:', error);
    if (error instanceof Error && (error.name === 'JWTExpired' || error.name === 'JWSInvalid')) {
        return new NextResponse('Invalid or expired token', { status: 401 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
