import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
export default function RetentionRedirect() { redirect("/customer-intelligence/retention"); }
