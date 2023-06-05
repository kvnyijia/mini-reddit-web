import React from "react";
import { NavBar } from "./NavBar";
import { Wrapper } from "./Wrapper";

interface LayoutProps {
  children: any;
  variant?: "small" | "regular";
}

export const Layout: React.FC<LayoutProps> = ({children, variant}) => {
  return (
    <>
    <NavBar />
    <Wrapper variant={variant}>
      {children}
    </Wrapper>
    </>
  );
};
