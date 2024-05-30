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
import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 30,
    flexDirection: "column",
  },
  logo: {
    width: 100,
    height: "auto",
    marginBottom: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    // flexDirection: "column",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "column",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
    textAlign: "center",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
  },
  contactInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
});

// Create Document Component
export const CommissionRequestPDF = ({ data }) => {
  console.log("data for pdf", data);
  const currentDate = moment().format("YYYY-MM-DD");
  return (
    // <Document>
    //   <Page size="A4" style={styles.page}>
    //     <View style={styles.header}>
    //       <View>
    //         <Text>Bill to:</Text>
    //         <Text>{data?.vendor_name}</Text>
    //         <Text>{data?.address}</Text>
    //         <Text>TRN No: {data?.trn}</Text>
    //       </View>
    //       <View style={styles.companyInfo}>
    //         <Text>Company: {data?.company}</Text>
    //         <Text>TRN No: {data?.company_trn}</Text>
    //         <Text>Email Address: {data?.company_email}</Text>
    //         <Text>Telephone: {data?.company_tele}</Text>
    //       </View>
    //     </View>

    //     <Text
    //       style={{
    //         textAlign: "center",
    //         fontWeight: "bold",
    //         fontSize: 20,
    //         marginBottom: 20,
    //         textDecoration: "underline",
    //       }}
    //     >
    //       TAX INVOICE
    //     </Text>

    //     <View style={styles.table}>
    //       <View style={styles.tableRow}>
    //         <Text style={styles.tableColHeader}>CLIENT NAME</Text>
    //         <Text style={styles.tableColHeader}>UNIT NO</Text>
    //         <Text style={styles.tableColHeader}>PROJECT NAME</Text>
    //       </View>
    //       <View style={styles.tableRow}>
    //         <Text style={styles.tableCol}>{data?.leadName}</Text>
    //         <Text style={styles.tableCol}>{data?.unit}</Text>
    //         <Text style={styles.tableCol}>{data?.project}</Text>
    //       </View>
    //     </View>

    //     <View style={styles.table}>
    //       <View style={styles.tableRow}>
    //         <Text style={styles.tableColHeader}>SALES VALUE (AED)</Text>
    //         <Text style={styles.tableColHeader}>COMMISSION %</Text>
    //         <Text style={styles.tableColHeader}>NET VALUE BEFORE VAT</Text>
    //         <Text style={styles.tableColHeader}>VAT VALUE</Text>
    //         <Text style={styles.tableColHeader}>GROSS VALUE (AED)</Text>
    //       </View>
    //       <View style={styles.tableRow}>
    //         <Text style={styles.tableCol}>{data?.amount}</Text>
    //         <Text style={styles.tableCol}>{data?.comm_percent}</Text>
    //         <Text style={styles.tableCol}>{data?.comm_amount}</Text>
    //         <Text style={styles.tableCol}>5% of Selling</Text>
    //         <Text style={styles.tableCol}>Gross Value</Text>
    //       </View>
    //     </View>

    //     <View style={styles.total}>
    //       <Text>TOTAL: Gross Value</Text>
    //     </View>

    //     <View style={styles.footer}>
    //       <Text>All cheques payable to the following account:</Text>
    //       <Text>Bank Name: {data?.bank_name}</Text>
    //       <Text>Bank Address: {data?.bank_address}</Text>
    //       <Text>Bank Account Name: {data?.bank_acc_name}</Text>
    //       <Text>Account Number: {data?.bank_acc_no}</Text>
    //       <Text>IBAN: {data?.bank_iban}</Text>
    //       <Text>SWIFT Code: {data?.bank_swift_code}</Text>
    //       <Text>Sincerely,</Text>
    //       <Text>Mr. MOHAMED MEDHAT FATHY IBRAHIM HIKAL</Text>
    //       <Text>CEO</Text>
    //       <Text>HIKAL REAL ESTATE L.L.C</Text>
    //     </View>
    //   </Page>
    // </Document>

    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>HIKAL REAL ESTATE</Text>
          <Text>
            Date:{currentDate}
            <Text>Invoice No:{data?.id} </Text>
          </Text>
        </View>

        <Text style={styles.title}>TAX INVOICE</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>CLIENT NAME</Text>
            <Text style={styles.tableColHeader}>UNIT NO</Text>
            <Text style={styles.tableColHeader}>PROJECT NAME</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>ClientName</Text>
            <Text style={styles.tableCol}>UnitNumber</Text>
            <Text style={styles.tableCol}>ProjectName</Text>
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
            <Text style={styles.tableCol}>SellingAmount</Text>
            <Text style={styles.tableCol}>CommPercent</Text>
            <Text style={styles.tableCol}>CommAmount</Text>
            <Text style={styles.tableCol}>VATValue</Text>
            <Text style={styles.tableCol}>GrossValue</Text>
          </View>
        </View>

        <View>
          <Text>All cheques payable to the following account:</Text>
          <Text>Bank Name: EMIRATES ISLAMIC</Text>
          <Text>Bank Address: EL SHK ZAYED RD AL WASL TOWER</Text>
          <Text>Bank Account Name: HIKAL REAL ESTATE L.L.C.</Text>
          <Text>Account Number: 3708453323701</Text>
          <Text>IBAN: AE31043007078453323701</Text>
          <Text>SWIFT Code: MEBLAEAD</Text>
        </View>

        <View style={styles.footer}>
          <Text>Sincerely,</Text>
          <Text>Mr. MOHAMED MEDHAT FATHY IBRAHIM HIKAL</Text>
          <Text>CEO</Text>
          <Text>HIKAL REAL ESTATE L.L.C.</Text>
          <Text>Authorized Signature</Text>
        </View>

        <View style={styles.contactInfo}>
          <Text>+971 4 272 2249 | info@hikalagency.ae</Text>
          <Text>
            Office No. 2704, API World Tower, Sheikh Zayed Road, Dubai
          </Text>
          <Text>www.hikalproperties.com</Text>
        </View>
      </Page>
    </Document>
  );
};
