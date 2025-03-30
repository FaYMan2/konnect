import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";

export async function POST(req: Request) {
  try {
    const { id, username, email } = await req.json();

    if (!id || !username || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: { clerkId : id, username, email },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, username, email } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!username && !email) {
      return NextResponse.json({ error: "At least one field to update is required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { clerkId : id },
      data: { username, email },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "User not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { clerkId : id },
    });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "User not found or deletion failed" }, { status: 404 });
  }
}
