// screens/table.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PermissionsAndroid } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf'; // Import the PDF library



export default function Table({ route }) {

    const { userId } = route.params; // Extract userId from navigation params


    const [report, setReport] = useState({
      modelNo: '',
      serialNo: '',
      startDate: '',
      endDate: '',
      Temp: '',
      Test: '',
      sampleDetails: ['', '', '', '', ''], // For Sample Details
      temperatureRecords: [
        { time: '', setTemp: '', tempAchieved: '' },
        { time: '', setTemp: '', tempAchieved: '' },
        { time: '', setTemp: '', tempAchieved: '' },
        { time: '', setTemp: '', tempAchieved: '' },
        { time: '', setTemp: '', tempAchieved: '' },
        { time: '', setTemp: '', tempAchieved: '' },
      ],
    });

    // const onStartDateChange = (event, selectedDate) => {
    //     const currentDate = selectedDate || report.startDate;
    //     setReport({ ...report, startDate: currentDate });
    //     setShowStartDate(false);
    //   };
    
    //   const onEndDateChange = (event, selectedDate) => {
    //     const currentDate = selectedDate || report.endDate;
    //     setReport({ ...report, endDate: currentDate });
    //     setShowEndDate(false);
    //   };


  
    const [email, setEmail] = useState('');

    const navigation = useNavigation();

    const handleLogout = async () => {
    // Clear user data if you're using AsyncStorage
      await AsyncStorage.removeItem(`userReport_${userId}`);
    // Navigate to Sign In screen
      navigation.navigate('SignIn'); // Ensure 'SignIn' matches your navigation setup
    };


    const saveReport = async () => {
      console.log("Attempting to save report:", report);
      try {
          const response = await fetch('http://192.168.29.170:5000/auth/save-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, reportData: report }),
          });
  
          const text = await response.text(); // Get raw response as text
          console.log("Raw response from save-report API:", text);
  
          const data = JSON.parse(text); // Parse it to JSON
          console.log("Parsed response:", data);
          
          if (response.ok) {
              Alert.alert('Success', data.message);
          } else {
              Alert.alert('Error', data.message);
          }
      } catch (error) {
          console.error('Error saving report:', error);
          Alert.alert('Error', 'Failed to save report');
      }
  };



  const loadReport = async () => {
    console.log("Attempting to load report for userId:", userId);
    try {
        const response = await fetch('http://192.168.29.170:5000/auth/load-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId}),
        });

        const data = await response.json();
        console.log("Response from load-report API:", data);
        
        if (response.ok) {
            setReport(data.reportData);
            console.log("Loaded report data:", data.reportData);
        } else {
            console.log(data.message); // Handle no report case
        }
    } catch (error) {
        console.error('Error loading report:', error);
    }
};




useEffect(() => {
  console.log('User ID:', userId); // Debugging: Check if the userId is correctly passed
}, [userId]);



    const downloadReport = async () => {
      const path = `${FileSystem.documentDirectory}report_${userId}.pdf`;
      try {
        await FileSystem.writeAsStringAsync(path, JSON.stringify(report), {
          encoding: FileSystem.EncodingType.UTF8
        });
        Alert.alert('Download', `Report downloaded to your device`);
      } catch (error) {
        console.error('Error creating report PDF:', error);
        Alert.alert('Error', 'Failed to download report');
      }
    };
  

    useEffect(() => {
      loadReport();
  }, [userId]); // Run this effect whenever userId changes
  
    return (
      <ScrollView contentContainerStyle={styles.container}>

        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>


        <Text style={styles.title}>BLOCK HEAT TEST</Text>
        <Text style={styles.label}>COMPANY NAME</Text>
  
        <Text style={styles.label}>DEPARTMENT NAME</Text>
  
        <Text style={styles.sectionTitle}>_______________________________</Text>
        <Text style={styles.title_r}>REPORT</Text>


      {/* Heating Block Make */}
      <View style={styles.row}>
        <Text style={styles.leftLabel}>HEATING BLOCK MAKE:</Text>
        <TextInput
          style={styles.rightInput}
          placeholder="Enter Heating Block Make"
          value={report.heatingBlockMake}
          onChangeText={(text) => setReport({ ...report, heatingBlockMake: text })}
        />
      </View>


      {/* Model No. */}
      <View style={styles.row}>
        <Text style={styles.leftLabel}>MODEL No.:</Text>
        <TextInput
          style={styles.rightInput}
          placeholder="Enter Model No."
          value={report.modelNo}
          onChangeText={(text) => setReport({ ...report, modelNo: text })}
        />
      </View>

      {/* Serial No. */}
      <View style={styles.row}>
        <Text style={styles.leftLabel}>SERIAL No.:</Text>
        <TextInput
          style={styles.rightInput}
          placeholder="Enter Serial No."
          value={report.serialNo}
          onChangeText={(text) => setReport({ ...report, serialNo: text })}
        />
      </View>

      {/* Table1 */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>PARAMETERS</Text>
          <Text style={styles.tableHeader}>SET VALUES</Text>
        </View>
        
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>TEMPERATURE</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter Temperature"
            value={report.Temp}
            onChangeText={(text) => setReport({ ...report, Temp: text })}
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>TEST PERIOD</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter Test Period"
            value={report.Test}
            onChangeText={(text) => setReport({ ...report, Test: text })}
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>START DATE & TIME</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter Start Date & Time"
            value={report.startDate}
            onChangeText={(text) => setReport({ ...report, startDate: text })}
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>END DATE & TIME</Text>
          <TextInput
            style={[styles.tableInput, styles.lastCell]}
            placeholder="Enter End Date & Time"
            value={report.endDate}
            onChangeText={(text) => setReport({ ...report, endDate: text })}
          />
        </View>
      </View>



      {/* Table2 */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}> REAGENT </Text>
          <Text style={styles.tableHeader}>DETAILS</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>REAGENT 1 LOT No. & EXPIRY DATE</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter details"
            value={report.detail1}
            onChangeText={(text) => setReport({ ...report, detail1: text })}
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>REAGENT ll LOT No. & EXPIRY DATE</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter details"
            value={report.detail2}
            onChangeText={(text) => setReport({ ...report, detail2: text })}
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>REAGENT lll LOT No. & EXPIRY DATE</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter details"
            value={report.detail3}
            onChangeText={(text) => setReport({ ...report, detail3: text })}
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>REAGENT 1 SENSITIVITY  </Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter details"
            value={report.detail4}
            onChangeText={(text) => setReport({ ...report, detail4: text })}
          />
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>REAGNET ll POTENCY</Text>
          <TextInput
            style={styles.tableInput}
            placeholder="Enter details"
            value={report.detail5}
            onChangeText={(text) => setReport({ ...report, detail5: text })}
          />
        </View>
      </View>


      {/* <View style={styles.container}>
      <Text>Start Date:</Text>
      <TextInput
        placeholder="Select Start Date"
        value={report.startDate}
        onFocus={() => setShowStartDate(true)}
      />
      {showStartDate && (
        <DateTimePicker
          value={new Date(report.startDate)}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )}
      
      <Text>End Date:</Text>
      <TextInput
        placeholder="Select End Date"
        value={report.endDate}
        onFocus={() => setShowEndDate(true)}
      />
      {showEndDate && (
        <DateTimePicker
          value={new Date(report.endDate)}
          mode="date"
          display="default"
          onChange={onEndDateChange}
        />
      )}
    </View> */}


      {/* Sample Details Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>SAMPLE DETAILS</Text>
          
          <Text style={styles.tableHeader}></Text>
        </View>
        {['', '', '', '', ''].map((_, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>-----</Text>
            <TextInput
              style={styles.tableInput}
              placeholder=""
              value={report.sampleDetails[index]}
              onChangeText={(text) => {
                const newSampleDetails = [...report.sampleDetails];
                newSampleDetails[index] = text;
                setReport({ ...report, sampleDetails: newSampleDetails });
              }}
            />
          </View>
        ))}
      </View>


      {/* Temperature Record Table */}
      <Text style={styles.tableCaption}>TEMPERATURE RECORD</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>S.NO</Text>
          <Text style={styles.tableHeader}>TIME</Text>
          <Text style={styles.tableHeader}>SET TEMP</Text>
          <Text style={styles.tableHeader}>TEMP ACHIEVED</Text>
        </View>
        {report.temperatureRecords.map((record, index) => (
          <View style={styles.tableRow} key={index}>
            {/* <Text style={styles.tableCell}>{index + 1}</Text> */}
            <TextInput
              style={styles.tableInput}
              placeholder=""
              value={record.serialNo}
              onChangeText={(text) => {
                const newRecords = [...report.temperatureRecords];
                newRecords[index].serialNo = text;
                setReport({ ...report, temperatureRecords: newRecords });
              }}
            />
            <TextInput
              style={styles.tableInput}
              placeholder=""
              value={record.time}
              onChangeText={(text) => {
                const newRecords = [...report.temperatureRecords];
                newRecords[index].time = text;
                setReport({ ...report, temperatureRecords: newRecords });
              }}
            />
            <TextInput
              style={styles.tableInput}
              placeholder=""
              value={record.setTemp}
              onChangeText={(text) => {
                const newRecords = [...report.temperatureRecords];
                newRecords[index].setTemp = text;
                setReport({ ...report, temperatureRecords: newRecords });
              }}
            />
            <TextInput
              style={styles.tableInput}
              placeholder=""
              value={record.tempAchieved}
              onChangeText={(text) => {
                const newRecords = [...report.temperatureRecords];
                newRecords[index].tempAchieved = text;
                setReport({ ...report, temperatureRecords: newRecords });
              }}
            />
          </View>
        ))}
      </View>


      {/* Custom styled buttons with adjustable spacing */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={saveReport}>
          <Text style={styles.buttonText}>Save Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={downloadReport}>
          <Text style={styles.buttonText}>Download Report as PDF</Text>
        </TouchableOpacity>
      </View>


      {/* Email input and send link button */}
      {/* <TextInput
        style={styles.input}
        placeholder="Enter email to send link"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Send Download Link to Email" onPress={sendReportLink} /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  logoutButton: {
    position: 'absolute',
    top: 35,
    right: 10,
    padding: 7,
    backgroundColor: '#5a67d8',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginTop:55, textAlign: 'center' },
  title_r: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop:10, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, textAlign: 'center' },
  sectionTitle: { textAlign: 'center', marginVertical: 10 },
  input: { marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginBottom: 10, 
  },
  leftLabel: { 
    flex: 1, 
    fontSize: 14, 
    fontWeight: 'bold', 
    flexWrap: 'wrap',
    textAlign: 'left',
    paddingVertical: 10,
    minHeight: 40,
  },
  rightInput: { 
    flex: 1, 
    padding: 10, 
    fontSize: 11, 
    borderWidth: 1, 
    flexWrap: 'wrap',
    borderColor: '#000', 
    borderRadius: 5,
    minHeight: 40,
  },


  table: { borderWidth: 1, borderColor: '#000', marginTop: 20, marginBottom:30 },
  tableRow: { flexDirection: 'row' },
  tableHeader: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#000', fontWeight: 'bold', textAlign: 'center', fontSize:13 },
  tableHeader_t: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#000', fontWeight: 'bold', textAlign: 'center', fontSize:13 },
  tableCell: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#000', textAlign: 'center', flexWrap: 'wrap', textAlign: 'center', fontSize:13  },
  tableInput: { flex: 1,
     padding: 10, 
     borderWidth: 1, 
     borderColor: '#000', 
     fontSize: 11,  
     textAlignVertical: 'top', // Ensures text is vertically aligned at the top
     minHeight: 50, // Set a minimum height for each cell
     width: '100%',
     textAlign: 'center', // Takes the full width
     flexWrap: 'wrap',},
  

  tableCaption: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 10 },

    // Custom styles for button section
  buttonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f4f7',
  },

  button: {
    width: '90%',
    padding: 15,
    backgroundColor: '#5a67d8',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },  
  
});

      