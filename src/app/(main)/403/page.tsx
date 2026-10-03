import Forbidden from "@/app/forbidden";

export const metadata = {
  title: "403 — Access Restricted | FlexStudioo",
  description: "You do not have administrative clearance or permission to access this area.",
};

export default function Page403() {
  return <Forbidden />;
}
