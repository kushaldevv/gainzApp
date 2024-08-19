import { appendFollowing, unfollowUser } from "@/services/apiCalls";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";

const DropDownMenu = ({
  children,
  setFollowing,
  action,
  userId1,
  userId2,
}: {
  children: any;
  setFollowing: React.Dispatch<React.SetStateAction<boolean | null>>;
  action: string;
  userId1: string;
  userId2: string;
}) => {
  const handlePress = async () => {
    setFollowing(action === "Unfollow" ? false : true);
    if (action === "Unfollow") {
      await unfollowUser(userId1, userId2);
    } else {
      await appendFollowing(userId1, userId2);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content
        loop={false}
        side="bottom"
        align="start"
        alignOffset={0}
        avoidCollisions={false}
        collisionPadding={8}
        sideOffset={0}
      >
        <DropdownMenu.Item
          key={"0"}
          onSelect={handlePress}
        >
          <DropdownMenu.ItemTitle>{action}</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: action === "Unfollow" ?  "person.badge.minus" :"person.badge.plus", 
              pointSize: 18,
              weight: "semibold",
              scale: "medium",
            }}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DropDownMenu;
