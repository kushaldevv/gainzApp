import { View, Text } from 'react-native'
import React from 'react'
import * as DropdownMenu from "zeego/dropdown-menu";
import { MoreHorizontal } from '@tamagui/lucide-icons';

const DropDownMenu = () => {
  return (
    <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <MoreHorizontal />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Item key={"0"}>
        <DropdownMenu.ItemTitle>Share</DropdownMenu.ItemTitle>
        <DropdownMenu.ItemIcon
          ios={{
            name: "square.and.arrow.up", // required
            pointSize: 18,
            weight: "semibold",
            scale: "medium",
          }}
        />
      </DropdownMenu.Item>
      <DropdownMenu.Item key={"1"}>
        <DropdownMenu.ItemTitle style={{backgroundColor:'red'}}>Unfollow</DropdownMenu.ItemTitle>
        <DropdownMenu.ItemIcon
          ios={{
            name: "person.badge.minus", // required
            pointSize: 18,
            weight: "semibold",
            scale: "medium",
          }}
        />
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  )
}

export default DropDownMenu