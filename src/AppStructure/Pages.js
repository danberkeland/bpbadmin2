import React, { useEffect } from "react";

import AnimatedRoutes from "./AnimatedRoutes";


import { useSettingsStore } from "../Contexts/SettingsZustand";

const bpbmgrItems = [
  {
    label: "Logistics",
    icon: "pi pi-fw pi-map",
    command: () => {
      window.location = "/Logistics";
    },
  },
  {
    label: "Locations",
    icon: "pi pi-fw pi-map-marker",
    command: () => {
      window.location = "/Locations";
    },
  },
  {
    label: "Products",
    icon: "pi pi-fw pi-tags",
    command: () => {
      window.location = "/Products";
    },
  },
]

const itemsAuth2 = [
  
  {
    label: "Ordering",
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
    
  },
  /*
  {
    label: "Products",
    icon: "pi pi-fw pi-tags",
    
  },
  {
    label: "Billing",
    icon: "pi pi-fw pi-dollar",
    
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-cog",
   
  },
  */
];

const itemsAuth2b = [
  
  {
    label: "Ordering",
    icon: "pi pi-fw pi-shopping-cart",
    command: () => {
      window.location = "/Ordering";
    },
    
  }
];

const itemsAuth1 = itemsAuth2b.concat([
  {
    label: "Legacy Production",
    icon: "pi pi-fw pi-chart-bar",
    items: [
      {
        label: "BPBN",
        icon: "pi pi-fw pi-home",
        items: [
          {
            label: "Baker 1",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBNBaker1";
            },
          },
          {
            label: "Baker 2",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBNBaker2";
            },
          },
          {
            label: "BPBN Setout",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBNSetOut";
            },
          },
          {
            label: "Who Bake",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/WhoBake";
            },
          },
          {
            label: "Who Shape",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/WhoShape";
            },
          },
          
          
        ],
      },
      
      
      {
        label: "BPBS",
        icon: "pi pi-fw pi-home",
        items: [
          {
            label: "What To Make",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBSWhatToMake";
            },
          },
          {
            label: "Mix Pocket",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBSMixPocket";
            },
          },
          {
            label: "BPBS Setout",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/BPBSSetOut";
            },
          },
          {
            label: "Croix Count",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/CroixCount";
            },
          },
          {
            label: "Croix To Make",
            icon: "pi pi-fw pi-home",
            command: () => {
              window.location = "/Production/CroixToMake";
            },
          },
          
          
        ],
      },
      
      {
        label: "Test New Production Pages",
        //icon: "pi pi-fw pi-wrench",
        command: () => {
          window.location = "/Production/Production";
        },
      },
    ],
  },
  {
    label: "Logistics",
    icon: "pi pi-fw pi-map",
    items: [
      {
        label: "By Route (Legacy)",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/Logistics/ByRoute";
        },
      },
    ],
  },
  {
    label: "EOD Counts",
    icon: "pi pi-fw pi-sliders-v",
    command: () => {
      window.location = "/EODCounts";
    },
  },
  
  {
    label: "Locations",
    icon: "pi pi-fw pi-map-marker",
    command: () => {
      window.location = "/Locations";
    },
  },
  {
    label: "Products",
    icon: "pi pi-fw pi-tags",
    command: () => {
      window.location = "/Products";
    },
  },
  {
    label: "Billing",
    icon: "pi pi-fw pi-dollar",
    command: () => {
      window.location = "/Billing";
    },
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-cog",
    items: [
      {
        label: "Manage Customers",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/Settings/ManageCustomers";
        },
      },
      {
        label: "Manage Training",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/Settings/ManageTrainings";
        },
      },
      {
        label: "Customer Products",
        icon: "pi pi-fw pi-home",
        command: () => {
          window.location = "/Settings/custProds";
        },
      },
    ],
  },
]);

function Pages(props) {
  const setItems = useSettingsStore((state) => state.setItems);
  const authClass = useSettingsStore((state) => state.authClass);
  useEffect(() => {
    if (authClass === "customer"){
      setItems(itemsAuth2);
    } else if (authClass === "bpbmgr") {
      setItems(bpbmgrItems)
    } else {
      setItems(itemsAuth1)
    }
   
  }, [authClass]);

  return (
    
     <AnimatedRoutes
      Routes={props.Routes}
      Route={props.Route}
      useLocation={props.useLocation}
    />
 
   
  );
}

export default Pages;
