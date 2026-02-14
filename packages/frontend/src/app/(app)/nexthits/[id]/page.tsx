import { redirect } from "next/navigation";

export default function NextHitDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/product-intelligence/next-hit/${params.id}`);
}
