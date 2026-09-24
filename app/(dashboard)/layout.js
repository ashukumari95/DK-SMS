import AppLayout from "@/components/AppLayout";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  
  return (
    <AppLayout session={session}>
      {children}
    </AppLayout>
  );
}
