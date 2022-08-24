import React, { useContext, useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';

import { SettingsContext } from "../../Contexts/SettingsContext";

import { testingGrQL } from "../../restAPIs";

import moment from "moment";

const locs = [
  {label: 'high', value: 'high'},
  {label: 'whole', value: 'whole'},
  {label: 'lincoln', value: 'lincoln'},
  {label: 'novo', value: 'novo'},
  {label: 'scout1', value: 'scout1'}
];

function Ordering() {
  const { setIsLoading } = useContext(SettingsContext);
  const [ orderList, setOrderList ] = useState({});
  const [ date, setDate ] = useState();
  const [ dayOfWeek, setDayOfWeek ] = useState('')
  const [ chosen, setChosen ] = useState('')

  useEffect(() => {
    setIsLoading(true);
    testingGrQL(chosen, date, dayOfWeek).then((result) => {
      console.log("result",result.errors)
      !result.errors && setOrderList(result);
      setIsLoading(false);
    });
    console.log("chosen",chosen)
  }, [date, dayOfWeek, chosen]);

  const handleDate = (date) => {
    let finalDate = moment(date.toISOString()).format('L')
    let dayOfWeek = moment(date.toISOString()).format('ddd')
    console.log(finalDate)
    console.log(dayOfWeek)
    setDayOfWeek(dayOfWeek)
    setDate(finalDate);
  };

  return (
    <React.Fragment>
      <div>
        <div className="card">
          <Calendar
            value={date}
            onChange={(e) => handleDate(e.value)}
          ></Calendar>
          <Dropdown value={chosen} options={locs} onChange={e => setChosen(e.value)} optionLabel="label" placeholder="location" />
          <DataTable value={orderList} responsiveLayout="scroll">
            <Column field="prod" header="Product"></Column>
            <Column field="qty" header="Qty"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="rate" header="Rate"></Column>
          </DataTable>
          
        </div>
      </div>
    </React.Fragment>
  );
}

export default Ordering;
