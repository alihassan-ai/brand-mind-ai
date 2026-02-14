import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getConnectedShop } from "@brandmind/backend/auth/session";
import { generateLaunchKit, LaunchKitInput } from "@brandmind/brain/agents/launch-kit-agent";
import { prisma } from "@brandmind/shared";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user || !shopDomain) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const body = await req.json();
    const { candidateId, productName, productType, targetPrice, description } = body;

    let input: LaunchKitInput;

    if (candidateId) {
      // Build input from a NextHit candidate
      const candidate = await prisma.nextHitCandidate.findUnique({
        where: { id: candidateId },
        include: { analysis: true },
      });

      if (!candidate) {
        return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
      }

      // Extract estimated price from analysis revenue scenarios if available
      const analysis = candidate.analysis as any;
      const expectedScenario = analysis?.revenueScenarios?.expected;
      const estimatedPrice = targetPrice
        ?? expectedScenario?.revenuePerUnit
        ?? 50;

      input = {
        productName: candidate.title,
        productType: candidate.hitType,
        targetPrice: Number(estimatedPrice),
        description: candidate.description,
        shopId: shop.id,
        candidateId: candidate.id,
      };
    } else if (productName && targetPrice != null) {
      // Direct product creation — no candidateId needed
      input = {
        productName,
        productType: productType || "General",
        targetPrice: Number(targetPrice),
        description: description || "",
        shopId: shop.id,
      };
    } else {
      return NextResponse.json(
        { error: "Provide either candidateId or productName + targetPrice" },
        { status: 400 }
      );
    }

    const launchKit = await generateLaunchKit(input);

    return NextResponse.json({ success: true, data: launchKit });
  } catch (error: any) {
    console.error("Launch kit error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    const shopDomain = await getConnectedShop();

    if (!user || !shopDomain) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { shopDomain } });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const launchKits = await prisma.launchKit.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ success: true, data: launchKits });
  } catch (error: any) {
    console.error("Launch kit fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
