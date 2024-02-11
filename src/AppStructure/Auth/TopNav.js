import React from "react";

import { Menubar } from "primereact/menubar";

function TopNav() {
  const items = [
    {
      label: "Production",
      icon: "pi pi-fw pi-chart-bar",
      items: [
        {
          label: "BPBN",
          items: [
            {
              label: "BPBN Baker 1",
              command: () => {
                window.location = "/Production/BPBNBaker1";
              },
            },
            {
              label: "BPBN Baker 2",
              command: () => {
                window.location = "/Production/BPBNBaker2";
              },
            },
            {
              label: "BPBN Set Out",
              command: () => {
                window.location = "/Production/BPBNSetOut";
              },
            },
            {
              label: "BPBN Buckets",
              command: () => {
                window.location = "/Production/BPBNBuckets";
              },
            },
            {
              label: "Who Bake",
              command: () => {
                window.location = "/Production/WhoBake";
              },
            },
            {
              label: "WhoShape",
              command: () => {
                window.location = "/Production/WhoShape";
              },
            },
          ],
        },
        {
          label: "BPBS",
          items: [
            {
              label: "BPBS What To Make",
              command: () => {
                window.location = "/Production/BPBSWhatToMake";
              },
            },
            {
              label: "BPBS Mix/Pocket",
              command: () => {
                window.location = "/Production/BPBSMixPocket";
              },
            },
            {
              label: "BPBS Set Out",
              command: () => {
                window.location = "/Production/BPBSSetOut";
              },
            },
            {
              label: "BPBS Buckets",
              command: () => {
                window.location = "/Production/BPBSBuckets";
              },
            },
            {
              label: "Special Packing",
              command: () => {
                window.location = "/Production/BPBSPacking";
              },
            },
            
            
          ],
        },
        {
          label: "Croix",
          items: [
            {
              label: "What Croix to shape",
              command: () => {
                window.location = "/Production/CroixToMake";
              },
            },
            {
              label: "Croix EOD Count",
              command: () => {
                window.location = "/Production/CroixCount";
              },
            },
          ],
        },
      ],
    },
    {
      label: "Logistics",
      icon: "pi pi-fw pi-map",
      items: [
        {
          label: "By Route",
          command: () => {
            window.location = "/logistics/byRoute";
          },
        },
        {
          label: "By Filter",
          command: () => {
            window.location = "/logistics/byProduct";
          },
        },
        {
          label: "North Driver Lists",
          command: () => {
            window.location = "/logistics/NorthLists";
          },
        },
        {
          label: "AM Pastry Pack",
          command: () => {
            window.location = "/logistics/AMPastry";
          },
        },
        {
          label: "Retail Bags",
          command: () => {
            window.location = "/logistics/RetailBags";
          },
        },
        {
          label: "Special Orders",
          command: () => {
            window.location = "/logistics/SpecialOrders";
          },
        },
        {
          label: "Freezer Thaw",
          command: () => {
            window.location = "/logistics/FreezerThaw";
          },
        },
        /*
        {
          label: "Voice",
          command: () => {
            window.location = "/settings/voice";
          },
        },
        */
      ],
    },
    {
      label: "EOD Counts",
      icon: "pi pi-fw pi-map",
      items: [
       
        {
          label: "BPBS",
          command: () => {
            window.location = "/EODCounts";
          },
        },
      ],
    },
    /*
    {
      label: "Dough Calc",
      icon: "pi pi-fw pi-map",
      command: () => {
        window.location = "/doughCalc/doughCalc";
      },
    },
    */
    {
      label: "Ordering",
      icon: "pi pi-fw pi-shopping-cart",
      command: () => {
        window.location = "/Ordering";
      },
    },
    {
      label: "Locations",
      icon: "pi pi-fw pi-users",
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
      icon: "pi pi-fw pi-money-bill",
      command: () => {
        window.location = "/Billing";
      },
    },
    {
      label: "Settings",
      icon: "pi pi-fw pi-cog",
      items: [
        {
          label: "Edit Zones",
          command: () => {
            window.location = "/Settings/editZones";
          },
        },
        {
          label: "Edit Routes",
          command: () => {
            window.location = "/Settings/editRoutes";
          },
        },
        {
          label: "Edit Doughs",
          command: () => {
            window.location = "/Settings/editDough";
          },
        },
        {
          label: "Notes",
          command: () => {
            window.location = "/Settings/Notes";
          },
        },
        {
          label: "Delivery Order",
          command: () => {
            window.location = "/settings/DelivOrder";
          },
        },
        {
          label: "Customer Product Setup",
          command: () => {
            window.location = "/Settings/custProds";
          },
        },
        {
          label: "Manage Users",
          command: () => {
            window.location = "/Settings/ManageCustomers";
          },
        },
        {
          label: "Tomorrow Backups",
          items: [
            {
              label: "BPBN Baker 1",
              command: () => {
                window.location = "/BPBNProd/BPBNBaker1Backup";
              },
            },
            // {
            //   label: "BPBN Baker 2",
            //   command: () => {
            //     window.location = "/BPBNProd/BPBNBaker2Backup";
            //   },
            // },
            {
              label: "BPBS What To Make",
              command: () => {
                window.location = "/BPBSProd/BPBSWhatToMakeBackup";
              },
            },
            
            
          ],
        }
        
      ],
    },
  ];

  return <Menubar 
    model={items} 
    //id="bpb-top-nav"
    style={{borderRadius: "0px", height: "4rem"}}     
  />
}

export default TopNav;
