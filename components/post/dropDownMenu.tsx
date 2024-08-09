import React from 'react'
import * as DropdownMenu from "zeego/dropdown-menu";
import { MoreHorizontal } from '@tamagui/lucide-icons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

const DropDownMenu = () => {
    return (
      <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <TouchableOpacity>
          <MoreHorizontal />
        </TouchableOpacity>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        loop={false}
        side="bottom"
        align="start"
        alignOffset={0}
        avoidCollisions={false}
        collisionPadding={8}
        sideOffset={0}
      >
        <DropdownMenu.Item key={"0"}>
          <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'trash', // required
              pointSize: 18,
              weight: "semibold",
              scale: "medium"
            }}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
    )
  }
  
  export default DropDownMenu;