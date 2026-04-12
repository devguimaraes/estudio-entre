import { sanityClient } from "sanity:client";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const { projectId, dataset } = sanityClient.config();

export const urlFor = (source: SanityImageSource) =>
  createImageUrlBuilder({ projectId: projectId!, dataset: dataset! }).image(source);
