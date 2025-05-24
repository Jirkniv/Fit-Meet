import React, { useState } from 'react';
import { TouchableOpacity, View, Image, Dimensions, ImageSourcePropType } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { fixUrl } from '../../api/fixUrl';
interface ImagePickerProps {
  onImageSelected: (img: { uri: string; type: string; fileName: string }) => void;
  defaultImage?: ImageSourcePropType;
}

export default function ImagePicker({ onImageSelected, defaultImage }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);

  async function pickImage() {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    const response = await launchImageLibrary(options);
    if (response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      setImage(selectedImage.uri || null);
      onImageSelected({
        uri: fixUrl(selectedImage.uri!),
        type: selectedImage.type || 'image/jpeg',
        fileName: selectedImage.fileName || 'image.jpg',
      });
    }
  }

  const useCompactStyle = !!defaultImage;

  const imageSource = defaultImage
    ? defaultImage
    : image
    ? { uri: fixUrl(image) }
    : require('../../assets/images/image.png');

  const imageStyle = useCompactStyle
    ? { width: 70, height: 55,  }
    : {
        width: Dimensions.get('window').width * 0.8,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
      };

  return (
    <View style={{ alignItems: 'center', flex: 1, paddingTop: 50 }}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={imageSource} style={imageStyle} />
      </TouchableOpacity>
    </View>
  );
}
