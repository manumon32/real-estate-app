/* eslint-disable react-native/no-inline-styles */
import CommonHeader from '@components/Header/CommonHeader';
import TextInputs from '@components/Input/textInput';
import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function LoanCalculator() {
  const [price, setPrice] = useState('1000000'); // example ₹10 lakh
  const downPayment = '0'; // example ₹2 lakh
  const [rate, setRate] = useState('8.5'); // example 8.5%
  const [tenureInput, setTenureInput] = useState('20'); // default 20 years
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');

  // Inside useMemo:
  const {loanAmount, emi, totalInterest, totalPayment} = useMemo(() => {
    const P = parseFloat(price) || 0;
    const DP = parseFloat(downPayment) || 0;
    const loan = Math.max(P - DP, 0);
    const annualRate = parseFloat(rate) || 0;
    const R = annualRate / 12 / 100; // 🔹 Calculation
    const tenureInMonths = Number(tenureInput) * 12;

    let emiCalc = 0;
    if (loan > 0 && R > 0 && tenureInMonths > 0) {
      emiCalc =
        (loan * R * Math.pow(1 + R, tenureInMonths)) /
        (Math.pow(1 + R, tenureInMonths) - 1);
    } else if (loan > 0 && R === 0 && tenureInMonths > 0) {
      emiCalc = loan / tenureInMonths;
    }

    const totalPay = emiCalc * tenureInMonths;
    const totalInt = totalPay - loan;

    return {
      loanAmount: loan.toFixed(0),
      emi: emiCalc.toFixed(0),
      totalInterest: totalInt.toFixed(0),
      totalPayment: totalPay.toFixed(0),
    };
  }, [price, rate, tenureInput]);

  const formatINR = (value: string | number) => {
    const num =
      typeof value === 'string'
        ? parseInt(value.replace(/\D/g, ''), 10)
        : value;
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num);
  };
  const series = useMemo(() => {
    const loan = Number(loanAmount) > 0 ? Number(loanAmount) || 1 : 1;
    const interest = Number(totalInterest) > 0 ? Number(totalInterest) || 1 : 1;
    const total = loan + interest;

    const principalPercent = total > 0 ? ((loan / total) * 100).toFixed(1) : 1;
    const interestPercent =
      total > 0 ? ((interest / total) * 100).toFixed(1) : 0;

    return [
      {
        value: interest,
        color: '#FFE659',
        label: {text: `${interestPercent}%`},
      },
      {
        value: loan,
        color: '#7D6BE2',
        label: {text: `${principalPercent}%`},
      },
    ];
  }, [loanAmount, totalInterest]);

  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="EMI Calculator" textColor="#171717" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}>
        {/* Loan Amount */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Loan Amount</Text>
          <TextInputs
            onChangeText={text => {
              // Allow only numbers
              const numeric = text.replace(/\D/g, '');
              setPrice(numeric);
            }}
            value={formatINR(price)}
            iconName="currency-inr"
            placeholder="Price"
            placeholderTextColor={'#ccc'}
            // onBlur={handleBlur('price')}
            // error={touched?.price && errors?.price ? true : false}
            keyboardType="numeric"
          />
        </View>

        {/* Interest Rate */}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Interest Rate (% p.a)</Text>
          <TextInputs
            onChangeText={text => {
              const numeric = text
                .replace(/[^0-9.]/g, '') // allow digits + dot
                .replace(/(\..*?)\./g, '$1'); // keep only the first dot
              setRate(numeric);
            }}
            iconName={'percent'}
            value={rate}
            placeholder="Enter Rate"
            placeholderTextColor={'#ccc'}
            // onBlur={handleBlur('price')}
            // error={touched?.price && errors?.price ? true : false}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
              width: '100%',
            }}>
            <Text style={styles.label}>Loan Tenure</Text>

            {/* Toggle Button */}
            <TouchableOpacity
              onPress={() => {
                setTenureUnit(tenureUnit === 'years' ? 'months' : 'years');
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                backgroundColor: '#6366f1',
                borderRadius: 8,
                marginLeft: 'auto',
                marginBottom: 4,
              }}>
              <Text style={{color: '#fff', fontWeight: '600'}}>
                {tenureUnit === 'years' ? 'Years' : 'Months'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInputs
            onChangeText={text => {
              const numeric = text.replace(/\D/g, '');
              tenureUnit === 'years'
                ? setTenureInput(numeric)
                : setTenureInput(String(Number(numeric) / 12));
            }}
            iconName={'calendar'}
            value={
              tenureUnit === 'years'
                ? String(Number(tenureInput))
                : String(Number(tenureInput) * 12)
            }
            placeholder="Enter Tenure"
            placeholderTextColor={'#ccc'}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.emiCard}>
          <Text style={styles.emiLabel}>Your Monthly EMI</Text>
          <Text style={styles.emiValue}>₹{formatINR(emi)}</Text>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdown}>
          <Text style={styles.breakdownText}>
            Principal Amount{' '}
            <Text style={styles.value}>₹{formatINR(loanAmount)}</Text>
          </Text>
          <Text style={styles.breakdownText}>
            Total Interest{' '}
            <Text style={styles.value}>₹{formatINR(totalInterest)}</Text>
          </Text>
          <Text style={styles.breakdownText}>
            Total Amount{' '}
            <Text style={styles.value}>₹{formatINR(totalPayment)}</Text>
          </Text>
        </View>

        {/* Chart (placeholder for donut chart lib) */}
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartPlaceholder}>
            <PieChart widthAndHeight={190} series={series} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 12,
                }}>
                <View
                  style={{
                    width: 18,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#7D6BE2',
                    marginRight: 6,
                  }}
                />
                <Text style={{fontSize: 14, color: '#374151'}}>
                  {'Principal'}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 12,
                }}>
                <View
                  style={{
                    width: 18,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#FFE659',
                    marginRight: 6,
                  }}
                />
                <Text style={{fontSize: 14, color: '#374151'}}>
                  {'Interest'}
                </Text>
              </View>
            </View>
            {/* <Text style={{marginTop: 10, fontSize: 14, color: '#374151'}}>
              Principal vs Interest
            </Text> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainerStyle: {
    padding: 5,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  emiCard: {
    backgroundColor: '#d1fae5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    marginTop: 12,
    alignItems: 'center',
  },
  emiLabel: {
    fontSize: 14,
    color: '#065f46',
  },
  emiValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065f46',
    marginTop: 4,
  },
  inputContainer: {
    padding: 2,
    marginTop: 12,
  },
  breakdown: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginBottom: 20,
  },
  breakdownText: {
    fontSize: 14,
    marginVertical: 4,
    color: '#374151',
  },
  value: {
    fontWeight: '700',
    color: '#111827',
  },
  chartPlaceholder: {
    alignItems: 'center',
    marginVertical: 20,
  },
});
