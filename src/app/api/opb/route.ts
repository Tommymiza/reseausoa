import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  try {
    const url = req.url;
    if (!url) throw new Error("URL is not defined");
    const params = new URL(url).searchParams;
    const args = params.get("args")
      ? JSON.parse(params.get("args") as string)
      : {};
    const producteurs = await prisma.oPB.findMany({
      ...args,
    });
    return NextResponse.json(producteurs);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
