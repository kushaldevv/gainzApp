import React from 'react';
import * as DropdownMenu from "zeego/dropdown-menu";

const DropDownMenu = ({children} : {children: any}) => {
    return (
      <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {children}
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
          <DropdownMenu.ItemTitle>Unfollow</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'person.fill.xmark', // required
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