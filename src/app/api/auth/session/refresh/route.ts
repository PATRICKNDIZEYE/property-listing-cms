import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

/**
 * API endpoint to refresh the session by updating the lastActivity timestamp.
 * This is called by the client-side activity monitor to keep the session alive.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // The session refresh is handled by NextAuth's update trigger
    // We just need to verify the session exists and return success
    // The actual update happens in the JWT callback when trigger === 'update'
    
    return NextResponse.json({ 
      success: true,
      message: 'Session refreshed',
      timestamp: Math.floor(Date.now() / 1000)
    });
  } catch (error: any) {
    console.error('Error refreshing session:', error);
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 }
    );
  }
}

