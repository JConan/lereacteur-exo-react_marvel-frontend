import notFound from "../assets/images/not_found.png";

export const getThumbnailURL = (data: { path: string; extension: string }) => {
  if (data.path.match(/(image_not_available|4c002e0305708)$/i)) return notFound;
  return data.path + "." + data.extension;
};
