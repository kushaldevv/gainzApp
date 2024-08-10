import { View, Text } from "react-native";
import React, { ReactNode, useState } from "react";
import * as ContextMenu from "zeego/context-menu";
import * as ImagePicker from "expo-image-picker";

interface ContextMenuViewProps {
  children?: React.ReactElement;
  label: string;
  isEditing?: boolean;
  startEdit?: () => void;
  onImagePick?: (uri: string) => void;
}

const ContextMenuView: React.FC<ContextMenuViewProps> = ({
  children,
  label,
  isEditing,
  startEdit,
  onImagePick
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImagePick?.(result.assets[0].uri);
    }
  };

  const selectFunc = async () => {
    if (label == "Update name") {
      startEdit?.();
    } else {
      pickImage();
    }
  }

  return (
    <ContextMenu.Root style={{borderRadius:42}}>
      <ContextMenu.Trigger>{children ? children : <View />}</ContextMenu.Trigger>
      <ContextMenu.Content
        loop={false}
        alignOffset={10}
        avoidCollisions={true}
        collisionPadding={20}
      >
        <ContextMenu.Item key="0" onSelect={() => selectFunc()}>
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
