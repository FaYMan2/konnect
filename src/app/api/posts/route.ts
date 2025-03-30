import { NextResponse } from "next/server";
import prisma from "@/app/utils/prisma";

export async function POST(req: Request) {
  try {
    const { id , content, tags, images } = await req.json();

    if (!id || !content) {
      return NextResponse.json({ error: "Missing required fields (id and content)" }, { status: 400 });
    }

    console.log("Creating post with data:", { id, content, tags, images });

    const user = await prisma.user.findUnique({
      where: { clerkId : id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        creatorId : user?.id,
        content,
        tags: tags || [],
        images: images || [],
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Post not found or deletion failed" }, { status: 404 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("post");
    const clerkId = searchParams.get("user");

    if (!!postId && !!clerkId) {
        return NextResponse.json({ error: "Provide either postId or clerkId, not both" }, { status: 400 });
    }

    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json(post, { status: 200 });
    } 
    else if (clerkId) {
      const user = await prisma.user.findUnique({
        where : { clerkId },
        include : { posts : true },
      })
    
      if(!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(!!user.posts ? user.posts : [] , { status: 200 });
    } 
    else {
      return NextResponse.json({ error: "Provide either postId or clerkId" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
