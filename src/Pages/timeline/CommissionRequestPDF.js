import React from "react";
import ReactDOM from "react-dom";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 20,
    fontSize: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  companyInfo: {
    textAlign: "right",
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#e0e0e0",
    padding: 5,
    textAlign: "center",
  },
  tableCol: {
    width: "20%",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    textAlign: "center",
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
  },
});

// Create Document Component
export const CommissionRequestPDF = ({ data }) => {
  console.log("data for pdf", data);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text>Bill to:</Text>
            <Text>Name of the Developer</Text>
            <Text>Address of the Developer</Text>
            <Text>TRN No: TRN of the Developer</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>Company: HIKAL REAL ESTATE LLC</Text>
            <Text>TRN No: 1005871585000043</Text>
            <Text>Email Address: info@hikalagency.ae</Text>
            <Text>Telephone: +971 4 272 2249</Text>
          </View>
        </View>

        <Text style={{ textAlign: "center", fontSize: 16, marginBottom: 20 }}>
          TAX INVOICE
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>CLIENT NAME</Text>
            <Text style={styles.tableColHeader}>UNIT NO</Text>
            <Text style={styles.tableColHeader}>PROJECT NAME</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Client Name</Text>
            <Text style={styles.tableCol}>Unit Number</Text>
            <Text style={styles.tableCol}>Project Name</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>SALES VALUE (AED)</Text>
            <Text style={styles.tableColHeader}>COMMISSION %</Text>
            <Text style={styles.tableColHeader}>NET VALUE BEFORE VAT</Text>
            <Text style={styles.tableColHeader}>VAT VALUE</Text>
            <Text style={styles.tableColHeader}>GROSS VALUE (AED)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>Selling amount</Text>
            <Text style={styles.tableCol}>Comm Percent</Text>
            <Text style={styles.tableCol}>Comm Amount</Text>
            <Text style={styles.tableCol}>5% of Selling</Text>
            <Text style={styles.tableCol}>Gross Value</Text>
          </View>
        </View>

        <View style={styles.total}>
          <Text>TOTAL: Gross Value</Text>
        </View>

        <View style={styles.footer}>
          <Text>All cheques payable to the following account:</Text>
          <Text>Bank Name: EMIRATES ISLAMIC</Text>
          <Text>Bank Address: El SHK ZAYED RD AL WASL TOWER</Text>
          <Text>Bank Account Name: HIKAL REAL ESTATE L.L.C.</Text>
          <Text>Account Number: 370843323701</Text>
          <Text>IBAN: AE310340003708443323701</Text>
          <Text>SWIFT Code: MEBLAEAD</Text>
          <Text>Sincerely,</Text>
          <Text>Mr. MOHAMED MEDHAT FATHY IBRAHIM HIKAL</Text>
          <Text>CEO</Text>
          <Text>HIKAL REAL ESTATE L.L.C</Text>
        </View>
      </Page>
    </Document>
  );
};
