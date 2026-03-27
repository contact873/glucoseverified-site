import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "1ofyvk3d",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});