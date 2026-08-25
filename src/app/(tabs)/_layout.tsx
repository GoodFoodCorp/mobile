import { AuthProvider } from "../../context/AuthContext";
import TabLayout from "../../components/TabLayout";

export default function AppLayout() {
  return (
    <AuthProvider>
      <TabLayout />
    </AuthProvider>
  );
}
