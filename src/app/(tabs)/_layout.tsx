import TabLayout from "../../components/TabLayout";

// L'AuthProvider est monté une seule fois dans app/_layout.tsx : un second
// provider ici aurait un état utilisateur séparé de celui des écrans hors onglets.
export default function AppLayout() {
  return <TabLayout />;
}
