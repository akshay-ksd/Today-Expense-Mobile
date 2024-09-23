import { View, Text, TextInput, TouchableOpacity, Alert, NativeModules, ActivityIndicator, Pressable } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import styles from './style'
import Animated, { FadeInDown, FadeOutDown, FlipOutEasyY, RotateOutDownLeft, SlideOutDown, SlideOutUp, useAnimatedStyle, useSharedValue, withDecay, withTiming, ZoomIn, ZoomOut, ZoomOutEasyDown } from 'react-native-reanimated';
import usePopup from '../../../service/zustand/usePopup';
import DatePicker from 'react-native-date-picker'
import Ripple from "react-native-material-ripple"
import Icons from "react-native-vector-icons/Ionicons"

const { BackgroundService, ExpenseModule } = NativeModules;

const PopUp: FC<any> = ({ addData, lastDate, selectedItem, deleteItem, updateItem }) => {
  const [autoFocus, setAutoFocus] = useState(false);
  const [amount, setAmount] = useState(selectedItem?.expense || "");
  const [description, setDescription] = useState(selectedItem?.description || "");
  const [date, setDate] = useState<any>(selectedItem?.date);
  const [open, setOpen] = useState<any>(false);
  const [loader, setLoader] = useState(false);

  const boxScale = useSharedValue(0);
  const translateX = useSharedValue(-100);
  const translateY = useSharedValue(500);

  const setPopup = usePopup((state: any) => state.setPopup)

  useEffect(() => {
    boxScale.value = withTiming(1)
    translateX.value = withTiming(0)
    translateY.value = withTiming(0)
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: boxScale.value }, { translateX: translateX.value }, { translateY: translateY.value }]
    };
  });

  function getCurrentFormattedDate(d: any) {
    const date = new Date(d || lastDate);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  }


  const validateAndSubmit = async () => {

    setLoader(true)
    if (amount.trim() === '' || isNaN(amount)) {
      Alert.alert('Invalid Input', 'Please enter a valid amount.');
      setLoader(false)
      return;
    }
    if (description.trim() === '') {
      Alert.alert('Invalid Input', 'Please enter a description.');
      setLoader(false)
      return;
    }


    try {
      if (selectedItem) {
        ExpenseModule.updateExpense(selectedItem?.id, amount, description.trim(), date.toString())
          .then((res: any) => {
            updateItem(amount, description.trim(), date.toString(),selectedItem?.id,selectedItem?.index)
            setAmount("")
            setDescription("")
            setDate("")
            // setPopup(false)
          })
          .catch((error: any) => {
            console.error(error);
          });
      } else {
        const d = getCurrentFormattedDate();
        ExpenseModule.addExpense(amount, description.trim(), d.toString()).then((res: any) => {
          if (res) {
            BackgroundService.startService();
            addData(amount, description.trim(), d.toString())
            setAmount("")
            setDescription("")
            // setPopup(false)
          }
        })
      }


    } catch (error) {
      console.error(error);
      return [];
    } finally {

    }
    setTimeout(() => {
      // translateX.value = withTiming(-100)
      // translateY.value = withTiming(800)
      boxScale.value = withTiming(0)
    }, 100);
    setTimeout(() => {
      setPopup(false)
    }, 350);
  };

  const removeItem = async () => {
    boxScale.value = withTiming(0)
    setTimeout(() => {
      deleteItem(selectedItem)
    }, 200);
  }


  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => removeItem(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <Pressable style={{ width: "100%", height: "100%", position: "absolute", bottom: 0, zIndex: 1000 }} onPress={() => {
      boxScale.value = withTiming(0)
      setTimeout(() => {
        setPopup(false)
      }, 200)
    }
    }>
      <Animated.View style={[styles.container, animatedStyle]} >
        <Pressable style={styles.box} >
          {
            selectedItem && (
              <View style={{ borderWidth: 1.5, borderColor: "#f2f2f2", padding: 8, borderRadius: 5, flexDirection: "row", width: "90%", justifyContent: "space-evenly", alignItems: "center" }}>
                <Ripple
                  style={{ flexDirection: "row", width: "80%", justifyContent: "space-evenly", alignItems: "center" }}
                  onPress={() => setOpen(true)}>
                  <Icons name={"calendar-number-outline"} color={"black"} size={22} />
                  <Text style={[styles.input, { width: 90, borderBottomWidth: 0 }]}>{date}</Text>
                </Ripple>
                <Ripple onPress={handleDelete}>
                  <Icons name={"trash-outline"} color={"black"} size={22} />
                </Ripple>
              </View>

            )
          }
          <TextInput
            placeholder='Enter Amount'
            style={styles.input}
            placeholderTextColor={"gray"}
            autoFocus={autoFocus}
            keyboardType='number-pad'
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            placeholder='Enter Description'
            style={[styles.input]}
            placeholderTextColor={"gray"}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.button} onPress={validateAndSubmit}>
            {
              loader ?
                <ActivityIndicator size={20} color={"white"} />
                :
                <Text style={styles.title}>{selectedItem ? "Update" : "Add"}</Text>
            }
          </TouchableOpacity>
        </Pressable>
        {
          selectedItem && (
            <DatePicker
              modal
              mode='date'
              open={open}
              date={new Date(selectedItem?.date)}
              onConfirm={(date) => {
                setOpen(false)
                setDate(getCurrentFormattedDate(date))
              }}
              onCancel={() => {
                setOpen(false)
              }}
            />
          )
        }

      </Animated.View >
    </Pressable>
  )
}

export default PopUp
