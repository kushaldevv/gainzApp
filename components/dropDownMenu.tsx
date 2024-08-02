import { View, Text } from 'react-native'
import React from 'react'
import * as DropdownMenu from "zeego/dropdown-menu";
import { MoreHorizontal } from '@tamagui/lucide-icons';

const DropDownMenu = ({isUser} : {isUser: boolean}) => {
  return (
    <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <MoreHorizontal />
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
      <DropdownMenu.Item key={"2"}>
        <DropdownMenu.ItemTitle style={{backgroundColor:'red'}}>User Profile</DropdownMenu.ItemTitle>
        <DropdownMenu.ItemIcon
          ios={{
            name: "person.text.rectangle", 
            pointSize: 18,
            weight: "semibold",
            scale: "medium",
          }}
        />
      </DropdownMenu.Item>
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
        <DropdownMenu.ItemTitle>{isUser ? 'Delete' : 'Unfollow'}</DropdownMenu.ItemTitle>
        <DropdownMenu.ItemIcon
          ios={{
            name: isUser ? 'trash' : 'person.badge.minus', // required
            pointSize: 18,
            weight: "semibold",
            scale: "medium",
            color: isUser ? 'red' : 'black'
          }}
        />
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  )
}

export default DropDownMenu