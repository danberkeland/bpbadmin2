import React, { useContext, useState } from "react";

import { SettingsContext } from "../../Contexts/SettingsContext";
import {
  grabOldLoc,
  checkExistsNewLoc,
  updateNewLoc,
  createNewLoc,
} from "./LocationHelpers";
import { LocationForm } from "./LocationComponents";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { API } from "aws-amplify";

function Locations() {

  const { setIsLoading } = useContext(SettingsContext);

  const [locationTableData, setLocationTableData] = useState({});
  const [selectedTableLocation, setSelectedTableLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({});

  const [formIsVisible, setFormIsVisible] = useState(false);
  const [formApiPath, setFormApiPath] = useState();

  const remap = () => {
    setIsLoading(true);
    grabOldLoc()
      .then((oldLoc) => {
        console.log("oldLoc", oldLoc);
        for (let old of oldLoc) {
          checkExistsNewLoc(old.nickName).then((exists) => {
            console.log("exists", exists);
            if (exists) {
              updateNewLoc(old);
            } else {
              createNewLoc(old);
            }
          });
        }
      })
      .then((e) => {
        setIsLoading(false);
        console.log("Location DB updated");
      });
  };

  const listLocations = async () => {
    setIsLoading(true);
    const response = await API.get("bpbrpc", "/locations/listLocations");
    setIsLoading(false);
    console.log("fetchLocations response:", response);
    setLocationTableData(response);
  };

  const getLocation = async () => {
    setIsLoading(true);
    const response = await API.get(
      "bpbrpc",
      `/locations/getLocation?locNick=${selectedTableLocation.locNick}`
    );
    console.log("getLocation response:", response);
    setIsLoading(false);

    return response;
  };

  const editLocation = async () => {
    const response = await getLocation();
    setCurrentLocation(response);
    setFormApiPath("/locations/updateLocation")
    setFormIsVisible(true);
  };

  const createLocation = () => {
    setCurrentLocation({});
    setFormApiPath("/locations/createLocation")
    setFormIsVisible(true);
  }

  return (
    <React.Fragment>
      <Button label="remap Locations" onClick={remap} disabled />
      <Button label="List Locations" onClick={listLocations} />
      <Button
        label="Edit Selected Location"
        onClick={() => editLocation(selectedTableLocation)}
        disabled={!selectedTableLocation}
      />
      <Button label="Create New Location" onClick={createLocation} />

      <div>
        <h1>Locations</h1>
        <DataTable
          value={locationTableData}
          selectionMode="single"
          metaKeySelection={false}
          selection={selectedTableLocation}
          onSelectionChange={(e) => setSelectedTableLocation(e.value)}
          responsiveLayout="scroll"
          size="small"
          showGridlines
          style={{ float: "left" }}
        >
          <Column field="locNick" header="locNick (ID)" sortable />
          <Column field="locName" header="locName" sortable />
          {/* <Column field="subs" header="subs" sortable filter="true" /> */}
        </DataTable>

        <div style={{ display: "inline-block" }}>
          <pre style={{ minwidth: "250px" }}>
            Selected Location: {JSON.stringify(selectedTableLocation, null, 4)}
          </pre>

          {formIsVisible && (
            <LocationForm
              apiPath={formApiPath} // i.e. "UPDATE" or "CREATE"
              location={currentLocation}
              hideForm={() => {
                setFormIsVisible(false);
                setCurrentLocation(null);
              }}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Locations;
