import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const imagesApiUrl: string = import.meta.env.VITE_IMAGES_API_URL;

export type ImageApiResponse = {
  url: string;
  uuid: string;
  title: string;
  content_type: string;
};

export const useGetApiImages = (cardImageId: string | undefined) => {
  const query = useQuery({
    queryKey: ["api-images"],
    queryFn: async () => {
      return await axios
        .get<ImageApiResponse[]>(imagesApiUrl)
        .then((res) => res.data);
    },
  });

  console.log(query.data, cardImageId);
  const imageData = cardImageId
    ? query.data?.find((image) => image.uuid === cardImageId)
    : undefined;
  console.log({ imageData });
  return { ...query, imageData };
};
