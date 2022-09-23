import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SettingsContext } from "./Contexts/SettingsContext";

import { authSignOut } from "./Auth/AuthHelpers";

import styled from "styled-components";

const TopBar = styled.div`
  display: grid;
  grid-template-columns: 10fr 1fr;
  background-color: white;
`;

function Nav() {
  const { setFormType, chosen, authType } = useContext(SettingsContext);
  const [items, setItems] = useState([]);

  const navigate = useNavigate();

  const itemsAuth4 = [
    {
      label: "Customer News",
      icon: "pi pi-fw pi-home",
      command: () => {
        navigate("/CustomerNews");
      },
    },
    {
      label: "Ordering",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        navigate("/Ordering");
      },
    },
    {
      label: "Products",
      icon: "pi pi-fw pi-tags",
      command: () => {
        navigate("/CustomerOrdering");
      },
    },
  ];
  
  const itemsAuth3 = itemsAuth4.concat([
    {
      label: "Settings",
      icon: "pi pi-fw pi-cog",
      command: () => {
        navigate("/CustomerSettings");
      },
    },
  ]);
  
  const itemsAuth2 = [
    {
      label: "Production",
      icon: "pi pi-fw pi-chart-bar",
      command: () => {
        navigate("/Production");
      },
    },
    {
      label: "Logistics",
      icon: "pi pi-fw pi-map",
      command: () => {
        navigate("/Logistics");
      },
    },
    {
      label: "EOD Counts",
      icon: "pi pi-fw pi-sliders-v",
      command: () => {
        navigate("/EODCounts");
      },
    },
    {
      label: "Ordering",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        navigate("/Ordering");
      },
    },
    {
      label: "Locations",
      icon: "pi pi-fw pi-map-marker",
      command: () => {
        navigate("/Locations");
      },
    },
    {
      label: "Products",
      icon: "pi pi-fw pi-tags",
      command: () => {
        navigate("/Products");
      },
    },
  ];
  
  const itemsAuth1 = itemsAuth2.concat([
    {
      label: "Billing",
      icon: "pi pi-fw pi-dollar",
      command: () => {
        navigate("/Billing");
      },
    },
    {
      label: "Settings",
      icon: "pi pi-fw pi-cog",
      command: () => {
        navigate("/Settings");
      },
    },
  ]);

  useEffect(() => {
    switch (authType) {
      case 1:
        setItems(itemsAuth1);
        break;
      case 2:
        setItems(itemsAuth2);
        break;
      case 3:
        setItems(itemsAuth3);
        break;
      case 4:
        setItems(itemsAuth4);
        break
      default:
        setItems([])
    }
  }, [authType]);

  const signOut = () => {
    authSignOut(setFormType);
  };
  return (
    <TopBar>
      <Menubar model={items} />
      <Button onClick={signOut} label={"Sign Out"}></Button>
    </TopBar>
  );
}

export default Nav;
