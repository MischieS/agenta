import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { createHash } from 'crypto';

// Helper function to hash passwords
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// GET /api/admin/users/[id] - Get a specific admin user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch user data from the user table
    const result = await executeQuery`
      SELECT id, email, first_name, last_name, role, 
             created_at, updated_at
      FROM "user"
      WHERE id = ${params.id}
    `;
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result[0], { status: 200 });
  } catch (error: any) {
    console.error(`Failed to fetch user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update an admin user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Build the update set dynamically
    let updateFields = [];
    let updateValues = [];
    
    // Process email update
    if (body.email) {
      updateFields.push('email = ?');
      updateValues.push(body.email);
    }
    
    // Process password update
    if (body.password) {
      const passwordHash = createHash('sha256').update(body.password).digest('hex');
      updateFields.push('password_hash = ?');
      updateValues.push(passwordHash);
    }
    
    // Process name field updates
    if (body.name) {
      updateFields.push('first_name = ?');
      updateValues.push(body.name);
    }
    
    if (body.surname) {
      updateFields.push('last_name = ?');
      updateValues.push(body.surname);
    }
    
    if (body.role) {
      const validRoles = ['admin', 'chief', 'manager', 'sales'];
      if (!validRoles.includes(body.role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
      updateFields.push('role = ?');
      updateValues.push(body.role);
    }

    // Update user table if any fields need updating
    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE "user"
        SET ${updateFields.join(', ')}, updated_at = NOW()
        WHERE id = ?
        RETURNING id, email, first_name as name, last_name as surname, role, updated_at
      `;
      
      const updatedUser = await executeQuery(updateQuery, [...updateValues, params.id]);
      return NextResponse.json(updatedUser[0], { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(`Failed to update user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete an admin user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if the user exists
    const existingUser = await executeQuery`
      SELECT id FROM "user" WHERE id = ${id}
    `;
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete the user
    await executeQuery`
      DELETE FROM "user" WHERE id = ${id}
    `;
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Failed to delete user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
