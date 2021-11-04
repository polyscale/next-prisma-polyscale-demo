import { Image } from "antd";
import { FC, memo } from "react";

const ImageGallery: FC<{
  visible: boolean;
  setVisible: (v: boolean) => void;
  galleryImageIds: number[];
}> = ({ visible, setVisible, galleryImageIds }) => {
  return (
    <Image.PreviewGroup
      preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
    >
      {galleryImageIds.map((id, i) => (
        <Image key={i} src={`/images/${id}.webp`}></Image>
      ))}
    </Image.PreviewGroup>
  );
};

export default memo(ImageGallery);
