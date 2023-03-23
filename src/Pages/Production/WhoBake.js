import React, { useEffect, useState, useContext } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import jsPDF from "jspdf";
import "jspdf-autotable";

import { convertDatetoBPBDate, todayPlus } from "../../helpers/dateTimeHelpers";

import ComposeAllOrders from "./Utils/composeAllOrders";

import styled from "styled-components";
import { useSettingsStore } from "../../Contexts/SettingsZustand";
import { useLegacyFormatDatabase } from "../../data/legacyData";

const WholeBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  padding: 0 0 100px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
`;

const ButtonWrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  display: flex;
  width: 60%;
  flex-direction: row;
  justify-content: space-between;
  align-content: left;

  background: #ffffff;
`;

const compose = new ComposeAllOrders();

function WhoBake() {
  const [allOrders, setAllOrders] = useState([]);

  const setIsLoading = useSettingsStore((state) => state.setIsLoading);
  const { data: database } = useLegacyFormatDatabase();

  let delivDate = todayPlus()[0];

  useEffect(() => {
    gatherAllOrdersInfo(database);
  }, [delivDate, database]); // eslint-disable-line react-hooks/exhaustive-deps

  const gatherAllOrdersInfo = (database) => {
    setIsLoading(true);
    try {
      let allOrdersData = compose.returnAllOrdersBreakDown(
        delivDate,
        database,
        "Carlton"
      );

      setAllOrders(allOrdersData.whoBake);
      setIsLoading(false);
    } catch {}
  };

  const exportWhoBakePdf = () => {
    let finalY;
    let pageMargin = 20;
    let tableToNextTitle = 5;
    let titleToNextTable = tableToNextTitle + 3;
    let tableFont = 11;
    let titleFont = 14;

    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(20);
    doc.text(pageMargin, 20, `Who Bake ${convertDatetoBPBDate(delivDate)}`);

    finalY = 20;

    doc.setFontSize(titleFont);
    doc.text(pageMargin, finalY + tableToNextTitle, `Set Out`);
    for (let ord of allOrdersList) {
      let total = 0;
      for (let num of allOrders.filter((fil) => fil.forBake === ord)) {
        total = total + num.qty;
      }

      doc.autoTable({
        theme: "grid",
        body: allOrders.filter((fil) => fil.forBake === ord),
        margin: pageMargin,
        columns: [
          { header: ord, dataKey: "custName" },
          { header: "Qty", dataKey: "qty" },
        ],
        startY: finalY + titleToNextTable,
        styles: { fontSize: tableFont },
      });

      finalY = doc.previousAutoTable.finalY;
      doc.text(pageMargin + 100, finalY + 8, `Total: ${total}`);
      finalY = finalY + 10;
    }
    doc.save(`WhoBake${delivDate}.pdf`);
  };

  const header = (
    <ButtonContainer>
      <ButtonWrapper>
        <Button
          type="button"
          onClick={exportWhoBakePdf}
          className="p-button-success"
          data-pr-tooltip="PDF"
        >
          Print Who Bake
        </Button>
      </ButtonWrapper>
    </ButtonContainer>
  );

  let allOrdersList = Array.from(
    new Set(allOrders.map((all) => all.forBake).filter((all) => all !== null))
  );

  const footerGroup = (e) => {
    let total = 0;
    for (let prod of e) {
      total += prod.qty;
    }

    return (
      <ColumnGroup>
        <Row>
          <Column
            footer="Total:"
            colSpan={1}
            footerStyle={{ textAlign: "right" }}
          />
          <Column footer={total} />
        </Row>
      </ColumnGroup>
    );
  };

  return (
    <React.Fragment>
      <WholeBox>
        <h1>Who Bake {convertDatetoBPBDate(delivDate)}</h1>
        <div>{header}</div>
        {allOrdersList &&
          allOrdersList.map((all) => (
            <React.Fragment>
              <h3>{all}</h3>
              <DataTable
                value={allOrders.filter((fil) => fil.forBake === all)}
                className="p-datatable-sm"
                footerColumnGroup={footerGroup(
                  allOrders.filter((fil) => fil.forBake === all)
                )}
              >
                <Column field="custName" header="Customer"></Column>
                <Column field="qty" header="Qty"></Column>
              </DataTable>
            </React.Fragment>
          ))}
      </WholeBox>
    </React.Fragment>
  );
}

export default WhoBake;