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
    fontSize: 10,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    width: "100vw",
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
            <Text>{data?.vendor_name}</Text>
            <Text>{data?.address}</Text>
            <Text>TRN No: {data?.trn}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text>Company: {data?.company}</Text>
            <Text>TRN No: {data?.company_trn}</Text>
            <Text>Email Address: {data?.company_email}</Text>
            <Text>Telephone: {data?.company_tele}</Text>
          </View>
        </View>

        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 20,
            textDecoration: "underline",
          }}
        >
          TAX INVOICE
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>CLIENT NAME</Text>
            <Text style={styles.tableColHeader}>UNIT NO</Text>
            <Text style={styles.tableColHeader}>PROJECT NAME</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>{data?.leadName}</Text>
            <Text style={styles.tableCol}>{data?.unit}</Text>
            <Text style={styles.tableCol}>{data?.project}</Text>
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
            <Text style={styles.tableCol}>{data?.amount}</Text>
            <Text style={styles.tableCol}>{data?.comm_percent}</Text>
            <Text style={styles.tableCol}>{data?.comm_amount}</Text>
            <Text style={styles.tableCol}>5% of Selling</Text>
            <Text style={styles.tableCol}>Gross Value</Text>
          </View>
        </View>

        <View style={styles.total}>
          <Text>TOTAL: Gross Value</Text>
        </View>

        <View style={styles.footer}>
          <Text>All cheques payable to the following account:</Text>
          <Text>Bank Name: {data?.bank_name}</Text>
          <Text>Bank Address: {data?.bank_address}</Text>
          <Text>Bank Account Name: {data?.bank_acc_name}</Text>
          <Text>Account Number: {data?.bank_acc_no}</Text>
          <Text>IBAN: {data?.bank_iban}</Text>
          <Text>SWIFT Code: {data?.bank_swift_code}</Text>
          <Text>Sincerely,</Text>
          <Text>Mr. MOHAMED MEDHAT FATHY IBRAHIM HIKAL</Text>
          <Text>CEO</Text>
          <Text>HIKAL REAL ESTATE L.L.C</Text>
        </View>
      </Page>
    </Document>
  );
};
