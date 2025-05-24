import { useState } from 'react';
import { TouchableOpacity, View, Text, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { styles } from './styles';

interface DatePickerProps {
    onChange?: (date: Date) => void;
    label: string;
}

export default function DatePicker({ onChange, label }: DatePickerProps) {

    const [date, setDate] = useState<Date>(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);


    function formatDate(date: Date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }


    function handleDateChange(event: DateTimePickerEvent, selectedDate: Date | undefined) {
        if(selectedDate) {
            const updatedDate = new Date(selectedDate);

            if(mode === 'date') {
                updatedDate.setFullYear(selectedDate.getFullYear(),selectedDate.getMonth(), selectedDate.getDate());
            } else {
                updatedDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
            }
            setDate(updatedDate);

            if (mode === 'date') {
                setMode('time');
                setShow(true);
            }else{
                setShow(false);
                onChange && onChange(updatedDate);
            }
        }
    }

    function showPicker(mode: 'date' | 'time') {
        setShow(true);
        setMode(mode);
    }

    return (
        <>
            {
                show && (
                    <DateTimePicker
                        value={date}
                        locale='pt-BR'
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={handleDateChange}
                    />
                )
            }
            <View style={styles.container}>
                <Text>
                    {label}
                </Text>
                <TouchableOpacity
                    onPress={() => showPicker('date')}
                >
                    <View style={styles.input}>
                        <Text>
                            {formatDate(date)}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
}