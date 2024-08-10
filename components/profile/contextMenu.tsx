import { View, Text } from "react-native";
import React, { ReactNode, useState } from "react";
import * as ContextMenu from "zeego/context-menu";
import * as ImagePicker from "expo-image-picker";

const ContextMenuView = ({
  children,
  label,
  setIsEditing,
}: {
  children: any;
  label: string;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <ContextMenu.Root style={{ borderRadius: label === 'Update name' ? 16 : 42 }}>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content
        loop={false}
        alignOffset={10}
        avoidCollisions={true}
        collisionPadding={20}
      >
        <ContextMenu.Item
          key="0"
          onSelect={() => {
            if (label == "Update name") {
              setIsEditing && setIsEditing(true);
            } else {
              pickImage();
            }
          }}
        >
          <ContextMenu.ItemTitle>{label}</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              name: label == "Update name" ? "pencil" : "photo",
              pointSize: 18,
              weight: "semibold",
              scale: "medium",
            }}
          />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

export default ContextMenuView;
