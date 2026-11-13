import { createFileRoute } from "@tanstack/react-router";
import { AiravotoLauncher } from "@/components/airavoto-launcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Airavoto — Modular Gaming Launcher" },
      { name: "description", content: "Your games, player stats, active session, and gaming widgets together in one modular desktop launcher." },
      { property: "og:title", content: "Airavoto — Modular Gaming Launcher" },
      { property: "og:description", content: "A personal gaming desktop for your library, activity, session, and rewards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AiravotoLauncher />;
}
