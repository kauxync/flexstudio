import NotFound from "@/app/not-found";

export const metadata = {
  title: "404 — Page Not Found | FlexStudioo",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function Page404() {
  return <NotFound />;
}
